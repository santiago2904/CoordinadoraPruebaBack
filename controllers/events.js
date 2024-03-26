const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require("express-validator");
const { sequelize } = require("../config/mysql")
const ModelEvents = require('../models/events');
const ModelUsers = require('../models/users');
const ModelEventAttendee = require('../models/eventAttendee');
const { geocodeAddress, searchNearbyPlaces } = require('../utils/handleMapBox');
const { getDataExcel } = require('../utils/handleExcel');
const { encrypt } = require('../utils/handlePassword');

const getEvents = async (req, res) => {
    try {
        const events = await ModelEvents.findAllActive();
        const eventsMapped = events.map(event => formatEvent(event));
        res.status(200).json(eventsMapped);
    } catch (e) {
        handleHttpError(res, "ERROR_GET_EVENTS" + e);
    }
}

const createEvent = async (req, res) => {
    try {
        const data = matchedData(req);
        const created_by = data.created_by;
        const user = await ModelUsers.findByPkActive(created_by);
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }
        const findEvent = await ModelEvents.findEventByNameAndDates(data.name, data.start_date, data.end_date);
        if (findEvent) {
            return handleHttpError(res, "EVENT_ALREADY_EXISTS", 409);
        }
        const event = await ModelEvents.create(data);
        res.status(201).send((event));

    } catch (e) {
        handleHttpError(res, "ERROR_CREATE_EVENT" + e);
    }

}

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await ModelEvents.findOneByPkActive(id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        const eventMapped = formatEvent(event);
        res.status(200).send(eventMapped);
    } catch (e) {
        handleHttpError(res, "ERROR_GET_EVENT_BY_ID" + e);
    }
}

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = matchedData(req);
        if (data.created_by) {
            const user = await ModelUsers.findByPkActive(data.created_by);
            if (!user) {
                return handleHttpError(res, "USER_NOT_FOUND", 404);
            }
        }
        const event = await ModelEvents.findOneByPkActive(id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        await event.update(data);
        res.status(200).send(formatEvent(event));
    } catch (e) {
        handleHttpError(res, "ERROR_UPDATE_EVENT" + e);
    }
}

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await ModelEvents.findOneByPkActive(id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        await event.update({ state: false });
        res.status(200).send();
    } catch (e) {
        handleHttpError(res, "ERROR_DELETE_EVENT" + e);
    }
}

const getCoordenadesByAdressLocation = async (req, res) => {
    try {
        const { id, radius, limit } = req.params;
        const event = await ModelEvents.findOneByPkActive(id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        const location = event.location;
        const coordenades = await geocodeAddress(location);
        const nearbyPlaces = await searchNearbyPlaces(coordenades.latitude, coordenades.longitude, radius, limit);

        res.status(200).send(nearbyPlaces);
    } catch (e) {
        handleHttpError(res, "ERROR_GET_COORDENADES_BY_ADRESS_LOCATION" + e);
    }
}

const getEventCountAttendees = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await ModelEvents.findOneByPkActive(id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        const attendees = await ModelEventAttendee.findAllAttendeesByEvent(id);
        const attendeesMapped = attendees.map(attendee => formatAtendee(attendee));
        res.status(200).send(AttendeesByEventByDate(attendeesMapped));
    } catch (e) {
        handleHttpError(res, "ERROR_GET_EVENT_ATTENDEES" + e);
    }
}

const getEventsTotalCountAttendees = async (req, res) => {
    try {

        const attendees = await ModelEventAttendee.FindAllActive();
        const attendeesMapped = attendees.map(attendee => formatAtendee(attendee));
        const attendeesByDate = AttendeesByEventByDate(attendeesMapped);
        res.status(200).send((attendeesByDate));
    } catch (e) {
        handleHttpError(res, "ERROR_GET_TOTAL_ATTENDEES" + e);
    }


}

const createAttendeeByEvent = async (req, res) => {
    try {
        const data = matchedData(req);
        const event = await ModelEvents.findOneByPkActive(data.event_id);
        if (!event) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }
        const user = await ModelUsers.findByPkActive(data.user_id);
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const userAttendanceDate = new Date(data.attendance_date);
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);

        if (!(userAttendanceDate < startDate || userAttendanceDate > endDate)) {
            const eventAttendee = await ModelEventAttendee.findOneActive(data.user_id, data.event_id, data.attendance_date);
            if (eventAttendee) {
                return handleHttpError(res, "ATTENDEE_ALREADY_EXISTS", 403);
            }
        }else{
            return handleHttpError(res, "ATTENDEE_DATE_OUT_OF_RANGE", 403);
        }

        await ModelEventAttendee.create(data);
        res.status(201).send({
            status: 'ok',
            message: 'Attendee created successfully.',
        });
    } catch (e) {
        handleHttpError(res, "ERROR_CREATE_ATTENDEE" + e);
    }

}

const processUploadExcel = async (req, res) => {
    const transaction = await sequelize.transaction();
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).send('No file provided.');
    }

    try {
        // Start a transaction
        const findEvent = await ModelEvents.findOneByPkActive(id, { transaction });
        if (!findEvent) {
            return handleHttpError(res, "EVENT_NOT_FOUND", 404);
        }

        const data = await getDataExcel(req.file.path);

        const dataUserMap = await Promise.all(data.map(async (user) => {
            const userExist = await ModelUsers.findUserByEmailOrIdentification(user.email, user.identification);

            const userAttendanceDate = new Date(user.attendance_date);
            const startDate = new Date(findEvent.start_date);
            const endDate = new Date(findEvent.end_date);

            if (!(userAttendanceDate < startDate || userAttendanceDate > endDate)) {
                if (!userExist) {
                    const userCreate = {
                        name: user.name,
                        email: user.email,
                        birthdate: user.birthdate,
                        location: user.location,
                        identification: user.identification,
                        id_role: 2,
                        password: await encrypt(String(user.identification)),
                    }
                    const userCreated = await ModelUsers.create(
                        userCreate,
                        { transaction }
                    );

                    await ModelEventAttendee.create({
                        event_id: id,
                        user_id: userCreated.id,
                        attendance_date: user.attendance_date
                    }, { transaction });
                    return userCreated;
                } else {
                    const eventAttendee = await ModelEventAttendee.findOneActive(userExist.id, id, user.attendance_date);



                    if (!eventAttendee) {
                        await ModelEventAttendee.create({
                            event_id: id,
                            user_id: userExist.id,
                            attendance_date: user.attendance_date
                        }, { transaction });
                    }

                    return userExist;
                }
            }
        }));

        // Commit the transaction
        await transaction.commit();

        res.status(200).send({
            status: 'ok',
            message: 'Data processed successfully.',

        });
    } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        handleHttpError(res, `Error processing the Excel file: ${error.message}`, 500);
    }
}


const AttendeesByEventByDate = (data) => {
    const jsonByDate = {};
    let totalCount = 0;
    data.forEach((attendee) => {
        const date = attendee.attendance_date;
        if (!jsonByDate[date]) {
            jsonByDate[date] = {
                count: 0
            };
        }
        jsonByDate[date].count++;
    });

    const jsonByDateArray = Object.keys(jsonByDate).map((key) => {
        totalCount += jsonByDate[key].count;
        return {
            date: key,
            count: jsonByDate[key].count
        }
    })
    return {
        total: totalCount,
        data: jsonByDateArray
    }
}


const formatEvent = (event) => {
    return {
        id: event.id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        max_attendees: event.max_attendees,
        created_by: event.creator.name
    }
}

const formatAtendee = (attendee) => {
    return {
        id: attendee.id,
        user: attendee.user.name,
        attendance_date: attendee.attendance_date
    }
}


module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getCoordenadesByAdressLocation, processUploadExcel, getEventsTotalCountAttendees, getEventCountAttendees, createAttendeeByEvent }
const { DataTypes, Op, fn, col } = require("sequelize");
const { sequelize } = require("../config/mysql");
const ModelEvents = require("./events");
const ModelUsers = require("./users");

const ModelEventAttendee = sequelize.define(
    "event_attendees",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        attendance_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'event_attendees',
    }
);

ModelEventAttendee.belongsTo(ModelEvents, {
    foreignKey: 'event_id',
    as: 'event'
});

ModelEventAttendee.belongsTo(ModelUsers, {
    foreignKey: 'user_id',
    as: 'user'
});

ModelEventAttendee.findOneActive = async (userId, eventId, attendance_date) => {
    console.log("fechaaaaa ", attendance_date);
    return ModelEventAttendee.findOne({
        where: {
            user_id: userId,
            event_id: eventId,
            attendance_date: {
                [Op.eq]: sequelize.literal(`'${attendance_date}'`)
            }
        },
        include: [
            {
                model: ModelEvents,
                as: 'event',
            },
            {
                model: ModelUsers,
                as: 'user',
            },
        ],
    });
}

ModelEventAttendee.findAllAttendeesByEvent = async (eventId) => {
    return ModelEventAttendee.findAll({
        where: {
            event_id: eventId,
        },
        include: [
            {
                model: ModelEvents,
                as: 'event',
                where: {
                    id: eventId,
                    state: true,
                }
            },
            {
                model: ModelUsers,
                as: 'user',
                where: {
                    state: true,
                }
            },
        ],
    });
}


ModelEventAttendee.findAllAttendesByUser = async (userId) => {
    return ModelEventAttendee.findAll({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: ModelEvents,
                as: 'event',
                where: {
                    state: true,
                }
            },
            {
                model: ModelUsers,
                as: 'user',
                where: {
                    id: userId,
                    state: true,
                }
            },
        ],
    });
}

ModelEventAttendee.FindAllActive = async () => {
    return ModelEventAttendee.findAll({
        include: [
            {
                model: ModelEvents,
                as: 'event',
                where: {
                    state: true,
                }
            },
            {
                model: ModelUsers,
                as: 'user',
                where: {
                    state: true,
                }
            },
        ],
    });
}




module.exports = ModelEventAttendee;

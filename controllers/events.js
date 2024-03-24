const { handleHttpError } = require('../utils/handleError');
const ModelEvents = require('../models/events');


const getEvents = async (req, res) => {
    try {
        const events = await ModelEvents.findAll();
        res.status(200).json(events);
    } catch (error) {
        handleHttpError(res, "ERROR_GET_ROLES" + e);
    }
}


module.exports = { getRoles }
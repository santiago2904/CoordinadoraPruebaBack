const { handleHttpError } = require('../utils/handleError');
const ModelRoles = require('../models/roles');


const getRoles = async (req, res) => {
    try {
        const roles = await ModelRoles.findAll();
        res.status(200).json(roles);
    } catch (error) {
        handleHttpError(res, "ERROR_GET_ROLES" + e);
    }
}


module.exports = { getRoles }
const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require("express-validator");
const { encrypt } = require('../utils/handlePassword');
const ModelRoles = require('../models/roles');
const ModelUsers = require('../models/users');


const getUsers = async (req, res) => {
    try {

        
        const users = await ModelUsers.findAll({ 
            attributes: { exclude: ['password'] },
            include: {
                model: ModelRoles,
                as: 'rol',
            }
        
        });
        res.status(200).json(users);
    } catch (e) {
        handleHttpError(res, "ERROR_GET_USERSS " + e);
    }
}


const createUser = async (req, res) => {

    try {
        data = matchedData(req);
        console.log(data);
        const passwordHash = await encrypt(data.password)
        const body = { ...data, password: passwordHash }
        const dataUser = await ModelUsers.create(body)
        dataUser.set('password', undefined, { strict: false });
        res.status(201);
        res.send({ data: dataUser });

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            handleHttpError(res, "El usuario ya existe.", 409);
        } else {
            handleHttpError(res, "ERROR_EN_CREATE_ITEM : " + e, 500);
        }
    }
}


module.exports = { getUsers, createUser }
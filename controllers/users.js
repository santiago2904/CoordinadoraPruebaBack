const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require("express-validator");
const { encrypt } = require('../utils/handlePassword');
const ModelRoles = require('../models/roles');
const ModelUsers = require('../models/users');


const getUsers = async (req, res) => {
    try {
        const users = await ModelUsers.findAllActice();
        const userMapped = users.map(user => formatUserData(user));
        res.status(200).send(userMapped);
    } catch (e) {
        handleHttpError(res, "ERROR_GET_USERSS " + e);
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await ModelUsers.findByPkActive(id);
        if (!user) {
            handleHttpError(res, "User not found.", 404);
            return;
        }
        res.status(200).send(formatUserData(user));
    } catch (e) {
        handleHttpError(res, "ERROR_GET_USER_BY_ID " + 500);
    }

}

const createUser = async (req, res) => {

    try {
        data = matchedData(req);
        const findUser = await ModelUsers.findUserByEmailOrIdentification(data.email, data.identification);
        if (findUser) {
            handleHttpError(res, "The user already exists.", 409);
            return;
        }
        const passwordHash = await encrypt(data.password)
        const body = { ...data, password: passwordHash }
        const dataUser = await ModelUsers.create(body)
        dataUser.set('password', undefined, { strict: false });
        res.status(201).send((dataUser));

    } catch (e) {
        handleHttpError(res, "ERROR_EN_CREATE_ITEM : " + e, 500);
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = matchedData(req);
        const user = await ModelUsers.findByPkActive(id);
        if (!user) {
            handleHttpError(res, "User not found.", 404);
            return;
        }
        const userUpdated = await user.update(data);
        res.status(200).send(formatUserData(userUpdated));
    } catch (e) {
        handleHttpError(res, "ERROR_UPDATE_USER " + e);
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await ModelUsers.findByPkActive(id);
        if (!user) {
            handleHttpError(res, "User not found.", 404);
            return;
        }
        const deleteUser = await user.update({ state: false });
        res.status(200).send(formatUserData(deleteUser));
    } catch (e) {
        handleHttpError(res, "ERROR_DELETE_USER " + e);
    }
}

const formatUserData = (user) => {
    return {
        id: user.id,
        name: user.name,
        identification: user.identification,
        birthdate: user.birthdate,
        email: user.email,
        location: user.location,
        rol: user.rol.description
    }
}

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById }
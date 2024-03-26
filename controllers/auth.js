const { matchedData, check } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign, verifyToken, tokenSignReset, verifyTokenReset } = require("../utils/handleJwt")

const ModelUsers = require('../models/users');
const { handleHttpError } = require("../utils/handleError");
const axios = require('axios');



/**
 * Encargado de Login de usuario
 * @param {*} req 
 * @param {*} res 
 */
const loginCtrl = async (req, res) => {
    try {

        req = matchedData(req);

        const user = await ModelUsers.findForLoginDataByEmail(req.email);

        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404);
            return
        }

        const hashPassword = user.get("password");
        const check = await compare(req.password, hashPassword)

        if (!check) {
            handleHttpError(res, "PASSWORD_INVALID", 401);
            return
        }

        user.set('password', undefined, { strict: false })// para no mostrar el password en la respuesta

        const data = {
            token: await tokenSign(user),
            user: {
                id: user.get("id"),
                name: user.get("name"),
                identification: user.get("identification"),
                birthdate: user.get("birthdate"),
                email: user.get("email"),
                longitude: user.get("longitude"),
                latitude: user.get("latitude"),
                rol: user.rol.description

            }
        }
        // Make POST request to localhost:1880
        const response = await axios.post('http://host.docker.internal:1880/send-email', {
            destinationEmail: user.email,
            subjectEmail: "new login",
            textEmail: "you have a login in this moment"
        });


        // Handle the response
        console.log(response.data);
        res.send({ data })

    } catch (e) {
        console.log(e)
        handleHttpError(res, "ERROR_EN_LOGIN");
    }
}

module.exports = { loginCtrl }
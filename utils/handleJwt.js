const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

/**
 * Debes de pasar el objeto del usuario
 * @param {*} user 
 */
const tokenSign = async (user) => {
    //console.log("tokenSign user:", user)
    const sign = jwt.sign(
        {
           
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
        },
        JWT_SECRET,
        {
            expiresIn: "10h"
        }
    );

    return sign
}

/**
 * Debes de pasa el Token
 * @param {*} tokenJwt 
 * @returns 
 */
const verifyToken = async (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (error) {
        return null
    }
}


module.exports = { tokenSign, verifyToken }


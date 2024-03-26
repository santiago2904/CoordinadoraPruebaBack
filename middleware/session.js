const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const ModelUsers = require("../models/users")


const authMiddleware = async (req, res, next) => {
    try {

        if (!req.headers.accesstoken) {
            handleHttpError(res, "MissingAccessToken: Access token is required", 401);
            return;
        }

        const token = req.headers.accesstoken.split(' ').pop();
        const dataToken = await verifyToken(token);

        if (!dataToken) {
            handleHttpError(res, "InvalidToken: Invalid or expired access token.", 401);
            return;
        }

        const user = await ModelUsers.findOne({
            where: {
                id: dataToken.user.id
            },
            include: 'rol'
        });

        if (!user) {
            handleHttpError(res, "UserNotFound", 404, "User associated with token not found.");
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        handleHttpError(res, "InternalError: Internal server error occurred " + error, 500)
        return
    }
}

module.exports = authMiddleware
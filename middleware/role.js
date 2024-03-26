const { handleHttpError } = require("../utils/handleError");

const checkRol = (allowedRoles) => (req, res, next) => {
    try {
        const { user } = req;

        if (!user || !user.rol || !user.rol.description) {
            handleHttpError(res, "UserNotFoundOrInvalid", 403, "User or user role not found or invalid.");
            return;
        }

        const userRole = user.rol.description;

        const hasPermission = allowedRoles.some((role) => userRole.includes(role));

        if (!hasPermission) {
            handleHttpError(res, "UserNotAuthorized: User does not have permission to access this resource.", 403);
            return;
        }

        next();
    } catch (e) {
        handleHttpError(res, "InternalError: Internal server error ocurred", 500, + e.message);
    }
};

module.exports = checkRol;

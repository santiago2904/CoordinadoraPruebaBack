const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");


const validatorLogin = [
    check("password").exists().notEmpty().isLength({ min: 3, max: 15 }).withMessage("password must be between 3 and 15 characters"),
    check("email").exists().notEmpty().isEmail().withMessage("email is required"),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorLogin }
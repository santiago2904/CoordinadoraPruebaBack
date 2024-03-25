const { check, body } = require("express-validator");
const validateResults = require("../utils/handleValidator");


const validateCreateUser = [
    body('name').exists().notEmpty().isString().withMessage('Name is required and must be a string'),
    body('identification').exists().notEmpty().isString().withMessage('Identification is required and must be a string'),
    body('birthdate').exists().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Birthdate must be in YYYY-MM-DD format'),
    body('email').exists().notEmpty().isEmail().withMessage('Email is required and must be a valid email address'),
    body('password').exists().notEmpty().isLength({ min: 3, max: 100 }).withMessage('Password is required and must be between 3 and 100 characters'),
    body('location').exists().notEmpty().isString().withMessage('location must be a string'),
    body('id_role').exists().notEmpty().isNumeric().withMessage('Role ID is required and must be a number'),

    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validateUpdateUser = [
    body('name').optional().notEmpty().isString().withMessage('Name must be a string'),
    body('identification').optional().notEmpty().isString().withMessage('Identification must be a string'),
    body('birthdate').optional().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Birthdate must be in YYYY-MM-DD format'),
    body('email').optional().notEmpty().isEmail().withMessage('Email must be a valid email address'),
    body('password').optional().notEmpty().isLength({ min: 3, max: 100 }).withMessage('Password must be between 3 and 100 characters'),
    body('location').optional().notEmpty().isString().withMessage('lcoation must be a string'),
    body('id_role').optional().notEmpty().isNumeric().withMessage('Role ID must be a number'),

    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
module.exports = { validateCreateUser, validateUpdateUser }
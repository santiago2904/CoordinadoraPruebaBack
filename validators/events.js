const { body } = require("express-validator");
const validateResults = require("../utils/handleValidator");


const validateCreateEvent = [
    body("name").exists().notEmpty().withMessage("Name is required."),
    body("start_date").exists().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('start_date must be in YYYY-MM-DD format'),
    body("end_date").exists().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('end_date must be in YYYY-MM-DD format'),
    body("location").exists().notEmpty().withMessage("Location is required."),
    body("max_attendees").exists().isNumeric().withMessage("Max attendees must be a number."),
    body("description").exists().isString().withMessage("Description must be a string."),
    body("created_by").exists().isNumeric().withMessage("Created by must be a number."),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validateUpdateEvent = [
    body("name").optional().notEmpty().withMessage("Name is required."),
    body("start_date").optional().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('start_date must be in YYYY-MM-DD format'),
    body("end_date").optional().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('end_date must be in YYYY-MM-DD format'),
    body("location").optional().notEmpty().withMessage("Location is required."),
    body("max_attendees").optional().isNumeric().withMessage("Max attendees must be a number."),
    body("description").optional().isString().withMessage("Description must be a string."),
    body("created_by").optional().isNumeric().withMessage("Created by must be a number."),

    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validateCreateAttendee = [
    body("user_id").exists().isNumeric().withMessage("User ID is required."),
    body("event_id").exists().isNumeric().withMessage("Event ID is required."),
    body("attendance_date").exists().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('attendance_date must be in YYYY-MM-DD format'),
    (req, res, next) => {
        return validateResults(req, res, next)
    }

]

module.exports = { validateCreateEvent, validateUpdateEvent, validateCreateAttendee }
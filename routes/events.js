const express = require("express")
const multer = require('multer');
const router = express.Router()
const { getEvents, getEventById, createEvent, deleteEvent, updateEvent, getCoordenadesByAdressLocation, processUploadExcel, getEventCountAttendees, getEventsTotalCountAttendees, createAttendeeByEvent } = require("../controllers/events")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/role")
const { validateCreateEvent, validateUpdateEvent, validateCreateAttendee } = require("../validators/events")

const upload = multer({ dest: 'uploads/' });


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events.
 *     description: Endpoint to retrieve all events.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Events retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getAllEventsData'
 *       403:
 *         description: Insufficient permissions to access the events.
 *       404:
 *         description: Events not found.
 *       500:
 *         description: Server error occurred while retrieving the events.
 */
router.get("/", authMiddleware, checkRol(["ADMIN"]), getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID.
 *     description: Endpoint to retrieve an event by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getEventData'
 *       403:
 *         description: Insufficient permissions to access the event.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error occurred while retrieving the event.
 */
router.get("/:id", authMiddleware, checkRol(["ADMIN"]), getEventById);

/**
 * @swagger
 * /events/{id}/{radius}/{limit}:
 *   get:
 *     summary: Get coordinates by event address location.
 *     description: Endpoint to retrieve coordinates by event address location.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Event ID.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: radius
 *         description: Search radius in meters.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: limit
 *         description: Maximum number of results.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coordinates retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/dataPlaces'
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error occurred.
 */
router.get("/poi/:id/:radius/:limit", authMiddleware, checkRol(["ADMIN"]), getCoordenadesByAdressLocation);



/**
 * @swagger
 * /events/excel/{id}:
 *   post:
 *     summary: Process an Excel file to create attendees.
 *     description: Endpoint to process an Excel file to create attendees.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Event ID.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attendees created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseMessage'
 *       403:
 *         description: Insufficient permissions or validation error.
 *       404:
 *          description: Event not found.
 *       500:
 *         description: Server error occurred while creating the attendees.
 */
router.post("/excel/:id", authMiddleware, checkRol(["ADMIN"]), upload.single('file'), processUploadExcel);


/**
 * @swagger
 * /events/attendees/total:
 *   get:
 *     summary: Get the total number of attendees in all events.
 *     description: Endpoint to retrieve the total number of attendees.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Total number of attendees retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getCountAttendeesData'
 *       403:
 *         description: Insufficient permissions to access the attendees.
 *       500:
 *         description: Server error occurred while retrieving the total number of attendees.
 */
router.get("/attendees/total", authMiddleware, checkRol(["ADMIN"]), getEventsTotalCountAttendees);

/**
 * @swagger
 * /events/attendees/{id}:
 *   get:
 *     summary: Get the total number of attendees by event ID.
 *     description: Endpoint to retrieve the total number of attendees by event ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Event ID.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Total number of attendees retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getCountAttendeesData'
 *       403:
 *         description: Insufficient permissions to access the attendees.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error occurred while retrieving the total number of attendees.
 */
router.get("/attendees/:id", authMiddleware, checkRol(["ADMIN"]), getEventCountAttendees);

/**
 * @swagger
 * /events/attendees/:
 *   post:
 *     summary: Create a new event attendee.
 *     description: Endpoint to create a new event attendee.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createAttendeeData'
 *     responses:
 *       201:
 *         description: Event attendee created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/responseMessage'
 *       403:
 *         description: Insufficient permissions or validation error.
 *       404:
 *          description: Event or user not found.
 *       500:
 *         description: Server error occurred while creating the event attendee.
 */
router.post("/attendees/", authMiddleware, checkRol(["ADMIN"]), validateCreateAttendee, createAttendeeByEvent);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event.
 *     description: Endpoint to create a new event.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createEventData'
 *     responses:
 *       201:
 *         description: Event created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getEventData'
 *       403:
 *         description: Insufficient permissions to create an event.
 *       404:
 *          description: User created_by not found.
 *       500:
 *         description: Server error occurred while creating the event.
 */
router.post("/", authMiddleware, checkRol(["ADMIN"]), validateCreateEvent, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID.
 *     description: Endpoint to delete an event by its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getEventData'
 *       403:
 *         description: Insufficient permissions to delete the event.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error occurred while deleting the event.
 */
router.delete("/:id", authMiddleware, checkRol(["ADMIN"]), deleteEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID. 
 *     description: Endpoint to update an event by its ID. All fields are optional.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createEventData'
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getEventData'
 *       403:
 *         description: Insufficient permissions to update the event.
 *       404:
 *         description: Event not found or user created_by not found.
 *       500:
 *         description: Server error occurred while updating the event.
 */
router.put("/:id", authMiddleware, checkRol(["ADMIN"]), validateUpdateEvent, updateEvent);

module.exports = router;
const express = require("express")
const router = express.Router()
const { getUsers, createUser, updateUser, deleteUser, getUserById } = require("../controllers/users")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/role")
const { validateCreateUser } = require("../validators/users")

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Endpoint to retrieve all users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getAllUserData'
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: Users not found.
 *       500:
 *         description: Server error.
 */
router.get("/", authMiddleware, checkRol(["ADMIN"]), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID.
 *     description: Endpoint to get a user by ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getUserData'
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", authMiddleware, checkRol(["ADMIN"]), getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     description: Endpoint to create a new user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUserData'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getUserData'
 *       403:
 *         description: Insufficient permissions.
 *       500:
 *         description: Server error.
 */
router.post("/", authMiddleware, checkRol(["ADMIN"]), validateCreateUser, createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID.
 *     description: Endpoint to update a user by ID. All fields are optional.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUserData'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getUserData'
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", authMiddleware, checkRol(["ADMIN"]), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID.
 *     description: Endpoint to delete a user by ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getUserData'
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", authMiddleware, checkRol(["ADMIN"]), deleteUser);

module.exports = router;
const express = require("express")
const router = express.Router()
const { getUsers, createUser } = require("../controllers/users")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/role")
const { validateCreateUser } = require("../validators/users")

router.get("/", authMiddleware, checkRol(["ADMIN"]), getUsers);

router.post("/", authMiddleware, checkRol(["ADMIN"]), validateCreateUser, createUser);


module.exports = router;
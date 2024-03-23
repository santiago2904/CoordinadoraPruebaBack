const express = require("express")
const router = express.Router()
const { getRoles } = require("../controllers/roles")



router.get("/", getRoles)


module.exports = router;
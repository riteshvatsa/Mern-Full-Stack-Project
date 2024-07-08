const express = require('express');
const { registerUser, authUser, allUsers } = require("../controllers/userControllers.js")
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js")

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/').get(protect, allUsers);

module.exports = router;
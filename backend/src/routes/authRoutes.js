const express = require('express');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);
module.exports = router;
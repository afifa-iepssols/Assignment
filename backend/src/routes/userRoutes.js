const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const router = express.Router();

//visitors route
router.get("/", (req, res) => {
    res.json({message: "Welcome Visitor! Browse businesses here."});
});

//only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("Admin"), (req, res) => {
    res.json({message: `Welcome Admin`});
});

//both admin and business owner can access
router.get("/business", verifyToken, authorizeRoles("Admin", "Business Owner"), (req, res) => {
    res.json({message: `Welcome Business Owner`});
});

router.get("/use", verifyToken, authorizeRoles("Admin", "Business Owner", "User"), (req, res) => {
    res.json({message: `Welcome Business User`});
});

module.exports = router; 
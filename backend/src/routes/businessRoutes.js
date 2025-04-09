const { addBusiness, updateBusiness, viewBusinessByID, deleteBusinessByID, filteredBusinessView, uploadLogo, deleteLogo  } = require('../controllers/businessController');
const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const uploadLogoMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/addBiz', verifyToken, authorizeRoles("Business Owner"), addBusiness);
router.patch('/updateBiz/:id', verifyToken, authorizeRoles("Business Owner"), updateBusiness);
router.get('/viewBiz/:id', viewBusinessByID);
router.get('/viewBizs', filteredBusinessView);
router.delete('/deleteBiz/:id', verifyToken, authorizeRoles("Admin"), deleteBusinessByID);
router.post(
    '/uploadLogo/:id',
    verifyToken,
    authorizeRoles("Business Owner", "Admin"),
    uploadLogoMiddleware, 
    uploadLogo
  );
router.delete('/deleteLogo/:id', verifyToken, authorizeRoles("Business Owner", "Admin"), deleteLogo);


module.exports = router;


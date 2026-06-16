const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaignStatus,
    deleteCampaign
} = require('../controllers/campaignController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin-only routes (if we had role-based auth)
// router.get('/', restrictTo('admin'), getAllCampaigns);

// GET /campaigns - Get all campaigns
router.get('/', asyncHandler(getAllCampaigns));

// GET /campaigns/:id - Get single campaign
router.get('/:id', asyncHandler(getCampaignById));

// POST /campaigns - Create new campaign
router.post('/', asyncHandler(createCampaign));

// PATCH /campaigns/:id/status - Update campaign status
router.patch('/:id/status', asyncHandler(updateCampaignStatus));

// DELETE /campaigns/:id - Delete campaign
router.delete('/:id', asyncHandler(deleteCampaign));

module.exports = router;

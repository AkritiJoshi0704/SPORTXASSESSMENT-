const CampaignModel = require('../models/campaignModel');
const { validateCampaign, validateStatus } = require('../utils/validation');

class CampaignController {
  // Get all campaigns
  async getAllCampaigns(req, res) {
    try {
      const campaigns = CampaignModel.getAll();
      res.json({
        success: true,
        count: campaigns.length,
        data: campaigns
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Get single campaign by ID
  async getCampaignById(req, res) {
    try {
      const campaign = CampaignModel.getById(req.params.id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found',
          message: `No campaign found with id: ${req.params.id}`
        });
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Create new campaign
  async createCampaign(req, res) {
    try {
      const validationErrors = validateCampaign(req.body);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validationErrors
        });
      }

      const newCampaign = CampaignModel.create({
        name: req.body.name.trim(),
        advertiser: req.body.advertiser.trim(),
        status: req.body.status,
        impressions: req.body.impressions,
        ctr: req.body.ctr,
        budget_total: req.body.budget_total,
        budget_spent: req.body.budget_spent
      });

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: newCampaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Update campaign status
  async updateCampaignStatus(req, res) {
    try {
      const { status } = req.body;

      if (!validateStatus(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
          message: 'Status must be one of: active, paused, ended'
        });
      }

      const updatedCampaign = CampaignModel.updateStatus(req.params.id, status);

      if (!updatedCampaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found',
          message: `No campaign found with id: ${req.params.id}`
        });
      }

      res.json({
        success: true,
        message: 'Campaign status updated successfully',
        data: updatedCampaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Delete campaign
  async deleteCampaign(req, res) {
    try {
      const deletedCampaign = CampaignModel.delete(req.params.id);

      if (!deletedCampaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found',
          message: `No campaign found with id: ${req.params.id}`
        });
      }

      res.json({
        success: true,
        message: 'Campaign deleted successfully',
        data: deletedCampaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }
}

module.exports = new CampaignController();

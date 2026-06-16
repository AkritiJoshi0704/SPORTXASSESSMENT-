/**
 * Campaign Model Unit Tests
 * Tests for data access layer CRUD operations
 */

const CampaignModel = require('../models/campaignModel');

describe('CampaignModel', () => {
    let initialCampaignCount;

    beforeAll(() => {
        // Store initial count of campaigns
        initialCampaignCount = CampaignModel.getAll().length;
    });

    describe('getAll', () => {
        it('should return all campaigns as an array', () => {
            const campaigns = CampaignModel.getAll();
            expect(Array.isArray(campaigns)).toBe(true);
            expect(campaigns.length).toBeGreaterThan(0);
        });

        it('should return campaigns with required fields', () => {
            const campaigns = CampaignModel.getAll();
            const campaign = campaigns[0];

            expect(campaign).toHaveProperty('id');
            expect(campaign).toHaveProperty('name');
            expect(campaign).toHaveProperty('advertiser');
            expect(campaign).toHaveProperty('status');
            expect(campaign).toHaveProperty('impressions');
            expect(campaign).toHaveProperty('ctr');
            expect(campaign).toHaveProperty('budget_total');
            expect(campaign).toHaveProperty('budget_spent');
        });
    });

    describe('getById', () => {
        it('should return a campaign by id', () => {
            const campaign = CampaignModel.getById('1');
            expect(campaign).toBeDefined();
            expect(campaign.id).toBe('1');
            expect(campaign.name).toBe('Summer Sale Campaign');
        });

        it('should return null for non-existent id', () => {
            const campaign = CampaignModel.getById('9999');
            expect(campaign).toBeUndefined();
        });
    });

    describe('create', () => {
        it('should create a new campaign and return it', () => {
            const newCampaignData = {
                name: 'Test Campaign',
                advertiser: 'Test Brand',
                status: 'active',
                impressions: 50000,
                ctr: 2.5,
                budget_total: 25000,
                budget_spent: 10000
            };

            const campaign = CampaignModel.create(newCampaignData);

            expect(campaign).toBeDefined();
            expect(campaign.id).toBeDefined();
            expect(campaign.name).toBe('Test Campaign');
            expect(campaign.advertiser).toBe('Test Brand');
            expect(campaign.status).toBe('active');
        });

        it('should add campaign to the list', () => {
            const countBefore = CampaignModel.getAll().length;

            CampaignModel.create({
                name: 'Another Test',
                advertiser: 'Brand 2',
                status: 'paused',
                impressions: 30000,
                ctr: 1.5,
                budget_total: 20000,
                budget_spent: 8000
            });

            const countAfter = CampaignModel.getAll().length;
            expect(countAfter).toBe(countBefore + 1);
        });
    });

    describe('updateStatus', () => {
        it('should update campaign status', () => {
            const campaign = CampaignModel.getById('1');
            const originalStatus = campaign.status;

            const newStatus = originalStatus === 'active' ? 'paused' : 'active';
            const updated = CampaignModel.updateStatus('1', newStatus);

            expect(updated.status).toBe(newStatus);
        });

        it('should return null for non-existent id', () => {
            const result = CampaignModel.updateStatus('9999', 'active');
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete a campaign by id', () => {
            // Create a campaign to delete
            const newCampaign = CampaignModel.create({
                name: 'Campaign to Delete',
                advertiser: 'Delete Test',
                status: 'active',
                impressions: 10000,
                ctr: 1.0,
                budget_total: 5000,
                budget_spent: 2000
            });

            const countBefore = CampaignModel.getAll().length;
            const deleted = CampaignModel.delete(newCampaign.id);

            expect(deleted).toBeDefined();
            expect(deleted.id).toBe(newCampaign.id);
            expect(CampaignModel.getAll().length).toBe(countBefore - 1);
        });

        it('should return null for non-existent id', () => {
            const result = CampaignModel.delete('9999');
            expect(result).toBeNull();
        });

        it('should not find deleted campaign by id', () => {
            const newCampaign = CampaignModel.create({
                name: 'To Verify Delete',
                advertiser: 'Verify',
                status: 'ended',
                impressions: 5000,
                ctr: 0.5,
                budget_total: 1000,
                budget_spent: 1000
            });

            CampaignModel.delete(newCampaign.id);
            const found = CampaignModel.getById(newCampaign.id);

            expect(found).toBeUndefined();
        });
    });

    describe('exists', () => {
        it('should return true for existing campaign', () => {
            const exists = CampaignModel.exists('1');
            expect(exists).toBe(true);
        });

        it('should return false for non-existent campaign', () => {
            const exists = CampaignModel.exists('9999');
            expect(exists).toBe(false);
        });
    });
});

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'campaigns.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load campaigns from file or fallback to default seed
let campaigns = [];
const loadData = () => {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      campaigns = JSON.parse(raw);
    } else {
      campaigns = [];
      fs.writeFileSync(dataFile, JSON.stringify(campaigns, null, 2));
    }
  } catch (err) {
    console.error('Failed to load campaigns data:', err);
    campaigns = [];
  }
};

const saveData = () => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(campaigns, null, 2));
  } catch (err) {
    console.error('Failed to save campaigns data:', err);
  }
};

// Initialize
loadData();

const CampaignModel = {
  getAll: () => campaigns,

  getById: (id) => campaigns.find((c) => c.id === id),

  create: (campaignData) => {
    // generate unique id
    const maxId = campaigns.reduce((max, c) => Math.max(max, Number(c.id)), 0);
    const newCampaign = {
      id: String(maxId + 1),
      ...campaignData,
    };
    campaigns.push(newCampaign);
    saveData();
    return newCampaign;
  },

  updateStatus: (id, status) => {
    const campaignIndex = campaigns.findIndex((c) => c.id === id);
    if (campaignIndex === -1) {
      return null;
    }
    campaigns[campaignIndex].status = status;
    saveData();
    return campaigns[campaignIndex];
  },

  update: (id, data) => {
    const campaignIndex = campaigns.findIndex((c) => c.id === id);
    if (campaignIndex === -1) return null;
    // Merge allowed fields
    const allowed = [
      'name',
      'advertiser',
      'status',
      'impressions',
      'ctr',
      'budget_total',
      'budget_spent',
    ];
    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        campaigns[campaignIndex][key] = data[key];
      }
    });
    saveData();
    return campaigns[campaignIndex];
  },

  delete: (id) => {
    const campaignIndex = campaigns.findIndex((c) => c.id === id);
    if (campaignIndex === -1) {
      return null;
    }
    const deletedCampaign = campaigns[campaignIndex];
    campaigns.splice(campaignIndex, 1);
    saveData();
    return deletedCampaign;
  },

  exists: (id) => campaigns.some((c) => c.id === id),

  // For tests or reset convenience
  _reset: (newData) => {
    campaigns = newData || [];
    saveData();
  },
};

module.exports = CampaignModel;

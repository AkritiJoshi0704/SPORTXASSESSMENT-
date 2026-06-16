const validateCampaign = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Campaign name is required and must be a non-empty string');
  }
  
  if (!data.advertiser || typeof data.advertiser !== 'string' || data.advertiser.trim().length === 0) {
    errors.push('Advertiser is required and must be a non-empty string');
  }
  
  if (!data.status || !['active', 'paused', 'ended'].includes(data.status)) {
    errors.push('Status must be one of: active, paused, ended');
  }
  
  if (typeof data.impressions !== 'number' || data.impressions < 0) {
    errors.push('Impressions must be a non-negative number');
  }
  
  if (typeof data.ctr !== 'number' || data.ctr < 0 || data.ctr > 100) {
    errors.push('CTR must be a number between 0 and 100');
  }
  
  if (typeof data.budget_total !== 'number' || data.budget_total <= 0) {
    errors.push('Total budget must be a positive number');
  }
  
  if (typeof data.budget_spent !== 'number' || data.budget_spent < 0) {
    errors.push('Budget spent must be a non-negative number');
  }
  
  if (data.budget_spent > data.budget_total) {
    errors.push('Budget spent cannot exceed total budget');
  }
  
  return errors;
};

const validateStatus = (status) => {
  if (!status || !['active', 'paused', 'ended'].includes(status)) {
    return false;
  }
  return true;
};

module.exports = {
  validateCampaign,
  validateStatus
};

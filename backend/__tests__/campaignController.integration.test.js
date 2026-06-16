const app = require('../server');
const fs = require('fs');
const path = require('path');
const http = require('http');

const API_KEY = 'spotx-secret-key-2024';
const dataFile = path.join(__dirname, '..', 'data', 'campaigns.json');

function httpRequest(baseUrl, method, pathUrl, body, headers = {}) {
  const url = new URL(pathUrl, baseUrl);
  const opts = {
    method,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = data ? JSON.parse(data) : null;
        } catch (e) {
          return reject(e);
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Campaign API integration', () => {
  let createdId;
  let server;
  let baseUrl;

  beforeAll((done) => {
    // backup data file
    if (fs.existsSync(dataFile)) {
      fs.copyFileSync(dataFile, dataFile + '.bak');
    }
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    // restore data file
    if (fs.existsSync(dataFile + '.bak')) {
      fs.copyFileSync(dataFile + '.bak', dataFile);
      fs.unlinkSync(dataFile + '.bak');
    }
    if (server) server.close(done);
    else done();
  });

  test('POST /campaigns -> create, PATCH /campaigns/:id -> update, DELETE /campaigns/:id -> delete', async () => {
    const newCampaign = {
      name: 'Integration Test',
      advertiser: 'Tester',
      status: 'active',
      impressions: 1000,
      ctr: 1.2,
      budget_total: 5000,
      budget_spent: 100,
    };

    const postRes = await httpRequest(baseUrl, 'POST', '/campaigns', newCampaign, {
      'X-API-Key': API_KEY,
    });
    expect(postRes.status).toBe(201);
    expect(postRes.body.success).toBe(true);
    createdId = postRes.body.data.id;

    const updateRes = await httpRequest(
      baseUrl,
      'PATCH',
      `/campaigns/${createdId}`,
      { ...newCampaign, name: 'Integration Test Updated' },
      { 'X-API-Key': API_KEY }
    );
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.name).toBe('Integration Test Updated');

    const delRes = await httpRequest(baseUrl, 'DELETE', `/campaigns/${createdId}`, null, {
      'X-API-Key': API_KEY,
    });
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
  });
});

const { spawn } = require('child_process');
const path = require('path');

function startBackend() {
  const env = { ...process.env, PORT: '3001' };
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const backend = spawn(npm, ['--prefix', 'backend', 'start'], {
    env,
    stdio: 'inherit',
  });

  backend.on('close', (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

function serveFrontend() {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const frontend = spawn(npx, ['http-server', 'frontend/dist', '-p', '3000', '-c-1'], {
    stdio: 'inherit',
  });

  frontend.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });
}

// Start both
startBackend();
serveFrontend();

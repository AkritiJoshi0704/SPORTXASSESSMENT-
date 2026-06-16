const { spawn } = require('child_process');
const path = require('path');

function startBackend() {
  const env = { ...process.env, PORT: '3001' };
  // use shell to avoid spawn platform issues
  const cmd = process.platform === 'win32' ? 'cmd /c "set PORT=3001&& npm --prefix backend start"' : 'PORT=3001 npm --prefix backend start';
  const backend = spawn(cmd, { shell: true, env, stdio: 'inherit' });

  backend.on('close', (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

function serveFrontend() {
  const cmd = process.platform === 'win32' ? 'npx http-server frontend/dist -p 3000 -c-1' : 'npx http-server frontend/dist -p 3000 -c-1';
  const frontend = spawn(cmd, { shell: true, stdio: 'inherit' });

  frontend.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });
}

// Start both
startBackend();
serveFrontend();

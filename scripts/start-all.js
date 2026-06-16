const { spawn } = require('child_process');
const net = require('net');

function checkPortFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') return resolve(false);
        return resolve(false);
      })
      .once('listening', () => {
        srv.close();
        return resolve(true);
      })
      .listen(port, '127.0.0.1');
  });
}

async function start() {
  const backendPortFree = await checkPortFree(3001);
  const frontendPortFree = await checkPortFree(3000);

  if (!backendPortFree || !frontendPortFree) {
    console.error('Ports required by this project are in use:');
    if (!backendPortFree) console.error(' - Port 3001 (backend) is in use');
    if (!frontendPortFree) console.error(' - Port 3000 (frontend) is in use');
    console.error('Please free these ports or stop the processes using them, then re-run `npm run start-all`.');
    console.error('Helpful commands:');
    console.error('  Windows (PowerShell): Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process');
    console.error('  macOS / Linux: sudo lsof -i :3001 && sudo kill -9 <PID>');
    process.exit(1);
  }

  // Start backend
  const env = { ...process.env, PORT: '3001' };
  const backendCmd = process.platform === 'win32' ? 'cmd /c "set PORT=3001&& npm --prefix backend start"' : 'PORT=3001 npm --prefix backend start';
  const backend = spawn(backendCmd, { shell: true, env, stdio: 'inherit' });
  backend.on('close', (code) => console.log(`Backend exited with code ${code}`));

  // Serve frontend
  const frontendCmd = 'npx http-server frontend/dist -p 3000 -c-1';
  const frontend = spawn(frontendCmd, { shell: true, stdio: 'inherit' });
  frontend.on('close', (code) => console.log(`Frontend server exited with code ${code}`));
}

start();

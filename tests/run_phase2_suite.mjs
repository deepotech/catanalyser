import { spawn } from 'child_process';
import http from 'http';
import { runFullPhase2TestSuite } from './test_phase2_url_cleanup.mjs';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
process.env.TEST_BASE_URL = BASE_URL;

function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        resolve();
      });
      req.on('error', (err) => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server timed out waiting for ${url}: ${err.message}`));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

async function main() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn(process.execPath, ['./node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
    stdio: 'pipe',
    env: { ...process.env, PORT: String(PORT) },
  });

  server.stdout.on('data', (d) => process.stdout.write(`[next] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[next:err] ${d}`));

  try {
    await waitForServer(`${BASE_URL}/`, 25000);
    console.log(`\nNext.js server is up at ${BASE_URL}. Running test suite...\n`);
    await runFullPhase2TestSuite();
    console.log('\nAll test assertions completed successfully!');
  } finally {
    console.log('Stopping Next.js server...');
    server.kill();
  }
}

main().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});

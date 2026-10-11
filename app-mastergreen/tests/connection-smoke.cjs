// Executar: node tests/connection-smoke.cjs [caminho do pacote playwright]
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:8081',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };
    let loggedIn = false;
    await page.route('**/api/mobile/bootstrap', async (route) => {
      await route.fulfill({
        status: loggedIn ? 200 : 401,
        contentType: 'application/json', headers: corsHeaders,
        body: JSON.stringify(loggedIn ? {
          user: { id: 'test', name: 'Teste', type: 'admin', branch: 'Matriz' },
          settings: { invoicePercent: 5 },
          products: [{ id: 'p1', name: 'Grama', pricePerM2: '64' }],
          customers: [],
        } : { message: 'Unauthorized' }),
      });
    });
    await page.route('**/api/login', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      loggedIn = true;
      await route.fulfill({ status: 200, headers: corsHeaders, contentType: 'application/json', body: '{"user":{"id":"test"}}' });
    });
    await page.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle' });
    await page.getByRole('tab', { name: /Sistema/ }).click();
    await page.getByText('Entre com sua conta MasterGreen para ver os dados do sistema.').waitFor();
    await page.getByLabel('E-mail').fill('teste@example.com');
    await page.getByLabel('Senha').fill('teste');
    await page.getByRole('button', { name: 'Conectar', exact: true }).click();
    await page.getByText('Conectado como Teste').waitFor();
    await page.getByText('1 produtos').waitFor();
    await page.getByText('Nota fiscal: 5%').waitFor();
    await page.getByRole('tab', { name: /Orçamento/ }).click();
    await page.getByText('VALOR DA NOTA FISCAL (5%)').waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: aba Sistema, login, bootstrap e percentual aplicado ao orçamento rápido.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });

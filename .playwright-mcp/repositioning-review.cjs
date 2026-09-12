const { chromium } = require('C:/Users/frenc/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Consent is rejected for the visual review; no messages are sent externally.
    await page.addInitScript(() => localStorage.setItem('unaifly_cookie_consent', 'rejected'));
    await page.goto('http://localhost:5001', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(__dirname, 'repositioning-desktop.png'), fullPage: true });
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.title(), /Consultoría tecnológica/);
    assert.equal(await page.locator('main section').count(), 8);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(a.getAttribute('href').slice(1))).map(a => a.getAttribute('href')));
    assert.deepEqual(brokenAnchors, []);
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    assert.match(schema, /Consultoría tecnológica/);
    const problem = page.locator('details').nth(1);
    await problem.locator('summary').click();
    assert.equal(await problem.getAttribute('open'), '');
    await page.getByRole('link', { name: 'Analizar mi empresa', exact: true }).first().click();
    assert.equal(new URL(page.url()).hash, '#diagnostico');
    await page.getByRole('button', { name: 'Solicitar análisis', exact: true }).click();
    assert.equal(await page.locator('#company').evaluate(el => el.validity.valueMissing), true);
    await page.locator('#company').fill('Empresa de prueba');
    await page.locator('#area').selectOption('Administración');
    await page.locator('#process').fill('Copiamos los datos de pedidos recibidos por email en varias herramientas.');
    await page.evaluate(() => { window.open = (url, target, features) => { window.testDraft = { url, target, features }; return null; }; });
    await page.getByRole('button', { name: 'Solicitar análisis', exact: true }).click();
    const draft = await page.evaluate(() => window.testDraft);
    const draftUrl = new URL(draft.url);
    assert.equal(draftUrl.origin, 'https://wa.me');
    assert.equal(draftUrl.pathname, '/34644583808');
    assert.match(draftUrl.searchParams.get('text'), /Empresa de prueba/);
    assert.match(draftUrl.searchParams.get('text'), /Administración/);
    assert.equal(draft.features, 'noopener,noreferrer');
    await page.getByRole('status').filter({ hasText: 'Tu mensaje está preparado' }).waitFor();
    await page.getByRole('button', { name: 'Configurar cookies', exact: true }).click();
    await page.getByRole('button', { name: /Rechazar/i }).click();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(350);
      const geometry = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      assert.ok(geometry.content <= geometry.viewport, `Overflow at ${width}: ${JSON.stringify(geometry)}`);
      if (width === 390) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: path.join(__dirname, 'repositioning-mobile.png'), fullPage: true });
        await page.locator('#diagnostico').screenshot({ path: path.join(__dirname, 'repositioning-contact-mobile.png') });
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'passed', sections: 8, viewports: [320,390,768,1024,1440], checks: ['heading and metadata', 'JSON-LD', 'anchor destinations', 'accordion', 'diagnostic CTA', 'required fields', 'WhatsApp draft and blocked-popup fallback', 'cookie settings', 'responsive overflow', 'no runtime errors'], messagesSent: 0 }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

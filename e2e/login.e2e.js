describe('Flujo E2E: Login', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('permite iniciar sesión y ver dashboard', async () => {
    await expect(element(by.text('Iniciar Sesión'))).toBeVisible();

    await element(by.type('RCTTextField')).atIndex(0).typeText('demo@email.com');
    await element(by.type('RCTTextField')).atIndex(1).typeText('123456');
    await element(by.text('Entrar')).tap();

    await expect(element(by.text('Dashboard'))).toBeVisible();
  });
});

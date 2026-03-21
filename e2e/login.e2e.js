describe('Flujo E2E: Login', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: {
        EXPO_PUBLIC_E2E_MODE: 'true',
      },
    });
  });

  it('permite iniciar sesión y ver dashboard', async () => {
    await expect(element(by.id('login-title'))).toBeVisible();

    await element(by.id('login-email-input')).typeText('demo@email.com');
    await element(by.id('login-password-input')).typeText('123456');
    await element(by.id('login-submit-button')).tap();

    await expect(element(by.id('dashboard-title'))).toBeVisible();
    await expect(element(by.id('dashboard-message'))).toHaveText('Dashboard listo para pruebas E2E');
  });
});

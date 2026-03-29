import { getProtectedProfile, loginUser } from '../../services/api';
import { getToken } from '../../services/authStorage';

jest.mock('../../services/authStorage', () => ({
  getToken: jest.fn(),
}));

describe('api service in E2E mode', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, EXPO_PUBLIC_E2E_MODE: 'true' };
    (getToken as jest.Mock).mockResolvedValue('e2e-demo-token');
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('resuelve login exitoso con credenciales de prueba', async () => {
    await expect(
      loginUser({ email: 'demo@email.com', password: '123456' })
    ).resolves.toEqual({ token: 'e2e-demo-token' });
  });

  it('devuelve mensaje del dashboard para token válido en modo E2E', async () => {
    await expect(getProtectedProfile()).resolves.toEqual({
      message: 'Dashboard listo para pruebas E2E',
      user: {
        id: 1,
        role_id: 2,
        name: 'Cliente Demo',
        email: 'demo@email.com',
      },
    });
  });
});

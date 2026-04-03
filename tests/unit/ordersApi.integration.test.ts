import { getOrders } from '../../services/api';
import { getToken } from '../../services/authStorage';

jest.mock('../../services/authStorage', () => ({
  getToken: jest.fn(),
}));

describe('getOrders normalization', () => {
  const originalEnv = process.env;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, EXPO_PUBLIC_E2E_MODE: 'false', NODE_ENV: 'development' };
    (global as any).fetch = fetchMock;
    (getToken as jest.Mock).mockResolvedValue('token-demo');
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('normaliza pedidos usando columnas de la tabla orders', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 42,
          user_id: 8,
          total: '99.5',
          status: 'Creado',
          created_at: '2026-04-01T10:00:00.000Z',
          delivery_location: 'Oficina',
          delivery_preference: 'Llamar al llegar',
        },
      ],
    });

    await expect(getOrders()).resolves.toEqual([
      {
        id: 42,
        user_id: 8,
        total: 99.5,
        status: 'created',
        created_at: '2026-04-01T10:00:00.000Z',
        delivery_location: 'Oficina',
        delivery_preference: 'Llamar al llegar',
      },
    ]);
  });
});

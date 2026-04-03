const mockQuery = jest.fn();

jest.mock('../../backend/config/db', () => ({
  query: (...args: any[]) => mockQuery(...args),
}));

const { getOrders } = require('../../backend/controllers/orderController');

const createRes = () => {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('orderController.getOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna todos los pedidos cuando el rol admin llega como string', async () => {
    mockQuery.mockResolvedValueOnce([
      [
        {
          id: 10,
          user_id: 2,
          total: 15000,
          status: 'created',
          created_at: '2026-04-01T10:00:00.000Z',
          delivery_location: 'Casa',
          delivery_preference: 'Portería',
        },
      ],
    ]);

    const req: any = { user: { id: 1, role_id: '1' } };
    const res = createRes();

    await getOrders(req, res);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('FROM orders'), []);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 10,
        user_id: 2,
      }),
    ]);
  });

  it('filtra por user_id cuando es cliente', async () => {
    mockQuery.mockResolvedValueOnce([[]]);

    const req: any = { user: { id: 55, role_id: '2' } };
    const res = createRes();

    await getOrders(req, res);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = ?'), [55]);
  });
});

import { isJwtExpired, parseJwtPayload } from '../../domain/auth';

const header = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';

describe('auth token domain helpers', () => {
  it('parsea payload jwt', () => {
    const payload = 'eyJpZCI6MSwiZXhwIjo5OTk5OTk5OTk5fQ';
    const token = `${header}.${payload}.signature`;

    expect(parseJwtPayload(token)).toMatchObject({ id: 1 });
  });

  it('detecta token expirado', () => {
    const payload = 'eyJleHAiOjF9';
    const token = `${header}.${payload}.signature`;

    expect(isJwtExpired(token)).toBe(true);
  });
});

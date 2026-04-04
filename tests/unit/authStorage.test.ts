import { getValidToken, saveToken, removeToken } from '../../services/authStorage';

const buildFakeJwt = (expOffsetSeconds: number) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expOffsetSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${encodedPayload}.signature`;
};

describe('authStorage token expiration', () => {
  beforeEach(async () => {
    await removeToken();
  });

  it('returns token when token is not expired', async () => {
    const token = buildFakeJwt(300);
    await saveToken(token);

    const result = await getValidToken();
    expect(result).toBe(token);
  });

  it('removes token when token is expired', async () => {
    const token = buildFakeJwt(-300);
    await saveToken(token);

    const result = await getValidToken();
    expect(result).toBe('');
  });
});

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middlewares/authMiddleware');

process.env.JWT_SECRET = 'test-secret';

test('requireAuth rejects request without bearer token', () => {
  const req = { headers: {} };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  let nextCalled = false;
  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Token no proporcionado' });
});

test('requireAuth attaches user when token is valid', () => {
  const token = jwt.sign({ id: 99, role_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {
    status() {
      return this;
    },
    json() {
      return this;
    },
  };

  let nextCalled = false;
  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, 99);
});

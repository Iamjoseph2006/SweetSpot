import { registerSchema } from '../../validation/registerSchema';

describe('registerSchema', () => {
  it('acepta datos válidos', () => {
    const result = registerSchema.safeParse({
      name: 'María Pérez',
      email: 'maria@example.com',
      password: 'ClaveSegura1',
      confirmPassword: 'ClaveSegura1',
    });

    expect(result.success).toBe(true);
  });

  it('rechaza contraseña sin mayúscula', () => {
    const result = registerSchema.safeParse({
      name: 'María Pérez',
      email: 'maria@example.com',
      password: 'clavesegura1',
      confirmPassword: 'clavesegura1',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza contraseñas distintas', () => {
    const result = registerSchema.safeParse({
      name: 'María Pérez',
      email: 'maria@example.com',
      password: 'ClaveSegura1',
      confirmPassword: 'ClaveSegura2',
    });

    expect(result.success).toBe(false);
  });
});

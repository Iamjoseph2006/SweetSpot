import {
  buildLoginPayload,
  buildRegisterPayload,
  mapInternalError,
  normalizeEmail,
} from '../../services/authLogic';

describe('authLogic', () => {
  it('normaliza correo en minúsculas y sin espacios', () => {
    expect(normalizeEmail('  USER@MAIL.COM  ')).toBe('user@mail.com');
  });

  it('transforma payload de registro', () => {
    expect(
      buildRegisterPayload({
        name: '  Ana  ',
        email: ' ANA@MAIL.COM ',
        password: 'Clave123A',
      })
    ).toEqual({
      name: 'Ana',
      email: 'ana@mail.com',
      password: 'Clave123A',
      role_id: 2,
    });
  });

  it('mapea errores internos a mensaje legible', () => {
    expect(mapInternalError(new Error('Timeout de red'), 'Fallback')).toBe('Timeout de red');
    expect(mapInternalError(null, 'Fallback')).toBe('Fallback');
  });

  it('arma payload de login con correo normalizado', () => {
    expect(buildLoginPayload({ email: ' USER@MAIL.COM ', password: '123456' })).toEqual({
      email: 'user@mail.com',
      password: '123456',
    });
  });
});

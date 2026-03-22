import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/auth/LoginScreen';
import { loginUser } from '../../services/api';
import { getToken, saveToken } from '../../services/authStorage';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

jest.mock('../../services/api', () => ({
  loginUser: jest.fn(),
}));

jest.mock('../../services/authStorage', () => ({
  getToken: jest.fn(),
  saveToken: jest.fn(),
}));

describe('LoginScreen integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getToken as jest.Mock).mockResolvedValue('');
  });

  it('muestra errores de validación si el formulario es inválido', async () => {
    const { getByText, getByTestId } = render(<LoginScreen />);

    fireEvent.press(getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(getByText(/correo electrónico válido/i)).toBeTruthy();
      expect(getByText(/al menos 6 caracteres/i)).toBeTruthy();
    });
  });

  it('integra UI + servicio y navega cuando login es exitoso', async () => {
    (loginUser as jest.Mock).mockResolvedValue({ token: 'jwt-demo' });

    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      ' Demo@Email.com '
    );
    fireEvent.changeText(
      getByPlaceholderText('Contraseña'),
      '123456'
    );

    fireEvent.press(getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'demo@email.com',
        password: '123456',
      });
      expect(saveToken).toHaveBeenCalledWith('jwt-demo');
      expect(mockReplace).toHaveBeenCalledWith('/DashboardScreen');
    });
  });

  it('muestra error general cuando el servicio rechaza las credenciales', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      error: 'Credenciales inválidas',
    });

    const { getByPlaceholderText, getByTestId, findByText } =
      render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      'demo@email.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Contraseña'),
      '123456'
    );

    fireEvent.press(getByTestId('login-submit-button'));

    expect(await findByText(/credenciales inválidas/i)).toBeTruthy();
    expect(saveToken).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalledWith('/DashboardScreen');
  });
});
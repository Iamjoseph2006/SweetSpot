import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AdminProductsListScreen from '../../app/shop/AdminProductsListScreen';
import AdminProductsScreen from '../../app/shop/AdminProductsScreen';
import {
  createProduct,
  deleteProduct,
  getProducts,
  inactivateProduct,
  updateProduct,
} from '../../services/api';

const mockPush = jest.fn();

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock('../../components/app-footer-nav', () => ({
  AppFooterNav: () => null,
  FOOTER_SPACE: 92,
}));

jest.mock('../../services/api', () => ({
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  inactivateProduct: jest.fn(),
  activateProduct: jest.fn(),
}));

describe('Admin products CRUD integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('permite crear producto y navegar al listado de administración', async () => {
    (createProduct as jest.Mock).mockResolvedValue({});

    const { getByPlaceholderText, getByText } = render(<AdminProductsScreen />);

    fireEvent.changeText(getByPlaceholderText('Nombre del producto'), 'Torta de chocolate');
    fireEvent.changeText(getByPlaceholderText('Precio'), '25000');
    fireEvent.press(getByText('Crear producto'));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        name: 'Torta de chocolate',
        description: '',
        price: 25000,
        image: '',
      });
    });

    fireEvent.press(getByText('Ver productos'));
    expect(mockPush).toHaveBeenCalledWith('/shop/AdminProductsListScreen');
  });

  it('permite editar, inactivar y eliminar productos en el listado admin', async () => {
    (getProducts as jest.Mock).mockResolvedValue([
      {
        id: 10,
        name: 'Cheesecake',
        description: 'Porción personal',
        price: 18000,
        image: '',
        active: true,
      },
    ]);
    (updateProduct as jest.Mock).mockResolvedValue({});
    (inactivateProduct as jest.Mock).mockResolvedValue({});
    (deleteProduct as jest.Mock).mockResolvedValue({});

    const { getByText, getByPlaceholderText } = render(<AdminProductsListScreen />);

    await waitFor(() => {
      expect(getByText('Cheesecake')).toBeTruthy();
    });

    fireEvent.press(getByText('Editar'));
    fireEvent.changeText(getByPlaceholderText('Precio'), '19000');
    fireEvent.press(getByText('Guardar cambios'));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith(10, {
        name: 'Cheesecake',
        description: 'Porción personal',
        price: 19000,
        image: '',
      });
    });

    fireEvent.press(getByText('Inactivar'));
    await waitFor(() => {
      expect(inactivateProduct).toHaveBeenCalledWith(10);
    });

    fireEvent.press(getByText('Eliminar'));
    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(10);
    });
  });
});

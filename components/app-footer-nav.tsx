import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FooterRoute =
  | '/DashboardScreen'
  | '/shop/CatalogScreen'
  | '/shop/CartScreen'
  | '/shop/OrdersScreen'
  | '/profile/ProfileSettingsScreen'
  | '/shop/AdminProductsScreen';

type FooterItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  route: FooterRoute;
};

type AppFooterNavProps = {
  isAdmin?: boolean;
};

export function AppFooterNav({ isAdmin = false }: AppFooterNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const items: FooterItem[] = isAdmin
    ? [
        { label: 'Inicio', icon: 'home-outline', route: '/DashboardScreen' },
        { label: 'Productos', icon: 'cube-outline', route: '/shop/AdminProductsScreen' },
        { label: 'Pedidos', icon: 'receipt-outline', route: '/shop/OrdersScreen' },
        { label: 'Perfil', icon: 'person-outline', route: '/profile/ProfileSettingsScreen' },
      ]
    : [
        { label: 'Inicio', icon: 'home-outline', route: '/DashboardScreen' },
        { label: 'Productos', icon: 'pricetag-outline', route: '/shop/CatalogScreen' },
        { label: 'Carrito', icon: 'cart-outline', route: '/shop/CartScreen' },
        { label: 'Pedidos', icon: 'receipt-outline', route: '/shop/OrdersScreen' },
        { label: 'Perfil', icon: 'person-outline', route: '/profile/ProfileSettingsScreen' },
      ];

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => router.replace(item.route)}
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={21} color={isActive ? '#38b6ff' : '#7a5a52'} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const FOOTER_SPACE = 92;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f2d8e5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  item: {
    alignItems: 'center',
    gap: 2,
    minWidth: 58,
  },
  label: {
    fontSize: 11,
    color: '#7a5a52',
    fontWeight: '600',
  },
  labelActive: {
    color: '#38b6ff',
  },
});

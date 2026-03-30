import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppFooterNav, FOOTER_SPACE } from '../components/app-footer-nav';
import { Ionicons } from '@expo/vector-icons';
import { getProtectedProfile } from '../services/api';
import { removeToken } from '../services/authStorage';

type DashboardUser = {
  id: number;
  role_id: number;
  name?: string;
  email?: string;
  full_name?: string;
  correo?: string;
};

type QuickNavItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  route: '/DashboardScreen' | '/shop/AdminProductsScreen' | '/shop/OrdersScreen' | '/profile/ProfileSettingsScreen' | '/shop/CartScreen' | '/shop/CatalogScreen';
};

export default function DashboardScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProtectedProfile();

      if (data.error) {
        await removeToken();
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace('/auth/LoginScreen');
        return;
      }

      setMessage(data.message ?? '');
      setUser(data.user ?? null);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/auth/LoginScreen');
  };

  const isAdmin = user?.role_id === 1;
  const displayName = user?.name || user?.full_name || 'Si';
  const displayEmail = user?.email || user?.correo || 'Sin correo';
  const roleLabel = isAdmin ? 'Administrador' : 'Cliente';
  const quickNavItems: QuickNavItem[] = isAdmin
    ? [
        { label: 'Inicio', icon: 'home-outline', route: '/DashboardScreen' },
        { label: 'Productos', icon: 'cube-outline', route: '/shop/AdminProductsScreen' },
        { label: 'Pedidos', icon: 'receipt-outline', route: '/shop/OrdersScreen' },
        { label: 'Perfil', icon: 'person-outline', route: '/profile/ProfileSettingsScreen' },
      ]
    : [
        { label: 'Inicio', icon: 'home-outline', route: '/DashboardScreen' },
        { label: 'Carrito', icon: 'cart-outline', route: '/shop/CartScreen' },
        { label: 'Productos', icon: 'pricetag-outline', route: '/shop/CatalogScreen' },
        { label: 'Pedidos', icon: 'receipt-outline', route: '/shop/OrdersScreen' },
      ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} testID="dashboard-title">
          Bienvenido{displayName !== 'Si' ? `, ${displayName}` : ' a SweetSpot'}
        </Text>

      {!loading && <Text style={styles.headerEmail}>{displayEmail}</Text>}

      {loading ? (
        <ActivityIndicator color="#704f46" size="large" testID="dashboard-loader" />
      ) : (
        <>
          <View style={styles.profileCard}>
            <Text style={styles.sectionTitle}>Tu perfil</Text>
            <Text style={styles.profileLabel}>Nombre</Text>
            <Text style={styles.profileValue}>{displayName}</Text>
            <Text style={styles.profileLabel}>Correo</Text>
            <Text style={styles.profileValue}>{displayEmail}</Text>
            <Text style={styles.profileLabel}>Rol</Text>
            <Text style={styles.profileValue}>{roleLabel}</Text>
          </View>

          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Acciones rápidas</Text>
            <Text style={styles.subtitle} testID="dashboard-message">
              {message}
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} testID="dashboard-logout-button">
        <Text style={styles.btnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      </ScrollView>
      {!loading && <AppFooterNav isAdmin={isAdmin} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff3f9',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: FOOTER_SPACE + 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 18,
    textAlign: 'center',
  },
  headerEmail: {
    textAlign: 'center',
    color: '#9a7f76',
    marginBottom: 18,
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f2d8e5',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f2d8e5',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#704f46',
    fontWeight: '700',
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 13,
    color: '#9a7f76',
    marginTop: 8,
  },
  profileValue: {
    fontSize: 16,
    color: '#4f3a34',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 15,
    color: '#704f46',
    marginBottom: 12,
  },
  btnLogout: {
    backgroundColor: '#38b6ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f2d8e5',
  },
  bottomNavTitle: {
    color: '#704f46',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  navButton: {
    width: '24%',
    minWidth: 74,
    alignItems: 'center',
    gap: 5,
  },
  navIconWrap: {
    backgroundColor: '#f9ebf3',
    borderWidth: 1,
    borderColor: '#f2d8e5',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: '#704f46',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

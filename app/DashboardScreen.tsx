import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppFooterNav, FOOTER_SPACE } from '../components/app-footer-nav';
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

type QuickAction = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  description: string;
  route:
    | '/shop/AdminProductsScreen'
    | '/shop/OrdersScreen'
    | '/profile/ProfileSettingsScreen'
    | '/shop/CartScreen'
    | '/shop/CatalogScreen';
};

export default function DashboardScreen() {
  const router = useRouter();
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

      setUser(data.user ?? null);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    router.dismissAll();
    router.replace('/auth/LoginScreen');
  };

  const isAdmin = user?.role_id === 1;
  const displayName = user?.name || user?.full_name || 'Cliente SweetSpot';
  const displayEmail = user?.email || user?.correo || 'Sin correo';
  const roleLabel = isAdmin ? 'Administrador' : 'Cliente';

  const quickActions = useMemo<QuickAction[]>(
    () =>
      isAdmin
        ? [
            {
              label: 'Gestionar productos',
              icon: 'cube-outline',
              description: 'Crea, edita y controla tu catálogo.',
              route: '/shop/AdminProductsScreen',
            },
            {
              label: 'Ver pedidos',
              icon: 'receipt-outline',
              description: 'Revisa y da seguimiento a compras.',
              route: '/shop/OrdersScreen',
            },
            {
              label: 'Mi perfil',
              icon: 'person-outline',
              description: 'Actualiza tus datos y sesión.',
              route: '/profile/ProfileSettingsScreen',
            },
          ]
        : [
            {
              label: 'Explorar productos',
              icon: 'pricetag-outline',
              description: 'Descubre postres y promos disponibles.',
              route: '/shop/CatalogScreen',
            },
            {
              label: 'Ir al carrito',
              icon: 'cart-outline',
              description: 'Finaliza tu compra en segundos.',
              route: '/shop/CartScreen',
            },
            {
              label: 'Mis pedidos',
              icon: 'receipt-outline',
              description: 'Consulta estado e historial de órdenes.',
              route: '/shop/OrdersScreen',
            },
            {
              label: 'Mi perfil',
              icon: 'person-outline',
              description: 'Gestiona cuenta y seguridad.',
              route: '/profile/ProfileSettingsScreen',
            },
          ],
    [isAdmin],
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>SweetSpot</Text>
          <Text style={styles.title} testID="dashboard-title">
            Hola, {displayName}
          </Text>
          <Text style={styles.subtitle}>Tu panel está listo para comenzar.</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#704f46" size="large" testID="dashboard-loader" />
        ) : (
          <>
            <View style={styles.profileCard}>
              <Text style={styles.sectionTitle}>Resumen de cuenta</Text>

              <View style={styles.profileRow}>
                <Ionicons name="mail-outline" size={18} color="#704f46" />
                <Text style={styles.profileValue}>{displayEmail}</Text>
              </View>

              <View style={styles.profileRow}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#704f46" />
                <Text style={styles.profileValue}>{roleLabel}</Text>
              </View>
            </View>

            <View style={styles.actionsCard}>
              <Text style={styles.sectionTitle}>Acciones rápidas</Text>

              {quickActions.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.actionButton}
                  onPress={() => router.push(item.route)}
                  activeOpacity={0.85}
                >
                  <View style={styles.actionIconWrap}>
                    <Ionicons name={item.icon} size={20} color="#704f46" />
                  </View>

                  <View style={styles.actionTextWrap}>
                    <Text style={styles.actionLabel}>{item.label}</Text>
                    <Text style={styles.actionDescription}>{item.description}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#b9948d" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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
    padding: 20,
    paddingBottom: FOOTER_SPACE + 20,
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#704f46',
    borderRadius: 22,
    padding: 20,
  },
  badge: {
    color: '#fcd6e9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: '#fce8f2',
    marginTop: 6,
    fontSize: 15,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f2d8e5',
    gap: 10,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f2d8e5',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#704f46',
    fontWeight: '700',
    marginBottom: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileValue: {
    fontSize: 15,
    color: '#4f3a34',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9fc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f5ddec',
    padding: 12,
    gap: 10,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#feeaf4',
  },
  actionTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    color: '#704f46',
    fontWeight: '700',
    fontSize: 14,
  },
  actionDescription: {
    color: '#9a7f76',
    fontSize: 12,
  },
});

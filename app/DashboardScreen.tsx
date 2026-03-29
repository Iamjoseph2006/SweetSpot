import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        router.dismissAll();
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
    router.dismissAll();
    router.replace('/auth/LoginScreen');
  };

  const isAdmin = user?.role_id === 1;
  const displayName = user?.name || user?.full_name || 'Si';
  const displayEmail = user?.email || user?.correo || 'Sin correo';
  const roleLabel = isAdmin ? 'Administrador' : 'Cliente';

  return (
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

            {isAdmin ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.btnAdmin]}
                  onPress={() => router.push('/shop/AdminProductsScreen')}
                >
                  <Text style={styles.btnText}>Gestionar Productos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.btnOrders]}
                  onPress={() => router.push('/shop/OrdersScreen')}
                >
                  <Text style={styles.btnText}>Gestionar Pedidos</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.btnCatalog]}
                  onPress={() => router.push('../shop/CatalogScreen')}
                >
                  <Text style={styles.btnText}>Ir al Catálogo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.btnOrders]}
                  onPress={() => router.push('/shop/OrdersScreen')}
                >
                  <Text style={styles.btnText}>Ver mis pedidos</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </>
      )}

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} testID="dashboard-logout-button">
        <Text style={styles.btnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff3f9',
    padding: 24,
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
  btnCatalog: {
    backgroundColor: '#f59e0b',
  },
  btnAdmin: {
    backgroundColor: '#704f46',
  },
  btnOrders: {
    backgroundColor: '#38b6ff',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
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
});

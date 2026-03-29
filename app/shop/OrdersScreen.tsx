import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getOrders, getProtectedProfile, Order, updateOrderStatus } from '../../services/api';

const ADMIN_STATUSES = ['created', 'preparing', 'sent', 'delivered'];

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const profile = await getProtectedProfile();
      setIsAdmin(profile.user?.role_id === 1);

      const data = await getOrders();
      setOrders(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleAdvanceStatus = async (order: Order) => {
    const currentIndex = ADMIN_STATUSES.indexOf(order.status);

    if (currentIndex < 0 || currentIndex === ADMIN_STATUSES.length - 1) {
      return;
    }

    const nextStatus = ADMIN_STATUSES[currentIndex + 1];
    const response = await updateOrderStatus(order.id, nextStatus);

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    loadOrders();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isAdmin ? 'Gestión de pedidos' : 'Mis pedidos'}</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos todavía.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>Pedido #{item.id}</Text>
            <Text style={styles.text}>Estado: {item.status}</Text>
            <Text style={styles.text}>Total: ${Number(item.total).toFixed(2)}</Text>
            <Text style={styles.text}>
              Fecha: {new Date(item.created_at).toLocaleString('es-CO', { hour12: false })}
            </Text>

            {isAdmin ? (
              <>
                <Text style={styles.text}>Cliente: {item.name || 'Sin nombre'}</Text>
                <Text style={styles.text}>Correo: {item.email || 'Sin correo'}</Text>
                <TouchableOpacity style={styles.statusButton} onPress={() => handleAdvanceStatus(item)}>
                  <Text style={styles.buttonText}>Avanzar estado</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DashboardScreen')}>
        <Text style={styles.buttonText}>Regresar al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  id: { fontWeight: '700', color: '#704f46', fontSize: 16, marginBottom: 4 },
  text: { color: '#704f46', marginBottom: 3 },
  empty: { textAlign: 'center', color: '#704f46', marginTop: 24 },
  statusButton: {
    backgroundColor: '#38b6ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#8c6a5d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

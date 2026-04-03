import { useFocusEffect, useRouter } from 'expo-router';
import { removeToken } from '../../services/authStorage';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { getOrders, getProtectedProfile, Order, updateOrderStatus } from '../../services/api';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';
import { AppButton } from '../../components/ui/app-button';

const STATUS_LABELS: Record<string, string> = {
  created: 'Creado',
  preparing: 'En preparación',
  sent: 'Enviado',
  delivered: 'Entregado',
};
const ORDER_STATUS_FLOW = ['created', 'preparing', 'sent', 'delivered'] as const;

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await getProtectedProfile();

      if (profile.error || !profile.user?.id) {
        await removeToken();
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace('/auth/LoginScreen');
        return;
      }

      const admin = profile.user.role_id === 1;
      setIsAdmin(admin);

      const data = await getOrders();
      const visibleOrders = admin ? data : data.filter((order) => order.user_id === profile.user?.id);
      setOrders(visibleOrders);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const handleChangeStatus = (order: Order) => {
    const options = ORDER_STATUS_FLOW.filter((status) => status !== order.status);

    if (!options.length) {
      Alert.alert('Sin cambios', 'El pedido ya está en su estado final.');
      return;
    }

    Alert.alert(
      `Cambiar estado #${order.id}`,
      `Estado actual: ${STATUS_LABELS[order.status] ?? order.status}`,
      [
        ...options.map((status) => ({
          text: STATUS_LABELS[status],
          onPress: async () => {
            const response = await updateOrderStatus(order.id, status);
            if (response.error) {
              Alert.alert('Error', response.error);
              return;
            }
            Alert.alert('Listo', `Estado actualizado a: ${STATUS_LABELS[status]}`);
            loadOrders();
          },
        })),
        { text: 'Cancelar', style: 'cancel' as const },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isAdmin ? 'Gestión de pedidos' : 'Mis pedidos'}</Text>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color="#704f46" />
        </View>
      ) : (
        <FlatList
          data={orders}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos todavía.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>{isAdmin ? `Pedido #${item.id} · Usuario #${item.user_id}` : `Pedido #${item.id}`}</Text>
            <Text style={styles.text}>Estado: {STATUS_LABELS[item.status] ?? item.status}</Text>
            <Text style={styles.text}>Total: ${Number(item.total).toFixed(2)}</Text>
            <Text style={styles.text}>
              Fecha: {new Date(item.created_at).toLocaleString('es-CO', { hour12: false })}
            </Text>

            {isAdmin ? (
              <>
                <Text style={styles.text}>Cliente: {item.name || `Usuario #${item.user_id}`}</Text>
                <Text style={styles.text}>Correo: {item.email || 'Sin correo'}</Text>
                <AppButton
                  style={styles.changeStatusButton}
                  variant="secondary"
                  label="Cambiar estado"
                  onPress={() => handleChangeStatus(item)}
                />
              </>
            ) : null}
          </View>
        )}
        />
      )}

      <AppFooterNav isAdmin={isAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48, paddingBottom: FOOTER_SPACE },
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
  changeStatusButton: { marginTop: 8, borderRadius: 8, paddingVertical: 10 },
  empty: { textAlign: 'center', color: '#704f46', marginTop: 24 },
  loaderWrap: { paddingVertical: 24 },
});

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

      const admin = Number(profile.user.role_id) === 1;
      setIsAdmin(admin);

      const data = await getOrders();
      setOrders(data);
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
              Alert.alert('Error', `${response.error} (pedido #${order.id})`);
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
            <View style={styles.headerRow}>
              <Text style={styles.id}>Pedido #{item.id}</Text>
              <Text style={styles.statusBadge}>{STATUS_LABELS[item.status] ?? item.status}</Text>
            </View>
            {isAdmin ? <Text style={styles.meta}>Cliente ID: {item.user_id}</Text> : null}
            <Text style={styles.total}>Total: ${Number(item.total).toFixed(2)}</Text>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Ubicación</Text>
              <Text style={styles.value}>
                {(item.delivery_location ?? '').trim() || 'Sin ubicación registrada'}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Preferencia</Text>
              <Text style={styles.value}>
                {(item.delivery_preference ?? '').trim() || 'Sin preferencia registrada'}
              </Text>
            </View>
            <Text style={styles.dateText}>
              Fecha: {new Date(item.created_at).toLocaleString('es-CO', { hour12: false })}
            </Text>

            {isAdmin ? (
              <>
                <AppButton
                  style={styles.changeStatusButton}
                  variant="primary"
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
    borderWidth: 1,
    borderColor: '#f2d8e5',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  id: { fontWeight: '700', color: '#704f46', fontSize: 16, marginBottom: 4 },
  statusBadge: {
    backgroundColor: '#f5e6df',
    color: '#704f46',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: '700',
    fontSize: 12,
    overflow: 'hidden',
  },
  meta: { color: '#9a7f76', marginBottom: 6, fontSize: 13 },
  text: { color: '#704f46', marginBottom: 3 },
  total: { color: '#4d2d24', marginBottom: 6, fontSize: 16, fontWeight: '800' },
  infoBlock: {
    backgroundColor: '#fff8fc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },
  label: { color: '#9a7f76', fontSize: 12, marginBottom: 2, fontWeight: '700' },
  value: { color: '#704f46', fontSize: 14 },
  dateText: { color: '#704f46', marginTop: 2, marginBottom: 3 },
  changeStatusButton: { marginTop: 8, borderRadius: 8, paddingVertical: 10 },
  empty: { textAlign: 'center', color: '#704f46', marginTop: 24 },
  loaderWrap: { paddingVertical: 24 },
});

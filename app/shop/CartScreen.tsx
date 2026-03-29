import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem, createOrder, deleteCartItem, getCartByUser } from '../../services/api';

const DEMO_USER_ID = 1;

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    try {
      const data = await getCartByUser(DEMO_USER_ID);
      setItems(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el carrito');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const handleDelete = async (id: number) => {
    await deleteCartItem(id);
    loadCart();
  };

  const handleConfirmOrder = async () => {
    const response = await createOrder(DEMO_USER_ID);

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    router.replace('/shop/OrderScreen');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu carrito</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos en el carrito.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>Cant: {item.quantity} - ${item.price}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.buttonText}>Confirmar pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/shop/CatalogScreen')}>
        <Text style={styles.buttonText}>Seguir comprando</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#704f46', marginBottom: 16 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: '600', color: '#704f46' },
  details: { color: '#704f46' },
  empty: { textAlign: 'center', color: '#704f46', marginTop: 24 },
  total: { fontSize: 18, fontWeight: 'bold', color: '#704f46', marginVertical: 12 },
  deleteButton: { backgroundColor: '#d9534f', padding: 10, borderRadius: 8 },
  confirmButton: { backgroundColor: '#38b6ff', padding: 12, borderRadius: 10, alignItems: 'center' },
  backButton: {
    backgroundColor: '#8c6a5d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

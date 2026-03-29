import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { addProductToCart, getProducts, Product } from '../../services/api';

const DEMO_USER_ID = 1;

export default function CatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const response = await addProductToCart({
      user_id: DEMO_USER_ID,
      product_id: productId,
      quantity: 1,
    });

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert('Listo', 'Producto agregado al carrito');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo Sweet Spot</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#704f46" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} contentFit="contain" />
              ) : null}
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item.id)}>
                <Text style={styles.buttonText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DashboardScreen')}>
        <Text style={styles.buttonText}>Regresar al menú</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/shop/CartScreen')}>
        <Text style={styles.buttonText}>Ver carrito</Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f2f6',
  },
  productName: { fontSize: 18, fontWeight: '600', color: '#704f46' },
  productPrice: { fontSize: 16, color: '#704f46', marginBottom: 8 },
  button: { backgroundColor: '#704f46', padding: 10, borderRadius: 8, alignItems: 'center' },
  secondaryButton: {
    backgroundColor: '#38b6ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#8c6a5d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

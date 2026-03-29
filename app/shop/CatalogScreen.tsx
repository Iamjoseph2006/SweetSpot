import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addProductToCart, getProducts, Product } from '../../services/api';

const DEMO_USER_ID = 1;

export default function CatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationText, setLocationText] = useState('Ubicación no cargada');
  const [customImageUrl, setCustomImageUrl] = useState('');

  useEffect(() => {
    loadProducts();
    loadLocation();
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

  const loadLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Permiso de ubicación denegado');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocationText(
        `Lat: ${currentLocation.coords.latitude.toFixed(5)} | Lng: ${currentLocation.coords.longitude.toFixed(5)}`
      );
    } catch {
      setLocationText('No se pudo obtener la ubicación');
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
      <Text style={styles.location}>{locationText}</Text>

      <TextInput
        value={customImageUrl}
        onChangeText={setCustomImageUrl}
        placeholder="URL de imagen para mostrar"
        style={styles.input}
      />
      {customImageUrl ? <Image source={{ uri: customImageUrl }} style={styles.preview} /> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#704f46" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.productImage} /> : null}
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item.id)}>
                <Text style={styles.buttonText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/shop/CartScreen')}>
        <Text style={styles.buttonText}>Ver carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#704f46', marginBottom: 8 },
  location: { color: '#704f46', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
  },
  preview: { width: '100%', height: 120, borderRadius: 10, marginBottom: 12 },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  productImage: { width: '100%', height: 130, borderRadius: 8, marginBottom: 8 },
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
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

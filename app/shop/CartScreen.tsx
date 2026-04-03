import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { CartItem, createOrder, deleteCartItem, getCartByUser, getProtectedProfile } from '../../services/api';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';
import { readNativeNote, saveNativeNote } from '../../services/native/fileSystemService';
import { getCurrentLocation, requestLocationPermission } from '../../services/native/locationService';

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [preference, setPreference] = useState('');
  const [nativeLoading, setNativeLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProtectedProfile();

      if (data.error || !data.user?.id) {
        return;
      }

      setUserId(data.user.id);
      setIsAdmin(data.user.role_id === 1);
    } catch {
      setUserId(null);
    }
  }, []);

  const loadCart = useCallback(async () => {
    try {
      if (!userId) {
        setItems([]);
        return;
      }

      const data = await getCartByUser(userId);
      setItems(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el carrito');
    }
  }, [userId]);

  const loadSavedPreference = useCallback(async () => {
    try {
      setNativeLoading(true);
      const saved = await readNativeNote();
      if (!saved) {
        Alert.alert('Preferencias', 'Aún no tienes una preferencia guardada');
        return;
      }
      setPreference(saved);
    } catch {
      Alert.alert('Error', 'No se pudo leer la preferencia guardada');
    } finally {
      setNativeLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleDelete = async (id: number) => {
    await deleteCartItem(id);
    loadCart();
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const permission = await requestLocationPermission();

      if (permission !== 'granted') {
        const permissionMessage =
          permission === 'blocked'
            ? 'El permiso está bloqueado. Habilítalo en la configuración del dispositivo.'
            : permission === 'unavailable'
              ? 'La ubicación no está disponible en este dispositivo o emulador.'
              : 'Debes habilitar permisos para usar tu ubicación de entrega.';
        Alert.alert('Ubicación', permissionMessage);
        return;
      }

      const location = await getCurrentLocation();
      if (!location) {
        Alert.alert('Ubicación', 'No fue posible obtener la ubicación actual');
        return;
      }

      setDeliveryLocation(
        `Lat ${location.latitude.toFixed(5)} / Lon ${location.longitude.toFixed(5)}`
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la ubicación');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSavePreference = async () => {
    if (!preference.trim()) {
      Alert.alert('Preferencias', 'Escribe una preferencia antes de guardar');
      return;
    }

    try {
      setNativeLoading(true);
      await saveNativeNote(preference.trim());
      Alert.alert('Listo', 'Preferencia guardada en almacenamiento local');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la preferencia');
    } finally {
      setNativeLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!userId) {
      Alert.alert('Perfil', 'No se pudo identificar tu usuario');
      return;
    }

    const cleanedLocation = deliveryLocation.trim();
    const cleanedPreference = preference.trim();

    const response = await createOrder(userId, {
      delivery_location: cleanedLocation,
      delivery_preference: cleanedPreference,
    });

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert(
      'Pedido confirmado',
      `Entrega: ${cleanedLocation || 'Sin ubicación registrada'}\nPreferencia: ${cleanedPreference || 'Sin preferencias'}`
    );

    router.replace('/shop/OrderScreen');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const locationPreview = deliveryLocation.trim() || 'Sin ubicación registrada';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu carrito</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos en el carrito.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.itemInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>Cantidad: {item.quantity}</Text>
              <Text style={styles.details}>Precio unitario: ${Number(item.price).toFixed(2)}</Text>
              <Text style={styles.subtotal}>Subtotal: ${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.nativeCard}>
        <Text style={styles.nativeTitle}>Datos de entrega</Text>
        <Text style={styles.nativeInfo}>Ubicación: {locationPreview}</Text>

        <TouchableOpacity
          style={[styles.nativeButton, locationLoading && styles.disabledButton]}
          onPress={handleUseCurrentLocation}
          disabled={locationLoading}
        >
          <Text style={styles.buttonText}>
            {locationLoading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={preference}
          onChangeText={setPreference}
          placeholder="Ej: sin lactosa, tocar timbre..."
          multiline
        />

        <TouchableOpacity style={styles.nativeButton} onPress={handleSavePreference}>
          <Text style={styles.buttonText}>Guardar preferencia local</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={loadSavedPreference}>
          <Text style={styles.buttonText}>Cargar preferencia guardada</Text>
        </TouchableOpacity>

        {nativeLoading || locationLoading ? <ActivityIndicator color="#704f46" /> : null}
      </View>

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.buttonText}>Confirmar pedido</Text>
      </TouchableOpacity>

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
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600', color: '#704f46' },
  details: { color: '#704f46' },
  subtotal: { color: '#4d2d24', fontWeight: '700', marginTop: 2 },
  empty: { textAlign: 'center', color: '#704f46', marginTop: 24 },
  nativeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2d8e5',
    padding: 12,
    marginVertical: 8,
    gap: 8,
  },
  nativeTitle: { fontWeight: '700', color: '#704f46' },
  nativeInfo: { color: '#704f46' },
  nativeButton: { backgroundColor: '#704f46', padding: 11, borderRadius: 10, alignItems: 'center' },
  disabledButton: { opacity: 0.75 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  total: { fontSize: 18, fontWeight: 'bold', color: '#704f46', marginVertical: 12 },
  deleteButton: { backgroundColor: '#d9534f', padding: 10, borderRadius: 8 },
  confirmButton: { backgroundColor: '#38b6ff', padding: 12, borderRadius: 10, alignItems: 'center' },
  secondaryButton: {
    backgroundColor: '#8c6a5d',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

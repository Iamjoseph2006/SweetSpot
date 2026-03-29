import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido realizado con éxito ✅</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/shop/CatalogScreen')}>
        <Text style={styles.buttonText}>Volver al catálogo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3f9',
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#704f46', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#704f46', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

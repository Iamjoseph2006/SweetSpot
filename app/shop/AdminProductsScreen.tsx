import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createProduct } from '../../services/api';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image: '',
};

export default function AdminProductsScreen() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);

  const clearForm = () => {
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y precio son obligatorios');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
    };

    if (Number.isNaN(payload.price)) {
      Alert.alert('Dato inválido', 'El precio debe ser numérico');
      return;
    }

    const response = await createProduct(payload);

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert('Listo', 'Producto creado');
    clearForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir producto</Text>

      <TextInput
        value={form.name}
        onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
        placeholder="Nombre del producto"
        style={styles.input}
      />
      <TextInput
        value={form.description}
        onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
        placeholder="Descripción"
        style={styles.input}
      />
      <TextInput
        value={form.price}
        onChangeText={(value) => setForm((prev) => ({ ...prev, price: value }))}
        placeholder="Precio"
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <TextInput
        value={form.image}
        onChangeText={(value) => setForm((prev) => ({ ...prev, image: value }))}
        placeholder="URL de imagen (opcional)"
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Crear producto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.manageButton} onPress={() => router.push('/shop/AdminProductsListScreen')}>
        <Text style={styles.buttonText}>Ver productos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/DashboardScreen')}>
        <Text style={styles.buttonText}>Regresar al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48 },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
  },
  saveButton: { backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignItems: 'center' },
  manageButton: {
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

import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createProduct,
  deleteProduct,
  getProducts,
  Product,
  updateProduct,
} from '../../services/api';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image: '',
};

export default function AdminProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el catálogo');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const clearForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
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

    const response = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert('Listo', editingId ? 'Producto actualizado' : 'Producto creado');
    clearForm();
    loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      image: product.image || '',
    });
  };

  const handleDelete = async (id: number) => {
    const response = await deleteProduct(id);

    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    loadProducts();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrador de productos (CRUD)</Text>

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
        <Text style={styles.buttonText}>{editingId ? 'Actualizar' : 'Crear producto'}</Text>
      </TouchableOpacity>

      {editingId ? (
        <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Cancelar edición</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.productImage} /> : null}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>${item.price}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  title: { fontSize: 21, fontWeight: 'bold', color: '#704f46', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
  },
  saveButton: { backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelButton: {
    backgroundColor: '#8c6a5d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  list: { paddingVertical: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  productImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 17, fontWeight: '600', color: '#704f46' },
  details: { color: '#704f46', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  editButton: {
    flex: 1,
    backgroundColor: '#38b6ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#8c6a5d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

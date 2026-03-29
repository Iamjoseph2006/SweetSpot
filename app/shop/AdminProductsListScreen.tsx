import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { activateProduct, deleteProduct, getProducts, inactivateProduct, Product, updateProduct } from '../../services/api';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';

const EMPTY_FORM = { name: '', description: '', price: '', image: '' };

export default function AdminProductsListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el catálogo');
    }
  }, []);

  useFocusEffect(useCallback(() => { loadProducts(); }, [loadProducts]));

  const clearForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
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

  const handleSave = async () => {
    if (!editingId) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      Alert.alert('Dato inválido', 'Completa nombre y precio válidos');
      return;
    }

    const response = await updateProduct(editingId, payload);
    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert('Listo', 'Producto actualizado');
    clearForm();
    loadProducts();
  };

  const toggleActive = async (product: Product) => {
    const response = product.active === false ? await activateProduct(product.id) : await inactivateProduct(product.id);
    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }
    loadProducts();
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
      <Text style={styles.title}>Ver productos</Text>

      {editingId ? (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Editando #{editingId}</Text>
          <TextInput value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} style={styles.input} placeholder="Nombre" />
          <TextInput value={form.description} onChangeText={(v) => setForm((p) => ({ ...p, description: v }))} style={styles.input} placeholder="Descripción" />
          <TextInput value={form.price} onChangeText={(v) => setForm((p) => ({ ...p, price: v }))} style={styles.input} placeholder="Precio" keyboardType="decimal-pad" />
          <TextInput value={form.image} onChangeText={(v) => setForm((p) => ({ ...p, image: v }))} style={styles.input} placeholder="URL imagen" />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.buttonText}>Guardar cambios</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={clearForm}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, item.active === false && styles.inactiveCard]}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.productImage} contentFit="contain" /> : null}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>${item.price}</Text>
            <Text style={styles.details}>Estado: {item.active === false ? 'Inactivo' : 'Activo'}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}><Text style={styles.buttonText}>Editar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inactiveButton} onPress={() => toggleActive(item)}><Text style={styles.buttonText}>{item.active === false ? 'Activar' : 'Inactivar'}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}><Text style={styles.buttonText}>Eliminar</Text></TouchableOpacity>
          </View>
        )}
      />

      <AppFooterNav isAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48, paddingBottom: FOOTER_SPACE },
  title: { fontSize: 21, fontWeight: 'bold', color: '#704f46', marginBottom: 12, textAlign: 'center' },
  list: { paddingBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  inactiveCard: { opacity: 0.75 },
  editCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  editTitle: { color: '#704f46', fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', padding: 10, marginBottom: 8 },
  productImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8, backgroundColor: '#f8f2f6' },
  name: { fontSize: 17, fontWeight: '600', color: '#704f46' },
  details: { color: '#704f46', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  saveButton: { backgroundColor: '#704f46', padding: 10, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#8c6a5d', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  editButton: { flex: 1, backgroundColor: '#38b6ff', padding: 10, borderRadius: 8, alignItems: 'center' },
  inactiveButton: { flex: 1, backgroundColor: '#704f46', padding: 10, borderRadius: 8, alignItems: 'center' },
  deleteButton: { backgroundColor: '#d9534f', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

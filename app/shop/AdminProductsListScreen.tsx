import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';
import { AppButton } from '../../components/ui/app-button';
import { AppListItem } from '../../components/ui/app-list-item';
import { AppTextInput } from '../../components/ui/app-text-input';
import { Product } from '../../services/api';
import {
  initialProductDraft,
  loadAdminProducts,
  removeProduct,
  toggleProductState,
  updateProductFromDraft,
} from '../../viewmodels/adminProductsViewModel';

export default function AdminProductsListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialProductDraft());
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loadAdminProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el catálogo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearForm = () => {
    setEditingId(null);
    setForm(initialProductDraft());
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
    const result = await updateProductFromDraft(editingId, form);
    if (result.error) {
      Alert.alert('Error', result.error);
      return;
    }

    Alert.alert('Listo', 'Producto actualizado');
    clearForm();
    loadProducts();
  };

  const handleDelete = async (productId: number) => {
    const result = await removeProduct(productId);
    if (result.error) {
      Alert.alert('Error', result.error);
      return;
    }

    Alert.alert('Listo', 'Producto eliminado');
    loadProducts();
  };

  const handleToggleActive = async (product: Product) => {
    const result = await toggleProductState(product);
    if (result.error) {
      Alert.alert('Error', result.error);
      return;
    }

    Alert.alert('Listo', product.active === false ? 'Producto activado' : 'Producto inactivado');
    loadProducts();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver productos</Text>
      {loading ? <Text style={styles.subtitle}>Cargando catálogo...</Text> : null}

      {editingId ? (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Editando #{editingId}</Text>
          <AppTextInput value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Nombre" />
          <AppTextInput value={form.description} onChangeText={(v) => setForm((p) => ({ ...p, description: v }))} placeholder="Descripción" />
          <AppTextInput value={form.price} onChangeText={(v) => setForm((p) => ({ ...p, price: v }))} placeholder="Precio" keyboardType="decimal-pad" />
          <AppTextInput value={form.image} onChangeText={(v) => setForm((p) => ({ ...p, image: v }))} placeholder="URL imagen" />
          <AppButton style={styles.saveButton} onPress={handleSave} label="Guardar cambios" />
          <AppButton style={styles.cancelButton} onPress={clearForm} label="Cancelar" variant="secondary" />
        </View>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AppListItem inactive={item.active === false}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.productImage} contentFit="contain" /> : null}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>${item.price}</Text>
            <Text style={styles.details}>Estado: {item.active === false ? 'Inactivo' : 'Activo'}</Text>
            <View style={styles.row}>
              <AppButton style={styles.editButton} onPress={() => handleEdit(item)} label="Editar" variant="secondary" />
              <AppButton
                style={styles.inactiveButton}
                onPress={() => handleToggleActive(item)}
                label={item.active === false ? 'Activar' : 'Inactivar'}
              />
            </View>
            <AppButton style={styles.deleteButton} onPress={() => handleDelete(item.id)} label="Eliminar" variant="danger" />
          </AppListItem>
        )}
      />

      <AppFooterNav isAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48, paddingBottom: FOOTER_SPACE },
  title: { fontSize: 21, fontWeight: 'bold', color: '#704f46', marginBottom: 6, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#704f46', marginBottom: 12 },
  list: { paddingBottom: 12 },
  editCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  editTitle: { color: '#704f46', fontWeight: '700', marginBottom: 8 },
  productImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8, backgroundColor: '#f8f2f6' },
  name: { fontSize: 17, fontWeight: '600', color: '#704f46' },
  details: { color: '#704f46', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  saveButton: { borderRadius: 8, paddingVertical: 10 },
  cancelButton: { borderRadius: 8, paddingVertical: 10, marginTop: 8 },
  editButton: { flex: 1, borderRadius: 8, paddingVertical: 10 },
  inactiveButton: { flex: 1, borderRadius: 8, paddingVertical: 10 },
  deleteButton: { borderRadius: 8, paddingVertical: 10 },
});

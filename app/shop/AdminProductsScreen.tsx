import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';
import { AppButton } from '../../components/ui/app-button';
import { AppTextInput } from '../../components/ui/app-text-input';
import { useAdminProductsViewModel } from '../../viewmodels/useAdminProductsViewModel';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image: '',
};

export default function AdminProductsScreen() {
  const router = useRouter();
  const { create, isSubmitting } = useAdminProductsViewModel();
  const [form, setForm] = useState(EMPTY_FORM);

  const clearForm = () => {
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    const response = await create(form);
    if (!response.success) {
      Alert.alert('Error', response.error);
      return;
    }

    Alert.alert('Listo', 'Producto creado');
    clearForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir producto</Text>

      <AppTextInput
        value={form.name}
        onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
        placeholder="Nombre del producto"
      />
      <AppTextInput
        value={form.description}
        onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
        placeholder="Descripción"
      />
      <AppTextInput
        value={form.price}
        onChangeText={(value) => setForm((prev) => ({ ...prev, price: value }))}
        placeholder="Precio"
        keyboardType="decimal-pad"
      />
      <AppTextInput
        value={form.image}
        onChangeText={(value) => setForm((prev) => ({ ...prev, image: value }))}
        placeholder="URL de imagen (opcional)"
      />

      <AppButton
        label={isSubmitting ? 'Guardando...' : 'Crear producto'}
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />

      <AppButton
        label="Ver productos"
        variant="secondary"
        style={styles.manageButton}
        onPress={() => router.push('/shop/AdminProductsListScreen')}
      />

      <AppFooterNav isAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3f9', padding: 16, paddingTop: 48, paddingBottom: FOOTER_SPACE },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 12,
    textAlign: 'center',
  },
  saveButton: { marginTop: 8, borderRadius: 10 },
  manageButton: {
    borderRadius: 10,
    marginTop: 8,
  },
});

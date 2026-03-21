import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProfileSettingsViewModel } from '../viewmodels/useProfileSettingsViewModel';

export default function ProfileSettingsScreen() {
  const {
    locationState,
    locationMessage,
    fileState,
    fileMessage,
    savedFilePath,
    updateLocation,
    savePreference,
    loadPreference,
  } = useProfileSettingsViewModel();

  const [address, setAddress] = useState('Av. Dulce 123, Ciudad SweetSpot');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta terminada en 1234');
  const [preference, setPreference] = useState('Sin lactosa y poco azúcar');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil / Configuración</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos principales</Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput value={paymentMethod} onChangeText={setPaymentMethod} style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Funcionalidad nativa #1 · Geolocalización</Text>
        <Text style={styles.status}>Estado: {locationState}</Text>
        <Text style={styles.info}>{locationMessage}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={updateLocation}>
          <Text style={styles.buttonText}>Actualizar ubicación de entrega</Text>
        </TouchableOpacity>

        {locationState === 'loading' && <ActivityIndicator color="#704f46" />}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Funcionalidad nativa #2 · Sistema de archivos</Text>
        <TextInput
          value={preference}
          onChangeText={setPreference}
          style={[styles.input, styles.multiline]}
          multiline
          placeholder="Preferencias de pedido"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={() => savePreference(preference)}>
          <Text style={styles.buttonText}>Guardar preferencia en almacenamiento local</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={loadPreference}>
          <Text style={styles.buttonText}>Cargar preferencia guardada</Text>
        </TouchableOpacity>

        {fileState === 'loading' && <ActivityIndicator color="#704f46" />}

        <Text style={styles.status}>Estado: {fileState}</Text>
        <Text style={styles.info}>Ruta local: {savedFilePath || 'Aún no guardada'}</Text>
        <Text style={styles.info}>Contenido: {fileMessage}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff3f9',
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#704f46',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#f2d7e4',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#704f46',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#704f46',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#38b6ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  status: {
    color: '#704f46',
    fontWeight: '700',
  },
  info: {
    color: '#5b4a45',
  },
});
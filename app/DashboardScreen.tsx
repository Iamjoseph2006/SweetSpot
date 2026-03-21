import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProtectedProfile } from '../services/api';
import { removeToken } from '../services/authStorage';

export default function DashboardScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProtectedProfile();

      if (data.error) {
        await removeToken();
        router.replace('/auth/LoginScreen');
        return;
      }

      setMessage(data.message);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    router.replace('/auth/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="dashboard-title">
        Bienvenido al Dashboard
      </Text>

      {loading ? (
        <ActivityIndicator color="#704f46" size="large" testID="dashboard-loader" />
      ) : (
        <Text style={styles.subtitle} testID="dashboard-message">
          {message}
        </Text>
      )}
      <TouchableOpacity
        style={styles.btnProfile}
        onPress={() => router.push('/profile/ProfileSettingsScreen')}
        testID="dashboard-profile-button"
      >
        <Text style={styles.btnText}>Ir a Perfil / Configuración</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} testID="dashboard-logout-button">
        <Text style={styles.btnText}>Cerrar sesión</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#704f46',
    marginBottom: 24,
    textAlign: 'center',
  },
  btnProfile: {
    backgroundColor: '#8c6a5d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnLogout: {
    backgroundColor: '#38b6ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

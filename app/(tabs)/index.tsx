import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.logo} 
      />

      {/* Título */}
      <Text style={styles.title}>Bienvenido a Sweet Spot</Text>
      <Text style={styles.subtitle}>
        Tu dulcería favorita al alcance de un click
      </Text>

      {/* Botones */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/auth/LoginScreen')}>
          <Text style={styles.btnText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/auth/RegisterScreen')}>
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24,
    backgroundColor: '#fff3f9', // fondo SweetSpot
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 24, 
    resizeMode: 'contain' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#704f46', // color principal
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: '#384152', // color secundario/texto
    textAlign: 'center', 
    marginBottom: 32 
  },
  buttons: { 
    width: '100%',
    gap: 16, // espacio entre botones
  },
  btnPrimary: {
    backgroundColor: '#704f46', // color principal
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#38b6ff', // color acento
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

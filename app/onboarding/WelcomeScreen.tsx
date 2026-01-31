import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Sweet Spot</Text>

      <Text style={styles.text}>
        Descubre una experiencia dulce y personalizada
      </Text>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.push('/onboarding/BenefitsScreen')}
      >
        <Text style={styles.btnPrimaryText}>Continuar</Text>
      </TouchableOpacity>

      {/* Botón Saltar */}
      <TouchableOpacity
        style={styles.btnSkip}
        onPress={() => router.replace('/auth/RegisterScreen')}
      >
        <Text style={styles.btnSkipText}>Saltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff3f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },

  /* Continuar */
  btnPrimary: {
    backgroundColor: '#704f46', // café
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 16,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

  /* Saltar */
  btnSkip: {
    alignItems: 'center',
  },
  btnSkipText: {
    color: '#38b6ff', // azul
    fontWeight: 'bold',
    fontSize: 14,
  },
});
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function BenefitsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>¿Por qué usar Sweet Spot?</Text>

      <Text style={styles.text}>
        🍬 Acceso rápido a productos{'\n'}
        🍦 Experiencia personalizada{'\n'}
        🍭 Gestión sencilla de tu cuenta
      </Text>

      {/* Botón Siguiente */}
      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.push('/onboarding/PermissionsScreen')}
      >
        <Text style={styles.btnPrimaryText}>Siguiente</Text>
      </TouchableOpacity>

      {/* Botón Atrás */}
      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => router.back()}
      >
        <Text style={styles.btnSecondaryText}>Atrás</Text>
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
  logo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },

  /* Siguiente */
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

  /* Atrás */
  btnSecondary: {
    backgroundColor: '#38b6ff', // azul
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 16,
  },
  btnSecondaryText: {
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
    color: '#38b6ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

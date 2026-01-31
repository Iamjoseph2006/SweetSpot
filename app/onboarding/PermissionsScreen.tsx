import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PermissionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo listo</Text>

      <Text style={styles.text}>
        Necesitamos algunos datos para crear tu cuenta y ofrecerte
        una experiencia personalizada.
      </Text>

      {/* Botón Ir a Registro */}
      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.replace('/auth/RegisterScreen')}
      >
        <Text style={styles.btnPrimaryText}>Ir al registro</Text>
      </TouchableOpacity>

      {/* Botón Atrás */}
      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => router.back()}
      >
        <Text style={styles.btnSecondaryText}>Atrás</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#704f46',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },

  /* Ir a Registro */
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
  },
  btnSecondaryText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

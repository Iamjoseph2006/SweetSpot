import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { z } from 'zod';
import { loginUser } from '../../services/api';
import { buildLoginPayload, mapInternalError } from '../../services/authLogic';
import { getToken, saveToken } from '../../services/authStorage';

const loginSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const token = await getToken();
      if (token) {
        router.replace('/DashboardScreen');
      }
    };

    redirectIfLoggedIn();
  }, [router]);

  const login = async () => {
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const validation = loginSchema.safeParse({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const response = await loginUser({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (response.token) {
        await saveToken(response.token);
        router.replace('/DashboardScreen');
      } else {
        setErrors({
          general: response.error || 'Correo o contraseña incorrectos',
        });
      }
    } catch (error) {
      setErrors({
        general: mapInternalError(
          error,
          'No se pudo conectar al servidor. Verifica tu conexión o la IP.'
        ),
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} testID="login-title">
          Iniciar Sesión
        </Text>

        <TextInput
          testID="login-email-input"
          placeholder="Correo electrónico"
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}

        <TextInput
          testID="login-password-input"
          placeholder="Contraseña"
          secureTextEntry
          style={[styles.input, errors.password && styles.inputError]}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>⚠️ {errors.password}</Text>}

        {errors.general && <Text style={styles.errorTextCenter}>⚠️ {errors.general}</Text>}

        <TouchableOpacity style={styles.btnPrimary} onPress={login} testID="login-submit-button">
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/auth/RegisterScreen')}
          testID="login-register-button"
        >
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff3f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#704f46',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d9534f',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    marginBottom: 6,
  },
  errorTextCenter: {
    color: '#d9534f',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  btnPrimary: {
    backgroundColor: '#704f46',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#38b6ff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

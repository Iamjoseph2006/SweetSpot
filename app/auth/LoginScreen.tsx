import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { z } from 'zod';
import { loginUser } from '../../services/api';
import { mapInternalError } from '../../services/authLogic';
import { getToken, saveToken } from '../../services/authStorage';
import { AppButton } from '../../components/ui/app-button';
import { AppTextInput } from '../../components/ui/app-text-input';

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

        <AppTextInput
          testID="login-email-input"
          placeholder="Correo electrónico"
          hasError={Boolean(errors.email)}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}

        <AppTextInput
          testID="login-password-input"
          placeholder="Contraseña"
          secureTextEntry
          hasError={Boolean(errors.password)}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>⚠️ {errors.password}</Text>}

        {errors.general && <Text style={styles.errorTextCenter}>⚠️ {errors.general}</Text>}

        <AppButton label="Entrar" style={styles.btnPrimary} onPress={login} testID="login-submit-button" />

        <AppButton
          label="Registrarse"
          variant="secondary"
          style={styles.btnSecondary}
          onPress={() => router.push('/auth/RegisterScreen')}
          testID="login-register-button"
        />
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
    marginTop: 16,
  },
  btnSecondary: {
    marginTop: 12,
  },
});

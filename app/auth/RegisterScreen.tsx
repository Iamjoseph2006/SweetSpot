import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { checkEmailExists, registerUser } from '../../services/api';
import { buildRegisterPayload, mapInternalError, normalizeEmail } from '../../services/authLogic';
import { registerSchema } from '../../validation/registerSchema';
import { AppButton } from '../../components/ui/app-button';
import { AppTextInput } from '../../components/ui/app-text-input';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });

    if (emailTimeout.current) {
      clearTimeout(emailTimeout.current);
    }

    emailTimeout.current = setTimeout(async () => {
      const normalizedEmail = normalizeEmail(value);
      if (!normalizedEmail.includes('@')) return;

      try {
        const exists = await checkEmailExists(normalizedEmail);
        if (exists) {
          setErrors((prev) => ({
            ...prev,
            email: 'Este correo ya está registrado',
          }));
        }
      } catch {
        // Silencioso para no romper UX.
      }
    }, 600);
  };

  const register = async () => {
    setErrors({});

    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await registerUser(
        buildRegisterPayload({
          name,
          email,
          password,
          roleId: 2,
        })
      );

      if (response?.error) {
        Alert.alert('Error', response.error);
        return;
      }

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada');
      router.replace('/auth/LoginScreen');
    } catch (error) {
      Alert.alert('Error de conexión', mapInternalError(error, 'No se pudo conectar con el servidor'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <AppTextInput placeholder="Nombre" value={name} onChangeText={setName} hasError={Boolean(errors.name)} />
        {errors.name && <Text style={styles.errorText}>⚠️ {errors.name}</Text>}

        <AppTextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          hasError={Boolean(errors.email)}
        />
        {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}

        <AppTextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          hasError={Boolean(errors.password)}
        />
        {errors.password && <Text style={styles.errorText}>⚠️ {errors.password}</Text>}

        <AppTextInput
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          hasError={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>}

        <AppButton label="Registrarse" style={styles.btnPrimary} onPress={register} />

        <AppButton
          label="Ya tengo cuenta"
          variant="secondary"
          style={styles.btnSecondary}
          onPress={() => router.push('/auth/LoginScreen')}
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
    color: '#b00020',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
  btnPrimary: {
    marginTop: 16,
  },
  btnSecondary: {
    marginTop: 12,
  },
});

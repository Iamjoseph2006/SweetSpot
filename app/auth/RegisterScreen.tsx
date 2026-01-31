import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { z } from 'zod';
import { checkEmailExists, registerUser } from '../../services/api';

/* ESQUEMA DE VALIDACIÓN (ZOD) */
const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres'),

    email: z
      .string()
      .email('Ingrese un correo electrónico válido'),

    password: z
      .string()
      .min(6, 'La contraseña debe tener mínimo 6 caracteres'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default function RegisterScreen() {
  const router = useRouter();

  /* ESTADOS */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* DEBOUNCE EMAIL (useRef) */
  const emailTimeout = useRef<any>(null);

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
      if (value.includes('@')) {
        try {
          const exists = await checkEmailExists(value);
          if (exists) {
            setErrors((prev) => ({
              ...prev,
              email: 'Este correo ya está registrado',
            }));
          }
        } catch {
          // Silencioso para no romper UX
        }
      }
    }, 600);
  };

  /* REGISTRO */
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
      const response = await registerUser({
        name,
        email,
        password,
        role_id: 2,
      });

      if (response?.error) {
        Alert.alert('Error', response.error);
        return;
      }

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada');
      router.replace('/auth/LoginScreen');

    } catch (error) {
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor'
      );
    }
  };

  /* UI */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>⚠️ {errors.name}</Text>}

        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && (
          <Text style={styles.errorText}>⚠️ {errors.password}</Text>
        )}

        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>
        )}

        <TouchableOpacity style={styles.btnPrimary} onPress={register}>
          <Text style={styles.btnText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/auth/LoginScreen')}
        >
          <Text style={styles.btnText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ESTILOS */
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
  errorText: {
    color: '#b00020',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
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

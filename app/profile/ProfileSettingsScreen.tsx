import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppFooterNav, FOOTER_SPACE } from '../../components/app-footer-nav';
import { getProtectedProfile } from '../../services/api';
import { removeToken } from '../../services/authStorage';
import { AppButton } from '../../components/ui/app-button';

type ProfileUser = {
  role_id: number;
  name?: string;
  full_name?: string;
  email?: string;
  correo?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);

  if (parts.length === 0) {
    return 'SS';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProtectedProfile();

        if (data.error) {
          Alert.alert('Perfil', data.error);
          await removeToken();
          router.dismissAll();
          router.replace('/auth/LoginScreen');
          return;
        }

        setUser(data.user ?? null);
      } catch {
        Alert.alert('Error', 'No se pudo cargar tu perfil');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    router.dismissAll();
    router.replace('/auth/LoginScreen');
  };

  const roleLabel = user?.role_id === 1 ? 'Administrador' : 'Cliente';
  const displayName = user?.name || user?.full_name || 'Sin nombre';
  const displayEmail = user?.email || user?.correo || 'Sin correo';
  const isAdmin = user?.role_id === 1;
  const initials = getInitials(displayName);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.card}>
          {loadingProfile ? (
            <ActivityIndicator color="#704f46" />
          ) : (
            <View style={styles.profileContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <Text style={styles.welcome}>¡Bienvenido a tu perfil!</Text>

              <Text style={styles.profileLabel}>Nombre</Text>
              <Text style={styles.profileValue}>{displayName}</Text>

              <Text style={styles.profileLabel}>Correo</Text>
              <Text style={styles.profileValue}>{displayEmail}</Text>

              <Text style={styles.profileLabel}>Rol</Text>
              <Text style={styles.profileValue}>{roleLabel}</Text>

              <AppButton
                style={styles.btnLogout}
                variant="secondary"
                onPress={handleLogout}
                testID="profile-logout-button"
                label="Cerrar sesión"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <AppFooterNav isAdmin={isAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff3f9',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: FOOTER_SPACE + 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#704f46',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#f2d7e4',
    boxShadow: '0px 4px 8px rgba(112, 79, 70, 0.12)',
    elevation: 3,
  },
  profileContent: {
    alignItems: 'flex-start',
    width: '100%',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#704f46',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  welcome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4f3a34',
    alignSelf: 'center',
    marginBottom: 8,
  },
  profileLabel: {
    fontSize: 13,
    color: '#9a7f76',
    marginTop: 8,
  },
  profileValue: {
    fontSize: 16,
    color: '#4f3a34',
    fontWeight: '600',
  },
  btnLogout: {
    width: '100%',
    marginTop: 18,
    borderRadius: 12,
  },
});

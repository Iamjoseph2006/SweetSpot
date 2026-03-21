import { useCallback, useState } from 'react';
import {
  getCurrentLocation,
  PermissionState,
  requestLocationPermission,
} from '../../services/native/locationService';

export function useLocationFeature() {
  const [permission, setPermission] = useState<PermissionState>('denied');
  const [location, setLocation] = useState('Sin ubicación');
  const [loading, setLoading] = useState(false);

  const requestAndLoadLocation = useCallback(async () => {
    setLoading(true);

    try {
      const status = await requestLocationPermission();
      setPermission(status);

      if (status !== 'granted') {
        if (status === 'blocked') setLocation('Permiso bloqueado. Habilítalo en ajustes.');
        if (status === 'denied') setLocation('Permiso denegado por el usuario.');
        if (status === 'unavailable') setLocation('Módulo de geolocalización no disponible en este entorno.');
        return;
      }

      const current = await getCurrentLocation();

      if (!current) {
        setLocation('No se pudo obtener la ubicación.');
        return;
      }

      setLocation(`Lat: ${current.latitude.toFixed(5)} | Lon: ${current.longitude.toFixed(5)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    permission,
    location,
    loading,
    requestAndLoadLocation,
  };
}
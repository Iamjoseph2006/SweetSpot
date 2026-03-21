import { useCallback, useState } from 'react';
import { getCurrentLocation, requestLocationPermission } from '../../services/native/locationService';
import { readNativeNote, saveNativeNote } from '../../services/native/fileSystemService';

type UiState = 'idle' | 'loading' | 'success' | 'error';

export function useProfileSettingsViewModel() {
  const [locationState, setLocationState] = useState<UiState>('idle');
  const [locationMessage, setLocationMessage] = useState('Sin ubicación registrada.');

  const [fileState, setFileState] = useState<UiState>('idle');
  const [fileMessage, setFileMessage] = useState('Sin preferencia guardada.');
  const [savedFilePath, setSavedFilePath] = useState('');

  const updateLocation = useCallback(async () => {
    setLocationState('loading');

    try {
      const permission = await requestLocationPermission();

      if (permission !== 'granted') {
        if (permission === 'denied') {
          setLocationMessage('Permiso de ubicación denegado.');
        } else if (permission === 'blocked') {
          setLocationMessage('Permiso bloqueado. Habilítalo en ajustes del sistema.');
        } else {
          setLocationMessage('Geolocalización no disponible en este entorno.');
        }
        setLocationState('error');
        return;
      }

      const location = await getCurrentLocation();

      if (!location) {
        setLocationMessage('No fue posible obtener tu ubicación.');
        setLocationState('error');
        return;
      }

      setLocationMessage(
        `Latitud ${location.latitude.toFixed(5)} / Longitud ${location.longitude.toFixed(5)}`
      );
      setLocationState('success');
    } catch {
      setLocationMessage('Ocurrió un error al consultar ubicación.');
      setLocationState('error');
    }
  }, []);

  const savePreference = useCallback(async (content: string) => {
    setFileState('loading');

    try {
      const path = await saveNativeNote(content);
      setSavedFilePath(path);
      setFileMessage(content);
      setFileState('success');
    } catch {
      setFileMessage('No se pudo guardar la preferencia local.');
      setFileState('error');
    }
  }, []);

  const loadPreference = useCallback(async () => {
    setFileState('loading');

    try {
      const content = await readNativeNote();

      if (!content) {
        setFileMessage('No existe preferencia guardada aún.');
        setFileState('error');
        return;
      }

      setFileMessage(content);
      setFileState('success');
    } catch {
      setFileMessage('No se pudo leer la preferencia guardada.');
      setFileState('error');
    }
  }, []);

  return {
    locationState,
    locationMessage,
    fileState,
    fileMessage,
    savedFilePath,
    updateLocation,
    savePreference,
    loadPreference,
  };
}

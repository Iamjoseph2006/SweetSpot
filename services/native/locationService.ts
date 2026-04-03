export type PermissionState = 'granted' | 'denied' | 'blocked' | 'unavailable';

export type LocationResult = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

const getExpoLocation = () => {
  try {
    const moduleName = 'expo-location';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(moduleName);
  } catch {
    return null;
  }
};

export async function requestLocationPermission(): Promise<PermissionState> {
  const Location = getExpoLocation();

  if (!Location?.requestForegroundPermissionsAsync) {
    return 'unavailable';
  }

  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

  if (status === 'granted') {
    return 'granted';
  }

  return canAskAgain ? 'denied' : 'blocked';
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  const Location = getExpoLocation();

  if (!Location?.getCurrentPositionAsync && !Location?.getLastKnownPositionAsync) {
    return null;
  }

  let current = null;
  if (Location?.getLastKnownPositionAsync) {
    try {
      current = await Location.getLastKnownPositionAsync();
    } catch {
      current = null;
    }
  }

  if (!current?.coords && Location?.getCurrentPositionAsync) {
    try {
      current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch {
      current = null;
    }
  }

  if (!current?.coords) {
    return null;
  }

  return {
    latitude: current.coords.latitude,
    longitude: current.coords.longitude,
    accuracy: current.coords.accuracy,
  };
}

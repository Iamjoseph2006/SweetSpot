import * as FileSystem from 'expo-file-system/legacy';

const FILE_NAME = 'sweetspot-week13-note.txt';

const getFileUri = () => `${FileSystem.documentDirectory}${FILE_NAME}`;

export async function saveNativeNote(content: string) {
  await FileSystem.writeAsStringAsync(getFileUri(), content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return getFileUri();
}

export async function readNativeNote() {
  const fileUri = getFileUri();
  const info = await FileSystem.getInfoAsync(fileUri);

  if (!info.exists) {
    return null;
  }

  return FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}
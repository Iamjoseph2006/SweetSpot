import { useCallback, useState } from 'react';
import { readNativeNote, saveNativeNote } from '../../services/native/fileSystemService';

export function useFileSystemFeature() {
  const [savedPath, setSavedPath] = useState('');
  const [savedContent, setSavedContent] = useState('Aún no hay contenido guardado');
  const [loading, setLoading] = useState(false);

  const saveNote = useCallback(async (content: string) => {
    setLoading(true);
    try {
      const path = await saveNativeNote(content);
      setSavedPath(path);
      setSavedContent(content);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNote = useCallback(async () => {
    setLoading(true);
    try {
      const content = await readNativeNote();
      setSavedContent(content ?? 'No existe archivo guardado todavía.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    savedPath,
    savedContent,
    loading,
    saveNote,
    loadNote,
  };
}
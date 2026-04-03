import { TextInput, TextInputProps, StyleSheet } from 'react-native';

type AppTextInputProps = TextInputProps & {
  hasError?: boolean;
};

export function AppTextInput({ hasError = false, style, ...props }: AppTextInputProps) {
  return <TextInput style={[styles.input, hasError && styles.inputError, style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 6,
  },
  inputError: {
    borderColor: '#d9534f',
  },
});

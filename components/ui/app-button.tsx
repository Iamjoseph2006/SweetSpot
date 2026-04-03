import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'neutral';

type AppButtonProps = TouchableOpacityProps & {
  label?: string;
  children?: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  children,
  variant = 'primary',
  fullWidth = true,
  style,
  ...props
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], fullWidth && styles.fullWidth, style]}
      activeOpacity={0.85}
      {...props}
    >
      {typeof label === 'string' ? <Text style={styles.text}>{label}</Text> : children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: '#704f46',
  },
  secondary: {
    backgroundColor: '#38b6ff',
  },
  danger: {
    backgroundColor: '#d9534f',
  },
  neutral: {
    backgroundColor: '#8c6a5d',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

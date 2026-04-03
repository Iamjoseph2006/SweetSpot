import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type AppListItemProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  inactive?: boolean;
};

export function AppListItem({ children, style, inactive = false }: AppListItemProps) {
  return <View style={[styles.card, inactive && styles.inactiveCard, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  inactiveCard: {
    opacity: 0.75,
  },
});

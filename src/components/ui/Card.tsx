import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from './theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  inner?: boolean;
}

export function Card({ children, style, inner = false }: CardProps) {
  return (
    <View style={[styles.card, inner && styles.inner, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  inner: {
    backgroundColor: colors.cardInner,
    borderRadius: radius.md,
    ...shadow,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

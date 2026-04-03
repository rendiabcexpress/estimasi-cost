import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from './theme';
import { MarginStatus } from '../../types';

interface BadgeProps {
  status: MarginStatus;
  label: string;
  large?: boolean;
}

const statusConfig = {
  ok: {
    bg: colors.successLight,
    text: colors.success,
    border: colors.success,
  },
  warning: {
    bg: colors.warningLight,
    text: colors.warning,
    border: colors.warning,
  },
  rugi: {
    bg: colors.dangerLight,
    text: colors.danger,
    border: colors.danger,
  },
};

export function Badge({ status, label, large = false }: BadgeProps) {
  const cfg = statusConfig[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        large && styles.large,
      ]}
    >
      <Text style={[styles.text, { color: cfg.text }, large && styles.largeText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  large: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  largeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

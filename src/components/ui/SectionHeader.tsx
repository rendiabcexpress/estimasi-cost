import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radius } from './theme';

interface SectionHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  rightColor?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  rightText,
  rightColor,
  collapsible = false,
  collapsed = false,
  onToggle,
}: SectionHeaderProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>
        {rightText && (
          <Text style={[styles.rightText, { color: rightColor ?? colors.primary }]}>
            {rightText}
          </Text>
        )}
        {collapsible && (
          <Text style={styles.chevron}>{collapsed ? '▶' : '▼'}</Text>
        )}
      </View>
    </View>
  );

  if (collapsible && onToggle) {
    return (
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
  textBox: {
    flex: 1,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.small,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rightText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

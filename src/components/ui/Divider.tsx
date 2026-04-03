import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export function Divider({ my = spacing.md }: { my?: number }) {
  return <View style={[styles.line, { marginVertical: my }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.border,
  },
});

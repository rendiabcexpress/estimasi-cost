import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, spacing, radius, typography } from './theme';

interface InputFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
  autoMode?: boolean; // kolom yang dihitung otomatis (bg lavender)
  editable?: boolean;
  multiline?: boolean;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  prefix,
  suffix,
  style,
  autoMode = false,
  editable = true,
  multiline = false,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          autoMode && styles.autoRow,
          focused && !autoMode && styles.focused,
        ]}
      >
        {prefix && <Text style={styles.adornment}>{prefix}</Text>}
        <TextInput
          style={[styles.input, autoMode && styles.autoInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? '0'}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          editable={editable && !autoMode}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
        />
        {suffix && <Text style={styles.adornment}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 42,
  },
  autoRow: {
    backgroundColor: colors.inputBgAuto,
    borderColor: colors.primaryLight,
  },
  focused: {
    borderColor: colors.borderFocus,
  },
  adornment: {
    ...typography.small,
    color: colors.textSecondary,
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  autoInput: {
    color: colors.primary,
    fontWeight: '600',
  },
});

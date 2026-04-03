import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '../hooks/useCalculator';
import { Step1ShippingInfo } from '../components/calculator/Step1ShippingInfo';
import { Step2ItemDetails } from '../components/calculator/Step2ItemDetails';
import { Step3SalesTariff } from '../components/calculator/Step3SalesTariff';
import { Step4OpsCosts } from '../components/calculator/Step4OpsCosts';
import { Step5ExtraCosts } from '../components/calculator/Step5ExtraCosts';
import { Step6Breakdown } from '../components/calculator/Step6Breakdown';
import { StickyMarginBar } from '../components/StickyMarginBar';
import { colors, spacing, radius, shadow } from '../components/ui/theme';

export function CalculatorScreen() {
  const calc = useCalculator();

  const handleReset = () => {
    Alert.alert('Reset Kalkulator', 'Hapus semua data dan mulai dari awal?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: calc.reset },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Cost Estimation</Text>
            <Text style={styles.headerSub}>Estimasi margin pengiriman</Text>
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
            <Text style={styles.resetIcon}>↺</Text>
            <Text style={styles.resetLabel}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Scroll content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Step1ShippingInfo
            info={calc.state.shippingInfo}
            onChange={calc.setShippingInfo}
          />

          <Step2ItemDetails
            inputMode={calc.state.inputMode}
            onModeChange={calc.setInputMode}
            items={calc.state.items}
            itemsCalculated={calc.computed.itemsCalculated}
            directInput={calc.state.directInput}
            weightSummary={calc.computed.weightSummary}
            onAddItem={calc.addItem}
            onUpdateItem={calc.updateItem}
            onRemoveItem={calc.removeItem}
            onUpdateDirect={calc.setDirectInput}
          />

          <Step3SalesTariff
            tariff={calc.state.tariff}
            onChangeTariff={calc.setTariff}
            totalCW={calc.computed.weightSummary.totalChargeableWeight}
            totalKoli={calc.computed.weightSummary.totalKoli}
            revenueBerat={calc.computed.revenueBerat}
            revenueKoli={calc.computed.revenueKoli}
            totalRevenue={calc.computed.totalRevenue}
          />

          <Step4OpsCosts
            legs={calc.state.legs}
            subtotalFirstMile={calc.computed.subtotalFirstMile}
            subtotalMiddleMile={calc.computed.subtotalMiddleMile}
            subtotalLastMile={calc.computed.subtotalLastMile}
            totalOpsCost={calc.computed.totalOpsCost}
            onVendorChange={calc.setLegVendor}
            onAddItem={calc.addLegItem}
            onUpdateItem={calc.updateLegItem}
            onRemoveItem={calc.removeLegItem}
          />

          <Step5ExtraCosts
            extraCosts={calc.state.extraCosts}
            totalExtraCost={calc.computed.totalExtraCost}
            onAdd={calc.addExtraCost}
            onUpdate={calc.updateExtraCost}
            onRemove={calc.removeExtraCost}
          />

          <Step6Breakdown computed={calc.computed} state={calc.state} />

          {/* Bottom padding agar tidak tertutup sticky bar */}
          <View style={styles.bottomPad} />
        </ScrollView>

        {/* Sticky margin bar */}
        <StickyMarginBar computed={calc.computed} shippingInfo={calc.state.shippingInfo} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.danger + '40',
  },
  resetIcon: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '700',
  },
  resetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  bottomPad: {
    height: 8,
  },
});

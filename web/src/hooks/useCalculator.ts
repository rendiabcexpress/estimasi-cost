import { useState, useMemo, useCallback } from 'react';
import {
  CalculatorState,
  DimensionItem,
  CostItem,
  InputMode,
  ShippingInfo,
  Tariff,
} from '../types';
import { computeAll, genId } from '../utils/calculations';

const DEFAULT_STATE: CalculatorState = {
  shippingInfo: {
    asal: '',
    tujuan: '',
    deskripsi: '',
    produkId: 1,
  },
  inputMode: 'dimensi',
  items: [
    { id: genId(), koli: 1, panjang: 0, lebar: 0, tinggi: 0, berat: 0 },
  ],
  directInput: {
    koli: 0,
    actualWeight: 0,
    volumetricWeight: 0,
    chargeableWeight: 0,
    cbm: 0,
  },
  tariff: {
    hargaPerKg: 0,
    hargaPerKoli: 0,
  },
  legs: {
    firstMile: { vendor: '', items: [] },
    middleMile: { vendor: '', items: [] },
    lastMile: { vendor: '', items: [] },
  },
  extraCosts: [],
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  // --- Computed values (reaktif, tanpa tombol hitung) ---
  const computed = useMemo(() => computeAll(state), [state]);

  // --- Shipping Info ---
  const setShippingInfo = useCallback((info: Partial<ShippingInfo>) => {
    setState((s) => ({ ...s, shippingInfo: { ...s.shippingInfo, ...info } }));
  }, []);

  // --- Input Mode ---
  const setInputMode = useCallback((mode: InputMode) => {
    setState((s) => ({ ...s, inputMode: mode }));
  }, []);

  // --- Dimension Items ---
  const addItem = useCallback(() => {
    setState((s) => ({
      ...s,
      items: [...s.items, { id: genId(), koli: 1, panjang: 0, lebar: 0, tinggi: 0, berat: 0 }],
    }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof DimensionItem, value: number) => {
    setState((s) => ({
      ...s,
      items: s.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      items: s.items.filter((item) => item.id !== id),
    }));
  }, []);

  // --- Direct Input ---
  const setDirectInput = useCallback(
    (field: keyof CalculatorState['directInput'], value: number) => {
      setState((s) => ({
        ...s,
        directInput: { ...s.directInput, [field]: value },
      }));
    },
    []
  );

  // --- Tariff ---
  const setTariff = useCallback((field: keyof Tariff, value: number) => {
    setState((s) => ({ ...s, tariff: { ...s.tariff, [field]: value } }));
  }, []);

  // --- Leg Vendor ---
  const setLegVendor = useCallback(
    (leg: 'firstMile' | 'middleMile' | 'lastMile', vendor: string) => {
      setState((s) => ({
        ...s,
        legs: { ...s.legs, [leg]: { ...s.legs[leg], vendor } },
      }));
    },
    []
  );

  // --- Leg Cost Items ---
  const addLegItem = useCallback((leg: 'firstMile' | 'middleMile' | 'lastMile') => {
    setState((s) => ({
      ...s,
      legs: {
        ...s.legs,
        [leg]: {
          ...s.legs[leg],
          items: [...s.legs[leg].items, { id: genId(), deskripsi: '', biaya: 0 }],
        },
      },
    }));
  }, []);

  const updateLegItem = useCallback(
    (
      leg: 'firstMile' | 'middleMile' | 'lastMile',
      id: string,
      field: keyof CostItem,
      value: string | number
    ) => {
      setState((s) => ({
        ...s,
        legs: {
          ...s.legs,
          [leg]: {
            ...s.legs[leg],
            items: s.legs[leg].items.map((item) =>
              item.id === id ? { ...item, [field]: value } : item
            ),
          },
        },
      }));
    },
    []
  );

  const removeLegItem = useCallback(
    (leg: 'firstMile' | 'middleMile' | 'lastMile', id: string) => {
      setState((s) => ({
        ...s,
        legs: {
          ...s.legs,
          [leg]: {
            ...s.legs[leg],
            items: s.legs[leg].items.filter((item) => item.id !== id),
          },
        },
      }));
    },
    []
  );

  // --- Extra Costs ---
  const addExtraCost = useCallback(() => {
    setState((s) => ({
      ...s,
      extraCosts: [...s.extraCosts, { id: genId(), deskripsi: '', biaya: 0 }],
    }));
  }, []);

  const updateExtraCost = useCallback(
    (id: string, field: keyof CostItem, value: string | number) => {
      setState((s) => ({
        ...s,
        extraCosts: s.extraCosts.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeExtraCost = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      extraCosts: s.extraCosts.filter((item) => item.id !== id),
    }));
  }, []);

  // --- Reset ---
  const reset = useCallback(() => {
    setState({
      ...DEFAULT_STATE,
      items: [{ id: genId(), koli: 1, panjang: 0, lebar: 0, tinggi: 0, berat: 0 }],
    });
  }, []);

  return {
    state,
    computed,
    setShippingInfo,
    setInputMode,
    addItem,
    updateItem,
    removeItem,
    setDirectInput,
    setTariff,
    setLegVendor,
    addLegItem,
    updateLegItem,
    removeLegItem,
    addExtraCost,
    updateExtraCost,
    removeExtraCost,
    reset,
  };
}

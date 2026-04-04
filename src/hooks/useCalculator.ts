import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  CalculatorState,
  DimensionItem,
  CostItem,
  InputMode,
  ShippingInfo,
  Tariff,
  AutoFillStatus,
  RouteRate,
} from '../types';
import { computeAll, genId } from '../utils/calculations';
import { fetchRouteRate } from '../services/api';
import { findInHistory, saveToHistory } from '../services/autoFillHistory';

const DEFAULT_STATE: CalculatorState = {
  shippingInfo: {
    asalKotaId: null,
    asalKotaName: '',
    tujuanKotaId: null,
    tujuanKotaName: '',
    deskripsi: '',
    produkId: null,
    produkName: '',
    volumeDivider: 5000,
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
  const [autoFillStatus, setAutoFillStatus] = useState<AutoFillStatus>('idle');
  const lastAutoFillKey = useRef('');
  const abortRef = useRef<AbortController | null>(null);

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

  // --- Auto-fill: fetch rate saat asal+tujuan+produk lengkap ---
  useEffect(() => {
    const { asalKotaId, tujuanKotaId, produkId } = state.shippingInfo;
    if (!asalKotaId || !tujuanKotaId || !produkId) {
      setAutoFillStatus('idle');
      return;
    }

    const key = `${asalKotaId}-${tujuanKotaId}-${produkId}`;
    if (key === lastAutoFillKey.current) return;

    // Cancel previous fetch
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAutoFillStatus('loading');

    const applyRate = (rate: RouteRate) => {
      lastAutoFillKey.current = key;
      setState((s) => ({
        ...s,
        tariff: {
          hargaPerKg: s.tariff.hargaPerKg === 0 ? rate.hargaPerKg : s.tariff.hargaPerKg,
          hargaPerKoli: s.tariff.hargaPerKoli === 0 ? rate.hargaPerKoli : s.tariff.hargaPerKoli,
        },
        legs: {
          firstMile: s.legs.firstMile.items.length === 0 && s.legs.firstMile.vendor === ''
            ? rate.legs.firstMile : s.legs.firstMile,
          middleMile: s.legs.middleMile.items.length === 0 && s.legs.middleMile.vendor === ''
            ? rate.legs.middleMile : s.legs.middleMile,
          lastMile: s.legs.lastMile.items.length === 0 && s.legs.lastMile.vendor === ''
            ? rate.legs.lastMile : s.legs.lastMile,
        },
        extraCosts: s.extraCosts.length === 0 && rate.extraCosts.length > 0
          ? rate.extraCosts : s.extraCosts,
        shippingInfo: {
          ...s.shippingInfo,
          deskripsi: s.shippingInfo.deskripsi === '' && rate.deskripsi
            ? rate.deskripsi : s.shippingInfo.deskripsi,
        },
      }));
      setAutoFillStatus('applied');
    };

    // Try backend API first, then fall back to localStorage
    fetchRouteRate(asalKotaId, tujuanKotaId, produkId, controller.signal).then((apiRate) => {
      if (controller.signal.aborted) return;

      if (apiRate) {
        applyRate(apiRate);
      } else {
        // Fallback: cari di localStorage history
        const historyRate = findInHistory(asalKotaId, tujuanKotaId, produkId);
        if (historyRate) {
          applyRate(historyRate);
        } else {
          lastAutoFillKey.current = key;
          setAutoFillStatus('not-found');
        }
      }
    });

    return () => controller.abort();
  }, [state.shippingInfo.asalKotaId, state.shippingInfo.tujuanKotaId, state.shippingInfo.produkId]);

  // --- Save to history: simpan saat ada data bermakna ---
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToHistory(state);
    }, 2000); // debounce 2s
    return () => clearTimeout(saveTimeoutRef.current);
  }, [state.tariff, state.legs, state.extraCosts, state.shippingInfo]);

  // --- Reset ---
  const reset = useCallback(() => {
    lastAutoFillKey.current = '';
    setAutoFillStatus('idle');
    setState({
      ...DEFAULT_STATE,
      items: [{ id: genId(), koli: 1, panjang: 0, lebar: 0, tinggi: 0, berat: 0 }],
    });
  }, []);

  const dismissAutoFill = useCallback(() => setAutoFillStatus('idle'), []);

  return {
    state,
    computed,
    autoFillStatus,
    dismissAutoFill,
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

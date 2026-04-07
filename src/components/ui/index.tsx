import React, { useState, useId, useCallback } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  style,
  inner = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  inner?: boolean;
}) {
  return (
    <div
      className={inner ? 'est-card-inner' : 'est-card'}
      style={{
        background: inner ? 'var(--card-inner)' : 'var(--card)',
        borderRadius: inner ? 'var(--radius-md)' : 'var(--radius-lg)',
        padding: inner ? '12px' : '20px',
        boxShadow: inner ? 'none' : 'var(--shadow-card)',
        border: inner ? '1px solid var(--border)' : 'none',
        marginBottom: inner ? 0 : 12,
        maxWidth: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

export function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── InputField ───────────────────────────────────────────────────────────────

export function InputField({
  label,
  value,
  onChange,
  placeholder = '0',
  type = 'text',
  prefix,
  suffix,
  autoMode = false,
  style,
  readOnly = false,
  rows,
  onBlur,
  inputMode,
}: {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  autoMode?: boolean;
  style?: React.CSSProperties;
  readOnly?: boolean;
  rows?: number;
  onBlur?: () => void;
  inputMode?: 'numeric' | 'decimal' | 'text';
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: autoMode ? 'var(--primary)' : 'var(--text)',
    fontWeight: autoMode ? 600 : 400,
    padding: 0,
    width: '100%',
    resize: 'none',
  };

  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    background: autoMode ? 'var(--primary-light)' : 'white',
    border: `1.5px solid ${focused && !autoMode ? 'var(--primary)' : autoMode ? 'transparent' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '0 10px',
    minHeight: 40,
    gap: 4,
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ flex: 1, minWidth: 0, ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}
      <div style={wrapStyle}>
        {prefix && (
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>
            {prefix}
          </span>
        )}
        {rows ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...inputStyle, paddingTop: 8, paddingBottom: 8 }}
          />
        ) : (
          <input
            id={id}
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly || autoMode}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); onBlur?.(); }}
            style={inputStyle}
          />
        )}
        {suffix && (
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── NumberInput ──────────────────────────────────────────────────────────────

const thousandFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = '0',
  prefix,
  style,
  currency = false,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  prefix?: string;
  style?: React.CSSProperties;
  currency?: boolean;
}) {
  const handleChange = useCallback(
    (v: string) => {
      if (currency) {
        const digits = v.replace(/\D/g, '');
        onChange(parseInt(digits, 10) || 0);
      } else {
        onChange(parseFloat(v) || 0);
      }
    },
    [currency, onChange],
  );

  if (!currency) {
    return (
      <InputField
        label={label}
        value={value > 0 ? String(value) : ''}
        onChange={handleChange}
        type="number"
        placeholder={placeholder}
        prefix={prefix}
        style={style}
      />
    );
  }

  const display = value > 0 ? thousandFmt.format(value) : '';

  return (
    <InputField
      label={label}
      value={display}
      onChange={handleChange}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      prefix={prefix}
      style={style}
    />
  );
}

// ─── AutoField ────────────────────────────────────────────────────────────────

export function AutoField({
  label,
  value,
  highlight = false,
}: {
  label?: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={{ flex: 1 }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          background: highlight ? 'var(--primary-light)' : 'var(--card-inner)',
          border: `1.5px solid ${highlight ? 'rgba(37,99,235,0.3)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0 10px',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          fontSize: 13,
          fontWeight: highlight ? 700 : 600,
          color: highlight ? 'var(--primary-dark)' : 'var(--primary)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select({
  label,
  options,
  value,
  onChange,
  style,
}: {
  label?: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (v: string | number) => void;
  style?: React.CSSProperties;
}) {
  const id = useId();
  return (
    <div style={{ flex: 1, minWidth: 0, ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const opt = options.find((o) => String(o.value) === e.target.value);
          if (opt) onChange(opt.value);
        }}
        style={{
          width: '100%',
          height: 40,
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 10px',
          background: 'white',
          fontSize: 14,
          color: 'var(--text)',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238890B5' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: 30,
        }}
      >
        <option value="" disabled>Pilih...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── SegmentedControl ─────────────────────────────────────────────────────────

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--primary-light)',
        borderRadius: 'var(--radius-sm)',
        padding: 3,
        gap: 3,
        marginBottom: 16,
        width: 'fit-content',
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '6px 20px',
              borderRadius: 6,
              border: 'none',
              background: active ? 'white' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: active ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: active ? '0 1px 4px rgba(37,99,235,0.15)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── AddButton ────────────────────────────────────────────────────────────────

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 'var(--radius-sm)',
        border: '1.5px dashed var(--primary)',
        background: 'transparent',
        color: 'var(--primary)',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        marginTop: 8,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-light)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <IconPlus size={16} stroke={2.5} />
      {label}
    </button>
  );
}

// ─── DeleteBtn ────────────────────────────────────────────────────────────────

export function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'transparent',
        color: 'var(--danger)',
        fontSize: 14,
        cursor: 'pointer',
        borderRadius: 6,
        flexShrink: 0,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--danger-light)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      title="Hapus"
    >
      <IconX size={14} stroke={2.5} />
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ my = 12 }: { my?: number }) {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: `${my}px 0` }} />;
}

// ─── InfoNote ─────────────────────────────────────────────────────────────────

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--primary-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        fontSize: 12,
        color: 'var(--primary)',
        fontWeight: 500,
        marginTop: 8,
      }}
    >
      {children}
    </div>
  );
}

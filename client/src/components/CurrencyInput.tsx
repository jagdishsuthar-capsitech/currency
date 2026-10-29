
import type { CurrencyInfo } from '../types/currency';

interface CurrencyInputProps {
  label: string;
  amount: string;
  currency: CurrencyInfo;
  onAmountChange: (value: string) => void;
  onOpenModal: () => void;
  disabled?: boolean;
}

function CurrencyInput({
  label,
  amount,
  currency,
  onAmountChange,
  onOpenModal,
  disabled = false,
}: CurrencyInputProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-3 flex items-center justify-between gap-2">
        <label
          htmlFor={`amount-${label}`}
          className="text-sm font-medium text-slate-500"
        >
          {label}
        </label>

        <span className="truncate text-xs text-slate-400">
          {currency.name}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <input
          id={`amount-${label}`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          disabled={disabled}
          onChange={(event) => onAmountChange(event.target.value)}
          placeholder="0.00"
          aria-label={`${label} amount in ${currency.code}`}
          className="w-full min-w-0 flex-1 bg-transparent text-2xl
            font-semibold tracking-tight text-slate-900 outline-none
            placeholder:text-slate-300 disabled:opacity-60
            sm:text-3xl"
        />

        <button
          type="button"
          onClick={onOpenModal}
          aria-label={`Select currency, currently ${currency.code}`}
          className="flex shrink-0 items-center gap-2 rounded-xl
            border border-slate-200 bg-white px-3 py-2.5
            transition hover:border-blue-300 hover:bg-blue-50
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-blue-500"
        >
          {currency.countryCode && (
            <img
              src={`https://flagcdn.com/w40/${currency.countryCode}.png`}
              alt=""
              aria-hidden="true"
              className="h-4 w-6 rounded-sm object-cover"
            />
          )}

          <span className="text-sm font-bold text-slate-800">
            {currency.code}
          </span>

          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 text-slate-400"
          >
            <path
              d="m5 7 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CurrencyInput;

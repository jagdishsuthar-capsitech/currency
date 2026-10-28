import type { CurrencyInfo } from '../types/currency';

interface CurrencyInputProps {
    label: string;
    amount: number | string;
    currency: CurrencyInfo;
    onAmountChange: (value: string) => void;
    onOpenModal: () => void;

}

function CurrencyInput({ label, amount, currency, onAmountChange, onOpenModal, }: CurrencyInputProps) {
    return (
        <div className="flex-1">
            <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white overflow-hidden focus-within:border-blue-500 transition-colors">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full flex-1 py-3.5 px-4 text-xl font-semibold text-slate-800 outline-none bg-transparent"
                />
                <button
                    onClick={onOpenModal}
                    className="flex items-center gap-2 py-3 px-3.5 border-l border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    <img
                        src={`https://flagcdn.com/w40/${currency.countryCode}.png`}
                        alt={currency.code}
                        className="w-6 h-4 rounded-sm object-cover shadow-sm"
                    />
                    <span className="font-bold text-sm text-slate-700">{currency.code}</span>
                    <span className="text-[10px] text-slate-500">v</span>
                </button>
            </div>
            <span className="block mt-1.5 text-xs font-medium text-slate-500">
                {label} ({currency.name})
            </span>
        </div>
    );
}


export default CurrencyInput;
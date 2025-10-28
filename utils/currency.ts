import { Currency } from '../types';

export const formatCurrency = (
    amountInAED: number, 
    targetCurrency: Currency, 
    exchangeRates: Record<Currency, number>
): string => {
    const convertedAmount = amountInAED * exchangeRates[targetCurrency];
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedAmount);
};

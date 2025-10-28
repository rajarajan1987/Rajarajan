import React, { useState } from 'react';
import { Investment, Currency, Role } from '../types';
import { formatCurrency } from '../utils/currency';
import { TrendingUpIcon, PlusCircleIcon, TrashIcon, EditIcon } from './icons';
import InvestmentForm from './InvestmentForm';

interface InvestmentsProps {
    investments: Investment[];
    setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
    onAddOrUpdateInvestment: (investment: Omit<Investment, 'id'> | Investment) => void;
    onDeleteInvestment: (id: string) => void;
    currency: Currency;
    exchangeRates: Record<Currency, number>;
    currentUserRole: Role;
}

const Investments: React.FC<InvestmentsProps> = ({ investments, setInvestments, onAddOrUpdateInvestment, onDeleteInvestment, currency, exchangeRates, currentUserRole }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [investmentToEdit, setInvestmentToEdit] = useState<Investment | null>(null);
    const canEdit = currentUserRole === 'Admin' || currentUserRole === 'Editor';

    const handleSimulateUpdate = () => {
        setInvestments(prev => prev.map(inv => {
            const changePercent = (Math.random() - 0.45) * 0.1; // Random change between -4.5% and +5.5%
            const newCurrentValue = inv.currentValue * (1 + changePercent);
            return { ...inv, currentValue: Math.max(0, newCurrentValue) };
        }));
    };
    
    const handleAddInvestment = () => {
        setInvestmentToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditInvestment = (investment: Investment) => {
        setInvestmentToEdit(investment);
        setIsFormOpen(true);
    };
    
    const handleFormSubmit = (investment: Omit<Investment, 'id'> | Investment) => {
        onAddOrUpdateInvestment(investment);
        setIsFormOpen(false);
        setInvestmentToEdit(null);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Investment Portfolio</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSimulateUpdate}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                        >
                            <TrendingUpIcon className="w-5 h-5" />
                            Simulate Update
                        </button>
                        {canEdit && (
                            <button
                                onClick={handleAddInvestment}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Add Investment
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Investment</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                                <th scope="col" className="px-6 py-3 text-right">Purchase Value</th>
                                <th scope="col" className="px-6 py-3 text-right">Current Value (Unit)</th>
                                <th scope="col" className="px-6 py-3 text-right">Total Value</th>
                                <th scope="col" className="px-6 py-3 text-right">Gain/Loss</th>
                                {canEdit && <th scope="col" className="px-6 py-3 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {investments.map(inv => {
                                const purchaseValue = inv.purchasePrice * inv.quantity;
                                const totalCurrentValue = inv.currentValue * inv.quantity;
                                const gainLoss = totalCurrentValue - purchaseValue;
                                return (
                                <tr key={inv.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{inv.name}</th>
                                    <td className="px-6 py-4">{inv.type}</td>
                                    <td className="px-6 py-4 text-right">{inv.quantity.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono">{formatCurrency(purchaseValue, currency, exchangeRates)}</td>
                                    <td className="px-6 py-4 text-right font-mono">{formatCurrency(inv.currentValue, currency, exchangeRates)}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold">{formatCurrency(totalCurrentValue, currency, exchangeRates)}</td>
                                    <td className={`px-6 py-4 text-right font-mono ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(gainLoss, currency, exchangeRates)}
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-4">
                                                <button onClick={() => handleEditInvestment(inv)} className="text-blue-500 hover:text-blue-700">
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onDeleteInvestment(inv.id)} className="text-red-500 hover:text-red-700">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <InvestmentForm 
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setInvestmentToEdit(null); }}
                onSubmit={handleFormSubmit}
                investmentToEdit={investmentToEdit}
            />
        </div>
    );
};

export default Investments;
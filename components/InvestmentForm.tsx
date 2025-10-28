import React, { useState, useEffect } from 'react';
import { Investment } from '../types';

interface InvestmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (investment: Omit<Investment, 'id'> | Investment) => void;
  investmentToEdit?: Investment | null;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ isOpen, onClose, onSubmit, investmentToEdit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    if (investmentToEdit) {
      setName(investmentToEdit.name);
      setType(investmentToEdit.type);
      setQuantity(String(investmentToEdit.quantity));
      setPurchasePrice(String(investmentToEdit.purchasePrice));
      setCurrentValue(String(investmentToEdit.currentValue));
    } else {
      // Reset form
      setName('');
      setType('');
      setQuantity('');
      setPurchasePrice('');
      setCurrentValue('');
    }
  }, [investmentToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvestment = {
      name,
      type,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentValue: parseFloat(currentValue),
    };

    if (investmentToEdit) {
      onSubmit({ ...newInvestment, id: investmentToEdit.id });
    } else {
      onSubmit(newInvestment);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">{investmentToEdit ? 'Edit Investment' : 'Add New Investment'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="invName" className="block text-sm font-medium text-gray-700">Name / Ticker</label>
            <input type="text" id="invName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="invType" className="block text-sm font-medium text-gray-700">Type (e.g., Stock, Crypto, Fund)</label>
            <input type="text" id="invType" value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
           <div>
            <label htmlFor="invQuantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" id="invQuantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0" step="any" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price (AED)</label>
                <input type="number" id="purchasePrice" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0" step="any" />
            </div>
            <div>
                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">Current Value (AED)</label>
                <input type="number" id="currentValue" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0" step="any" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{investmentToEdit ? 'Save Changes' : 'Add Investment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;
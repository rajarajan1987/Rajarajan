import React, { useState, useEffect } from 'react';
import { Bill, BillFrequency } from '../types';

interface BillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bill: Omit<Bill, 'id' | 'lastPaid'>) => void;
}

const BillForm: React.FC<BillFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('1');
  const [frequency, setFrequency] = useState<BillFrequency>('Monthly');

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setName('');
      setAmount('');
      setDueDate('1');
      setFrequency('Monthly');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      amount: parseFloat(amount),
      dueDate: parseInt(dueDate),
      frequency,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">Add New Bill</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="billName" className="block text-sm font-medium text-gray-700">Bill Name</label>
            <input type="text" id="billName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700">Amount (AED)</label>
            <input type="number" id="billAmount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0.01" step="0.01" />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Day of Month</label>
            <input type="number" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="1" max="31" />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as BillFrequency)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Bill</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;
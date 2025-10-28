
import React, { useState, useEffect } from 'react';
import { Transaction, FamilyMember, TransactionType } from '../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  familyMembers: FamilyMember[];
  transactionToEdit?: Transaction | null;
}

const EXPENSE_CATEGORIES = ["Groceries", "Utilities", "Transport", "Entertainment", "Health", "Education", "Shopping", "Other"];
const INCOME_CATEGORIES = ["Salary", "Bonus", "Investment Gain", "Gift", "Other Income"];

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSubmit, familyMembers, transactionToEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState('family');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [type, setType] = useState<TransactionType>('Expense');

  const categories = type === 'Expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(String(transactionToEdit.amount));
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setMemberId(transactionToEdit.memberId);
      setCategory(transactionToEdit.category);
      setType(transactionToEdit.type);
    } else {
      // Reset form
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setMemberId('family');
      setType('Expense');
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  }, [transactionToEdit, isOpen]);
  
  useEffect(() => {
      setCategory(categories[0]);
  }, [type]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction = {
      description,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      memberId,
      category,
      type,
    };
    if (transactionToEdit) {
        onSubmit({ ...newTransaction, id: transactionToEdit.id });
    } else {
        onSubmit(newTransaction);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">{transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <div className="mt-1 grid grid-cols-2 gap-2 rounded-md bg-gray-200 p-1">
                <button type="button" onClick={() => setType('Expense')} className={`px-3 py-1 text-sm font-medium rounded ${type === 'Expense' ? 'bg-white shadow' : 'text-gray-600'}`}>Expense</button>
                <button type="button" onClick={() => setType('Income')} className={`px-3 py-1 text-sm font-medium rounded ${type === 'Income' ? 'bg-white shadow' : 'text-gray-600'}`}>Income</button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (AED)</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required min="0.01" step="0.01" />
          </div>
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">For Member</label>
            <select id="memberId" value={memberId} onChange={e => setMemberId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="family">General Family Expense</option>
              {familyMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{transactionToEdit ? 'Save Changes' : 'Add Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
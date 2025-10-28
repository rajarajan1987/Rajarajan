import React from 'react';
import { Transaction, FamilyMember, Role, Currency } from '../types';
import { EditIcon, TrashIcon, PlusCircleIcon } from './icons';
import { formatCurrency } from '../utils/currency';

interface TransactionListProps {
  transactions: Transaction[];
  familyMembers: FamilyMember[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currentUserRole: Role;
  currency: Currency;
  exchangeRates: Record<Currency, number>;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  familyMembers,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  currentUserRole,
  currency,
  exchangeRates
}) => {
  const getMemberName = (memberId: string) => {
    if (memberId === 'family') return 'General';
    return familyMembers.find(m => m.id === memberId)?.name || 'Unknown';
  };
  
  const canEdit = currentUserRole === 'Admin' || currentUserRole === 'Editor';

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Transactions</h2>
          {canEdit && (
            <button
              onClick={onAddTransaction}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Transaction
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Member</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3 text-right">Amount ({currency})</th>
                {canEdit && <th scope="col" className="px-6 py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{t.description}</th>
                  <td className="px-6 py-4">{getMemberName(t.memberId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${t.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>{t.category}</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(t.amount, currency, exchangeRates)}</td>
                  {canEdit && (
                    <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={() => onEditTransaction(t)} className="text-blue-500 hover:text-blue-700">
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => onDeleteTransaction(t.id)} className="text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No transactions yet. Add one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
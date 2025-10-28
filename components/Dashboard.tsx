
import React from 'react';
import { Transaction, Bill, Investment, FamilyMember, Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { getNextDueDate, isBillOverdue } from '../utils/bill-helpers';

interface DashboardProps {
  transactions: Transaction[];
  bills: Bill[];
  investments: Investment[];
  familyMembers: FamilyMember[];
  currency: Currency;
  exchangeRates: Record<Currency, number>;
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, bills, investments, currency, exchangeRates, onNavigate }) => {

  const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const today = new Date();
      return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
  });

  const totalIncomeThisMonth = thisMonthTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpentThisMonth = thisMonthTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.currentValue * inv.quantity), 0);
  const totalInvestmentGain = investments.reduce((sum, inv) => sum + ((inv.currentValue - inv.purchasePrice) * inv.quantity), 0);
  
  const upcomingBills = bills
    .map(bill => ({ ...bill, nextDueDate: getNextDueDate(bill.dueDate, bill.frequency, new Date(bill.lastPaid))}))
    .filter(bill => !isBillOverdue(bill.dueDate, bill.frequency, new Date(bill.lastPaid)))
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
    .slice(0, 3);

  const spendingByCategory: Record<string, number> = thisMonthTransactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(spendingByCategory).sort(([,a], [,b]) => b - a)[0];

  const recentTransactions = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">This Month's Flow</h3>
          <p className="text-xl font-bold text-green-600 mt-2">Income: {formatCurrency(totalIncomeThisMonth, currency, exchangeRates)}</p>
          <p className="text-xl font-bold text-red-600">Expenses: {formatCurrency(totalSpentThisMonth, currency, exchangeRates)}</p>
          <p className="text-sm text-gray-500 mt-1">Top category: <span className="font-medium text-indigo-600">{topCategory?.[0] || 'N/A'}</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 font-semibold">Investment Value</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(totalInvestmentValue, currency, exchangeRates)}</p>
          <p className={`text-sm mt-1 font-medium ${totalInvestmentGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Total Gain/Loss: {formatCurrency(totalInvestmentGain, currency, exchangeRates)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h3 className="text-gray-500 font-semibold">Upcoming Bills</h3>
           {upcomingBills.length > 0 ? (
                <ul className="mt-2 space-y-1">
                    {upcomingBills.map(bill => (
                        <li key={bill.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">{bill.name}</span>
                            <span className="font-mono">{formatCurrency(bill.amount, currency, exchangeRates)}</span>
                        </li>
                    ))}
                </ul>
           ) : <p className="text-sm text-gray-500 mt-2">No upcoming bills.</p>}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
            <button onClick={() => onNavigate('Transactions')} className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentTransactions.map(t => (
               <li key={t.id} className="py-3 flex justify-between items-center">
                 <div>
                    <p className="font-medium text-gray-800">{t.description}</p>
                    <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()} &bull; {t.category}</p>
                 </div>
                 <p className={`font-mono ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(t.amount, currency, exchangeRates)}</p>
               </li>
            ))}
             {recentTransactions.length === 0 && <p className="text-center text-gray-500 py-4">No recent transactions.</p>}
          </ul>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Spending by Category</h3>
            <div className="space-y-3">
                {Object.entries(spendingByCategory).sort(([,a], [,b]) => b - a).map(([category, amount]) => (
                    <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{category}</span>
                            <span className="font-mono">{formatCurrency(amount, currency, exchangeRates)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(amount / totalSpentThisMonth) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
                {Object.keys(spendingByCategory).length === 0 && <p className="text-center text-gray-500 py-4">No spending data available.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
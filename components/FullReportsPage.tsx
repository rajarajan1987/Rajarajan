

import React, { useState, useMemo } from 'react';
import { Transaction, FamilyMember, Currency } from '../types';
import ReportChat from './ReportChat';
import { formatCurrency } from '../utils/currency';

interface FullReportsPageProps {
    transactions: Transaction[];
    familyMembers: FamilyMember[];
    currency: Currency;
    exchangeRates: Record<Currency, number>;
}

// FIX: Refactored the CategorySpendingChart component to remove redundant/confusing type casts and simplify logic, resolving the arithmetic type errors.
const CategorySpendingChart: React.FC<{data: Record<string, number>, currency: Currency, exchangeRates: Record<Currency, number>}> = ({data, currency, exchangeRates}) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
        return <p className="text-center text-gray-500 py-8">No spending data for this period.</p>;
    }
    const sortedData = Object.entries(data).sort(([, valA], [, valB]) => valB - valA);
    const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

    return (
        <div className="p-4 border rounded-lg">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown by Category</h3>
             <div className="space-y-4">
                {sortedData.map(([category, amount], index) => {
                    const percentage = (amount / total) * 100;
                    return (
                        <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{category}</span>
                                <span className="font-mono">{formatCurrency(amount, currency, exchangeRates)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`${colors[index % colors.length]} h-4 rounded-full text-white text-xs flex items-center justify-center`} 
                                    style={{ width: `${percentage}%` }}
                                >
                                    {percentage > 5 ? `${percentage.toFixed(0)}%` : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>
    )
}


const FullReportsPage: React.FC<FullReportsPageProps> = ({ transactions, familyMembers, currency, exchangeRates }) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(startOfMonth);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [selectedMember, setSelectedMember] = useState('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            const isAfterStart = tDate >= new Date(startDate);
            const isBeforeEnd = tDate <= new Date(endDate + 'T23:59:59.999Z');
            const isMemberMatch = selectedMember === 'all' || t.memberId === selectedMember;
            return isAfterStart && isBeforeEnd && isMemberMatch;
        });
    }, [transactions, startDate, endDate, selectedMember]);

    const { totalIncome, totalExpenses, categorySpending } = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            if (t.type === 'Income') {
                acc.totalIncome += t.amount;
            } else {
                acc.totalExpenses += t.amount;
                acc.categorySpending[t.category] = (acc.categorySpending[t.category] || 0) + t.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpenses: 0, categorySpending: {} as Record<string, number> });
    }, [filteredTransactions]);

    const netFlow = totalIncome - totalExpenses;

    return (
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Report</h2>
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block">Family Member</label>
                            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                <option value="all">All Members</option>
                                <option value="family">General Family</option>
                                {familyMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome, currency, exchangeRates)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses, currency, exchangeRates)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-600">Net Savings/Loss</p>
                            <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>{formatCurrency(netFlow, currency, exchangeRates)}</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <CategorySpendingChart data={categorySpending} currency={currency} exchangeRates={exchangeRates} />
                </div>
            </div>
            <div className="lg:col-span-1">
                <ReportChat transactions={filteredTransactions} familyMembers={familyMembers} />
            </div>
        </div>
    );
};

export default FullReportsPage;
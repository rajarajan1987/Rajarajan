
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Bills from './components/Bills';
import Investments from './components/Investments';
import FamilyMembers from './components/FamilyMembers';
import FullReportsPage from './components/FullReportsPage';
import { FamilyMember, Transaction, Bill, Investment, Role, Currency } from './types';

const App: React.FC = () => {
    // State management
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
        { id: 'member1', name: 'Alex', role: 'Admin', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex' },
        { id: 'member2', name: 'Beth', role: 'Editor', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Beth' },
        { id: 'member3', name: 'Charlie', role: 'Viewer', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Charlie' },
    ]);
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: 't0', description: 'Monthly Salary', amount: 15000, date: new Date(new Date().setDate(1)).toISOString(), memberId: 'member1', category: 'Salary', type: 'Income' },
        { id: 't1', description: 'Weekly Groceries', amount: 350.75, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), memberId: 'member2', category: 'Groceries', type: 'Expense' },
        { id: 't2', description: 'Electricity Bill', amount: 220.50, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), memberId: 'family', category: 'Utilities', type: 'Expense' },
        { id: 't3', description: 'Gas for car', amount: 150.00, date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), memberId: 'member1', category: 'Transport', type: 'Expense' },
        { id: 't4', description: 'Movie Tickets', amount: 95.00, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), memberId: 'family', category: 'Entertainment', type: 'Expense' },
        { id: 't5', description: 'New Shoes', amount: 450.00, date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(), memberId: 'member3', category: 'Shopping', type: 'Expense' },
    ]);
    const [bills, setBills] = useState<Bill[]>([
        { id: 'b1', name: 'Rent', amount: 3500, dueDate: 1, frequency: 'Monthly', lastPaid: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
        { id: 'b2', name: 'Internet', amount: 200, dueDate: 15, frequency: 'Monthly', lastPaid: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
        { id: 'b3', name: 'Car Insurance', amount: 1200, dueDate: 20, frequency: 'Quarterly', lastPaid: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString() },
    ]);
    const [investments, setInvestments] = useState<Investment[]>([
        { id: 'inv1', name: 'Apple Inc.', type: 'Stock', quantity: 10, purchasePrice: 550.25, currentValue: 650.80 },
        { id: 'inv2', name: 'Bitcoin', type: 'Crypto', quantity: 0.1, purchasePrice: 100000, currentValue: 125000 },
    ]);

    // Current user simulation
    const [currentUserRole] = useState<Role>('Admin');
    const [currency, setCurrency] = useState<Currency>('AED');
    const exchangeRates: Record<Currency, number> = { 'AED': 1, 'USD': 0.27, 'EUR': 0.25, 'GBP': 0.22, 'INR': 22.75, 'AUD': 0.41 };

    // Transaction Modal State
    const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

    // Handlers
    const handleAddOrUpdateTransaction = (transaction: Omit<Transaction, 'id'> | Transaction) => {
        if ('id' in transaction) {
            setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
        } else {
            setTransactions([...transactions, { ...transaction, id: `t${Date.now()}` }]);
        }
    };

    const handleDeleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };
    
    const handleAddOrUpdateBill = (bill: Omit<Bill, 'id'> | Bill) => {
        if ('id' in bill) {
            setBills(bills.map(b => b.id === bill.id ? bill : b));
        } else {
            setBills([...bills, { ...bill, id: `b${Date.now()}`, lastPaid: new Date().toISOString() }]);
        }
    };

    const handleDeleteBill = (id: string) => {
        setBills(bills.filter(b => b.id !== id));
    };

    const handleMarkBillAsPaid = (billId: string) => {
        setBills(bills.map(b => b.id === billId ? {...b, lastPaid: new Date().toISOString()} : b))
    }

    const handleAddOrUpdateInvestment = (investment: Omit<Investment, 'id'> | Investment) => {
        if ('id' in investment) {
            setInvestments(investments.map(i => i.id === investment.id ? investment : i));
        } else {
            setInvestments([...investments, { ...investment, id: `inv${Date.now()}` }]);
        }
    }

    const handleDeleteInvestment = (id: string) => {
        setInvestments(investments.filter(i => i.id !== id));
    }

    const handleAddOrUpdateMember = (member: Omit<FamilyMember, 'id'> | FamilyMember) => {
        if ('id' in member) {
            setFamilyMembers(familyMembers.map(m => m.id === member.id ? member : m));
        } else {
            setFamilyMembers([...familyMembers, { ...member, id: `member${Date.now()}` }]);
        }
    }

    const handleDeleteMember = (id: string) => {
        setFamilyMembers(familyMembers.filter(m => m.id !== id));
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard 
                    transactions={transactions} 
                    bills={bills} 
                    investments={investments} 
                    familyMembers={familyMembers} 
                    currency={currency} 
                    exchangeRates={exchangeRates}
                    onNavigate={setActiveTab}
                />;
            case 'Transactions':
                return <TransactionList
                    transactions={transactions}
                    familyMembers={familyMembers}
                    onAddTransaction={() => { setTransactionToEdit(null); setIsTransactionFormOpen(true); }}
                    onEditTransaction={(t) => { setTransactionToEdit(t); setIsTransactionFormOpen(true); }}
                    onDeleteTransaction={handleDeleteTransaction}
                    currentUserRole={currentUserRole}
                    currency={currency}
                    exchangeRates={exchangeRates}
                />;
            case 'Bills':
                return <Bills 
                    bills={bills} 
                    onMarkAsPaid={handleMarkBillAsPaid}
                    onAddOrUpdateBill={handleAddOrUpdateBill}
                    onDeleteBill={handleDeleteBill}
                    currency={currency} 
                    exchangeRates={exchangeRates}
                    currentUserRole={currentUserRole}
                />;
            case 'Investments':
                return <Investments
                    investments={investments}
                    setInvestments={setInvestments}
                    onAddOrUpdateInvestment={handleAddOrUpdateInvestment}
                    onDeleteInvestment={handleDeleteInvestment}
                    currency={currency}
                    exchangeRates={exchangeRates}
                    currentUserRole={currentUserRole}
                />;
            case 'Family':
                return <FamilyMembers
                    familyMembers={familyMembers}
                    onAddOrUpdateMember={handleAddOrUpdateMember}
                    onDeleteMember={handleDeleteMember}
                    currentUserRole={currentUserRole}
                />;
            case 'Reports':
                 return <FullReportsPage 
                    transactions={transactions}
                    familyMembers={familyMembers}
                    currency={currency}
                    exchangeRates={exchangeRates}
                 />;
            default:
                return <Dashboard 
                    transactions={transactions} 
                    bills={bills} 
                    investments={investments} 
                    familyMembers={familyMembers} 
                    currency={currency} 
                    exchangeRates={exchangeRates}
                    onNavigate={setActiveTab}
                />;
        }
    };
    
    const tabs = ['Dashboard', 'Transactions', 'Bills', 'Investments', 'Family', 'Reports'];

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md sticky top-0 z-40">
                <nav className="container mx-auto px-4 md:px-6 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-indigo-600">Family Wallet</h1>
                        <div className="flex items-center gap-4">
                            {/* Currency Selector */}
                            <div>
                                <label htmlFor="currency-select" className="sr-only">Currency</label>
                                <select
                                    id="currency-select"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as Currency)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-2 pl-3 pr-8"
                                >
                                    {Object.keys(exchangeRates).map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Navigation Tabs */}
                            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                                {tabs.map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto">
                {renderContent()}
            </main>

            <TransactionForm
                isOpen={isTransactionFormOpen}
                onClose={() => setIsTransactionFormOpen(false)}
                onSubmit={handleAddOrUpdateTransaction}
                familyMembers={familyMembers}
                transactionToEdit={transactionToEdit}
            />
        </div>
    );
};

export default App;
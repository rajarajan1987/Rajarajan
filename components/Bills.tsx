import React, { useState } from 'react';
import { Bill, Currency, Role } from '../types';
import { formatCurrency } from '../utils/currency';
import { getNextDueDate, isBillOverdue } from '../utils/bill-helpers';
import { PlusCircleIcon, TrashIcon } from './icons';
import BillForm from './BillForm';

interface BillsProps {
    bills: Bill[];
    onMarkAsPaid: (billId: string) => void;
    onAddOrUpdateBill: (bill: Omit<Bill, 'id'> | Bill) => void;
    onDeleteBill: (id: string) => void;
    currency: Currency;
    exchangeRates: Record<Currency, number>;
    currentUserRole: Role;
}

const BillCard: React.FC<{bill: Bill, onMarkAsPaid: (id: string) => void, onDelete: (id: string) => void, currency: Currency, exchangeRates: Record<Currency, number>, canEdit: boolean}> = 
({ bill, onMarkAsPaid, onDelete, currency, exchangeRates, canEdit }) => {
    const lastPaidDate = new Date(bill.lastPaid);
    const nextDueDate = getNextDueDate(bill.dueDate, bill.frequency, lastPaidDate);
    const isOverdue = isBillOverdue(bill.dueDate, bill.frequency, lastPaidDate);
    const daysUntilDue = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    let statusText = `Due in ${daysUntilDue} days`;
    let statusColor = 'bg-yellow-100 text-yellow-800';
    if (isOverdue) {
        statusText = 'Overdue';
        statusColor = 'bg-red-100 text-red-800';
    } else if (daysUntilDue > 10) {
        statusText = `Due on ${nextDueDate.toLocaleDateString()}`;
        statusColor = 'bg-green-100 text-green-800';
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between relative group">
            {canEdit && (
                <button onClick={() => onDelete(bill.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            )}
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{bill.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {statusText}
                    </span>
                </div>
                <p className="text-2xl font-mono text-gray-900 my-2">
                    {formatCurrency(bill.amount, currency, exchangeRates)}
                </p>
                <p className="text-sm text-gray-500">Billed {bill.frequency}</p>
                 <p className="text-sm text-gray-500">Last paid: {lastPaidDate.toLocaleDateString()}</p>
            </div>
            {canEdit && (
                 <button 
                    onClick={() => onMarkAsPaid(bill.id)}
                    disabled={!isOverdue && daysUntilDue > 15}
                    className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                 >
                    Mark as Paid
                 </button>
            )}
        </div>
    );
};

const Bills: React.FC<BillsProps> = ({ bills, onMarkAsPaid, onAddOrUpdateBill, onDeleteBill, currency, exchangeRates, currentUserRole }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const canEdit = currentUserRole === 'Admin' || currentUserRole === 'Editor';
    
    const handleFormSubmit = (bill: Omit<Bill, 'id'> | Bill) => {
        onAddOrUpdateBill(bill);
        setIsFormOpen(false);
    }

    return (
        <div className="p-4 md:p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bill Reminders</h2>
                {canEdit && (
                    <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Bill
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bills.map(bill => (
                    <BillCard key={bill.id} bill={bill} onMarkAsPaid={onMarkAsPaid} onDelete={onDeleteBill} currency={currency} exchangeRates={exchangeRates} canEdit={canEdit} />
                ))}
            </div>
             {bills.length === 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
                    <p>You haven't added any recurring bills yet.</p>
                </div>
            )}
             <BillForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
             />
        </div>
    );
};

export default Bills;
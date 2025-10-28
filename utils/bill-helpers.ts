import { BillFrequency } from "../types";

export const getNextDueDate = (dueDate: number, frequency: BillFrequency, lastPaid: Date): Date => {
    const nextDue = new Date(lastPaid);
    
    switch (frequency) {
        case 'Monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
        case 'Quarterly':
            nextDue.setMonth(nextDue.getMonth() + 3);
            break;
        case 'Yearly':
             nextDue.setFullYear(nextDue.getFullYear() + 1);
            break;
    }
    nextDue.setDate(dueDate);
    return nextDue;
};

export const isBillOverdue = (dueDate: number, frequency: BillFrequency, lastPaid: Date): boolean => {
    const nextDueDate = getNextDueDate(dueDate, frequency, lastPaid);
    return new Date() > nextDueDate;
};

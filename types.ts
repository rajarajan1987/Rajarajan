export type Role = 'Admin' | 'Editor' | 'Viewer';

export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD';

export interface FamilyMember {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string; // Can be a URL or a base64 string from upload
}

export type TransactionType = 'Expense' | 'Income';

export interface Transaction {
  id: string;
  description: string;
  amount: number; // in AED
  date: string; // ISO string
  memberId: string; // 'family' or a member's id
  category: string;
  type: TransactionType;
}

export type BillFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

export interface Bill {
    id: string;
    name: string;
    amount: number; // in AED
    dueDate: number; // day of the month
    frequency: BillFrequency;
    lastPaid: string; // ISO string
}

export interface Investment {
    id: string;
    name: string;
    type: string; // e.g., 'Stock', 'Crypto', 'Fund', 'Real Estate'
    quantity: number;
    purchasePrice: number; // per unit in AED
    currentValue: number; // per unit in AED
}
import React, { useState, useEffect } from 'react';
import { Transaction, FamilyMember } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { SendIcon } from './icons';

interface ReportChatProps {
    transactions: Transaction[];
    familyMembers: FamilyMember[];
}

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

const ReportChat: React.FC<ReportChatProps> = ({ transactions, familyMembers }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: 'Ask me anything about the data shown in the current report.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Reset chat if the underlying data changes
    useEffect(() => {
        setMessages([{ sender: 'bot', text: 'Ask me anything about the data shown in the current report.' }]);
    }, [transactions]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const context = `
            You are a helpful financial assistant. Based on the following JSON data, answer the user's question.
            The data represents financial transactions for a family. 'memberId' of 'family' means it's a general expense.
            Family Members: ${JSON.stringify(familyMembers.map(m => ({ id: m.id, name: m.name })))}
            Transactions: ${JSON.stringify(transactions)}
        `;
        
        const prompt = `${context} User question: "${input}"`;
        const botResponse = await getFinancialAdvice(prompt);
        
        const botMessage: ChatMessage = { sender: 'bot', text: botResponse };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">AI Financial Assistant</h2>
            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                           <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="e.g., Who spent the most?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                />
                <button type="submit" className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isLoading}>
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ReportChat;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { getAccounts, getLedgerData } from '../actions';

export default function LedgerPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);

    useEffect(() => {
        getAccounts().then(setAccounts);
    }, []);

    const handleAccountChange = async (id: string) => {
        if (!id) return;
        const data = await getLedgerData(Number(id));
        setSelectedAccount(data);

        // Calculate running balance logic
        let currentBalance = 0;
        const entriesWithBalance = data?.entries.map((entry: any) => {
            const amount = Number(entry.amount);

            // Determine if this entry increases or decreases balance based on Account Type
            // Normal Debit Balance: ASSET, EXPENSE
            // Normal Credit Balance: LIABILITY, EQUITY, REVENUE
            const isNormalDebit = ['ASSET', 'EXPENSE'].includes(data.type);

            if (entry.type === 'DEBIT') {
                currentBalance += isNormalDebit ? amount : -amount;
            } else {
                currentBalance += isNormalDebit ? -amount : amount;
            }

            return { ...entry, runningBalance: currentBalance };
        });

        setLedgerEntries(entriesWithBalance || []);
    };

    return (
        <main className="p-10 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">General Ledger</h1>
                <select
                    className="p-2 border rounded bg-white shadow-sm"
                    onChange={(e) => handleAccountChange(e.target.value)}
                >
                    <option value="">Select an Account...</option>
                    {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                    ))}
                </select>
            </div>

            {!selectedAccount ? (
                <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">
                    Please select an account to view transaction history.
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden border">
                    <div className="p-4 bg-gray-50 border-b flex justify-between">
                        <span className="font-bold text-lg">{selectedAccount.name}</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">{selectedAccount.type}</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-sm uppercase text-gray-600">
                                <th className="p-4 border-b">Date</th>
                                <th className="p-4 border-b">Description</th>
                                <th className="p-4 border-b text-right">Debit</th>
                                <th className="p-4 border-b text-right">Credit</th>
                                <th className="p-4 border-b text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50 border-b transition">
                                    <td className="p-4 text-sm">
                                        {new Date(entry.transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">{entry.transaction.description}</div>
                                        <div className="text-xs text-gray-400">TXID: #{entry.transactionId}</div>
                                    </td>
                                    <td className="p-4 text-right text-blue-600 font-mono">
                                        {entry.type === 'DEBIT' ? Number(entry.amount).toFixed(2) : '-'}
                                    </td>
                                    <td className="p-4 text-right text-red-600 font-mono">
                                        {entry.type === 'CREDIT' ? Number(entry.amount).toFixed(2) : '-'}
                                    </td>
                                    <td className="p-4 text-right font-bold font-mono bg-gray-50">
                                        ${entry.runningBalance.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { createTransaction, getAccounts } from './actions';

export default function AccountingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [desc, setDesc] = useState("Office Supplies Purchase");
  const [amount, setAmount] = useState(100);

  // Simple state for a 2-line entry
  const [debitAcc, setDebitAcc] = useState("");
  const [creditAcc, setCreditAcc] = useState("");

  useEffect(() => {
    getAccounts().then(setAccounts);
  }, []);

  const handlePost = async () => {
    try {
      await createTransaction(desc, [
        { accountId: Number(debitAcc), amount: amount, type: 'DEBIT' },
        { accountId: Number(creditAcc), amount: amount, type: 'CREDIT' }
      ]);
      alert("Transaction Posted Successfully!");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Journal Entry</h1>

      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        <input
          className="w-full p-2 border"
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-blue-600">DEBIT (Increase Asset/Expense)</label>
            <select className="w-full p-2 border" onChange={(e) => setDebitAcc(e.target.value)}>
              <option>Select Account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-red-600">CREDIT (Decrease Asset/Increase Equity)</label>
            <select className="w-full p-2 border" onChange={(e) => setCreditAcc(e.target.value)}>
              <option>Select Account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <input
          type="number"
          className="w-full p-2 border"
          placeholder="Amount"
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button
          onClick={handlePost}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
        >
          Post Transaction
        </button>
      </div>
    </main>
  );
}
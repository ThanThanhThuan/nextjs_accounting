/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { getTrialBalance } from '../actions';

export default function TrialBalancePage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTrialBalance().then(res => {
            setData(res);
            setLoading(res === null); // simple check
            setLoading(false);
        });
    }, []);

    const totalDebits = data.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = data.reduce((sum, item) => sum + item.credit, 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    if (loading) return <p className="p-10 text-center">Loading Report...</p>;

    return (
        <main className="p-10 max-w-4xl mx-auto">
            <div className="bg-white shadow-xl rounded-lg border overflow-hidden">
                <div className="bg-gray-800 text-white p-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Trial Balance</h1>
                    <p className="text-gray-400 text-sm mt-1">As of {new Date().toLocaleDateString()}</p>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Account Name</th>
                            <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase">Debit ($)</th>
                            <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase">Credit ($)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-700">{row.name}</td>
                                <td className="p-4 text-right font-mono text-blue-600">
                                    {row.debit > 0 ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                </td>
                                <td className="p-4 text-right font-mono text-red-600">
                                    {row.credit > 0 ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                            <td className="p-4 text-gray-800">TOTAL</td>
                            <td className="p-4 text-right font-mono text-blue-700 text-lg border-double border-b-4 border-blue-200">
                                {totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-4 text-right font-mono text-red-700 text-lg border-double border-b-4 border-red-200">
                                {totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Validation Message */}
            <div className={`mt-6 p-4 rounded-md text-center font-bold ${isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isBalanced
                    ? "✅ The Trial Balance is in agreement."
                    : `❌ UNBALANCED! Difference: ${(totalDebits - totalCredits).toFixed(2)}`}
            </div>
        </main>
    );
}
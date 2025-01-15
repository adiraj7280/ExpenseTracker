// src/components/IncomeManager.js
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const IncomeManager = () => {
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const { addIncome, lockIncome, incomes, loading, error } = useFinance();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addIncome(parseFloat(amount), month, parseInt(year));
            setAmount('');
            setMonth('');
        } catch (err) {
            console.error('Failed to add income:', err);
        }
    };

    const handleLock = async (id) => {
        try {
            await lockIncome(id);
        } catch (err) {
            console.error('Failed to lock income:', err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Income Management</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Month
                        </label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Year
                        </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Income'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Month</th>
                            <th className="px-4 py-2 border">Year</th>
                            <th className="px-4 py-2 border">Amount</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map((income) => (
                            <tr key={income._id}>
                                <td className="px-4 py-2 border">{income.month}</td>
                                <td className="px-4 py-2 border">{income.year}</td>
                                <td className="px-4 py-2 border">Rs.{income.amount.toFixed(2)}</td>
                                <td className="px-4 py-2 border">
                                    {income.isLocked ? (
                                        <span className="text-red-500">Locked</span>
                                    ) : (
                                        <span className="text-green-500">Active</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    {!income.isLocked && (
                                        <button
                                            onClick={() => handleLock(income._id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            disabled={loading}
                                        >
                                            Lock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncomeManager;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import {
    PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import IncomeManager from './IncomeManager';
import ExpenseManager from './ExpenseManager';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { incomes, expenses } = useFinance();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalSavings = totalIncome - totalExpenses;

    const monthlyData = {
        income: incomes.find(i => i.month === selectedMonth && i.year === selectedYear)?.amount || 0,
        expenses: expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.toLocaleString('default', { month: 'long' }) === selectedMonth &&
                   expenseDate.getFullYear() === selectedYear;
        }).reduce((sum, expense) => sum + expense.amount, 0)
    };

    const pieChartData = [
        { name: 'Income', value: monthlyData.income, color: '#4CAF50' },
        { name: 'Expenses', value: monthlyData.expenses, color: '#f44336' }
    ];

    const categoryData = expenses
        .filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.toLocaleString('default', { month: 'long' }) === selectedMonth &&
                   expenseDate.getFullYear() === selectedYear;
        })
        .reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

    const barChartData = Object.entries(categoryData).map(([category, amount]) => ({
        category,
        amount
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Tracker.io</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Income</h3>
                        <p className="text-3xl font-bold text-green-600">Rs.{totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Expenses</h3>
                        <p className="text-3xl font-bold text-red-600">Rs.{totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Savings</h3>
                        <p className="text-3xl font-bold text-blue-600">Rs.{totalSavings.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
                    <div className="flex gap-4">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            {[
                                'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'
                            ].map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                        {[...Array(6)].map((_, i) => {
                        const year = new Date().getFullYear() + i; // Start from the current year and add upcoming years
                        return (
                        <option key={year} value={year}>
                        {year}
                        </option>
                        );
                        })}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Income vs Expenses</h3>
                        <div className="h-72">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Expenses by Category</h3>
                        <div className="h-72">
                            <ResponsiveContainer>
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <IncomeManager />
                    <ExpenseManager />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../services/firestoreService';  // Firestore service

const Expenses = ({ userId }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: '', category: '' });

  useEffect(() => {
    const fetchExpenses = async () => {
      const expensesData = await getExpenses(userId);
      setExpenses(expensesData);
    };
    fetchExpenses();
  }, [userId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await addExpense(userId, { ...newExpense, date: new Date() });
    const updatedExpenses = await getExpenses(userId);
    setExpenses(updatedExpenses);
    setNewExpense({ amount: '', category: '' });
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(userId, expenseId);
    const updatedExpenses = await getExpenses(userId);
    setExpenses(updatedExpenses);
  };

  return (
    <div>
      <h2>Your Expenses</h2>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          placeholder="Category"
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.amount} - {expense.category} - {new Date(expense.date.seconds * 1000).toLocaleDateString()}
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;

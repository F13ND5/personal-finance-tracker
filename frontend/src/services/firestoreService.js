import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
const db = getFirestore();

// --- Expense Functions ---

// Add an expense
export const addExpense = async (userId, expenseData) => {
  const expenseRef = collection(db, "users", userId, "expenses");
  return await addDoc(expenseRef, expenseData);
};

// Get all expenses for a user
export const getExpenses = async (userId) => {
  const expensesSnapshot = await getDocs(collection(db, "users", userId, "expenses"));
  return expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update an expense
export const updateExpense = async (userId, expenseId, updatedData) => {
  const expenseRef = doc(db, "users", userId, "expenses", expenseId);
  return await updateDoc(expenseRef, updatedData);
};

// Delete an expense
export const deleteExpense = async (userId, expenseId) => {
  const expenseRef = doc(db, "users", userId, "expenses", expenseId);
  return await deleteDoc(expenseRef);
};


// --- Budget Functions ---

// Add a budget
export const addBudget = async (userId, budgetData) => {
  const budgetRef = collection(db, "users", userId, "budgets");
  return await addDoc(budgetRef, budgetData);
};

// Get all budgets for a user
export const getBudgets = async (userId) => {
  const budgetsSnapshot = await getDocs(collection(db, "users", userId, "budgets"));
  return budgetsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update a budget
export const updateBudget = async (userId, budgetId, updatedData) => {
  const expenseRef = doc(db, "users", userId, "budgets", budgetId);
  return await updateDoc(expenseRef, updatedData);
};

// Delete a budget
export const deleteBudget = async (userId, budgetId) => {
  const budgetRef = doc(db, "users", userId, "budgets", budgetId);
  return await deleteDoc(budgetRef);
};


// --- Goal Functions ---

// Add a goal
export const addGoal = async (userId, goalData) => {
  const goalRef = collection(db, "users", userId, "goals");
  return await addDoc(goalRef, goalData);
};

// Get all goals for a user
export const getGoals = async (userId) => {
  const goalsSnapshot = await getDocs(collection(db, "users", userId, "goals"));
  return goalsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update a goal
export const updateGoal = async (userId, goalId, updatedData) => {
  const expenseRef = doc(db, "users", userId, "goals", goalId);
  return await updateDoc(expenseRef, updatedData);
};

// Delete a goal
export const deleteGoal = async (userId, goalId) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  return await deleteDoc(goalRef);
};
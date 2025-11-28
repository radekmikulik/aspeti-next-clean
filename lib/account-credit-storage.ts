// Account credit storage with localStorage
// LocalStorage key: aspeti_account_credit_v1

// Internal types (not exported directly)
interface AccountCreditState {
  balance: number;
}

// localStorage key
const STORAGE_KEY = 'aspeti_account_credit_v1';

// Default state
const DEFAULT_ACCOUNT_CREDIT: AccountCreditState = {
  balance: 420,
};

// Storage utility functions
function readFromStorage(): AccountCreditState | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (typeof parsed.balance !== 'number') {
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.warn('Error reading account credit from localStorage:', error);
    return null;
  }
}

function writeToStorage(state: AccountCreditState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Error writing account credit to localStorage:', error);
    throw error;
  }
}

// Public API functions

/**
 * Get current account credit state
 * If no data exists, creates and saves default state (420 Kč)
 */
export function getAccountCredit(): AccountCreditState {
  let state = readFromStorage();
  
  // If no data exists, save default state to localStorage for persistence
  if (!state) {
    try {
      writeToStorage(DEFAULT_ACCOUNT_CREDIT);
      state = DEFAULT_ACCOUNT_CREDIT;
    } catch (error) {
      console.warn('Could not save default account credit state:', error);
      state = DEFAULT_ACCOUNT_CREDIT;
    }
  }
  
  return state;
}

/**
 * Set specific balance and return new state
 */
export function setAccountCreditBalance(newBalance: number): AccountCreditState {
  const state: AccountCreditState = {
    balance: newBalance,
  };
  
  try {
    writeToStorage(state);
  } catch (error) {
    console.warn('Could not save account credit balance:', error);
  }
  
  return state;
}

/**
 * Add amount to current balance (positive amounts only)
 */
export function addAccountCredit(amount: number): AccountCreditState {
  const currentState = getAccountCredit();
  const newBalance = currentState.balance + amount;
  
  return setAccountCreditBalance(newBalance);
}

/**
 * Deduct amount from current balance (never goes below 0)
 */
export function deductAccountCredit(amount: number): AccountCreditState {
  const currentState = getAccountCredit();
  const newBalance = Math.max(0, currentState.balance - amount);
  
  return setAccountCreditBalance(newBalance);
}

// Export type for use in components
export type { AccountCreditState };
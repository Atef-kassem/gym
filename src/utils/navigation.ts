import { NavigateFunction } from 'react-router-dom';

// Enhanced navigation helper that prevents full page reloads
export const safeNavigate = (navigate: NavigateFunction, path: string, options?: { replace?: boolean }) => {
  try {
    // Clear any pending timeouts that might cause issues
    const timeouts = (window as any).__pendingTimeouts || [];
    timeouts.forEach((timeout: number) => clearTimeout(timeout));
    (window as any).__pendingTimeouts = [];

    // Navigate using React Router
    navigate(path, options);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to window.location only if React Router fails
    window.location.href = path;
  }
};

// Store navigation state to prevent loss during navigation
export const preserveNavigationState = (key: string, data: any) => {
  try {
    sessionStorage.setItem(`nav_state_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to preserve navigation state:', error);
  }
};

// Restore navigation state after navigation
export const restoreNavigationState = (key: string) => {
  try {
    const data = sessionStorage.getItem(`nav_state_${key}`);
    if (data) {
      sessionStorage.removeItem(`nav_state_${key}`);
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to restore navigation state:', error);
  }
  return null;
};

// Clear all navigation states
export const clearNavigationStates = () => {
  try {
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith('nav_state_'));
    keys.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear navigation states:', error);
  }
};
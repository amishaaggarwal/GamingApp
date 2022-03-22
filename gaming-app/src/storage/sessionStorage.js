// Save data to sessionStorage
export const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, value);
};

// Get saved data from sessionStorage
export const getSessionStorage = (key) => {
  return sessionStorage.getItem(key);
};

// Remove saved data from sessionStorage
export const removeFromSession = (key) => {
  sessionStorage.removeItem(key);
};

// Remove all saved data from sessionStorage
export const clearSession = () => sessionStorage.clear();

// Save data to sessionStorage
export const setInSession = (key, value) => {
    sessionStorage.setItem(key, value);
} 

// Get saved data from sessionStorage
export const getFromSession = (key) => {
    return sessionStorage.getItem(key);
}

// Remove saved data from sessionStorage
export const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
}

// // Remove all saved data from sessionStorage
// export const clearSession = () => sessionStorage.clear();

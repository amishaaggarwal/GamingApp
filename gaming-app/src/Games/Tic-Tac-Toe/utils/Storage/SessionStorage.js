export function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

export function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

export function clearSessionStorage() {
  sessionStorage.clear();
}

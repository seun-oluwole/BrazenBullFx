function getItem(key) {
  return JSON.parse(localStorage.getItem(key))
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function useLocalStorage() {
  return [getItem, setItem]
}
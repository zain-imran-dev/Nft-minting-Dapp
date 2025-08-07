// src/lib/mockStorage.js
class MockStorage {
  constructor() {
    this.storage = new Map();
    this.counter = 0;
  }

  set(key, value) {
    console.log('Setting storage:', key, value);
    this.storage.set(key, value);
  }

  get(key) {
    const value = this.storage.get(key);
    console.log('Getting storage:', key, value ? 'found' : 'not found');
    return value;
  }

  generateId() {
    return this.counter++;
  }

  has(key) {
    return this.storage.has(key);
  }

  keys() {
    return Array.from(this.storage.keys());
  }
}

// Create a singleton instance
const mockStorage = new MockStorage();

export default mockStorage;
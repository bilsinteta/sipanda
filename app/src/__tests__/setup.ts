// Polyfill Map.groupBy for Node < 21
if (typeof Map.groupBy !== 'function') {
  Map.groupBy = function (items: Iterable<any>, keySelector: (item: any, index: number) => any) {
    const map = new Map();
    let index = 0;
    for (const item of items) {
      const key = keySelector(item, index++);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    }
    return map;
  };
}

if (typeof (Object as any).groupBy !== 'function') {
  (Object as any).groupBy = function (items: Iterable<any>, keySelector: (item: any, index: number) => any) {
    const obj = Object.create(null);
    let index = 0;
    for (const item of items) {
      const key = keySelector(item, index++);
      if (!obj[key]) {
        obj[key] = [];
      }
      obj[key].push(item);
    }
    return obj;
  };
}

// Mock browser globals: window, localStorage, WebSocket
const store: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, val: string) => {
    store[key] = String(val);
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => Object.keys(store)[index] || null,
};

(global as any).localStorage = mockLocalStorage;
(global as any).window = {
  localStorage: mockLocalStorage,
  matchMedia: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }),
};

if (typeof (global as any).WebSocket === 'undefined') {
  (global as any).WebSocket = class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    readyState = 1;
    send() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

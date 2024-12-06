window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {},
  };
};

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.alert = jest.fn();

const originalError = console.error;
console.error = function(...args) {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*Cannot update a component/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

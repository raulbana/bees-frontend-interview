import '@testing-library/jest-dom';

const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
    /Warning: Act(...)/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
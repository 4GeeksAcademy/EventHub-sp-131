/* eslint-disable no-console */
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const devLog = {
  log: (...args) => { if (isDev) console.log(...args); },
  info: (...args) => { if (isDev) console.info(...args); },
  warn: (...args) => { if (isDev) console.warn(...args); },
  error: (...args) => { if (isDev) console.error(...args); }
};

export default devLog;

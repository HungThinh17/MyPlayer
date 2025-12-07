export const setupDevConsoleForwarding = (): void => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const originalLog = console.log.bind(console);

  console.log = (...args: unknown[]) => {
    originalLog(...args);

    try {
      fetch('/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: args }),
      }).catch((err) => originalLog('Failed to send logs:', err));
    } catch (err) {
      originalLog('Failed to send logs:', err);
    }
  };
};

export const log = (...args: unknown[]): void => {
  // Thin wrapper in case we want to redirect logs later.
  // eslint-disable-next-line no-console
  console.log(...args);
};


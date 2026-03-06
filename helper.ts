const { log, warn, error } = console;

const logPrefix = "kickback:";

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content);
};

export const elog = (...content: Parameters<typeof error>) => {
  error(logPrefix, ...content);
};

export const wlog = (...content: Parameters<typeof warn>) => {
  warn(logPrefix, ...content);
};

// Wait until the function returns true, then clear the interval
export const until = (fn: () => boolean | undefined, delay = 300) => {
  let count = 0;

  const id = setInterval(() => {
    count++;

    if (count >= 100) {
      clearInterval(id);
      elog("until: function did not return true within the specified attempts");
    }

    if (fn()) {
      clearInterval(id);
      return;
    }
  }, delay);
};

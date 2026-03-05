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

export const until = (fn: () => boolean | undefined, delay = 100) => {
  const id = setInterval(() => {
    if (fn()) clearInterval(id);
  }, delay);
};

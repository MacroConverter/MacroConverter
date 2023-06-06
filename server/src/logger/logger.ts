import { createLogger, transports, format, type Logger } from 'winston';

const customTimestamp = format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});
const customPrintf = format.printf(({ timestamp, level, message, service }) => {
  const ts: string = timestamp;
  const ser: string = service;
  const msg: string = message;
  return `[${ts}] ${ser} ${level}: ${msg}`;
});

const loggerSetup = (dirname: any, serviceName: string): Logger => {
  const logger = createLogger({
    transports: [new transports.Console()],
    format: format.combine(format.colorize(), customTimestamp, customPrintf),
    defaultMeta: {
      service: serviceName,
    },
  });

  return logger;
};

export { loggerSetup };

import { createLogger, transports, format } from 'winston';

const customTimestamp = format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});
const customPrintf = format.printf(({ timestamp, level, message, service }) => {
  return `[${timestamp}] ${service} ${level}: ${message}`;
});

module.exports = (dirname: any, service_name: string) => {
  const logger = createLogger({
    transports: [new transports.Console()],
    format: format.combine(format.colorize(), customTimestamp, customPrintf),
    defaultMeta: {
      service: service_name,
    },
  });

  return logger;
};

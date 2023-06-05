import { createLogger, transports, format } from 'winston';
import { TransformableInfo } from 'logform';
const { combine, timestamp, printf, prettyPrint } = format;

const formatSetup = printf(
  ({ level, message, timestamp }: TransformableInfo) => {
    return `${timestamp} ${message} ${level}`;
  },
);

module.exports = (dirname: any) => {
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  };

  let levelKeys = Object.keys(levels);
  for (let level of levelKeys) {
    const logger = createLogger({
      format: combine(timestamp(), formatSetup, prettyPrint()),
      transports: [
        new transports.Console({
          level,
        }),
      ],
    })[level];
    levels[level as keyof typeof levels] = logger;
  }

  return levels;
};

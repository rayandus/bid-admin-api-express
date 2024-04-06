import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint, printf, colorize } = format;

const logFormat = combine(
  colorize({ all: true, colors: { info: 'blue' } }),
  timestamp(),
  prettyPrint(),
  printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? `\n${JSON.stringify(args, null, 2)}` : ''}`;
  }),
);

const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: logFormat,
    }),
  ],
});

export default logger;

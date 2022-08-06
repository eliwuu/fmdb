import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.prettyPrint()
);

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      format: format,
      level: 'error',
      filename: 'error.%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      maxSize: '1m',
      maxFiles: '7d',
      zippedArchive: true,
    }),
  ],
});

export const Logger = logger;

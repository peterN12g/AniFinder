import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
    ),
    // transports: [
    //   new transports.File({ filename: 'error.log', level: 'error' }),
    //   new transports.Console(),
    //   new transports.File({ filename: 'api_logs.log' })
    // ],
  });
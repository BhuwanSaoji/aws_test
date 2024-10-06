import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: 'info', // Set default log level (info, error, warn, etc.)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({ format: combine(colorize(), logFormat) }), // Colorized output for console
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }), // File transport for errors
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') }) // File transport for combined logs
  ]
});

export default logger;

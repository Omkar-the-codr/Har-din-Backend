const { createLogger, format, transports } = require("winston");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

const fileTransport = new transports.File({
  filename: "logs/app.log",
  maxsize: 1024 * 1024, // Correct number type (1MB)
  options: { flags: "w" }, // Overwrites the file each time
});

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [fileTransport, new transports.Console()],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
});

module.exports = logger;

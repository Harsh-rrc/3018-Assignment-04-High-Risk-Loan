import fs from "fs";
import path from "path";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

// Create logs directory if missing
const logDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create write stream for file logging (in production)
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });

// Morgan setup — write to console in development, file in production, skip in test
const requestLogger =
  process.env.NODE_ENV === "production"
    ? morgan("combined", { stream: accessLogStream })
    : process.env.NODE_ENV === "test"
    ? (req: Request, res: Response, next: NextFunction) => next() // Skip logging in tests
    : morgan("dev", { stream: { write: (message: string) => console.log(message.trim()) } });

// Simple error logging middleware
const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction): void => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}`;

  if (process.env.NODE_ENV === "production") {
    fs.appendFileSync(path.join(logDir, "error.log"), logMessage + "\n");
  } else {
    console.error(logMessage);
  }

  next(err); // Pass the error to the next middleware
};

export { requestLogger, errorLogger };
import express from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/admineRoutes";
import { requestLogger, errorLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";

const app = express();

// Apply logging middleware early to capture all requests
app.use(requestLogger);

// Apply body parsing middleware after logging
app.use(express.json());

// API routes with authentication and authorization
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// Test route
app.get("/test", (req, res) => res.send("OK"));

// Apply error logging and handling middleware last
app.use(errorLogger);
app.use(errorHandler);

export default app;
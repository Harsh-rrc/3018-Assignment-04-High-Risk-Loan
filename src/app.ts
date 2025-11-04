import express from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import { requestLogger, errorLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use("/api/v1/loans", loanRoutes);

app.get("/test", (req, res) => res.send("OK"));

app.use(errorLogger);
app.use(errorHandler);

export default app;

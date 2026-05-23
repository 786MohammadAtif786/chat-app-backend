import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import socketSetup from "./socket/socket";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (_: any, res: { send: (arg0: string) => void; }) => {
  res.send("API Running...");
});

export default app;
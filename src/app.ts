import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import socketSetup from "./socket/socket";

const app = express();

// app.use(cors());


app.use(cors({
  origin: function (origin, callback) {

    const allowedOrigins = [
      "http://localhost:3000",
      "https://chat-app-fronted-lac.vercel.app"
    ];

    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked origin:", origin);
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (_: any, res: { send: (arg0: string) => void; }) => {
  res.send("API Running...");
});

export default app;
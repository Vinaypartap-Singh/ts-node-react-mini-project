import cors from "cors";
import express, { Express, Request, Response, urlencoded } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import routeHandler from "./routes";

const PORT = process.env.PORT || 3000;
const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket io in app instance

app.io = io;

// middlwares
app.use(express.json());
app.use(urlencoded({ extended: false }));

// Cors
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Routes Middleware
app.use(routeHandler);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));

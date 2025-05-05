import express, { Express, Request, Response, urlencoded } from "express";
import routeHandler from "./routes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// middlwares
app.use(express.json());
app.use(urlencoded({ extended: false }));

// Routes Middleware
app.use(routeHandler);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

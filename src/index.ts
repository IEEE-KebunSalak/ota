import Express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import otaRoutes from "./route/ota";
import ENV from "./utils/env";

const app = Express();

app.use(Express.json());
app.use("/ota", otaRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "OTA Service is running",
  });
});

app.get("/*file", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

app.listen(ENV.APP_PORT, () => {
  console.log(`Server is running on port ${ENV.APP_PORT}`);
});

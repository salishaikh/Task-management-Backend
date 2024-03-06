import dotenv from "dotenv";
import connectmongo from "./db/index.js";
import app from "./app.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

dotenv.config({
  path: "./env",
});

connectmongo()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
// ROUTES DEFINE
app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/board", boardRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(
    ` Server is running at port : https://localhost:${process.env.PORT}`
  );
});

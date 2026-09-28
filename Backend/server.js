import "dotenv/config";
import express from "express";
import cors from "cors";
import explainRoute from "./routes/explain.js";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Contextify backend is running.");
});

app.use("/api/explain", explainRoute);

app.listen(PORT, () => {
  console.log(`Contextify backend listening on ${PORT}`);
});
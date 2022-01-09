import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

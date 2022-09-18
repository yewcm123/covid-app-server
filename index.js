const express = require("express");
app = express();
const cors = require("cors");
const mysql = require("mysql");
const octokit = require("octokit");

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening at port ${PORT}`);
});

app.get("/getAllData", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();

  result.then((data) => response.json(data)).catch((err) => console.log(err));
});

app.get("/getTodayData", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getTodayData();

  result.then((data) => response.json(data)).catch((err) => console.log(err));
});

app.get("/getTodayDataGithub", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getTodayDataGithub();

  result.then((data) => response.json(data)).catch((err) => console.log(err));
});

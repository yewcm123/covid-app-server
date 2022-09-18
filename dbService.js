const mysql = require("mysql");
const octokit = require("octokit");
const moment = require("moment");
const axios = require("axios");
const csvparser = require("csv-parser");
let dbServiceInstance = null;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "covid_data",
  port: "3306",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

class dbService {
  static getDbServiceInstance() {
    return dbServiceInstance ? dbServiceInstance : new dbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT `date`,`cases_new`,`cases_recovered` FROM `cases_malaysia`";

        connection.query(query, (err, rows) => {
          if (err) reject(new Error(err.message));

          let dateArray = [];
          let casesNewArray = [];
          let casesRecoveredArray = [];

          rows.forEach((data) => {
            let modDate = data.date;
            modDate = moment(modDate).format("YYYY-MM-DD");
            dateArray.push(modDate);
            casesNewArray.push(data.cases_new);
            casesRecoveredArray.push(data.cases_recovered);
          });

          resolve({ dateArray, casesNewArray, casesRecoveredArray });
        });
      });

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async getTodayData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT `cases_new`, `cases_recovered` FROM `cases_malaysia` WHERE id=(SELECT max(id) FROM `cases_malaysia`)";
        connection.query(query, (err, data) => {
          if (err) reject(new Error(err.message));
          let casesNew = data[0].cases_new;
          let casesRecovered = data[0].cases_recovered;

          resolve({ casesNew, casesRecovered });
        });
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async getTodayDataGithub() {
    return axios
      .get(
        "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/deaths_malaysia.csv"
      )
      .pipe(csvparser.parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        console.log(row);
      });
  }
}

module.exports = dbService;

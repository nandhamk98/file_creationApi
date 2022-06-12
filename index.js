import express from "express";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const fsPromises = fs.promises;
const app = express();
const PORT = 4000;

const HOME_DIR = os.homedir();
const CURRENT_DIR = "/Desktop/backupFiles";
const PATH = path.join(HOME_DIR, CURRENT_DIR);

app.get("/", function (req, res) {
  res.send(PATH);
});

app.get("/files", async function (req, res) {
  let data = {};
  try {
    data.files = await fsPromises.readdir(PATH);
  } catch (e) {
    data.err = e;
  }
  res.send(data.files || data.err ? data : { message: "No Files Found" });
});

app.post("/create-file", async function (req, res) {
  let now = Date.now();
  let data = {};
  fs.mkdir(PATH, { recursive: true }, (err) => {
    if (err) throw err;
  });
  try {
    data = await fsPromises.writeFile(PATH + "/" + now, now.toString());
  } catch (err) {
    data = err;
  }
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`The server started in ${PORT}`);
});

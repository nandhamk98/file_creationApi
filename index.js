import express from "express";
import dotenv from "dotenv";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

dotenv.config();

const fsPromises = fs.promises;
const app = express();
const PORT = process.env.PORT;

const HOME_DIR = os.homedir();
const CURRENT_DIR = "/Desktop/backupFiles";
const PATH = path.join(HOME_DIR, CURRENT_DIR);

fs.mkdir(PATH, { recursive: true }, (err) => {
  if (err) throw err;
  console.log("folder created");
});

app.get("/", function (req, res) {
  res.send("Welcome to file creation app");
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
  try {
    data = await fsPromises.writeFile(
      PATH + "/" + now + ".txt",
      now.toString()
    );
    console.log("file created");
  } catch (err) {
    data = err;
  }
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`The server started in ${PORT}`);
});

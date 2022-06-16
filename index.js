import express from "express";
import dotenv from "dotenv";

// Inbuilt libraries
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Setting the applications
dotenv.config();

const fsPromises = fs.promises;
const app = express();
const PORT = process.env.PORT;

// Setting the file/folder path
const HOME_DIR = os.homedir();
const CURRENT_DIR = "/Desktop/backupFiles";
const PATH = path.join(HOME_DIR, CURRENT_DIR);

// Creating the folder for Writing/Reading files
fs.mkdir(PATH, { recursive: true }, (err) => {
  if (err) throw err;
  console.log("folder created");
});

// Root endpoint to check the application start
app.get("/", function (req, res) {
  res.send("Welcome to file creation app");
});

//Get all the files from backup folder
app.get("/files", async function (req, res) {
  let data = {};
  try {
    data.files = await fsPromises.readdir(PATH);
  } catch (e) {
    data.err = e;
  }
  res.send(data.files || data.err ? data : { message: "No Files Found" });
});

//Create a file with timestamp name and timestamp as a data inside the backup folder
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

// listening to the port
app.listen(PORT, () => {
  console.log(`The server started in ${PORT}`);
});

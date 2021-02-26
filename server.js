import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import shortid from "shortid";

require("dotenv").config();

const { readFile, stat, writeFile, readdir, unlink } = require("fs").promises;

const TIME_NOW = +new Date();
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

const FILETEMPLATE = (req) => {
  return {
    taskId: shortid.generate(),
    title: req.body.title,
    status: "new",
    _isDeleted: false,
    _createdAt: TIME_NOW,
    _deletedAt: null,
  };
};

const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, "../dist/assets")),
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
  bodyParser.json({ limit: "50mb", extended: true }),
  cookieParser(),
];

middleware.forEach((it) => app.use(it));

const processFileData = (obj) => {
  console.log(obj);
  const withoutDeleted = Object.values(obj).filter(
    (task) => task["_isDeleted"] !== true
  );
  const result = withoutDeleted.map((task) => {
    return Object.fromEntries(
      Object.entries(task).filter(([key, value]) => {
        return key[0] !== "_";
      })
    );
  }, {});
  return result;
};

const readFileData = async (category) => {
  const text = await readFile(`${__dirname}/data/tasks/${category}.json`, {
    encoding: "utf8",
  });
  return text ? JSON.parse(text) : [];
};

const writeFileData = async (updatedData, category) => {
  await writeFile(`${__dirname}/data/tasks/${category}.json`, updatedData, {
    encoding: "utf8",
  });
};

const readAndProcessFileData = async (category) => {
  const obj = await readFileData(category);
  return processFileData(obj);
};

app.get("/api/v1/tasks/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const result = await readAndProcessFileData(category);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something went wrong`);
  }
});

app.get("/api/v1/categories", async (req, res) => {
  try {
    const fileNamesArray = await readdir(`${__dirname}/data/tasks`);
    const result = fileNamesArray.map((file) => {
      return file.slice(0, -5);
    });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something went wrong`);
  }
});

app.get("/api/v1/tasks/:category/:timespan", async (req, res) => {
  const { timespan, category } = req.params;
  try {
    const fileContent = await readFileData(category);
    const filteredTasks = (timeMarker) => {
      return Object.keys(fileContent).reduce((acc, rec) => {
        if (fileContent[rec]._createdAt + timeMarker > TIME_NOW) {
          console.log(fileContent[rec], fileContent[rec]._createdAt, timeMarker, TIME_NOW);
          return processFileData([...acc, fileContent[rec]]);
        }
        return processFileData(acc);
      }, []);
      // const formatedFileContant = processFileData(filteredTasks);
    };
    switch (timespan) {
      case "day":
        res.status(200).send(filteredTasks(DAY));
        break;
      case "week":
        res.status(200).send(filteredTasks(WEEK));
        break;
      case "month":
        res.status(200).send(filteredTasks(MONTH));
        break;
      default:
        res
          .status(200)
          .send("please insert valid time marker: week, day or month");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something went wrong`);
  }
});

app.post("/api/v1/tasks", async (req, res) => {
  const { category } = req.body;
  try {
    await stat(`${__dirname}/data/tasks/${category}.json`);
    res.status(409).send(`${category} category is already exists`);
  } catch (err) {
    console.log(err);
    if ((err.errno = -2)) {
      await writeFileData([], category);
      res.status(200).send(`${category} category is created`);
    } else {
      console.log(err);
      res.status(500).send(`Something went wrong`);
    }
  }
});

app.post("/api/v1/tasks/:category", async (req, res) => {
  const { category } = req.params;
  try {
    await stat(`${__dirname}/data/tasks/${category}.json`);
    const data = await readFileData(category);
    const newData = FILETEMPLATE(req);
    const updatedData = JSON.stringify([...data, newData]);
    await writeFileData(updatedData, category);
    res.status(200).send(JSON.parse(updatedData));
  } catch (err) {
    console.log(err);
    if ((err.errno = -2)) {
      res.status(200).send(`${category} category doesn't exist`);
    } else {
      console.log(err);
      res.status(500).send(`Something went wrong`);
    }
  }
});

app.patch("/api/v1/tasks/:category/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  const { id, category } = req.params;
  const { status, title } = req.body;
  try {
    const fileContent = await readFileData(category);
    const fileContentArray = Array.from(fileContent);
    const findTask = fileContentArray.find((task) => task.taskId === id);
    if (
      status === "done" ||
      status === "blocked" ||
      status === "in progress" ||
      status === "new" ||
      typeof title !== "undefined"
    ) {
      const positionTaskInArray = fileContentArray.indexOf(findTask);
      const updateTask = Object.assign(findTask, req.body);
      fileContentArray[positionTaskInArray] = updateTask;
      const updatedData = JSON.stringify([...fileContentArray]);
      await writeFileData(updatedData, category);
      return res.status(200).send(updateTask);
    } else {
      return res.status(400).send(`Invalid status or title`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something went wrong`);
  }
});

app.delete("/api/v1/tasks/:category", async (req, res) => {
  const { category } = req.params;
  try {
    await unlink(`${__dirname}/data/tasks/${category}.json`);
    res.status(200).send(`${category} category is deleted`);
  } catch (err) {
    console.log(err);
    if ((err.errno = -2)) {
      res.status(200).send(`${category} category doesn't exist`);
    } else {
      console.log(err);
      res.status(500).send(`Something went wrong`);
    }
  }
});

app.delete("/api/v1/tasks/:category/:id", async (req, res) => {
  const { id, category } = req.params;
  try {
    const fileContent = await readFileData(category);
    const fileContentArray = Array.from(fileContent);
    const findTask = fileContentArray.find((task) => task.taskId === id);
    const updateTask = Object.assign(findTask, {
      _isDeleted: true,
      _deletedAt: TIME_NOW,
    });
    const positionTaskInArray = fileContentArray.indexOf(findTask);
    fileContentArray[positionTaskInArray] = updateTask;
    const updatedData = JSON.stringify([...fileContentArray]);
    await writeFileData(updatedData, category);
    return res.status(200).send(updateTask);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something went wrong`);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

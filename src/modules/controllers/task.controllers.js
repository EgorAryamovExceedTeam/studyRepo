const Task = require("../../db/models/task/index");

module.exports.getAllTasks = (req, res, next) => {
  Task.find().then((result) => {
    res.send({ data: result });
  });
};

module.exports.createNewTask = (req, res) => {
  const body = req.body;
  const task = new Task(body);
  task.save(body).then(() => {
    Task.find().then((result) => {
      res.send({ data: result });
    });
  });
};

module.exports.deleteTask = (req, res) => {
  Task.deleteOne({ _id: req.query._id }).then(() => {
    Task.find().then((result) => {
      res.send({ data: result });
    });
  });
};

module.exports.changeTaskInfo = (req, res) => {
  Task.updateOne({ _id: req.query._id }, req.body).then(() => {
    Task.find().then((result) => {
      res.send({ data: result });
    });
  });
};

module.exports.deleteAllTasks = (req, res, next) => {
  Task.deleteMany().then(() => {
    Task.find().then((result) => {
      res.send({ data: result });
    });
  });
};

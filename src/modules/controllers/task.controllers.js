const Task = require('../../db/models/task/index')

// get all tasks 
module.exports.getAllTasks = (req, res, next) => { 
  Task.find().then(result => {
    res.send({data: result});
  })
}
  
// create new task
module.exports.createNewTask = (req, res, next) => {
  const body = req.body;
  const task = new Task(body);
  task.save(body).then(() => {
    Task.find().then(result =>{
      res.send({data: result});
    })
  })
}

// delete task
module.exports.deleteTask = (req, res, next) => {
  Task.deleteOne({_id: req.query._id}).then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
}

// change task (task's text, isCheck)
module.exports.changeTaskInfo = (req, res, next) => {
  Task.updateOne({_id: req.body._id}, req.body).then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
}

// clear the task list
module.exports.deleteAllTasks = (req, res, next) => {
  Task.deleteMany().then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
}
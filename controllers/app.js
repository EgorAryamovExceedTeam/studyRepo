const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const {Schema} = mongoose;

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
});

const Task = mongoose.model('task', taskScheme);

app.use(cors());
app.use(express.json());


const url = 'mongodb+srv://EgorRestAPI:Nokiaversia228@cluster0.qnjrd.mongodb.net/UsersDB?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/allTasks', (req, res) => {
  Task.find().then(result => {
    res.send({data: result});
  })
})

app.post('/createTask', (req, res) => {
  const body = req.body;
  const task = new Task(body);
  task.save(body).then(() => {
    Task.find().then(result =>{
      res.send({data: result});
    })
  })
})

app.delete('/deleteTask', (req, res) => {
  Task.deleteOne({_id: req.query._id}).then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
});

app.patch('/updateTask', (req, res) => {
  Task.updateOne({_id: req.query._id}, req.body).then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
})

app.delete('/deleteAll', (req, res) => {
  Task.deleteMany().then(() => {
    Task.find().then(result => {
      res.send({data: result});
    })
  })
})

app.listen(8000, () => {
  console.log('Server has been started on port 8000...')
})
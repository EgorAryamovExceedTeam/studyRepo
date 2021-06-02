const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const apiRoutes = require('./src/modules/routes/routes');

app.use(cors());
app.use(express.json());

app.use('/', apiRoutes);

const url = 'mongodb+srv://EgorRestAPI:Nokiaversia228@cluster0.qnjrd.mongodb.net/UsersDB?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(8000, () => {
  console.log('Server has been started on port 8000...')
})
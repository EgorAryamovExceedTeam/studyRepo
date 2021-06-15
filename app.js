const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const apiRoutes = require("./src/modules/routes/routes");

const url = `mongodb+srv://EgorRestAPI:Nokiaversia228@cluster0.qnjrd.mongodb.net/UsersDB?retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());

app.use(bodyParser.json());
app.use("/", apiRoutes);

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

require('dotenv').config();
const mongoose = require('mongoose');
let data = 5;
const url = process.env.mongodb;

mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then((result) => console.log('Connected to mongodb'))
  .catch((error) => console.log('Error connecting to mongo', error.message));

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneSchema.set('toJSON', {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model('PhoneBook', phoneSchema);

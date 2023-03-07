const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
let PhoneBook = require('./mongo');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

// routes

app.get('/api/people', (req, res) => {
  PhoneBook.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/api/people/:id', (req, res) => {
  PhoneBook.findById(req.params.id).then((phone) => {
    res.json(phone);
  });
});

app.post('/api/people', (req, res) => {
  let { name, number } = req.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' });
  }
  if (PhoneBook.findOne({ name: name })) {
    return res.json({ error: 'Name Already Exists' });
  }
  const phone = new PhoneBook({ name, number });
  phone.save().then((phone) => {
    res.json(phone);
  });
});

app.delete('/api/people/:id', (req, res) => {
  const { id } = req.params;
  PhoneBook.findByIdAndDelete(id).then((phone) => {
    res.json(phone);
  });
});

app.get('/info', (req, res) => {
  res.json(`<h1>PhoneBook has info for ${data.length} people<h1> \n <p>${new Date()}</p>`);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

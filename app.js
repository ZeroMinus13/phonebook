const express = require('express');
const app = express();
let morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let data = require('./phonedata');

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// routes
app.get('/', (req, res) => {
  res.json('<h1>Hello</h1>');
});

app.get('/api/people', (req, res) => {
  res.json(data);
});

app.get('/api/people/:id', (req, res) => {
  const id = req.params.id;
  const people = data.find((note) => note.id == id);
  people ? res.json(people) : res.json('<h1>No people Found</h1>');
});

app.post('/api/people', (req, res) => {
  let nameExist = data.some((i) => i.name == req.body.name);
  if (!req.body.name || !req.body.number) {
    return res.send('Error ');
  } else if (nameExist) {
    return res.send('Name already');
  }
  data.concat(req.body);
  let newPerson = req.body;
  res.json(newPerson);
});

app.delete('/api/people/:id', (req, res) => {
  const id = req.params.id;
  let p = data.filter((note) => note.id !== id);
  res.json(p);
});

app.get('/info', (req, res) => {
  res.json(`<h1>PhoneBook has info for ${data.length} people<h1> \n <p>${new Date()}</p>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

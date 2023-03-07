const express = require('express');
const app = express();
const cors = require('cors');
let PhoneBook = require('./mongo');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

const unknownEndpoint = (request, response, next) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

// routes

app.get('/api/people', (req, res, next) => {
  PhoneBook.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get('/api/people/:id', (req, res, next) => {
  PhoneBook.findById(req.params.id)
    .then((phone) => (phone ? res.json(phone) : res.status(404).end()))
    .catch((err) => next(err));
});

app.post('/api/people', (req, res, next) => {
  let { name, number } = req.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' });
  }
  const phone = new PhoneBook({ name, number });
  phone
    .save()
    .then((phone) => {
      res.json(phone);
    })
    .catch((error) => next(error));
});

app.put('/api/people/:id', (req, res, next) => {
  let { name, number } = req.body;
  PhoneBook.findByIdAndUpdate(req.params.id, { number }, { new: true })
    .then((phone) => {
      res.json(phone);
    })
    .catch((err) => next(err));
});

app.delete('/api/people/:id', (req, res, next) => {
  const { id } = req.params;
  PhoneBook.findByIdAndDelete(id)
    .then((phone) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
  PhoneBook.find({})
    .then((result) => {
      res.json({ message: `PhoneBook has info for ${result.length} people\n ${new Date()}` });
    })
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  next(err);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

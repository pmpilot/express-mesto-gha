const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '62a0de4aafe18908c1314d01',
  };

  next();
});

app.use(express.json());

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Такой страницы нет' });

  next();
});

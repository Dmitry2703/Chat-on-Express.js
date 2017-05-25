const mongoose = require('./libs/mongoose');
const async = require('async');

const open = callback => mongoose.connection.on('open', callback);

const dropDatabase = (callback) => {
  const db = mongoose.connection.db;
  db.dropDatabase(callback);
};

const requireModels = (callback) => {
  require('./models/user');
  async.each(Object.keys(mongoose.models), (modelName, callback) => (
    mongoose.models[modelName].ensureIndexes(callback)
  ), callback);
};

const createUsers = (callback) => {
  const users = [{
    username: 'Vasya',
    password: 'supervasya',
  }, {
    username: 'Petya',
    password: '123',
  }, {
    username: 'admin',
    password: 'admin',
  }];
  async.each(users, (userData, callback) => {
    const user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
};

async.series([
  open,
  dropDatabase,
  requireModels,
  createUsers,
], (err) => {
  console.log(err);
  mongoose.disconnect();
});

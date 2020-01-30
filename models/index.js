const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

var models = {};

models.User = require('./User');

module.exports = models;
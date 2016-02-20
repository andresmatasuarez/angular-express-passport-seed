'use strict';

const mongoose = require('mongoose');
const schema   = require('./schema');

module.exports = mongoose.model('Admin', schema);

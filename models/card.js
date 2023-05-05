const mongoose = require('mongoose');
// const { regex } = require('../utils/regex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true,
    // validate: {
    //   validator(link) {
    //     return regex.test(link);
    //   },
    //   message: (props) => `${props.value} некорректная ссылка!`,
    // },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },

  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

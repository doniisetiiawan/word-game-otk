import mongoose from 'mongoose';
import Promise from 'bluebird';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
});

schema.statics.join = (name) => {
  const User = mongoose.model('user');
  const creating = User.create({
    name,
  });

  return Promise.resolve(creating);
};

schema.statics.leave = function (name) {
  return this.findOneAndRemove({
    name,
  }).exec();
};

schema.statics.findAllUsers = () => {
  const User = mongoose.model('user');
  const fetching = User.find().exec();

  return Promise.resolve(fetching).map((user) => user.name);
};

const User = mongoose.model('user', schema);

export default User;

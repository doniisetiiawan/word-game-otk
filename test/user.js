import User from '../app/models/user';
// eslint-disable-next-line no-unused-vars
import db from '../db';

const onJoinSuccess = (user) => {
  console.log('user', user.name, 'joined game!');
  return user;
};

const onJoinFail = (err) => {
  console.error('user fails to join, err', err);
};

console.log('Before leo send req to join game');

User.join('leo')
  .then(onJoinSuccess)
  .catch(onJoinFail);

console.log('After leo send req to join game');

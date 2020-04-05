import User from '../app/models/user';
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
  .then(() => {
    console.log('will call User.findAllUsers');
    return User.findAllUsers();
  })
  .then((allUsers) => {
    console.log('will call JSON.stringify');
    return JSON.stringify(allUsers);
  })
  .then((val) => {
    console.log('all users json string:', val);
  })
  .catch(onJoinFail);

console.log('After leo send req to join game');

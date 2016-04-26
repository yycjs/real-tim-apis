'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const request = require('request').defaults({
  baseUrl: 'http://real-time-yycrb.herokuapp.com',
  json: true
});

const req = function(options) {
  return new Promise((resolve, reject) => {
    req(options, (error, response, data) => {
      if(error) {
        return reject(error);
      }

      resolve(data);
    });
  });
};

const app = feathers()
  .configure(rest())
  .configure(socketio())
  .use('/polls', {
    find(params) {
      return req('/polls');
    },

    get(id) {
      return req(`/polls/${id}`);
    }
  })
  .use('/votes', {
    update(id, data) {
      return req({
        url: id,
        method: 'PUT',
        body: data
      });
    }
  })
  .use('/', feathers.static(`${__dirname}/../`))
  .use('/', feathers.static(`${__dirname}/../public/`));

app.listen(process.env.PORT || 3000);

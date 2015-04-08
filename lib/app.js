import feathers from 'feathers';
import request from 'request';
import _ from 'lodash';

const fetch = request.defaults({
  baseUrl: 'http://real-time-yycrb.herokuapp.com',
  json: true
});

const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .use('/polls', {
    find(params, callback) {
      fetch('/polls', (error, response, data) => {
        callback(error, data);
      });
    },

    get(id, params, callback) {
      fetch(`/polls/${id}`, (error, response, data) => {
        callback(error, data);
      });
    }
  })
  .use('/votes', {
    update(id, data, params, callback) {
      fetch({
        url: id,
        method: 'PUT',
        body: data
      }, (error) => {
        callback(error, data);
      });
    }
  })
  .use('/', feathers.static(`${__dirname}/..`));

app.listen(3000);

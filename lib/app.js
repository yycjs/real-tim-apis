import path from 'path';
import feathers from 'feathers';
import request from 'request';

const BASE = 'http://real-time-yycrb.herokuapp.com';
const app = feathers()
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .use('/polls', {
    find(params, callback) {
      request({
        url: `${BASE}/polls`,
        json: true
      }, (error, response, data) => {
        callback(error, data);
      });
    },

    get(id, params, callback) {
      request({
        url: `${BASE}/polls/${id}`,
        json: true
      }, (error, response, data) => {
        callback(error, data);
      });
    }
  })
  .use('/votes', {
    update(id, data, params, callback) {
      const url = `${BASE}/${data.poll}/${id};`
      request({
        url,
        body: {
          votes: data.votes
        },
        json: true
      }, (error, response, data) => {
        callback(error, data);
      });
    }
  })
  .use('/', feathers.static(path.join(__dirname, '..')));

app.listen(3000);

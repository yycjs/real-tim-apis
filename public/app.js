import $ from 'jquery';
import _ from 'lodash';

const socket = io.connect();

function updatePoll() {
  socket.emit('polls::get', 1, {}, (error, poll) => {
    let choices = _.sortBy(poll.choices, 'votes').reverse();
    let list = $('<ul>');
    choices.forEach(choice => {
      let li = $(`<li>
        ${choice.name} (${choice.votes}) <a class="upvote">Upvote</a>
      </li>`);
      li.data('choice', choice);
      list.append(li);
    });
    $('#main').html(list);
  });
}

socket.on('votes updated', updatePoll);

$(() => {
  $(document).on('click', 'li .upvote', function() {
    let choice = $(this).parent().data('choice');

    socket.emit('votes::update', choice.href, { votes: choice.votes + 1 }, {}, () => {
      console.log('Updated vote');
    });
  });

  updatePoll();
});

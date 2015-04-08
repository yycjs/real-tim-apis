import $ from 'jquery';
import _ from 'lodash';

const socket = io.connect();

function updatePoll() {
  $('.upvote').hide();
  socket.emit('polls::get', 2, {}, (error, poll) => {
    let choices = _.sortBy(poll.choices, 'votes').reverse();
    let list = $('<ul class="list-group">');
    choices.forEach(choice => {
      let li = $(`<li class="list-group-item">
        <span class="glyphicon glyphicon-triangle-top upvote"></span>
        ${choice.name}
        <span class="badge">${choice.votes}</span>
      </li>`);
      li.data('choice', choice);
      list.append(li);
    });
    $('#main').html(list);
    $('.upvote').show();
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

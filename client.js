(function() {
  if (window["WebSocket"]) {
    $(document).ready(function() {
      var animate, canvas, connect, context, id, sendDirection, server;
      server = null;
      canvas = $("#stage");
      context = canvas.get(0).getContext("2d");
      id = null;
      sendDirection = function(direction) {
        if (server) {
          return server.emit("direction", {
            'direction': direction
          });
        }
      };
      animate = function(snakes) {
        var element, snake, x, y, _i, _len, _results;
        context.fillStyle = 'rgb(230,230,230)';
        for (x = 0; x <= 49; x++) {
          for (y = 0; y <= 49; y++) {
            context.fillRect(x * 10, y * 10, 9, 9);
          }
        }
        _results = [];
        for (_i = 0, _len = snakes.length; _i < _len; _i++) {
          snake = snakes[_i];
          context.fillStyle = snake.color;
          $("#snake_" + snake.id).html(snake.name + ": Kills: " + snake.kills + " Deaths: " + snake.deaths);
          _results.push((function() {
            var _j, _len2, _ref, _results2;
            _ref = snake.elements;
            _results2 = [];
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              element = _ref[_j];
              x = element[0] * 10;
              y = element[1] * 10;
              _results2.push(context.fillRect(x, y, 9, 9));
            }
            return _results2;
          })());
        }
        return _results;
      };
      connect = function() {
        server =  io.connect("http://localhost", {
          'port': 5000
        });
//        server.on("id", function(event) {
//		id = event.value;
//	});
    server.on("snakeAdded", function(event) {
        snakeDiv = document.createElement( "div" )
        $(snakeDiv).attr('id', "snake_" + event.id);
        $("#scoreboard").append(snakeDiv);
    });

    server.on("snakeRemoved", function(event) {
        $("#snake_" + event.id ).remove();
    });

	server.on("snakes", function(event) {
		animate(event.value);
	});
      };
      connect();
  });
  } else {
    alert("Your browser does not support websockets.");
  }
}).call(this);

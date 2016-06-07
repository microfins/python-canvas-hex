$(function() {
    $('#newMapBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: '/createMap',
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                hex.clearMap();
                hex.init(response.props, response.map, true);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});


$(function() {
    $('#addPlayerBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: '/createMap',
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                hex.draw();
                hex.init(response.props, response.map);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function() {
    $('#endTurnBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: '/createMap',
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                hex.draw();
                hex.init(response.props, response.map);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function() {
    $('#endGameBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: '/createMap',
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                hex.draw();
                hex.init(response.props, response.map);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function() {
    $('#saveGameBtn').click(function() {
        $.ajax({
            type: 'POST',
            url: '/save',
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                console.log(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

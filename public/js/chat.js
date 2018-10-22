$(function() {
    //make connection
    var socket = io.connect('http://localhost:3000');

    var message = $("#message");
    var messages = $("#list");
    var send_button = $('#send');

    //Emit message
    send_button.click(function(){
        // console.log(message.val());
        socket.emit('chat', { message: message.val() });
    });

    //Listen on new_message
    // socket.on("new_message", (data) => {
    //     console.log(data);
    //     messages.append(
    //         "<li class='sent'><img src='http://emilcarlsson.se/assets/mikeross.png' alt='' /><p>What are you talking about? You do what they say or they shoot you.</p></li>"
    //     )
    // });

    message.on('keypress', () => {
        socket.emit('typing', 'User');
    });

    socket.on('typing', function(data) {
        console.log(' is typing');
    });

    socket.on('chat-recieved', function(data) {
        console.log(data);
        messages.append(
                    "<li class='sent'><img src='http://emilcarlsson.se/assets/mikeross.png' alt='' /><p>"+ data.message +"</p></li>"
                );
        message.val("");
    })

    //Listen on new_message
    socket.on("message", function(data) {
        console.log(data);
    })
})
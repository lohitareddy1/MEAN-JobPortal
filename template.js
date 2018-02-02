var engine = require('consolidate'),
express = require('express'),
app = express(),
socketio = require('socket.io');


app.engine('html', engine.nunjucks);// set the view engine
app.set('view engine', 'html');// tell which type of extension the views file will have
app.set('views', __dirname+'/views');

app.get('/', function(req, res){
    var username = "Marlabs";
    res.render('home',{"username": username});

})

var server = app.listen(8000, function(){
    console.log('Server running @ 8000');
})

var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
console.log('Socket connection established with the server');

socket.on('msg_to_server',function(data){
    socket.emit('msg_to_client', data);
});
});
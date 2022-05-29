var app = express();

var server = require("http").createServer(app);
var io = require('socket.io')(server);
io.on('connection',function(socket){
 
})
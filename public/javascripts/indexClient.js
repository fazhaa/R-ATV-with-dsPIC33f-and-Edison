/**
 * Created by Tim on 1/16/2017.
 */
var canvas = document.getElementById('canvas-video');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#333';
ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);
var client = new WebSocket('ws://' + document.domain + ':8084');
var player = new jsmpeg(client, { canvas:canvas });

var socket = io.connect();
var motorCalibrating = false;
var buttonClass = 'calibrate-button';

var options = {
    zone:document.getElementById("zone_joystick"),
    color:"blue",
    position:{
        top:'100px',
        left:'300px'
    },
    mode:'static'
};
var manager = nipplejs.create(options);

socket.on('calibrate finished', function(){
    document.getElementById("calibrateButton").classList.remove(buttonClass);
    buttonClass = 'calibrate-button';
    document.getElementById("calibrateButton").classList.add(buttonClass);
});

manager.on('added', function(evt, nipple){

});

manager.on('move', function(evt){

    var invertedX = manager[0].frontPosition.x * -1;
    var invertedY = manager[0].frontPosition.y * -1;
    socket.emit('new X', { newX: invertedX });
    socket.emit('new Y', { newY: invertedY });
    document.getElementById("xPos").innerHTML = "X position: " + manager[0].frontPosition.x;
    document.getElementById("yPos").innerHTML = "Y position: " + manager[0].frontPosition.y;

});

manager.on('end', function(evt){

    socket.emit('center X', {newX: 0});
    socket.emit('center Y', {newY: 0});
    document.getElementById("xPos").innerHTML = "X position: 0";
    document.getElementById("yPos").innerHTML = "Y position: 0";
});

function calibrateMotor() {
    document.getElementById("calibrateButton").classList.remove(buttonClass);
    buttonClass = 'calibrating-button';
    document.getElementById("calibrateButton").classList.add(buttonClass);
    socket.emit('calibrate motor');
}
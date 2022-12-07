const chatForm = document.getElementById('chat-form') ;
const chatMessage = document.querySelector('.chat-messages') ;
const roomName = document.getElementById('room-name') ;
const userList = document.getElementById('users') ;
  
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
}) ;

// console.log(username, room);
const socket = io();

// Join Chatroom
socket.emit('joinRoom',{username,room}) ;


// Get room and users

socket.on('roomUsers',({room,users}) => {
    outputRoomName(room) ;
    outputUsers(users) ;
});

// Message from server
socket.on('message',message => {
    console.log(message);
    outputMessage(message) ;

    // Scroll Down
    chatMessage.scrollTop = chatMessage.scrollHeight ;
}) ;

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault() ;

    const msg = e.target.elements.msg.value ;

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Cleat Input
    e.target.elements.msg.value = "" ;

    // Focus on the next message
    e.target.elements.msg.focus() ;
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message') ;
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>` ;
    document.querySelector('.chat-messages').appendChild(div) ;
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room ;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
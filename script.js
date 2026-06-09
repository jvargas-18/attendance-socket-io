import { io } from 'socket.io-client';

const socket = io('https://your-socketio-server.railway.app', {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('message', (data) => {
  console.log('Received:', data);
  const messages = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `Server: ${data}`;
    messages.appendChild(newMessage);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Socket.IO will automatically reconnect
});



document.getElementById('send').addEventListener('click', () => {
    const input = document.getElementById('message');
    socket.broadcast.emit('message', input.value);
});
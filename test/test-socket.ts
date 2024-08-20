
import { io, Socket } from 'socket.io-client';

let  socket = io('http://localhost:3000', {
	query: { token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkRFVkVMT1BNRU5UIiwiaWF0IjoxNzI0MDU3MTY1LCJleHAiOjE3MjUwOTM5NjV9.S0fNcGdD1df2QnO9av3r64FUflMj_R4evVLjr0RFvfE` }
});
socket.on('connect', () => {
	console.log('Connected');
	socket.emit('whoami', console.log)
});
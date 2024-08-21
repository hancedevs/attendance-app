
import { io, Socket } from 'socket.io-client';

const atoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkRFVkVMT1BNRU5UIiwiaWF0IjoxNzI0MDU3MTY1LCJleHAiOjE3MjUwOTM5NjV9.S0fNcGdD1df2QnO9av3r64FUflMj_R4evVLjr0RFvfE`
const btoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkRFVkVMT1BNRU5UIiwiaWF0IjoxNzI0MjIwNDQ0LCJleHAiOjE3MjUyNTcyNDR9.UbLAt-t8R4vgH7j4NY30pKmN4Dp2Ss0mF_J1GaGyWng'


const session = (token: string, cb: (s: Socket, user: any) => void) => {
	let socket = io('http://localhost:3000', {
		auth: { token }
	});
	socket.on('connect', () => {
		socket.emit('whoami', (user: { name: string }) => {
			console.log('Connected as', user.name);
			cb(socket, user);
			socket.on('user:online', (username) => console.log('User online', username));
			socket.on('user:offline', (username) => console.log('User offline', username));
		})
	});
	socket.on('disconnect', () => {
		process.exit();
	});
}

const connectB = () => session(
	btoken,
	(socket) => {
		socket.on('send-message', (message) => console.log('Sent message', message));
	}
) 

// As user 'a'
session(
	atoken,
	(socket) => {
		socket.on('user:online', (username) => {
			console.log('Sending to', username)
			socket.emit('send-message:private', {
				content: 'Hello',
				reciever: username
			});
		});
		connectB()
	}
)


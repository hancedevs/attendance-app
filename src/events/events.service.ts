import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { JwtPayloadInterface } from '@/auth/jwt-payload.interface';
import { JwtStrategy } from '@/auth/jwt.strategy';

@Injectable()
export class EventsService {

	constructor(
    private jwtService: JwtStrategy,
	){}

  onlineUsers: string[] = [];

	onModuleInit(){
		if(!global.onlineUsers) global.onlineUsers = [];
		this.onlineUsers = global.onlineUsers;
	}

	async verifyClient(client: Socket){
		const { token } = client.handshake.auth;
    
    if(token){
      return await new Promise((r) => {
				verify(token as string, process.env.JWT_SECRET, async (err, payload: JwtPayloadInterface) => {
					if(err){
						r(false);
						return client.disconnect();
					}
					let user = await this.jwtService.validate(payload);
					if(!user){
						r(false);
						return client.disconnect();
					}
					r(true);
					client.data.user = user;
				});
			});
    } else {
      client.disconnect();
			return false;
    }
	}

	addOnline(username: string){
		this.onlineUsers.push(username);
	}

	removeOnline(username: string){
		this.onlineUsers.splice(
      this.onlineUsers.indexOf(username),
      1
    );
	}

}

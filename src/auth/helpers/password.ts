import { hash, compare } from 'bcrypt';

export async function encryptPass(pass: string){
    return await hash(pass, 10);
}

export async function comparePass(pass: string, hash: string){
    console.log('===> COMPARE():', pass, '(TO)', hash);
    return await compare(pass, hash.toString());
}

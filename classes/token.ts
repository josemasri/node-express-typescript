import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = 'qXW6ibD@ETTj33poANLCHhXQVJ^Dv!76XoRX';
    private static caducidad: string = '30d';
    constructor() {
    }
    static getJWTToken(payload: any): string {
        return jwt.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarToken(userToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

    }
}
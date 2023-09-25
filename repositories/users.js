const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);


class UsersRepository extends Repository {
    async create(attrs) {

        // attrs is always: {email: '', password: ''}


        // add random id to record:

        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        //{email: vvv, password: jfjf} 
        // load the file so we have latest
        const records = await this.getAll();

        const record = {
            ...attrs, 
            password: `${buf.toString('hex')}.${salt}` 
        };

        records.push(record);

        // write the array back to hard drive as json this.filename
        await this.writeAll(records);

        return record;
    } 
    async comparePasswords(saved, supplied) {
        // Saved - password saved in our database. 'hashed.salt'
        //Suppplied - password from a user trying to sign in

        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];

        const [hashed, salt] = saved.split('.');

        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }
}

module.exports = new UsersRepository('users.json');
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/invariantError');
const AuthenticationsError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'insert into users values($1, $2, $3, $4) returning id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'select username from users where username = $1 ',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'select id, password from users where username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].length) {
      throw new AuthenticationsError('Kredensial yang anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationsError('Password salah');
    }

    return id;
  }
}

module.exports = UsersService;

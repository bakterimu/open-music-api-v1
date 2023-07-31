require('dotenv').config();
const Hapi = require('@hapi/hapi');

const users = require('./api/users');
const UsersService = require('./services/users/UsersService');
const UsersValidator = require('./validator/users');
// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/albums/AlbumsService');
const AlbumValidator = require('./validator/albums');
// songs
const songs = require('./api/songs');
const SongsService = require('./services/songs/SongsService');
const SongsValidator = require('./validator/songs');
// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/authentications/AuthenticationsService');
const TokenManager = require('./token/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
// error
const ClientError = require('./exceptions/clientError');

const start = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penangan client error secara internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // penangan client error dari native hapi seperti 404
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kesalahan pada server.',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error maka lanjut
    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();

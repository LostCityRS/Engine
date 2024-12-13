import path from 'path';

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';

import ejs from 'ejs';

import World from '#/engine/World.ts';
import TcpServer from '#/server/TcpServer.ts';

import Packet from '#/io/Packet.ts';

const slr = Packet.alloc(5000);
slr.p4(0);
const start = slr.pos;

slr.p2(1); // count

const worldId = 1;
const members = true;
const country = 0;

slr.p2((worldId & 0x7FFF) | (members ? 0x8000 : 0));
slr.pjstr('127.0.0.1');
slr.p1(country);
slr.p2(0); // player count

slr.psize4(slr.pos - start);

await World.load();

const server = new TcpServer();
server.start(40001);

// ----

const fastify = Fastify({
    logger: true
});

fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),

    setHeaders: (res, path, stat) => {
        if (path.endsWith('.ws')) {
            res.setHeader('content-type', 'text/html');
        }
    }
});

fastify.register(fastifyView, {
    root: path.join(process.cwd(), 'view'),

    engine: {
        ejs
    }
});

// ----

fastify.get('/', (req, reply) => {
    reply.view('applet.ejs');
});

fastify.get('/slr.ws', (req, reply) => {
    reply.header('content-type', 'application/octet-stream');
    reply.send(slr.data.subarray(0, slr.pos));
});

fastify.get('/error_game_alreadyloaded.ws', (req, reply) => {
    reply.view('error_game_alreadyloaded.ejs');
});

fastify.get('/error_game_crash.ws', (req, reply) => {
    reply.view('error_game_crash.ejs');
});

fastify.get('/error_game_invalidhost.ws', (req, reply) => {
    reply.view('error_game_invalidhost.ejs');
});

fastify.get('/error_game_js5connect_full.ws', (req, reply) => {
    reply.view('error_game_js5connect_full.ejs');
});

fastify.get('/error_game_js5connect_outofdate.ws', (req, reply) => {
    reply.view('error_game_js5connect_outofdate.ejs');
});

fastify.get('/error_game_js5connect.ws', (req, reply) => {
    reply.view('error_game_js5connect.ejs');
});

fastify.get('/error_game_js5crc.ws', (req, reply) => {
    reply.view('error_game_js5crc.ejs');
});

fastify.get('/error_game_js5io.ws', (req, reply) => {
    reply.view('error_game_js5io.ejs');
});

fastify.get('/error_game_wrongjava.ws', (req, reply) => {
    reply.view('error_game_wrongjava.ejs');
});

fastify.get('/clienterror.ws', (req, reply) => {
    console.log(req.query);

    reply.send('');
});

// ----

await fastify.listen({
    host: '0.0.0.0',
    port: 7001
});

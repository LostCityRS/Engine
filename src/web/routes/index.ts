import ServerList from '#/engine/ServerList.ts';

export default async function (f: any, opts: any) {
    f.get('/', (req: any, reply: any) => {
        reply.view('applet.ejs');
    });

    f.get('/slr.ws', (req: any, reply: any) => {
        reply.header('content-type', 'application/octet-stream');
        reply.send(ServerList.response);
    });

    f.get('/error_game_alreadyloaded.ws', (req: any, reply: any) => {
        reply.view('error_game_alreadyloaded.ejs');
    });

    f.get('/error_game_crash.ws', (req: any, reply: any) => {
        reply.view('error_game_crash.ejs');
    });

    f.get('/error_game_invalidhost.ws', (req: any, reply: any) => {
        reply.view('error_game_invalidhost.ejs');
    });

    f.get('/error_game_js5connect_full.ws', (req: any, reply: any) => {
        reply.view('error_game_js5connect_full.ejs');
    });

    f.get('/error_game_js5connect_outofdate.ws', (req: any, reply: any) => {
        reply.view('error_game_js5connect_outofdate.ejs');
    });

    f.get('/error_game_js5connect.ws', (req: any, reply: any) => {
        reply.view('error_game_js5connect.ejs');
    });

    f.get('/error_game_js5crc.ws', (req: any, reply: any) => {
        reply.view('error_game_js5crc.ejs');
    });

    f.get('/error_game_js5io.ws', (req: any, reply: any) => {
        reply.view('error_game_js5io.ejs');
    });

    f.get('/error_game_wrongjava.ws', (req: any, reply: any) => {
        reply.view('error_game_wrongjava.ejs');
    });

    f.get('/clienterror.ws', (req: any, reply: any) => {
        console.log(req.query);

        reply.send('');
    });
}

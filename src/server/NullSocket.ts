import ClientSocket from '#/server/ClientSocket.ts';

export default class NullSocket extends ClientSocket {
    write() {
    }

    close() {
    }

    terminate() {
    }
}

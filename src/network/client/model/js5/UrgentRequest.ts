import ClientMessage from '#/network/client/ClientMessage.ts';

export default class UrgentRequest extends ClientMessage {
    archive: number;
    group: number;

    constructor(archive: number, group: number) {
        super();

        this.archive = archive;
        this.group = group;
    }
}

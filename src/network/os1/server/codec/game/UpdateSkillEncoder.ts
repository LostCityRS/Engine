import type Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

import type UpdateSkill from '#/network/server/model/game/UpdateSkill.ts';

export default class UpdateSkillEncoder extends MessageEncoder {
    opcode = 208;
    size = 6;

    write(buf: Packet, message: UpdateSkill) {
        buf.p1_alt1(message.level);
        buf.p1_alt1(message.id);
        buf.p4(message.experience)
    }
}

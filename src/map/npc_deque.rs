use std::collections::VecDeque;
use crate::game::Npc;
use crate::map::{ZoneMap};

pub struct NpcDeque {
    queue: VecDeque<Npc>
}

impl NpcDeque {
    pub fn new() -> NpcDeque {
        return NpcDeque {
            queue: VecDeque::new()
        }
    }

    pub fn push_back(&mut self, npc: Npc) {
        self.queue.push_back(npc);
    }

    pub fn pop_queue(&mut self, zone_map: &mut ZoneMap) {
        self.queue.iter().for_each(|npc| zone_map.zone(npc.base.x, npc.base.z, npc.base.y).add_npc(npc));
        self.queue.clear();
    }
}
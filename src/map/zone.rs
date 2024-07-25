use std::collections::HashSet;
use crate::game::{Loc, Npc, Obj, Player};

pub struct Zone {
    pub index: i32,
    pub players: HashSet<i32>,
    pub npcs: HashSet<i32>,
    pub total_locs: i32,
    pub total_objs: i32
}

impl Zone {
    pub fn new(index: i32) -> Zone {
        Zone {
            index,
            players: HashSet::new(),
            npcs: HashSet::new(),
            total_locs: 0,
            total_objs: 0
        }
    }

    pub fn add_npc(&mut self, npc: &Npc) {
        self.npcs.insert(npc.nid);
    }

    pub fn del_npc(&mut self, npc: &Npc) {
        self.npcs.remove(&npc.nid);
    }

    pub fn add_player(&mut self, player: &Player) {
        self.players.insert(player.uid);
    }

    pub fn del_player(&mut self, player: &Player) {
        self.players.remove(&player.uid);
    }

    pub fn add_static_obj(&mut self, obj: Obj) {
        self.total_objs += 1;
    }

    pub fn add_static_loc(&mut self, loc: Loc) {
        self.total_locs += 1;
    }
}
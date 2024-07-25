use std::collections::VecDeque;
use crate::game::Player;
use crate::map::{ZoneMap};

pub struct PlayerDeque {
    queue: VecDeque<Player>
}

impl PlayerDeque {
    pub fn new() -> PlayerDeque {
        return PlayerDeque {
            queue: VecDeque::new()
        }
    }

    pub fn push_back(&mut self, player: Player) {
        self.queue.push_back(player);
    }

    pub fn pop_queue(&mut self, zone_map: &mut ZoneMap) {
        self.queue.iter().for_each(|player| zone_map.zone(player.base.x, player.base.z, player.base.y).add_player(player));
        self.queue.clear();
    }
}
use std::thread::sleep;
use std::time::{Duration, Instant};
use crate::game::world_stat::WorldStat;
use crate::map::{GameMap, NpcDeque, Zone, ZoneGrid, ZoneMap};
use crate::rsmod::RSMod;

pub struct World {
    pub current_tick: i32,
    pub tick_rate: Duration,
    pub rsmod: RSMod,
    pub game_map: GameMap,
    pub zone_map: ZoneMap,
    pub npc_loader: NpcDeque,
    pub stats: Vec<Duration>,
    pub last_stats: Vec<Duration>
}

impl World {
    pub fn new() -> World {
        return World {
            current_tick: 0,
            tick_rate: Duration::from_millis(600),
            rsmod: RSMod::new(),
            game_map: GameMap::new(),
            zone_map: ZoneMap::new(),
            npc_loader: NpcDeque::new(),
            stats: vec![Duration::new(0, 0); 12],
            last_stats: vec![Duration::new(0, 0); 12]
        }
    }

    pub fn start(&mut self, skip_maps: bool, start_cycle: bool) {
        println!("Starting world...");

        if !skip_maps {
            self.game_map.init("data/pack/server/maps/", &mut self.rsmod, &mut self.zone_map, &mut self.npc_loader)
        }

        println!("World ready");

        if start_cycle {
            self.cycle(true);
        }
    }

    pub fn cycle(&mut self, continue_cycle: bool) {
        let start: Instant = Instant::now();

        // world processing
        // - world queue
        // - calculate afk event readiness
        // - npc spawn scripts
        // - npc hunt
        self.process_world();

        // client input
        // - decode packets
        // - process pathfinding/following
        self.process_in();

        // npc processing (if npc is not busy)
        // - resume suspended script
        // - stat regen
        // - timer
        // - queue
        // - movement
        // - modes
        self.process_npcs();

        // player processing
        // - resume suspended script
        // - primary queue
        // - weak queue
        // - timers
        // - soft timers
        // - engine queue
        // - interactions
        // - movement
        // - close interface if attempting to logout
        self.process_players();

        // player logout
        self.process_logouts();

        // player login, good spot for it (before packets so they immediately load but after processing so nothing hits them)
        self.process_logins();

        // process zones
        // - build list of active zones around players
        // - loc/obj despawn/respawn
        // - compute shared buffer
        self.process_zones();

        // process movement directions
        // - convert player movements
        // - convert npc movements
        self.process_movement_dirs();

        // client output
        // - map update
        // - player info
        // - npc info
        // - zone updates
        // - inv changes
        // - stat changes
        // - afk zones changes
        // - flush packets
        self.process_out();

        // cleanup
        // - reset zones
        // - reset players
        // - reset npcs
        // - reset invs
        self.process_cleanup();

        // cycle the world now
        self.current_tick += 1;
        self.stats[WorldStat::Cycle as usize] = Instant::now() - start;

        // update stats
        self.last_stats[WorldStat::Cycle as usize] = self.stats[WorldStat::Cycle as usize];
        self.last_stats[WorldStat::World as usize] = self.stats[WorldStat::World as usize];
        self.last_stats[WorldStat::ClientsIn as usize] = self.stats[WorldStat::ClientsIn as usize];
        self.last_stats[WorldStat::Npcs as usize] = self.stats[WorldStat::Npcs as usize];
        self.last_stats[WorldStat::Players as usize] = self.stats[WorldStat::Players as usize];
        self.last_stats[WorldStat::Logouts as usize] = self.stats[WorldStat::Logouts as usize];
        self.last_stats[WorldStat::Logins as usize] = self.stats[WorldStat::Logins as usize];
        self.last_stats[WorldStat::Zones as usize] = self.stats[WorldStat::Zones as usize];
        self.last_stats[WorldStat::ClientsOut as usize] = self.stats[WorldStat::ClientsOut as usize];
        self.last_stats[WorldStat::Cleanup as usize] = self.stats[WorldStat::Cleanup as usize];
        self.last_stats[WorldStat::BandwidthIn as usize] = self.stats[WorldStat::BandwidthIn as usize];
        self.last_stats[WorldStat::BandwidthOut as usize] = self.stats[WorldStat::BandwidthOut as usize];

        println!("tick {} took {:?}", self.current_tick, self.stats[WorldStat::Cycle as usize]);
        println!("----");

        if continue_cycle {
            sleep(self.tick_rate - self.stats[WorldStat::Cycle as usize]);
            return self.cycle(continue_cycle);
        }
    }

    // - world queue
    // - calculate afk event readiness
    // - npc spawn scripts
    // - npc hunt
    fn process_world(&mut self) {
        let start: Instant = Instant::now();
        self.npc_loader.pop_queue(&mut self.zone_map);
        // TODO
        self.stats[WorldStat::World as usize] = Instant::now() - start
    }

    // - decode packets
    // - process pathfinding/following
    fn process_in(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::ClientsIn as usize] = Instant::now() - start
    }

    // - resume suspended script
    // - stat regen
    // - timer
    // - queue
    // - movement
    // - modes
    fn process_npcs(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Npcs as usize] = Instant::now() - start
    }

    // - resume suspended script
    // - primary queue
    // - weak queue
    // - timers
    // - soft timers
    // - engine queue
    // - interactions
    // - movement
    // - close interface if attempting to logout
    fn process_players(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Players as usize] = Instant::now() - start
    }

    fn process_logouts(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Logouts as usize] = Instant::now() - start
    }

    fn process_logins(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Logins as usize] = Instant::now() - start
    }

    // - build list of active zones around players
    // - loc/obj despawn/respawn
    // - compute shared buffer
    fn process_zones(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Zones as usize] = Instant::now() - start
    }

    // - convert player movements
    // - convert npc movements
    fn process_movement_dirs(&self) {
        // TODO: benchmark this?
        // TODO
    }

    // - map update
    // - player info
    // - npc info
    // - zone updates
    // - inv changes
    // - stat changes
    // - afk zones changes
    // - flush packets
    fn process_out(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::ClientsOut as usize] = Instant::now() - start
    }

    // - reset zones
    // - reset players
    // - reset npcs
    // - reset invs
    fn process_cleanup(&mut self) {
        let start: Instant = Instant::now();
        // TODO
        self.stats[WorldStat::Cleanup as usize] = Instant::now() - start
    }
}

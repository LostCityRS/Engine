use std::fs;
use std::time::Instant;
use crate::io::Packet;
use crate::map::zone_map::ZoneMap;
use crate::rsmod::{LocAngle, LocLayer, RSMod};

pub struct GameMap;

impl GameMap {
    const OPEN: u8 = 0x0;
    const BLOCKED: u8 = 0x1;
    const BRIDGE: u8 = 0x2;
    const ROOF: u8 = 0x4;
    const WALL: u8 = 0x8;
    const LOWMEMORY: u8 = 0x10;

    const X: u8 = 64;
    const Y: u8 = 4;
    const Z: u8 = 64;

    const MAPSQUARE: usize = (GameMap::X as u16 * GameMap::Y as u16 * GameMap::Z as u16) as usize;

    #[inline(always)]
    fn pack(x: u8, z: u8, y: u8) -> usize {
        return ((z as u16 & 0x3f) | ((x as u16 & 0x3f) << 6) | ((y as u16 & 0x3) << 12)) as usize;
    }

    #[inline(always)]
    fn x(packed: u16) -> u8 {
        return ((packed >> 6) & 0x3f) as u8;
    }

    #[inline(always)]
    fn y(packed: u16) -> u8 {
        return ((packed >> 12) & 0x3f) as u8;
    }

    #[inline(always)]
    fn z(packed: u16) -> u8 {
        return (packed & 0x3f) as u8;
    }

    pub fn init(&self, path: &str, rsmod: &mut RSMod, zone_map: &ZoneMap) {
        println!("Loading game map...");
        let start: Instant = Instant::now();
        let maps: Vec<String> = fs::read_dir(path)
            .expect("Unable to read directory")
            .filter_map(|entry| {
                let entry = entry.ok()?;
                let file_name = entry.file_name().into_string().ok()?;
                if file_name.starts_with('m') {
                    Some(file_name)
                } else {
                    None
                }
            })
            .collect();

        for map in maps {
            let pos: Vec<u8> = map[1..]
                .split('_')
                .filter_map(|s| s.parse().ok())
                .collect();

            if pos.len() != 2 {
                continue;
            }

            let (mx, mz) = (pos[0], pos[1]);
            let mapsquare_x: u16 = (mx << 6) as u16;
            let mapsquare_z: u16 = (mz << 6) as u16;

            self.npcs(Packet::load(format!("{}n{}_{}", path, mx, mz)), mapsquare_x, mapsquare_z);
            self.objs(Packet::load(format!("{}o{}_{}", path, mx, mz)), mapsquare_x, mapsquare_z, zone_map);
            let mut lands: Vec<u8> = vec![0; GameMap::MAPSQUARE];
            self.lands(rsmod, &mut lands, Packet::load(format!("{}m{}_{}", path, mx, mz)), mapsquare_x, mapsquare_z);
            self.locs(rsmod, &mut lands, Packet::load(format!("{}l{}_{}", path, mx, mz)), mapsquare_x, mapsquare_z, zone_map);
        }

        println!("Loaded game map in: {:?}", Instant::now() - start);
    }

    pub fn change_land(&self, rsmod: &mut RSMod, x: i32, z: i32, y: u8, add: bool) {
        rsmod.change_floor(x, z, y, add);
    }

    pub fn change_loc(&self, rsmod: &mut RSMod, shape: u8, angle: u8, blockrange: bool, length: u8, width: u8, active: i32, x: i32, z: i32, y: u8, add: bool) {
        match rsmod.loc_layer(shape) {
            LocLayer::Wall => rsmod.change_wall(x, z, y, angle, shape, blockrange, false, add),
            LocLayer::WallDecor => {} // do nothing
            LocLayer::Ground => {
                match LocAngle::try_from(angle) {
                    Ok(angle) => {
                        match angle {
                            LocAngle::North | LocAngle::South => rsmod.change_loc(x, z, y, length, width, blockrange, false, add),
                            LocAngle::West | LocAngle::East => rsmod.change_loc(x, z, y, width, length, blockrange, false, add),
                        }
                    }
                    Err(str) => panic!("{}", str)
                }
            }
            LocLayer::GroundDecor => {
                if active == 1 {
                    rsmod.change_floor(x, z, y, add);
                }
            }
        }
    }

    pub fn change_npc(&self, rsmod: &mut RSMod, x: i32, z: i32, y: u8, size: u8, add: bool) {
        rsmod.change_npc(x, z, y, size, add);
    }

    pub fn change_player(&self, rsmod: &mut RSMod, x: i32, z: i32, y: u8, size: u8, add: bool) {
        rsmod.change_player(x, z, y, size, add);
    }

    pub fn change_roof(&self, rsmod: &mut RSMod, x: i32, z: i32, y: u8, add: bool) {
        rsmod.change_roof(x, z, y, add);
    }

    fn npcs(&self, mut packet: Packet, mapsquare_x: u16, mapsquare_z: u16) {
        while packet.avail() > 0 {
            let packed: u16 = packet.g2();
            let x: u16 = mapsquare_x + GameMap::x(packed) as u16;
            let z: u16 = mapsquare_z + GameMap::z(packed) as u16;
            let y: u8 = GameMap::y(packed);
            let count: u8 = packet.g1();
            for _index in 0..count {
                let npc_type: u16 = packet.g2();
            }
        }
    }

    fn objs(&self, mut packet: Packet, mapsquare_x: u16, mapsquare_z: u16, zone_map: &ZoneMap) {
        while packet.avail() > 0 {
            let packed: u16 = packet.g2();
            let x: u16 = mapsquare_x + GameMap::x(packed) as u16;
            let z: u16 = mapsquare_z + GameMap::z(packed) as u16;
            let y: u8 = GameMap::y(packed);
            let count: u8 = packet.g1();
            for _index in 0..count {
                let obj_type: u16 = packet.g2();
                let obj_count: u8 = packet.g1();
            }
        }
    }

    fn lands(&self, rsmod: &mut RSMod, lands: &mut Vec<u8>, mut packet: Packet, mapsquare_x: u16, mapsquare_z: u16) {
        for y in 0..GameMap::Y {
            for x in 0..GameMap::X {
                for z in 0..GameMap::Z {
                    loop {
                        let code: i32 = packet.g1() as i32;
                        if code == 0 {
                            break;
                        } else if code == 1 {
                            packet.pos += 1;
                            break;
                        }

                        if code <= 47 {
                            packet.pos += 1;
                        } else if code <= 81 {
                            lands[GameMap::pack(x, z, y)] = (code - 49) as u8;
                        }
                    }
                }
            }
        }
        for y in 0..GameMap::Y {
            for x in 0..GameMap::X {
                let abs_x: i32 = (x as u16 + mapsquare_x) as i32;
                for z in 0..GameMap::Z {
                    let abs_z: i32 = (z as u16 + mapsquare_z) as i32;
                    if x % 7 == 0 && z % 7 == 0 {
                        rsmod.collision_flag_map.allocate_if_absent(abs_x, abs_z, y);
                    }

                    let land = lands[GameMap::pack(x, z, y)];

                    if land & GameMap::ROOF != GameMap::OPEN {
                        self.change_roof(rsmod, abs_x, abs_z, y, true);
                    }

                    if land & GameMap::BLOCKED != GameMap::BLOCKED {
                        continue;
                    }

                    let bridged: bool = if y == 1 { land & GameMap::BRIDGE } else { lands[GameMap::pack(x, z, 1)] & GameMap::BRIDGE } == GameMap::BRIDGE;
                    let abs_y: i8 = if bridged {y as i8 - 1} else {y as i8};
                    if abs_y < 0 {
                        continue;
                    }
                    self.change_land(rsmod, abs_x, abs_z, abs_y as u8, true);
                }
            }
        }
    }

    fn locs(&self, rsmod: &mut RSMod, lands: &mut Vec<u8>, mut packet: Packet, mapsquare_x: u16, mapsquare_z: u16, zone_map: &ZoneMap) {
        let mut loc_id: i32 = -1;

        loop {
            let delta = packet.gsmart();
            if delta == 0 {
                break;
            }

            loc_id += delta;

            let mut loc_pos: u16 = 0;
            loop {
                let delta_pos: u16 = packet.gsmart() as u16;
                if delta_pos == 0 {
                    break;
                }

                loc_pos += delta_pos - 1;
                let x: u8 = GameMap::x(loc_pos);
                let y: u8 = GameMap::y(loc_pos);
                let z: u8 = GameMap::z(loc_pos);

                let info: u8 = packet.g1();

                let bridged: bool = if y == 1 { lands[loc_pos as usize] & GameMap::BRIDGE } else { lands[GameMap::pack(x, z, 1)] & GameMap::BRIDGE } == GameMap::BRIDGE;
                let abs_y: i8 = if bridged {y as i8 - 1} else {y as i8};
                if abs_y < 0 {
                    continue;
                }

                let shape: u8 = info >> 2;
                let angle: u8 = info & 0x3;

                let abs_x: i32 = (x as u16 + mapsquare_x) as i32;
                let abs_z: i32 = (z as u16 + mapsquare_z) as i32;

                self.change_loc(rsmod, shape, angle, false, 1, 1, 1, abs_x, abs_z, abs_y as u8, true);
            }
        }
    }
}

use crate::rsmod::{CollisionFlag, CollisionFlagMap, LocAngle, LocLayer, LocShape};

pub struct RSMod {
    pub collision_flag_map: CollisionFlagMap
}

impl RSMod {
    pub fn new() -> RSMod {
        return RSMod {
            collision_flag_map: CollisionFlagMap::new()
        }
    }

    pub fn change_floor(&mut self, x: i32, z: i32, y: u8, add: bool) {
        if add {
            self.collision_flag_map.add(x, z, y, CollisionFlag::Floor as u32);
        } else {
            self.collision_flag_map.remove(x, z, y, CollisionFlag::Floor as u32);
        }
    }

    pub fn change_loc(&mut self, x: i32, z: i32, y: u8, width: u8, length: u8, blockrange: bool, breakroutefinding: bool, add: bool) {
        let mut mask: u32 = CollisionFlag::Loc as u32;
        if blockrange {
            mask |= CollisionFlag::LocProjBlocker as u32;
        }
        if breakroutefinding {
            mask |= CollisionFlag::LocRouteBlocker as u32;
        }
        for index in 0..width*length {
            let dx = x + (index % width) as i32;
            let dz = z + (index / width) as i32;
            if add {
                self.collision_flag_map.add(dx, dz, y, mask);
            } else {
                self.collision_flag_map.remove(dx, dz, y, mask);
            }
        }
    }

    pub fn change_npc(&mut self, x: i32, z: i32, y: u8, size: u8, add: bool) {
        let mask: u32 = CollisionFlag::Npc as u32;
        for index in 0..size*size {
            let dx = x + (index % size) as i32;
            let dz = z + (index / size) as i32;
            if add {
                self.collision_flag_map.add(dx, dz, y, mask);
            } else {
                self.collision_flag_map.remove(dx, dz, y, mask);
            }
        }
    }

    pub fn change_player(&mut self, x: i32, z: i32, y: u8, size: u8, add: bool) {
        let mask: u32 = CollisionFlag::Player as u32;
        for index in 0..size*size {
            let dx = x + (index % size) as i32;
            let dz = z + (index / size) as i32;
            if add {
                self.collision_flag_map.add(dx, dz, y, mask);
            } else {
                self.collision_flag_map.remove(dx, dz, y, mask);
            }
        }
    }

    pub fn change_roof(&mut self, x: i32, z: i32, y: u8, add: bool) {
        let mask: u32 = CollisionFlag::Roof as u32;
        if add {
            self.collision_flag_map.add(x, z, y, mask);
        } else {
            self.collision_flag_map.remove(x, z, y, mask);
        }
    }

    pub fn change_wall(&mut self, x: i32, z: i32, y: u8, angle: u8, shape: u8, blockrange: bool, breakroutefinding: bool, add: bool) {
        match LocShape::try_from(shape) {
            Ok(shape) => {
                match shape {
                    LocShape::WallStraight => self.change_wall_straight(x, z, y, angle, blockrange, breakroutefinding, add),
                    LocShape::WallDiagonalCorner | LocShape::WallSquareCorner => self.change_wall_corner(x, z, y, angle, blockrange, breakroutefinding, add),
                    LocShape::WallL => self.change_wall_l(x, z, y, angle, blockrange, breakroutefinding, add),
                    _ => {} // do nothing
                }
            }
            Err(str) => panic!("{}", str)
        }
    }

    pub fn loc_layer(&self, shape: u8) -> LocLayer {
        match LocShape::try_from(shape).unwrap_or(LocShape::CentrepieceStraight) {
            LocShape::WallStraight
            | LocShape::WallDiagonalCorner
            | LocShape::WallL
            | LocShape::WallSquareCorner => LocLayer::Wall,

            LocShape::WalldecorStraightNooffset
            | LocShape::WalldecorStraightOffset
            | LocShape::WalldecorDiagonalOffset
            | LocShape::WalldecorDiagonalNooffset
            | LocShape::WalldecorDiagonalBoth => LocLayer::WallDecor,

            LocShape::WallDiagonal
            | LocShape::CentrepieceStraight
            | LocShape::CentrepieceDiagonal
            | LocShape::RoofStraight
            | LocShape::RoofDiagonalWithRoofedge
            | LocShape::RoofDiagonal
            | LocShape::RoofLConcave
            | LocShape::RoofLConvex
            | LocShape::RoofFlat
            | LocShape::RoofedgeStraight
            | LocShape::RoofedgeDiagonalCorner
            | LocShape::RoofedgeL
            | LocShape::RoofedgeSquareCorner => LocLayer::Ground,

            LocShape::GroundDecor => LocLayer::GroundDecor
        }
    }

    fn change_wall_straight(&mut self, x: i32, z: i32, y: u8, angle: u8, blockrange: bool, breakroutefinding: bool, add: bool) {
        let west: u32 = if breakroutefinding { CollisionFlag::WallWestRouteBlocker as u32 } else if blockrange { CollisionFlag::WallWestProjBlocker as u32 } else { CollisionFlag::WallWest as u32 };
        let east: u32 = if breakroutefinding { CollisionFlag::WallEastRouteBlocker as u32 } else if blockrange { CollisionFlag::WallEastProjBlocker as u32 } else { CollisionFlag::WallEast as u32 };
        let north: u32 = if breakroutefinding { CollisionFlag::WallNorthRouteBlocker as u32 } else if blockrange { CollisionFlag::WallNorthProjBlocker as u32 } else { CollisionFlag::WallNorth as u32 };
        let south: u32 = if breakroutefinding { CollisionFlag::WallSouthRouteBlocker as u32 } else if blockrange { CollisionFlag::WallSouthProjBlocker as u32 } else { CollisionFlag::WallSouth as u32 };

        match LocAngle::try_from(angle) {
            Ok(angle) => {
                match angle {
                    LocAngle::West => {
                        if add {
                            self.collision_flag_map.add(x, z, y, west);
                            self.collision_flag_map.add(x - 1, z, y, east);
                        } else {
                            self.collision_flag_map.remove(x, z, y, west);
                            self.collision_flag_map.remove(x - 1, z, y, east);
                        }
                    }
                    LocAngle::North => {
                        if add {
                            self.collision_flag_map.add(x, z, y, north);
                            self.collision_flag_map.add(x, z + 1, y, south);
                        } else {
                            self.collision_flag_map.remove(x, z, y, north);
                            self.collision_flag_map.remove(x, z + 1, y, south);
                        }
                    }
                    LocAngle::East => {
                        if add {
                            self.collision_flag_map.add(x, z, y, east);
                            self.collision_flag_map.add(x + 1, z, y, west);
                        } else {
                            self.collision_flag_map.remove(x, z, y, east);
                            self.collision_flag_map.remove(x + 1, z, y, west);
                        }
                    }
                    LocAngle::South => {
                        if add {
                            self.collision_flag_map.add(x, z, y, south);
                            self.collision_flag_map.add(x, z - 1, y, north);
                        } else {
                            self.collision_flag_map.remove(x, z, y, south);
                            self.collision_flag_map.remove(x, z - 1, y, north);
                        }
                    }
                }
                if breakroutefinding {
                    return self.change_wall_straight(x, z, y, angle as u8, blockrange, false, add);
                }
                if blockrange {
                    return self.change_wall_straight(x, z, y, angle as u8, false, false, add);
                }
            }
            Err(str) => panic!("{}", str)
        }
    }

    fn change_wall_corner(&mut self, x: i32, z: i32, y: u8, angle: u8, blockrange: bool, breakroutefinding: bool, add: bool) {
        let north_west: u32 = if breakroutefinding { CollisionFlag::WallNorthWestRouteBlocker as u32 } else if blockrange { CollisionFlag::WallNorthWestProjBlocker as u32 } else { CollisionFlag::WallNorthWest as u32 };
        let south_east: u32 = if breakroutefinding { CollisionFlag::WallSouthEastRouteBlocker as u32 } else if blockrange { CollisionFlag::WallSouthEastProjBlocker as u32 } else { CollisionFlag::WallSouthEast as u32 };
        let north_east: u32 = if breakroutefinding { CollisionFlag::WallNorthEastRouteBlocker as u32 } else if blockrange { CollisionFlag::WallNorthEastProjBlocker as u32 } else { CollisionFlag::WallNorthEast as u32 };
        let south_west: u32 = if breakroutefinding { CollisionFlag::WallSouthWestRouteBlocker as u32 } else if blockrange { CollisionFlag::WallSouthWestProjBlocker as u32 } else { CollisionFlag::WallSouthWest as u32 };

        match LocAngle::try_from(angle) {
            Ok(angle) => {
                match angle {
                    LocAngle::West => {
                        if add {
                            self.collision_flag_map.add(x, z, y, north_west);
                            self.collision_flag_map.add(x - 1, z + 1, y, south_east);
                        } else {
                            self.collision_flag_map.remove(x, z, y, north_west);
                            self.collision_flag_map.remove(x - 1, z + 1, y, south_east);
                        }
                    }
                    LocAngle::North => {
                        if add {
                            self.collision_flag_map.add(x, z, y, north_east);
                            self.collision_flag_map.add(x + 1, z + 1, y, south_west);
                        } else {
                            self.collision_flag_map.remove(x, z, y, north_east);
                            self.collision_flag_map.remove(x + 1, z + 1, y, south_west);
                        }
                    }
                    LocAngle::East => {
                        if add {
                            self.collision_flag_map.add(x, z, y, south_east);
                            self.collision_flag_map.add(x + 1, z - 1, y, north_west);
                        } else {
                            self.collision_flag_map.remove(x, z, y, south_east);
                            self.collision_flag_map.remove(x + 1, z - 1, y, north_west);
                        }
                    }
                    LocAngle::South => {
                        if add {
                            self.collision_flag_map.add(x, z, y, south_west);
                            self.collision_flag_map.add(x - 1, z - 1, y, north_east);
                        } else {
                            self.collision_flag_map.remove(x, z, y, south_west);
                            self.collision_flag_map.remove(x - 1, z - 1, y, north_east);
                        }
                    }
                }
                if breakroutefinding {
                    return self.change_wall_corner(x, z, y, angle as u8, blockrange, false, add);
                }
                if blockrange {
                    return self.change_wall_corner(x, z, y, angle as u8, false, false, add);
                }
            }
            Err(str) => panic!("{}", str)
        }
    }

    fn change_wall_l(&mut self, x: i32, z: i32, y: u8, angle: u8, blockrange: bool, breakroutefinding: bool, add: bool) {
        let west: u32 = if breakroutefinding { CollisionFlag::WallWestRouteBlocker as u32 } else if blockrange { CollisionFlag::WallWestProjBlocker as u32 } else { CollisionFlag::WallWest as u32 };
        let east: u32 = if breakroutefinding { CollisionFlag::WallEastRouteBlocker as u32 } else if blockrange { CollisionFlag::WallEastProjBlocker as u32 } else { CollisionFlag::WallEast as u32 };
        let north: u32 = if breakroutefinding { CollisionFlag::WallNorthRouteBlocker as u32 } else if blockrange { CollisionFlag::WallNorthProjBlocker as u32 } else { CollisionFlag::WallNorth as u32 };
        let south: u32 = if breakroutefinding { CollisionFlag::WallSouthRouteBlocker as u32 } else if blockrange { CollisionFlag::WallSouthProjBlocker as u32 } else { CollisionFlag::WallSouth as u32 };

        match LocAngle::try_from(angle) {
            Ok(angle) => {
                match angle {
                    LocAngle::West => {
                        if add {
                            self.collision_flag_map.add(x, z, y, north | west);
                            self.collision_flag_map.add(x - 1, z, y, east);
                            self.collision_flag_map.add(x, z + 1, y, south);
                        } else {
                            self.collision_flag_map.remove(x, z, y, north | west);
                            self.collision_flag_map.remove(x - 1, z, y, east);
                            self.collision_flag_map.remove(x, z + 1, y, south);
                        }
                    }
                    LocAngle::North => {
                        if add {
                            self.collision_flag_map.add(x, z, y, north | east);
                            self.collision_flag_map.add(x, z + 1, y, south);
                            self.collision_flag_map.add(x + 1, z, y, west);
                        } else {
                            self.collision_flag_map.remove(x, z, y, north | east);
                            self.collision_flag_map.remove(x, z + 1, y, south);
                            self.collision_flag_map.remove(x + 1, z, y, west);
                        }
                    }
                    LocAngle::East => {
                        if add {
                            self.collision_flag_map.add(x, z, y, south | east);
                            self.collision_flag_map.add(x + 1, z, y, west);
                            self.collision_flag_map.add(x, z - 1, y, north);
                        } else {
                            self.collision_flag_map.remove(x, z, y, south | east);
                            self.collision_flag_map.remove(x + 1, z, y, west);
                            self.collision_flag_map.remove(x, z - 1, y, north);
                        }
                    }
                    LocAngle::South => {
                        if add {
                            self.collision_flag_map.add(x, z, y, south | west);
                            self.collision_flag_map.add(x, z - 1, y, north);
                            self.collision_flag_map.add(x - 1, z, y, east);
                        } else {
                            self.collision_flag_map.remove(x, z, y, south | west);
                            self.collision_flag_map.remove(x, z - 1, y, north);
                            self.collision_flag_map.remove(x - 1, z, y, east);
                        }
                    }
                }
                if breakroutefinding {
                    return self.change_wall_l(x, z, y, angle as u8, blockrange, false, add);
                }
                if blockrange {
                    return self.change_wall_l(x, z, y, angle as u8, false, false, add);
                }
            }
            Err(str) => panic!("{}", str)
        }
    }
}

use crate::rsmod::CollisionFlag;

pub trait CollisionStrategy {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool;
}

pub struct Normal;
impl CollisionStrategy for Normal {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool {
        return (tile_flag & block_flag) == CollisionFlag::Open as u32;
    }
}

pub struct Blocked;
impl CollisionStrategy for Blocked {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool {
        let flag: u32 = block_flag & !(CollisionFlag::Floor as u32);
        return (tile_flag & flag) == 0 && (tile_flag & CollisionFlag::Floor as u32) != CollisionFlag::Open as u32;
    }
}

pub struct Indoors;
impl CollisionStrategy for Indoors {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool {
        return (tile_flag & block_flag) == 0 && (tile_flag & CollisionFlag::Roof as u32) != CollisionFlag::Open as u32;
    }
}

pub struct Outdoors;
impl CollisionStrategy for Outdoors {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool {
        return (tile_flag & (block_flag | CollisionFlag::Roof as u32)) == CollisionFlag::Open as u32;
    }
}

pub struct LineOfSight;
impl CollisionStrategy for LineOfSight {
    fn can_move(self, tile_flag: u32, block_flag: u32) -> bool {
        let block_movement: u32 =
            CollisionFlag::WallNorthWest as u32 |
            CollisionFlag::WallNorth as u32 |
            CollisionFlag::WallNorthEast as u32 |
            CollisionFlag::WallEast as u32 |
            CollisionFlag::WallSouthEast as u32 |
            CollisionFlag::WallSouth as u32 |
            CollisionFlag::WallSouthWest as u32 |
            CollisionFlag::WallWest as u32 |
            CollisionFlag::Loc as u32;

        let block_route: u32 =
            CollisionFlag::WallNorthWestRouteBlocker as u32 |
            CollisionFlag::WallNorthRouteBlocker as u32 |
            CollisionFlag::WallNorthEastRouteBlocker as u32 |
            CollisionFlag::WallEastRouteBlocker as u32 |
            CollisionFlag::WallSouthEastRouteBlocker as u32 |
            CollisionFlag::WallSouthRouteBlocker as u32 |
            CollisionFlag::WallSouthWestRouteBlocker as u32 |
            CollisionFlag::WallWestRouteBlocker as u32 |
            CollisionFlag::LocRouteBlocker as u32;

        let movement_flags: u32 = (block_flag & block_movement) << 9;
        let route_flags: u32 = (block_flag & block_route) >> 13;
        let final_flag: u32 = movement_flags | route_flags;
        return (tile_flag & final_flag) == CollisionFlag::Open as u32;
    }
}

use crate::game::lifecycle::EntityLifeCycle;

pub struct EntityBase {
    pub x: i32,
    pub y: u8,
    pub z: i32,
    pub width: u8,
    pub length: u8,
    pub lifecycle: EntityLifeCycle,
    pub lifecycle_tick: i32,
    pub last_lifecycle_tick: i32
}

pub trait Entity {
    fn reset(&self, respawn: bool);
    fn set_lifecycle(&mut self, tick: i32, curr: i32);
    fn get_lifecycle(&self) -> &EntityLifeCycle;
    fn get_lifecycle_tick(&self) -> i32;
    fn get_last_lifecycle_tick(&self) -> i32;

    fn update_lifecycle(&self, tick: i32) -> bool {
        return self.get_lifecycle_tick() == tick && self.get_lifecycle() != &EntityLifeCycle::Forever;
    }

    fn check_lifecycle(&self, tick: i32) -> bool {
        return match self.get_lifecycle() {
            EntityLifeCycle::Forever => true,
            EntityLifeCycle::Respawn => self.get_lifecycle_tick() < tick,
            EntityLifeCycle::Despawn => self.get_last_lifecycle_tick() > tick
        }
    }
}

impl EntityBase {
    pub fn new(y: u8, x: i32, z: i32, width: u8, length: u8, lifecycle: EntityLifeCycle) -> EntityBase {
        return EntityBase {
            x,
            y,
            z,
            width,
            length,
            lifecycle,
            lifecycle_tick: -1,
            last_lifecycle_tick: -1,
        }
    }
}

impl Entity for EntityBase {
    fn reset(&self, _respawn: bool) {}

    fn set_lifecycle(&mut self, tick: i32, curr: i32) {
        self.lifecycle_tick = tick;
        self.last_lifecycle_tick = curr;
    }

    fn get_lifecycle(&self) -> &EntityLifeCycle {
        return &self.lifecycle;
    }

    fn get_lifecycle_tick(&self) -> i32 {
        return self.lifecycle_tick;
    }

    fn get_last_lifecycle_tick(&self) -> i32 {
        return self.last_lifecycle_tick;
    }
}

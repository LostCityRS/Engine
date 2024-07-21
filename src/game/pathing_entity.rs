use crate::map::Zone;

pub trait PathingEntity {
    fn enter(self, zone: &Zone);
    fn leave(self, zone: &Zone);
}

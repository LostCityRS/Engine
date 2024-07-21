#[repr(u8)]
#[derive(PartialEq)]
pub enum EntityLifeCycle {
    Forever = 0, // never respawns or despawns, is always in the world.
    Respawn = 1, // entity added from engine that respawns later.
    Despawn = 2 // entity added from script that despawns later.
}

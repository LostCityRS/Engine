use std::io::BufRead;
use lostcity::map::{GameMap, ZoneMap};
use lostcity::rsmod::RSMod;
use lostcity::script::{ScriptProvider, ScriptState};

fn main() {
    let mut rsmod: RSMod = RSMod::new();
    let mut zone_map: ZoneMap = ZoneMap::new();
    let game_map: GameMap = GameMap;
    game_map.init("data/pack/server/maps/", &mut rsmod, &mut zone_map);

    // let provider = ScriptProvider::load("data/pack/server");
    // let fib = provider.get_by_name("[proc,fib]");
    // let mut state = ScriptState::new_with_args(fib.unwrap(), vec![10], Vec::new());
    // state.execute(&provider);
    // println!("fib: result={} opcount={}", state.pop_int(), state.opcount);

    println!("Press enter to exit");
    let stdin = std::io::stdin();
    let mut iterator = stdin.lock().lines();
    let line1 = iterator.next().unwrap().unwrap();
}

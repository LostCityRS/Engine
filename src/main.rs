use std::io::BufRead;
use lostcity::game::World;
use lostcity::map::{GameMap, ZoneMap};
use lostcity::rsmod::RSMod;
use lostcity::script::{ScriptProvider, ScriptState};

fn main() {
    // let provider = ScriptProvider::load("data/pack/server");
    // let fib = provider.get_by_name("[proc,fib]");
    // let mut state = ScriptState::new_with_args(fib.unwrap(), vec![10], Vec::new());
    // state.execute(&provider);
    // println!("fib: result={} opcount={}", state.pop_int(), state.opcount);

    // println!("Press enter to exit");
    // let stdin = std::io::stdin();
    // let mut iterator = stdin.lock().lines();
    // let line1 = iterator.next().unwrap().unwrap();

    World::new().start(false, true);
}

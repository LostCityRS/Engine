enum GameServerPriority {
    // counted as part of the buffer_full command
    BUFFERED,

    // not counted as part of the buffer_full command
    IMMEDIATE
}

export default GameServerPriority;

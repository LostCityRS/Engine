import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';

type Cache = {
    KEY: number,
    DATA: Buffer,
    VERSION: number,
    CRC: number
};

type CacheIndex = {
    KEY: number,
    DATA: Buffer,
    VERSION: number,
    CRC: number
};

interface Database {
    cache: Cache;
    cache_index: CacheIndex;
}

export default class Js5DiskCache {
    #db: Kysely<Database>;

    constructor(path: string) {
        const dialect = new SqliteDialect({
            database: new Database(path)
        });
        
        this.#db = new Kysely<Database>({
            dialect
        });
    }

    readIndex() {
        return this.#db.selectFrom('cache_index').where('KEY', '=', 1).selectAll().executeTakeFirstOrThrow();
    }

    readGroup(id: number) {
        return this.#db.selectFrom('cache').where('KEY', '=', id).selectAll().executeTakeFirstOrThrow();
    }

    async writeIndex(index: CacheIndex) {
        await this.#db.deleteFrom('cache_index').where('KEY', '=', index.KEY).executeTakeFirst();
        return this.#db.insertInto('cache_index').values(index).executeTakeFirstOrThrow();
    }

    async writeGroup(group: Cache) {
        await this.#db.deleteFrom('cache').where('KEY', '=', group.KEY).executeTakeFirst();
        return this.#db.replaceInto('cache').values(group).executeTakeFirstOrThrow();
    }
}

import pkg from 'pg';
import { Client } from 'pg';

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mini_splitter',
    password: 'blackbee98',
    port: 5432,
});

db.connect();

export default db;
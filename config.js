const {Pool} = require('pg');

const isproduction = process.env.NODE_ENV === 'production';

let pool = null;
if (isproduction) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
} else {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'atvidade',
        password: 'postgres',
        port: 5432
    });
}

module.exports = {pool};
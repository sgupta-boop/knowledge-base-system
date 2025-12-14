import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkArticles() {
    try {
        const res = await pool.query('SELECT id, title, status FROM articles');
        console.log('Articles found:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkArticles();

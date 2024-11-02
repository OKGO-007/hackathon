import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('データベース接続に失敗しました', err);
  } else {
    console.log('データベースに接続しました');
  }
  release();
});


//: Promise<{ email: string, password_hash: string } | undefined>
// ユーザーを取得する関数の例
export const getUserByEmail = async (email: string) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return res.rows[0]
}

// ユーザーを登録する関数の例
export const insertUser = async (email: string, passwordHash: string): Promise<void> => {
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash])
}

export default pool;

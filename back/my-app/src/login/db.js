import { Pool } from 'pg'

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432, // PostgreSQLのデフォルトポート
})

// ユーザーを取得する関数の例
export const getUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return res.rows[0]
}

// ユーザーを登録する関数の例
export const insertUser = async (email, passwordHash) => {
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash])
}

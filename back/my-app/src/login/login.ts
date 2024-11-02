import { Hono } from 'hono'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import  db  from '../database/db'  // PostgreSQLの設定
import { insertUser, getUserByEmail } from '../database/db';

const logins = new Hono()

// サインアップ
logins.post('/signup', async (c) => {
  const { email, password } = await c.req.json()
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // ユーザーをデータベースに保存
  await insertUser(email, hashedPassword)

  return c.json({ message: 'User registered' })
})

// ログイン
logins.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const user = await getUserByEmail(email)
  
  if (user && await bcrypt.compare(password, user.password_hash)) {
    const token = jwt.sign({ userId: user.id }, 'SECRET_KEY')
    return c.json({ token })
  } else {
    return c.json({ error: 'Invalid credentials' }, 401)
  }
})

export default logins

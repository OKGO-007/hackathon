import { Hono } from 'hono';
import pool from '../database/db';

const tombstoneRouter = new Hono();

// 新しい墓石を作成するエンドポイント
tombstoneRouter.post('/', async (c) => {
  const { image, name } = await c.req.json(); // リクエストから画像データと名前を取得

  try {
    // データベースに画像データと名前を保存する
    const result = await pool.query(
      'INSERT INTO tombstones (image, name) VALUES ($1, $2) RETURNING id',
      [image, name]
    );
    return c.json({ id: result.rows[0].id }, 201); // 成功時に新しい墓石のIDを返す
  } catch (error) {
    console.error('データベースエラー:', error);
    return c.text('データベースエラー', 500);
  }
});

export default tombstoneRouter;
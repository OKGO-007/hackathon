
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { todos } from "./todo/api";
import { cors } from 'hono/cors'; // corsをインポート
import { basicAuth } from 'hono/basic-auth';  // basicAuthをインポート
import 'dotenv/config';



// let todoList = [
//   { id: "1", title: "Learning Hono", completed: false },
//   { id: "2", title: "Watch the movie", completed: true },
//   { id: "3", title: "Buy milk", completed: false },
// ];



const app = new Hono();


// 簡単なルートを追加（任意）
app.get('/', (c) => c.text('Hello, Hono!'));

// サーバーを起動
// const server = serve(app);
// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

export default app;



// import { Hono } from "hono";


// import { prettyJSON } from "hono/pretty-json";
// import { todos } from "./todo/api";
// import { cors } from 'hono/cors'; // corsをインポート
// import { basicAuth } from 'hono/basic-auth';  // basicAuthをインポート



// // let todoList = [
// //   { id: "1", title: "Learning Hono", completed: false },
// //   { id: "2", title: "Watch the movie", completed: true },
// //   { id: "3", title: "Buy milk", completed: false },
// // ];



// const app = new Hono();
// app.use(
//   "/api/*",
//   basicAuth({
//     username: "charizard",
//     password: "super-secret",
//   })
// );
// // CORS設定を追加
// app.use('*', cors({ origin: '*' })); // 全てのオリジンを許可
// app.use("*", prettyJSON());



// app.route("/api/todos", todos);
// // app.get("/api/todo", (c) => c.json(todoList));


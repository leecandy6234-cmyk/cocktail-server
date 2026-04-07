//const express = require("express");
// package.json 에서 "type": "module",로 변경
import express from "express"; //ES 문법 (자바 최신 문법!)
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  post: 3306,
  host: "localhost",
  user: "root",
  password: "qwer1234",
  database: "cocktail",
});

const app = express();

app.use((req, res, next) => {
  //cors 허용
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  // get(조회), ponst(추가), put,(수정) delete(삭제) 요청 허용)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // JSON 데이터 받을 수 있도록 허용
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json()); //제이슨 형태로 들어오는 요청을 파싱해서 req.body에 추가

app.get("/", (req, res) => {
  //send : 문자열, HTML , 객체 등 여러 타입을 보낼 수 있음
  res.send("안녕 세계!");
});
/*req 요청 res 응답*/

//DB에 값을 추가 (post)

/* INSERT INTO recipes(user_id, name, image, description)
VALUES(1, '모히또', '모히또.jpg', '상큼하고 청량한 쿠바식 칵테일'); */

app.post("/recipes", async (req, res) => {
  try {
    const { name, image, description } = req.body;
    await pool.query(
      "INSERT INTO recipes(name, image, description) VALUES(?,?,?)",
      [name, image, description],
    );
    res.status(201).json({ name, image, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류" });
  }
});
// DB에 있는 칵테일 레시피들 조회 : get
app.get("/recipes", async (req, res) => {
  const keyword = req.query.keyword;
  const searchKeyword = `%${keyword}%`;

  // SELECT * FROM recipes
  const [result] = await pool.query(
    "SELECT * FROM recipes WHERE name LIKE ? ORDER BY id DESC",
    [searchKeyword],
  );
  res.status(200).json(result);
});

app.listen(4000, () => {
  console.log("서버가 4000번 포트에서 실행 중입니다.");
});

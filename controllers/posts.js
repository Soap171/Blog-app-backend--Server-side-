import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const addPosts = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token not valid");

    const q =
      "INSERT INTO posts (`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(400).json(err);

      res.status(201).json("Post has been created");
    });
  });
};

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) res.send(err);

    res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `desc` , `img` , `date`, `image`, `cat` FROM USERS u JOIN posts p ON u.id = p.uid WHERE p.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(400).json(err);

    return res.status(200).json(data[0]);
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token not valid");

    const postId = req.params.id;

    const q = "DELETE from posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(400).json("You can delete only your posts");

      res.status(200).json("Post has been deleted");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token not valid");

    const postId = req.params.id;

    const q =
      "UPDATE posts SET `title`=?, `desc`=? , `img`=? , `cat`=?  WHERE `id` = ? AND `uid`=?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
    console.log(req.body.img);

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(400).json(err);

      res.status(201).json("Post has been updated");
    });
  });
};

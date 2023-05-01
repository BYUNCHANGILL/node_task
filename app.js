const express = require('express');
const cookieparser = require('cookie-parser');
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");
const connect = require("./schemas/index.js");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use("/", [postsRouter, commentsRouter, signupRouter, loginRouter]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});
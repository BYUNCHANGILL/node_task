const express = require('express');

// posts.js에서는 posts라는 컬렉션에 대한 CRUD를 구현합니다.
const Posts = require("../schemas/post.js");
const User = require("../schemas/user.js");
const authMiddleware = require('../middlewares/auth-middleware.js');
const mongoose = require('mongoose');

const router = express.Router();

// 게시글을 전체 목록 조회하는 API입니다.
router.get("/posts", async (req, res) => {
    try {
    // posts 컬렉션에 있는 postsId, user, title, createdAt을 조회합니다.
    const posts = await Posts.find({}, { _id: 0, postsId: 1, userId: 1, nickname: 1, title: 1, content: 1, createdAt: 1, updatedAt: 1 }).sort({ createdAt: -1 });;
    // 조회된 데이터를 클라이언트에게 전달합니다.
    return res.status(200).json({ posts: posts });
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글을 작성하는 API입니다.
router.post("/posts", authMiddleware, async (req, res) => {
    // authMiddleware를 통과하였다면, req.user에는 유저 정보가 담겨있습니다.
    const { userId, nickname } = res.locals.user;

    // title, content를 받아옵니다.
    const { title, content } = req.body;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!title && !content) {
        return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!title) {
        return res.status(400).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
        return res.status(400).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    // cookies가 존재하지 않는다면 401에러를 반환합니다.
    if (!req.cookies) {
        return res.status(401).json({ errorMessage: "로그인이 필요한 기능입니다." });
    }
    // cookies가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(401).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    try {
        const postsId = new mongoose.Types.ObjectId();
        const newPost = { userId: userId, postsId: postsId, nickname: nickname, title, content, createdAt: new Date(), updatedAt: new Date()};
        // posts 컬렉션에 새로운 도큐먼트를 추가합니다.
        await Posts.create(newPost);
        // 저장된 데이터를 클라이언트에게 전달합니다.
        return res.json({ message: "게시글을 생성하였습니다." });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});

// 게시글 상세 조회 API입니다.
router.get("/posts/:postId", async (req, res) => {
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { postId } = req.params;

    try {
        // posts 컬렉션에 있는 postsId, user, title, content, createdAt을 조회합니다.
        const post = await Posts.findOne({ postsId: postId }, { _id: 0, postsId: 1, userId: 1, nickname: 1, title: 1, content: 1, createdAt: 1, updatedAt: 1 });
        // 조회된 데이터가 없다면 404에러를 반환합니다.

        // 조회된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ post: post });
    } catch (error) {
        return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글을 수정하는 API입니다.
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { postId } = req.params;
    // title, content를 받아옵니다.
    const { title, content } = req.body;
    // posts 컬렉션에서 해당 postsId를 가진 도큐먼트를 조회합니다.
    const post_id = await Posts.findOne({ postsId: postId });

    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!title && !content) {
        return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!title) {
        return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
        return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    // 게시글 수정 권한이 없는 경우
    if (userId !== post_id.userId) {
        return res.status(403).json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    // cookies가 존재하지 않는 경우
    if (!req.cookies) {
        return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
    }

    // cookies가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    try {
        // 수정된 데이터를 저장합니다.
        await Posts.updateOne({ postsId: postId }, {$set: { title, content, updatedAt: new Date() }});
        // 수정된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ message: "게시글을 수정하였습니다." });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
});

// 게시글을 삭제하는 API입니다.
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { postId } = req.params;
    // posts 컬렉션에서 해당 postsId를 가진 도큐먼트를 조회합니다.
    const post = await Posts.findOne({ postsId: postId });

    // 게시글이 존재하지 않는 경우
    if (!post) {
        return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
    }
    // 게시글 삭제 권한이 없는 경우
    if (userId !== post.userId) {
        return res.status(403).json({ errorMessage: "게시글 삭제의 권한이 존재하지 않습니다." });
    }
    // cookies가 존재하지 않는 경우
    if (!req.cookies) {
        return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
    }
    // cookies가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }
    
    try {
        // 데이테 삭제를 합니다.
        await Posts.deleteOne({ postsId: postId });
        // 삭제된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
    }
});

module.exports = router;
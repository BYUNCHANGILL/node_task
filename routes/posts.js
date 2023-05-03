const express = require('express');

// posts.js에서는 posts라는 컬렉션에 대한 CRUD를 구현합니다.
const Posts = require("../schemas/post.js");
const authMiddleware = require('../middlewares/auth-middleware.js');
const mongoose = require('mongoose');

const router = express.Router();

// 게시글을 전체 목록 조회하는 API입니다.
router.get("/posts", async (req, res) => {
    try {
    // posts 컬렉션에 있는 postsId, user, title, createdAt을 조회합니다.
    const posts = await Posts.find({}, { _id: 0, postsId: 1, userId: 1, nickname: 1, title: 1, createdAt: 1, updatedAt: 1 }).sort({ createdAt: -1 });;
    // 조회된 데이터를 클라이언트에게 전달합니다.
    return res.status(200).json({ posts: posts });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글을 작성하는 API입니다.
router.post("/posts", authMiddleware, async (req, res) => {
    // authMiddleware를 통과하였다면, req.user에는 유저 정보가 담겨있습니다.
    const { userId } = res.locals.user;
    // title, content를 받아옵니다.
    const { title, content } = req.body;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!title || !content) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
    // ObjectId를 사용하여 postId 생성합니다.
    const postId = new mongoose.Types.ObjectId();
    // 새로운 도큐먼트를 생성합니다.
    const newPost = { postId, UserId: userId, title, content, createdAt: new Date() };
    // posts 컬렉션에 새로운 도큐먼트를 추가합니다.
    await Posts.create(newPost);
    // 저장된 데이터를 클라이언트에게 전달합니다.
    return res.json({ message: "게시글을 생성하였습니다." });
});

// 게시글 상세 조회 API입니다.
router.get("/posts/:_postId", async (req, res) => {
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _postId } = req.params;

    try {
        // posts 컬렉션에 있는 postsId, user, title, content, createdAt을 조회합니다.
        const post = await Posts.findOne({ postsId: _postId }, { _id: 0, postsId: 1, user: 1, title: 1, content: 1, createdAt: 1 });
        // 조회된 데이터가 없다면 404에러를 반환합니다.
        if (!post) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
        // 조회된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ data: post });
    } catch (error) {
    }
});

// 게시글을 수정하는 API입니다.
router.put("/posts/:_postId", async (req, res) => {
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _postId } = req.params;
    // user, password, title, content를 받아옵니다.
    const { password, title, content } = req.body;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!password || !title || !content) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    try {
        // posts 컬렉션에서 해당 postsId를 가진 도큐먼트를 조회합니다.
        const post_id = await Posts.findOne({ postsId: _postId });
        // 조회된 데이터가 없다면 404에러를 반환합니다.
        if (!post_id) {
            return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
        }
        // 조회된 데이터에서 password를 가져옵니다.
        const post_password = post_id.password;
        // 조회된 데이터가 있다면 수정합니다.
        if (post_password === password) {
            // 수정된 데이터를 저장합니다.
            await Posts.updateOne({ postsId: _postId }, { title, content });
            // 수정된 데이터를 클라이언트에게 전달합니다.
            return res.status(200).json({ message: "게시글을 수정하였습니다." });
        } else {
            // 비밀번호가 일치하지 않는다면 400에러를 반환합니다.
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
    } catch (error) {
    }
});

// 게시글을 삭제하는 API입니다.
router.delete("/posts/:_postId", async (req, res) => {
    // 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _postId } = req.params;
    // password를 받아옵니다.
    const { password } = req.body;
    try {
        // posts 컬렉션에서 해당 postsId를 가진 도큐먼트를 조회합니다.
        const post = await Posts.findOne({ postsId: _postId });
        // 조회된 데이터가 없다면 404에러를 반환합니다.
        if (!post) {
            return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
        }
        // 비밀번호가 일치하지 않는다면 400에러를 반환합니다.
        if (post.password !== password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
        // 데이테 삭제를 합니다.
        await Posts.deleteOne({ postsId: _postId, password });
        // 삭제된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
    }
});

module.exports = router;
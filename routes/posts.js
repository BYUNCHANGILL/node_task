const express = require('express');
const router = express.Router();

// posts.js에서는 posts라는 컬렉션에 대한 CRUD를 구현합니다.
const Posts = require("../schemas/post.js");
const mongoose = require('mongoose');

// 게시글을 조회하는 API입니다.
router.get("/posts", async (req, res) => {
    // posts 컬렉션에 있는 모든 데이터를 조회합니다.
    const posts = await Posts.find({});
    // 조회된 데이터를 클라이언트에게 전달합니다.
    return res.status(200).json({ "data": posts })
});

// 게시글을 작성하는 API입니다.
router.post("/posts", async (req, res) => {
    // user, password, title, content를 받아옵니다.
    const { user, password, title, content } = req.body;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!user || !password || !title || !content) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    // ObjectId를 사용하여 postsId를 생성합니다.
    const postsId = new mongoose.Types.ObjectId();
    // 새로운 도큐먼트를 생성합니다.
    const newPost = { user, password, title, content, postsId };
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
        // posts 컬렉션에서 해당 postsId를 가진 도큐먼트를 조회합니다.
        const post = await Posts.findOne({ postsId: _postId });
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
        const post = await Posts.findOne({ postsId: _postId });
        // 조회된 데이터가 없다면 404에러를 반환합니다.
        if (!post) {
            return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
        }
        // 수정된 데이터를 저장합니다.
        await Posts.updateOne({ postsId: _postId }, { password, title, content });
        // 수정된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ message: "게시글을 수정하였습니다." });
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
        // 삭제된 데이터를 저장합니다.
        await Posts.deleteOne({ postsId: _postId, password });
        // 삭제된 데이터를 클라이언트에게 전달합니다.
        return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
    }
});

module.exports = router;
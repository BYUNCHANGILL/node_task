const express = require('express');
const router = express.Router();

// comments.js에서는 comments라는 컬렉션에 대한 CRUD를 구현합니다.
const Comments = require("../schemas/comment.js");
const authMiddleware = require('../middlewares/auth-middleware.js');
const mongoose = require("mongoose");

// 댓글을 조회하는 API입니다.
router.get("/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    
    if (!postId) {
        return res.status(400).json({ message: "게시글이 존재하지 않습니다." })
    }

    try {
    // comments 컬렉션에 있는 commentId, user, content, createdAt을 조회합니다.
    const comments = await Comments.find({postId: postId}, { _id: 0, commentId: 1, userId: 1, nickname: 1, comment: 1, createdAt: 1, updatedAt: 1 }).sort({ createdAt: -1 });;
    // 조회된 데이터를 클라이언트에게 전달합니다.
    return res.status(200).json({ comments: comments });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
    }
});

// 댓글을 작성하는 API입니다.
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;

    // 댓글을 작성할 게시글이 없는 경우
    if (!postId) {
        return res.status(400).json({ message: "게시글이 존재하지 않습니다." })
    }
    // 로그인이 되어있지 않은 경우
    if (!userId) {
        return res.status(400).json({ message: "로그인이 필요합니다." })
    }
    // cookie가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(400).json({ message: "전달된 쿠키에서 오류가 발생하였습니다." })
    }
    // 데이터가 정상적으로 전달되지 않은 경우
    if (!comment) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    try {
        const commentId = new mongoose.Types.ObjectId();
        // 새로운 도큐먼트를 생성합니다.
        const newComment = { postId: postId, userId: userId, commentId: commentId, nickname: nickname, comment: comment, createdAt: Date.now(), updatedAt: Date.now() };
        // comments 컬렉션에 새로운 도큐먼트를 추가합니다.
        await Comments.create(newComment);
        // 저장된 데이터를 클라이언트에게 전달합니다.
        return res.json({ message: "댓글을 작성하였습니다." });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
    }
});

// 댓글을 수정하는 API입니다.
router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    // 댓글을 수정할 게시글이 없는 경우
    if (!postId) {
        return res.status(400).json({ message: "게시글이 존재하지 않습니다." })
    }
    // 댓글 수정 권한이 없는 경우
    if (!userId) {
        return res.status(400).json({ message: "댓글의 수정 권한이 존재하지 않습니다." })
    }
    // 로그인이 되어있지 않은 경우
    if (!userId) {
        return res.status(400).json({ message: "로그인이 필요합니다." })
    }
    // cookie가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(400).json({ message: "전달된 쿠키에서 오류가 발생하였습니다." })
    }
    // 데이터가 정상적으로 전달되지 않은 경우
    if (!comment || !commentId) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    try {
        await Comments.updateOne({ commentId: commentId }, { $set: { comment: comment, updatedAt: Date.now() } });
        return res.json({ message: "댓글을 수정하였습니다." });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "댓글 수정에 실패하였습니다." });
    }
});

// 댓글을 삭제하는 API입니다.
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;

    // 댓글을 삭제할 게시글이 없는 경우
    if (!postId) {
        return res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다." })
    }
    // 로그인이 되어있지 않은 경우
    if (!userId) {
        return res.status(400).json({ errorMessage: "댓글의 삭제 권한이 존재하지 않습니다." })
    }
    // cookie가 비정상적이거나 만료된 경우
    if (req.cookies.refreshToken) {
        return res.status(400).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." })
    }
    // 댓글이 존재하지 않는 경우
    if (!commentId) {
        return res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." })
    }

    try {
        // 데이터 삭제를 합니다.
        await Comments.deleteOne({ commentId: commentId });
        // 삭제된 데이터를 클라이언트에게 전달합니다.
        return res.json({ message: "댓글을 삭제하였습니다." });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    }
});

module.exports = router
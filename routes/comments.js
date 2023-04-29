const express = require('express');
const router = express.Router();

// comments.js에서는 comments라는 컬렉션에 대한 CRUD를 구현합니다.
const Comments = require("../schemas/comment.js");
const mongoose = require('mongoose');

// 댓글을 조회하는 API입니다.
router.get("/posts/:_postId/comments", async (req, res) => {
    // comments 컬렉션에 있는 commentId, user, content, createdAt을 조회합니다.
    const comments = await Comments.find({}, { _id: 0, commentId: 1, user: 1, content: 1, createdAt: 1 }).sort({ createdAt: -1 });;
    // 조회된 데이터를 클라이언트에게 전달합니다.
    return res.status(200).json({ data: comments });
});

// 댓글을 작성하는 API입니다.
router.post("/posts/:_postId/comments", async (req, res) => {
    // user, password, content를 받아옵니다.
    const { user, password, content } = req.body;
    // postsId는 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _postId } = req.params;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!user || !password) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    } else if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." })
    }
    // 댓글의 고유 아이디를 생성합니다.
    const commentId = new mongoose.Types.ObjectId();

    // 새로운 도큐먼트를 생성합니다.
    const newComment = { user, password, content, commentId,  postsId: _postId, createdAt: new Date() };
    // comments 컬렉션에 새로운 도큐먼트를 추가합니다.
    await Comments.create(newComment);
    // 저장된 데이터를 클라이언트에게 전달합니다.
    return res.json({ message: "댓글을 생성하였습니다." });
});

// 댓글을 수정하는 API입니다.
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
    // user, password, content를 받아옵니다.
    const { password, content } = req.body;
    // postsId는 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _commentId } = req.params;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." })
    }
    // comments 컬렉션에서 _commentId와 일치하는 도큐먼트를 찾습니다.
    const comment = await Comments.findOne({ commentId: _commentId });
    // comments 컬렉션에서 _commentId와 일치하는 도큐먼트가 없다면 404에러를 반환합니다.
    if (!comment) {
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }

    // 찾은 도큐먼트의 password와 클라이언트로부터 전달받은 password가 일치하지 않는다면 401에러를 반환합니다.
    if (comment.password == password) {
        // 찾은 도큐먼트를 업데이트합니다.
        await Comments.updateOne({ commentId: _commentId }, { content });
        // 업데이트된 데이터를 클라이언트에게 전달합니다.
        return res.json({ message: "댓글을 수정하였습니다." });
    } else {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
});

// 댓글을 삭제하는 API입니다.
router.delete("/posts/:_postId/comments/:_commentId", async (req, res) => {
    // password를 받아옵니다.
    const { password } = req.body;
    // postsId는 클라이언트로부터 전달받은 postsId를 받아옵니다.
    const { _commentId } = req.params;
    // 받아온 데이터가 없다면 400에러를 반환합니다.
    if (!password) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    // comments 컬렉션에서 _commentId와 일치하는 도큐먼트를 찾습니다.
    const comment = await Comments.findOne({ commentId: _commentId });

    // 데이터 삭제를 합니다.
    await Comments.deleteOne({ commentId: _commentId });
    // 삭제된 데이터를 클라이언트에게 전달합니다.
    return res.json({ message: "댓글을 삭제하였습니다." });
});

module.exports = router
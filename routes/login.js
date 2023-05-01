const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

// 로그인 API
router.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body;

        // 닉네임이 일치하는 유저를 찾는다.
        const user = await User.findOne({ nickname });

        // 1. 닉네임에 일치하는 유저가 존재하지 않는 경우
        if (!user || user.password !== password) {
            res.status(412).json({
                errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            });
            return;
        }

        // JWT 토큰 생성
        const token = jwt.sign({userId: user.userId}, "customized-secret-key");
        // Bearer Token 방식
        res.cookie("Authorization", `Bearer ${token}`); // 쿠키에 토큰 저장
        res.status(200).json({token});  // 토큰을 JSON 형태로 반환
    } catch (err) {
        console.log(err);
        res.status(400).json({errorMessage: '로그인에 실패하였습니다.'});
    }
});

module.exports = router;
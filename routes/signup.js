const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 회원가입 API
router.post('/singup', async (req, res) => {
    try {    
        const { nickname, password, confirm } = req.body;

        // 닉네임 정규식 확인
        const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
        if (!nicknameRegex.test(nickname)) {
            res.status(412).json({
                errorMessage: '닉네임의 형식이 일치하지 않습니다.',
            });
            return;
        }

        // 비밀번호와 비밀번호 확인이 일치하지 않을 경우
        if (password !== confirm) {
            res.status(412).json({
                errorMessage: '패스워드가 일치하지 않습니다.',
            });
            return;
        }

        // 비밀번호 정규식 확인
        const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
        if (!passwordRegex.test(password)) {
            res.status(412).json({
                errorMessage: '패스워드 형식이 일치하지 않습니다.',
            });
            return;
        }

        // password에 닉네임이 포함되어있는 경우
        if (password.includes(nickname)) {
            res.status(412).json({
                errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
            });
            return;
        }

        // 닉네임이 이미 존재하는지 확인
        const isExistUsers = await User.findOne({
            $or: [{ nickname }], // nickname이 일치하는 데이터를 찾는다.
        });

        // 닉네임이 이미 존재한다면 412에러를 반환합니다.
        if (isExistUsers) {
            res.status(412).json({
                errorMessage: '중복된 닉네임입니다.',
            });
            return;
        }

        // TODO : 비밀번호 암호화 하기 crypto 라이브러리 사용해서 나중에 하기
        const user = new User({nickname, password, confirm});
        await user.save();

        return res.status(201).json({"message": "회원가입에 성공하였습니다."});
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

module.exports = router;
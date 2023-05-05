const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    // authorization이 없다면 빈 문자열로 처리하고, 공백을 기준으로 나눠 authyType과 authToken을 추출합니다.
    const [authyType, authToken] = (Authorization ?? "").split(" ");

    // authyType이 "Bearer"가 아니거나 authToken이 없다면, 로그인 요청을 하라는 메시지와 함께 오류 응답을 보냅니다.
    if (authyType !== "Bearer" || !authToken) {
        res.status(400).json({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }

    try {
        // authToken을 검증하여 userId를 추출합니다.
        const { userId } = jwt.verify(authToken, "customized-secret-key");
        // userId를 사용하여 사용자 정보를 찾습니다.
        // const user = await User.findById(userId);
        const user = await User.findOne({ userId });
        // 찾은 사용자 정보를 응답의 locals 객체에 저장합니다.
        res.locals.user = user;
        // 다음 미들웨어로 이동합니다.
        next();
    } catch (error) {
        // 에러가 발생하면, 에러를 출력하고 로그인 요청을 하라는 메시지와 함께 오류 응답을 보냅니다.
        console.error(error);

        res.status(400).json({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }

};
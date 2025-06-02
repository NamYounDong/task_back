const PORT = 8000;
// require : 모듈을 불러오는 라이브러리 ( java의 import와 유사한 기능인듯 ? )

 // express 모듈 호출 : 서버 구축을 위한 프레임워크 ? ( 스프링 같은 놈임? )
const express = require("express");

 // cors 모듈 호출 : 서버 간 통신을 위한 모듈
const cors = require("cors");

const app = express(); // express 객체 생성
app.use(express.json()); // json 형식의 데이터 파싱
app.use(cors()); // 교차 출처 데이터 공유 허용 CROSS SCRIPT SITE 공격 방지 모듈인듯

app.use(require('./controllers/tasksController')); // tasksController 라우터 연결

app.listen(PORT, () => { // 서버 시작 감지
    console.log(`Server is running on port ${PORT}`);
});

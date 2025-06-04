const { Pool } = require('pg'); // 데이터베이스 연결 객체(PG 모듈 로드)

const dotenv = require('dotenv'); // require 메서드로 dotenv 모듈을 불러와서 환경 변수를 로드한다.
dotenv.config(); // dotenv 모듈을 사용하여 환경 변수를 로드한다

const pool = new Pool(
    {
        user:process.env.DB_USER, // dotenv 로 부를때 process.env로 부름...왜인지 모름
        host:process.env.DB_HOST, 
        database:process.env.DB_NAME,
        password:process.env.DB_PASS,
        port:process.env.DB_PORT
    }
)

const sendQuery = async (query, params) => {
    const result = await pool.query(query, params);
    // DB 조회시 _로 분할된 컬럽명을 카멜케이스로 변환
    return snakeToCamel(result.rows);
}


// 오브젝트 카멜케이스로 전환 함수 - start
// DB 조회시 _로 분할된 컬럽명을 카멜케이스로 변환
const snakeToCamel = (obj) => {
    let newObj;
    if(Array.isArray(obj)){
        newObj = []
        obj.forEach(item => {
            const newItem = {};
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const camelCaseKey = (key.indexOf('_') == 0 ? key.substring(1, key.length) : key).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                    newItem[camelCaseKey] = item[key];
                }
            }
            newObj.push(newItem);
        })
    }else{
        newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const camelCaseKey = (key.indexOf('_') == 0 ? key.substring(1, key.length) : key).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                newObj[camelCaseKey] = obj[key];
            }
        }
    }
    return newObj;
}
// 오브젝트 카멜케이스로 전환 함수 - end 


module.exports = { pool, sendQuery }
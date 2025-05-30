// 라우터란 한 마디로 간단하게 설명하면 '연결 장치'입니다.
// 즉, index.js 한 파일에서만 런칭할 수 있는 것이 아닌 router라는 것을 이용해서 여러가지 .js 파일에다가 원하는 코드를 짤 수 있다는 겁니다.
// 사실 이 router를 이용하는 이유는 코드의 간략화 + 가독성 때문입니다.
// index.js 하나에 다 묶여 넣으면 길이도 길어지고 그러므로 가독성이 떨어지게 됩니다
// 우리 모두 이런 문제를 해결하기 위해 갓갓 router를 쓰도록 합시다.



// NYD Original init Route
// 얘를 AJAX 처럼 쓰면 되겠네
// 라우터, 컨트롤러, {접근 옵션들}
// 구조 분할로 정보 전달해서 차후에 수정 시 편리하게 하기 위함
const initRoute = (router, {url, callback, type}) => {
    try {
        let connType;
        type = type?.toLowerCase(); // 기본적으로 소문자 처리
        if(type == undefined || type == null || type == ''){ // default는 POST 방식
            connType = 'post';
        }else if(type == 'put' || type == 'patch' || type == 'delete' || type == 'trace' || type == 'options' || type == 'connect' || type == 'track'){
            console.log(`${type} - ${url} 취약 메서드입니다. 제외합니다.`);
            return; // ISSUE : 취약점에 걸리는 METHOD 제외
        }else{
            connType = type;
        }
        // 4차 수정 - 거의 완성일 듯
        router[connType](url, (request, response) => {
            getBaseController({
                request : request ,
                response : response, 
                callback : callback,
                params : getParams(request) // 파라미터 죄다 뽑아내서 정제 후 반환하여 params에 저장하여 컨트롤러로 전달
            });
        });
    } catch (error) {
        console.log(`initRoute error : ${error.message}`);
        return respToJson(response, 500, {
            message : `URL : ${url} \n Error : ${error.message}`
        });
    }
}
// NYD Original
// initRoute와 함께 사용하기 위한 공용 Controller
const getBaseController = async ({request, response, callback, params}) => {
    try {
        const result = await callback(params);
        return respToJson(response, 200, result);
    } catch (error) {
        console.log(`getBaseController error : ${error.message}`);
        return respToJson(response, 500, {
            message : 'Error getBaseController : ' + error.message
        });
    }
}

// NYD Original
// 파라미터 죄다 뽑아내서 정제 후 반환하여 params에 저장하여 컨트롤러로 전달하기 위한 함수
const getParams = (request) => {
    const param = {}
    
    const query = request.query;
    const params = request.params;
    const body = request.body;

    for(const key in query){
        param[key] = query[key];
    }

    for(const key in params){
        param[key] = params[key];
    }

    for(const key in body){
        param[key] = body[key];
    }

    // params == {} 는 정상적으로 비교되지 않으므로, key 개수가 0인지를 확인해서 처리
    // Object.keys(param).length
    return Object.keys(param).length == 0 ? undefined : param; // 빈객체면 그냥 undefined 반환
}

// NYD Original
// 응답값 JSON 처리 함수
const respToJson = (response, responseCode, data) => {
    const result = response.status(responseCode).json(data)
    return result;
}


module.exports = { initRoute, respToJson }
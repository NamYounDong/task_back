const router = require('express').Router(); // express의 Router 객체 생성(모듈 로드)
const { sendQuery } = require('../database/database'); // database 연결
const { initRoute } = require('../routes/getRoutes'); // 라우트 작성
const {v4:uuidv4} = require('uuid'); // 난수 생성 모듈
const dotenv = require('dotenv'); // require 메서드로 dotenv 모듈을 불러와서 환경 변수를 로드한다.
dotenv.config(); // dotenv 모듈을 사용하여 환경 변수를 로드한다


const tasksControllers = [
    {
        url : '/getTasks', 
        type : 'post',
        callback : async (params) => {
            let query = 'select * from tasks'

            const whereArr = [];
            if(params != undefined){
                let where = ' where ';
                
                if(params.userId != undefined){
                    whereArr.push(params.userId);
                    where += ` user_id = $${whereArr.length}`; 
                }

                if(params.id != undefined){
                    whereArr.push(params.id);
                    where += ` ${whereArr.length == 1 ? '' : 'or'} id = $${whereArr.length}`; 
                }

                if(params.title != undefined){
                    whereArr.push(params.title);
                    where += ` ${whereArr.length == 1 ? '' : 'or'} title like concat('%', $${whereArr.length}::text, '%')`; 
                }

                if(params.isCompleted != undefined){
                    whereArr.push(params.isCompleted);
                    where += ` ${whereArr.length == 1 ? '' : 'or'} is_completed = $${whereArr.length}`; 
                }

                if(where.trim() != 'where'){
                    query += where;
                }
            }

            console.log('---------------updateTask-----------------');
            console.log(query);
            console.log(whereArr);

             // params가 있으면 조건절 추가
            query += ' order by date, created_at';

            const result = await sendQuery(query, whereArr);

            return result;
        }
    },
    
    {
        url : '/getTask', 
        type : 'post',
        callback : async (params) => {
            let query = 'select * from tasks'

            const whereArr = [];
            if(params != undefined){
                let where = ' where ';
                
                if(params.id != undefined){
                    whereArr.push(params.id);
                    where += ` id = $${whereArr.length}`; 
                }

                if(where.trim() != 'where'){
                    query += where;
                }
            }

            console.log('---------------updateTask-----------------');
            console.log(query);
            console.log(whereArr);

             // params가 있으면 조건절 추가
            query += ' order by id desc';

            const result = await sendQuery(query, whereArr);

            return result ? result[0] : {}; // 배열이 아닌 일반 객체로 전달
        }
    },



    {
        url : '/insertTask', 
        type : 'post',
        callback : async (params) => {
            const id = uuidv4();
            let query = 'insert into tasks (id, title, description, date, is_completed, is_important, user_id) values ($1, $2, $3, $4, $5, $6, $7)';
            const {title, description, date, isCompleted, isImportant, userId} = params;

            console.log('---------------updateTask-----------------');
            console.log(query);
            console.log([id, title, description, date, isCompleted, isImportant, userId]);

            await sendQuery(query, [id, title, description, date, isCompleted, isImportant, userId]);

            return {
                message : 'insert task success...'
            };
        }
    },

    {
        url : '/updateTask', 
        type : 'post',
        callback : async (params) => {
            let query = 'update tasks set ';

            console.log(params);

            const setArr = [];
            const whereArr = [];
            if(params != undefined){
                // 수정할 컬럼 추가
                if(params.isCompleted != undefined){
                    setArr.push(params.isCompleted);
                    query += `${setArr.length == 1 ? '' : ','} is_completed = $${setArr.length}`; 
                }

                if(params.isImportant != undefined){
                    setArr.push(params.isImportant);
                    query += `${setArr.length == 1 ? '' : ','} is_important = $${setArr.length}`; 
                }

                if(params.title != undefined){
                    setArr.push(params.title);
                    query += `${setArr.length == 1 ? '' : ','} title = $${setArr.length}`; 
                }


                if(params.date != undefined){
                    setArr.push(params.date);
                    query += `${setArr.length == 1 ? '' : ','} date = $${setArr.length}`; 
                }


                if(params.description != undefined){
                    setArr.push(params.description);
                    query += `${setArr.length == 1 ? '' : ','} description = $${setArr.length}`; 
                }

                // 조건절 추가
                let where = ' where ';
                
                if(params.id != undefined){
                    whereArr.push(params.id);
                    where += `id = $${setArr.length + whereArr.length}`; 
                }

                if(where.trim() != 'where'){
                    query += where;
                }
            }

            console.log('---------------updateTask-----------------');
            console.log(query);
            console.log([...setArr, ...whereArr]);

            await sendQuery(query, [...setArr, ...whereArr]);
            

            return {
                message : 'update task success...'
            };
        }
    },

    {
        url : '/deleteTask/:id', // 이렇게도 처리됨.
        type : 'get',
        callback : async (params) => {
            const id = uuidv4();
            let query = 'delete from tasks';

            const whereArr = [];
            if(params != undefined){
                let where = ' where ';
                
                if(params.id != undefined){
                    whereArr.push(params.id);
                    where += ` id = $${whereArr.length}`; 
                }

                if(params.userId != undefined){
                    whereArr.push(params.userId);
                    where += ` ${whereArr.length == 1 ? '' : 'or'} user_id = $${whereArr.length}`; 
                }

                if(params.isCompleted != undefined){
                    whereArr.push(params.isCompleted);
                    where += ` ${whereArr.length == 1 ? '' : 'or'} is_completed = $${whereArr.length}`; 
                }

                if(where.trim() != 'where'){
                    query += where;
                }
            }

            console.log('---------------deleteTask-----------------');
            console.log(query);
            console.log(whereArr);

            await sendQuery(query, whereArr);

            return {
                message : 'delete task success...'
            };
        }
    }, 

    {
        url : '/getMsrstnList', 
        type : 'get',
        callback : async (params) => {
            try {
                const dataUrl = `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList?serviceKey=${process.env.PUBLIC_DATA_API_SERVICE_KEY}&returnType=json&numOfRows=100&pageNo=1&addr=서울`;
    
                const data = JSON.parse(await getExternalURLData(dataUrl));
                if(data.response){
                    if(data.response.body){
                        if(data.response.body.items){
                            return data.response.body.items;
                        }else{
                            return []
                        }
                    }else{
                        return []
                    }
                }else{
                    return []
                };
            } catch (error) {
                console.log(error)
                return {
                     message : 'getMsrstnList error...'
                }
            }
        }
    },



    {
        url : '/getLatLngAddr', 
        type : 'post',
        callback : async (params) => {
            try {
                const { lat, lng } = params;
                const addrUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${process.env.GOOGLE_MAPS_API_KEY}`
                const data = JSON.parse(await getExternalURLData(addrUrl));
                
                const addr = geocodeFilter(data.results);
                console.log(addr)
                return { addr : addr, results: data.results };
            } catch (error) {
                console.log(error)
                return {
                     message : 'getMsrstnList error...'
                }
            }
        }
    }



    
];



function getExternalURLData(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? require('https') : require('http'); // url http / https에 따른 protocol 처리
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      };


      protocol.get(url, options, (response) => {
        const chunks = [];
  
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
  
        response.on('end', () => {
            // charset이 utf-8인지 검사하여 아니라면 다시 buffer로 재추출
            const buffer = Buffer.concat(chunks);
            const contentType = response.headers['content-type'];
            const charset = contentType ? contentType.split('charset=')[1] : 'utf-8';
            const data = buffer.toString(charset);
            resolve(data);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
}



const geocodeFilter = (results) => {
    const typesTrgtArr = [
        "convenience_store",
        "establishment",
        "food",
        "point_of_interest",

        'natural_feature',                  // 자연 지형
        'place',                  // 장소
        'landmark',                  // 랜드마크
        
        'hospital',                  // 병원
        'school',                  // 학교
        'college',                  // 대학
        'university',                  // 대학교
        'library',                  // 도서관
        'museum',                  // 박물관
        'park',                  // 공원
        'church',                  // 교회
        'temple',                  // 사찰
        'synagogue',                  // 시나고가
        'mosque',                  // 모스크
        'hotel',                  // 호텔
        'lodging',                  // 숙박 시설
        'restaurant',                  // 식당
        'bar',                  // 바
        'cafe',                  // 카페
        'night_club',                  // 나이트클럽
        'shopping_mall',                  // 쇼핑몰
        'department_store',                  // 백화점
        'supermarket',                  // 슈퍼마켓
        'store',                  // 상점
        'jewelry_store',                  // 보석점
        'florist',                  // 꽃집
        'bank',                  // 은행
        'atm',                  // 자동출입금
        'post_office',                  // 우체국
        'police_station',                  // 경찰서
        'fire_station',                  // 소방서
        'town_square',                  // 광장
        'city_hall',                  // 시청
        'monument',                  // 기념탑
        'memorial',                  // 기념비
        'museum',                  // 박물관
        'gallery',                  // 갤러리
        'art_gallery',                  // 미술관
        'historical_attraction',                  // 역사적인 명소
        'historical_location',                  // 역사적인 장소
        'historical_site',                  // 역사적인 유적지
        'historical_building',                  // 역사적인 건물
        'historical_place',                  // 역사적인 장소
        'historical_region',                  // 역사적인 지역
        'historical_district'                  // 역사적인 지구
    ]



    const typesTrgtArrSub = [
        'road',                  // 도로
        'building',                  // 건물
        'bridge',                  // 다리
        'tunnel',                  // 터널
        'footway',                  // 보도
        'bus_station',                  // 버스 정류장
        'railway_station',                  // 기차역
        'subway_station',                  // 지하철역
        'tram_station',                  // 트램 정류장
        'taxi_stand',                  // 택시 승강장
        'airport',                  // 공항
        'terminal',                  // 터미널
        'station',                  // 역
        'train_station',                  // 기차역
        'platform',                  // 플랫폼
        'underground',                  // 지하철
        'intersection',                  // 교차로
        'bus_stop',                  // 버스 정류장
        'railway_station',                  // 기차역
        'substation',                  // 변전소
        'transit_station',                  // 대중교통 정류장
        'city',                  // 도시
        'province',                  // 지방
        'region',                  // 지역
        'island',                  // 섬
        'continent',                  // 대륙
        'ocean',                  // 해양
        'sea',                  // 바다
        'river',                  // 강
        'lake',                  // 호수
        'mountain',                  // 산
        'hill',                  // 언덕
        'valley',                  // 계곡
        'highway',                  // 고속도로
        'railway',                  // 철도
    ]

    // const priorityResults = results.slice(0, 2); // 3순위 주소 까지만 처리

    // let addr = priorityResults.filter((result) => { // 1순위 조건 검색
    //     return typesTrgtArr.some(item => result.types.includes(item));
    // })
    
    // if(addr.length == 0){
    //     addr = priorityResults.filter((result) => { // 2순위 조건 검색
    //         return typesTrgtArrSub.some(item => result.types.includes(item));
    //     });
    //     if(addr.length == 0){
    //         addr = priorityResults.filter((result) => { // 없으면 일반도로
    //             return result.types.indexOf("street_address") != -1
    //         });
    //     }
    // }

    // if(addr == null || addr == undefined || addr.length == 0){
    //     return results[1];
    // }else{
    //     console.log(addr)
    //     return addr[0];
    // }

    return results[0]; // 애매한 경우가 많아서 일단 1순위 주소로 전달
}


tasksControllers.forEach(route => {
    // 4차 수정형 공통 Function으로 작성하여 처리중
    // router controller를 별도로 처리하는 이유는 차후 파일을 분리해서 관리할 때 개별로 입력하기 위함.
    initRoute(router, route);
});

module.exports = router;
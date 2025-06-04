import path from 'path';

// JS 날짜 포맷 설정
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    let h;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


// String Format 02d
export function pad(n, width){
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// 문자열을 입력받아 자동으로 정규식 생성
export function createWhitespaceInsensitiveRegex(str) {
    const escaped = str
      .split("")
      .map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // 특수문자 이스케이프
      .join("\\s*"); // 문자 사이에 공백 허용
  
    return new RegExp(escaped, "g");
}


// console.log 오버라이딩 : 디버그용으로 제작
console.log = (function(original) {
    return function() {
        const stack = new Error().stack;
        const stackLines = stack.split('\n');
        const callerLine = stackLines[2]; // 실제 호출 위치
        const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
            const [, functionName, filePath, line, column] = match;
            // 전체 경로에서 프로젝트 루트 이후의 경로만 추출
            const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
            const time = new Date().format('yyyy-MM-dd HH:mm:ss');
            original.apply(console, [`${time} [ ${relativePath} : ${functionName} ] :`, ...arguments]);
        } else {
            original.apply(console, arguments);
        }
    };
})(console.log);
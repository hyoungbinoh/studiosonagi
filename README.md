# studiosonagi 스튜디오 홈페이지

> ##### HTML, CSS, javascript 등을 활용한 스튜디오 홈페이지 제작
![스튜디오소나기스크린샷](https://user-images.githubusercontent.com/108599126/219299869-83fabaca-142f-4f5a-a2e7-7a44dd826e54.PNG)
##### URL: https://www.studiosonagi.com
   
### 1. 개발목표
* ##### 회사에서 스튜디오가 오픈함에 따라 운영에 필요한 홈페이지 제작. 
* ##### 강의를 통해 배운 HTML, CSS, javascript 등의 언어를 복습하고 응용하기 위하여 제작.
   
### 2. 사용기술
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white"> <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon AWS&logoColor=white">  <img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat&logo=amazon EC2&logoColor=white"> 

### 3. 구현기능
* 예약 달력 기능
<img src="https://user-images.githubusercontent.com/108599126/221131473-f4f7054b-5b80-4744-b354-b575c09b52c3.PNG" width="630" height="340">

```
//예약 날짜에 예약 내역 붙이기(위의 달력 제작 과정 생략)
function showMessage() {
   //Flask에서 Ajax 받기
   $.ajax({
      type: "GET",
      url: "/message",
      data: {},
      success: function (response) {
         let messages = response['all_messages']
         for (let j = 0; j < messages.length; j++) {
            let name = messages[j]['name']
            let reservationDate = messages[j]['date']
            let startTime = messages[j]['start_time']
            let endTime = messages[j]['end_time']
            let confirm = messages[j]['confirm']
            //예약 날짜의 표기가 달력 날짜 표기와 같도록 조정
            let adminYear = reservationDate.slice(0, 4)
            let adminMonth = ""
            let adminDate = ""
            if (reservationDate[5] == 0) {
               adminMonth = reservationDate[6]
            } else {
               adminMonth = reservationDate.slice(5, 7)
            }
            if (reservationDate[8] == 0) {
               adminDate = reservationDate[9]
            } else {
               adminDate = reservationDate.slice(8, 10)
            }
            //해당 예약 날짜에 해당 내역 표기
            if (viewMonth + 1 == adminMonth && viewYear == adminYear) {
               for (let date of document.querySelectorAll('.this')) {
                  if (+date.innerText == adminDate && confirm === "CONFIRMED") {
                     if (innerWidth <= 768) {
                        $(date).after(`<p class="reservation-list">${name[0]}*${name[name.length - 1]}님</p>`)
                     } else {
                        $(date).after(`<p class="reservation-list">${name[0]}*${name[name.length - 1]}님 ${startTime}~${endTime}</p>`)
                     }
                  }
               }
            }
         }
      }
   })
}
```

* 관리자 페이지 로그인 기능
* 관리자 페이지 정보 등록 기능

### 4. 개선사항

# studiosonagi 스튜디오 홈페이지

> ##### HTML, CSS, javascript 등을 활용한 스튜디오 홈페이지 제작
![스튜디오소나기스크린샷](https://user-images.githubusercontent.com/108599126/219299869-83fabaca-142f-4f5a-a2e7-7a44dd826e54.PNG)
##### URL: https://www.studiosonagi.com
   
### 1. 개발목표
* 회사에서 스튜디오가 오픈함에 따라 운영에 필요한 홈페이지 제작. 
* 강의를 통해 배운 HTML, CSS, javascript 등의 언어를 복습하고 응용하기 위하여 제작.
   
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
<img src="https://user-images.githubusercontent.com/108599126/221135708-dd2929b0-2d82-4ec7-ae08-d86b760da4c7.PNG" width="630" height="340">

```
<!-- HTML5 -->
<form method="get" id="login" class="login-container" action={{url_for("login")}}>
   <div class="login-wrap">
      <p class="login-logo">STUDIO SONAGI</p>
      <input type="id" id="loginId" name="loginId" class="login-common" placeholder="ID" />
      <input type="password" id="loginPw" name="loginPw" class="login-common" placeholder="Password"
         autocomplete="off" />
      <button type="submit" class="login">로그인</button>
   </div>
</form>
```

```
#Python Flask
@app.route('/login', methods=["get"])
def login():
    id_receive = request.args.get('loginId')
    id_hash = hashlib.sha256(id_receive.encode('utf-8')).hexdigest()

    password_receive = request.args.get('loginPw')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'id': id_hash,
        'password': password_hash
    }

    result = db.admin.find_one(doc)

    if result is not None:
        session["userID"] = id_receive
        return redirect(url_for("admin"))
    else:
        return redirect(url_for("admin"))
```

* 포트폴리오, 3D 샘플, 필모그래피 데이터 생성(관리자 페이지 CRUD 기능)
<img src="https://user-images.githubusercontent.com/108599126/221138781-5d6c6571-7f71-4418-a629-077c27b76955.PNG" width="630" height="340">

```
// jQuery
function uploadMovie() {
    let movieTitle = $('#movie-title').val()
    let movieImg = $('#movie-img').val()
    let movieUrl = $('#movie-url').val()

    // ID 값 등록 시간으로 대체
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let movieNum = year + month + day + hours + minutes + seconds;

    // 유효성 검사
    if (movieTitle == "") {
        alert("제목을 입력해주세요.");
        return false;
    }

    if (movieImg == "") {
        alert("이미지 URL을 입력해주세요.");
        return false;
    }

    if (movieUrl == "") {
        alert("네이버 영화 URL을 입력해주세요.");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/filmography_server",
        data: { movie_title_give: movieTitle, movie_url_give: movieUrl, movie_img_give: movieImg, movie_num_give: movieNum },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}
```

```
#Python Flask
@app.route('/filmography_server', methods=['POST'])
def get_movie():
    movie_num_receive = request.form['movie_num_give']
    movie_title_receive = request.form['movie_title_give']
    movie_img_receive = request.form['movie_img_give']
    movie_url_receive = request.form['movie_url_give']

    doc = {
        'movie_num': movie_num_receive,
        'movie_title': movie_title_receive,
        'movie_img': movie_img_receive,
        'movie_url': movie_url_receive
    }

    db.filmography.insert_one(doc)

    return jsonify({'msg': '영화가 등록되었습니다.'})
```

* 포트폴리오, 3D 샘플, 필모그래피 데이터 읽기(CRUD 기능)
데이터 있는 경우
<img src="https://user-images.githubusercontent.com/108599126/222898338-34ebb1d0-fe1e-4f5b-867d-67cdc514e3ce.JPG" width="630" height="340">
데이터 없는 경우
<img src="https://user-images.githubusercontent.com/108599126/222899880-d3f8f470-35bc-43b1-b907-3aa41b5bd870.JPG" width="630" height="340">

```
// jQuery
function showSample() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/sample_server",
        data: {},
        success: function (response) {
            let samples = response['all_samples'].reverse()
            if (samples.length != 0) {
                for (let i = 0; i < samples.length; i++) {
                    let sampleNum = samples[i]['sample_num']
                    let sampleTitle = samples[i]['sample_title']
                    let sampleIcvfx = samples[i]['sample_icvfx']
                    let sampleImg1 = samples[i]['sample_img1']

                    // 3D 샘플 내역 생성
                    let temp_html = `<div>
                                        <a href="/sample/${sampleNum}">
                                            <div class="portfolio-img">
                                                <img src="/static/sample/${sampleImg1}" alt="${sampleTitle}">
                                            </div>
                                            <p class="portfolio-text">${sampleTitle}<span class="portfolio-span">${sampleIcvfx == 'true' ? '(ICVFX 가능)' : ''}</span></p>
                                        </a>
                                    </div>`
                    $('#sample-wrap').append(temp_html)
                }
            } else {
                // 3D 샘플 내역 없을 때
                let temp_html = `<p class="portfolio-none">3D 맵 샘플 준비 중입니다.</p>`
                $('#sample-wrap').append(temp_html)
            }
        }
    })
}

```

```
#Python Flask
@app.route('/sample_server', methods=['GET'])
def read_sample():
    samples = list(db.sample.find({}, {'_id': False}))
    return jsonify({'all_samples': samples})
```

### 4. 개선사항
* 예약페이지 해당 달력 날짜 입력시 예약 팝업 또는 예약 상세페이지 이동 방안 고려 필요(현재는 단일 페이지)

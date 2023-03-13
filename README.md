# studiosonagi 스튜디오 홈페이지

> ##### HTML, CSS, javascript 등을 활용한 스튜디오 홈페이지 제작
![스튜디오소나기스크린샷](https://user-images.githubusercontent.com/108599126/219299869-83fabaca-142f-4f5a-a2e7-7a44dd826e54.PNG)
##### URL: https://www.studiosonagi.com
   
### 1. 개발목표
* 회사에서 스튜디오가 오픈함에 따라 운영에 필요한 홈페이지 제작. 
* 강의를 통해 배운 HTML, CSS, JavaScript 등의 언어를 복습하고 응용하기 위하여 제작.
<br/><br/>
   
### 2. 제작인원
* 풀스택 개발자 1명(본인)
<br/><br/>
   
### 3. 사용기술
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white"> <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon AWS&logoColor=white">  <img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat&logo=amazon EC2&logoColor=white"> 
<br/><br/>

### 4. 구현기능
* 예약 달력 기능

<img src="https://user-images.githubusercontent.com/108599126/221131473-f4f7054b-5b80-4744-b354-b575c09b52c3.PNG" width="630" height="340">

```
// JavaScript jQuery (위의 달력 제작 과정 생략)
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

* 관리자 페이지 CRUD 기
<img src="https://user-images.githubusercontent.com/108599126/221138781-5d6c6571-7f71-4418-a629-077c27b76955.PNG" width="630" height="340">

```
// JavaScript jQuery
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

* Ajax를 활용한 서버와 비동기 통신

<p>- 데이터 있는 경우</p>
<img src="https://user-images.githubusercontent.com/108599126/222898338-34ebb1d0-fe1e-4f5b-867d-67cdc514e3ce.JPG" width="630" height="340">

<p>- 데이터 없는 경우</p>
<img src="https://user-images.githubusercontent.com/108599126/222899880-d3f8f470-35bc-43b1-b907-3aa41b5bd870.JPG" width="630" height="340">

```
// JavaScript jQuery
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

* 포트폴리오, 3D 샘플, 필모그래피 데이터 수정(관리자 페이지 CRUD 기능)

<img src="https://user-images.githubusercontent.com/108599126/222917190-3fb21f93-1b75-4279-aaff-33e2063b2f85.JPG" width="630" height="340">

```
# Python Flask
@app.route('/portfolio_server/update', methods=['POST'])
def update_portfolio():

   # 중간생략
   
    try:
        portfolio_img2 = request.files['portfolio_img2_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            portfolio_delete2 = portfolio_num_target['portfolio_img2']
        except KeyError:
            pass
        else:
            portfolio_doc2 = [{'$set': {'portfolio_img2': portfolio_delete2}}]
            doc.extend(portfolio_doc2)
    else:
        try:
            portfolio_delete2 = portfolio_num_target['portfolio_img2']
        except KeyError:
            portfolio_extension2 = portfolio_img2.filename.split('.')[-1]
            portfolio_file2 = f'{portfolio_time}_portfolio_img2'
            portfolio_save2 = f'static/portfolio/{portfolio_file2}.{portfolio_extension2}'
            portfolio_img2.save(portfolio_save2)
            portfolio_doc2 = [{'$set': {'portfolio_img2': f'{portfolio_file2}.{portfolio_extension2}'}}]
            doc.extend(portfolio_doc2)
        else:
            os.remove('./static/portfolio/' + portfolio_delete2)
            portfolio_extension2 = portfolio_img2.filename.split('.')[-1]
            portfolio_file2 = f'{portfolio_time}_portfolio_img2'
            portfolio_save2 = f'static/portfolio/{portfolio_file2}.{portfolio_extension2}'
            portfolio_img2.save(portfolio_save2)
            portfolio_doc2 = [{'$set': {'portfolio_img2': f'{portfolio_file2}.{portfolio_extension2}'}}]
            doc.extend(portfolio_doc2)

    # 중간생략

    db.portfolio.update_one({'portfolio_num': portfolio_num_receive}, doc)
    flash('포트폴리오가 수정되었습니다.', 'msg')
    return jsonify({'msg': '포트폴리오가 수정되었습니다.'})
```

* 포트폴리오, 3D 샘플 상세 페이지

<img src="https://user-images.githubusercontent.com/108599126/222917909-693ac111-f5a1-4544-9c0b-7821315f5730.JPG" width="630" height="340">

```
<!-- HTML -->
<div class="common-container">
  <div class="common-wrap">
    <div class="portfolio-top" id="sample-detail-wrap">
      <div style="display: flex; flex-direction:column; justify-content:center;">
        <h1>{{ doc.portfolio_title }}</h1>
        {% if doc.portfolio_movie != '' %}
        <iframe class="portfolio-detail-img"
          src="https://www.youtube.com/embed/{{ doc.portfolio_movie }}"></iframe>
        {% endif %}
        <img class="portfolio-detail-img" src="/static/portfolio/{{ doc.portfolio_img1 }}">
        {% if doc.portfolio_img2 %}
        <img class="portfolio-detail-img" src="/static/portfolio/{{ doc.portfolio_img2 }}">
        {% endif %}
        {% if doc.portfolio_img3 %}
        <img class="portfolio-detail-img" src="/static/portfolio/{{ doc.portfolio_img3 }}">
        {% endif %}
        {% if doc.portfolio_img4 %}
        <img class="portfolio-detail-img" src="/static/portfolio/{{ doc.portfolio_img4 }}">
        {% endif %}
        <a href="/portfolio" class="portfolio-detail-btn">돌아가기</a>
      </div>
    </div>
  </div>
</div>
```

### 5. 문제해결
* 예약 달력에 달력 내용이 나오게 하는 방법을 잘 몰라서 어려움이 있었는데, 여러가지 안을 생각해보던 중 Ajax를 통해 서버에서 데이터를 가져올 때 그 안에 달력 값을 가져오는 방법을 생각했고, 그 방법을 적용하여 해결하였습니다.
* 이미지 데이터를 받아올 때 이미지 값이 null이면 서버에서 에러가 나는 문제가 있었고, 에러를 예외처리 하여 그 문제를 해결하였습니다.
<br/><br/>

### 6. 보완할 점
* 수정 페이지에서 수정 후 관리자페이지로 리디렉션 필요
<br/><br/>

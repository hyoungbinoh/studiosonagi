// showMovie, adminMovie 함수 실행
$(document).ready(function () {
    showMovie();
    adminMovie();
});

// 필모그래피 등록
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

// 필모그래피 수정
function updateMovie() {
    let movieNum = $('#movie-num').val()
    let movieTitle = $('#movie-title').val()
    let movieImg = $('#movie-img').val()
    let movieUrl = $('#movie-url').val()

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
        url: "/filmography_server/update",
        data: { movie_title_give: movieTitle, movie_url_give: movieUrl, movie_img_give: movieImg, movie_num_give: movieNum },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 관리자 필모그래피 내역 확인
function adminMovie() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/filmography_server",
        data: {},
        success: function (response) {
            let films = response['all_films'].reverse()
            for (let i = 0; i < films.length; i++) {
                let movieNum = films[i]['movie_num']
                let movieTitle = films[i]['movie_title']
                let movieImg = films[i]['movie_img']
                let movieUrl = films[i]['movie_url']

                // 필모그래피 내역 생성
                let temp_html = `<tr>
                                    <td>${movieTitle}</td>
                                    <td><img style="width: 150px; height: 200px;" src="${movieImg}"></td>
                                    <td><a class="admin-url" href="${movieUrl}">${movieUrl}</a></td>
                                    <td><a class="admin-table-update" href="/filmography_admin/${movieNum}">수정</a></td>
                                    <td><button class="admin-table-delete" type="button" onclick="deleteMovie(${movieNum})">삭제</button></td>
                                </tr>`
                $('#movie-admin').append(temp_html)
            }
        }
    })
}

// 필모그래피 내역 보여주기
function showMovie() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/filmography_server",
        data: {},
        success: function (response) {
            let films = response['all_films'].reverse()
            if (films.length != 0) {
                for (let i = 0; i < films.length; i++) {
                    let movieTitle = films[i]['movie_title']
                    let movieImg = films[i]['movie_img']
                    let movieUrl = films[i]['movie_url']

                    // 필모그래피 내역 생성
                    let temp_html = `<a class="movie-url" href="${movieUrl}">
                                        <img class="movie-img" src="${movieImg}" alt="${movieTitle}">
                                        <p class="movie-title">${movieTitle}</p>
                                    </a>`
                    $('#movie-wrap').append(temp_html)
                }
            } else {
                // 필모그래피 내역 없을 때
                let temp_html = `<p class="movie-none">필모그래피 준비 중입니다.</p>`
                $('#movie-wrap').append(temp_html)
            }

        }
    })
}


// 필모그래피 내역 삭제
function deleteMovie(movieNum) {
    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/filmography_server/delete",
        data: { movie_delete_give: movieNum },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}
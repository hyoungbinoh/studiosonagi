$(document).ready(function() {
    showMovie();
    adminMovie();
});



function uploadMovie() {
    let movieTitle = $('#movie-title').val()
    let movieImg = $('#movie-img').val()
    let movieUrl = $('#movie-url').val()
    
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let movieNum = year + month + day + hours + minutes + seconds;


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

    $.ajax({
        type: "POST",
        url: "/filmography_server",
        data: { movie_title_give : movieTitle, movie_url_give: movieUrl, movie_img_give: movieImg, movie_num_give: movieNum},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

function updateMovie() {
    let movieNum = $('#movie-num').val()
    let movieTitle = $('#movie-title').val()
    let movieImg = $('#movie-img').val()
    let movieUrl = $('#movie-url').val()


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

    $.ajax({
        type: "POST",
        url: "/filmography_server/update",
        data: { movie_title_give : movieTitle, movie_url_give: movieUrl, movie_img_give: movieImg, movie_num_give: movieNum},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

function adminMovie() {
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

function showMovie() {
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
    
                    let temp_html = `<a class="movie-url" href="${movieUrl}">
                                        <img class="movie-img" src="${movieImg}" alt="${movieTitle}">
                                        <p class="movie-title">${movieTitle}</p>
                                    </a>`
                    $('#movie-wrap').append(temp_html)
                }
            } else {
                let temp_html = `<p class="movie-none">필모그래피 준비 중입니다.</p>`
                $('#movie-wrap').append(temp_html)
            }

        }
    })
}

function deleteMovie(movieNum) {
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
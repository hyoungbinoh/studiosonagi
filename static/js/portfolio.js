// adminPortfolio, showPortfolio 함수 실행
$(document).ready(function () {
    adminPortfolio();
    showPortfolio();
});

// 포트폴리오 등록
function uploadPortfolio() {
    let portfolioTitle = $('#portfolio-title').val();
    let portfolioImg1 = $('#portfolio-img1')[0].files[0];
    let portfolioImg2 = $('#portfolio-img2')[0].files[0];
    let portfolioImg3 = $('#portfolio-img3')[0].files[0];
    let portfolioImg4 = $('#portfolio-img4')[0].files[0];
    let portfolioMovie = $('#portfolio-movie').val();

    // ID 값 등록 시간으로 대체
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let portfolioNum = year + month + day + hours + minutes + seconds;

    // FormDate 객체 생성
    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    formData.append('portfolio_title_give', portfolioTitle);
    formData.append('portfolio_img1_give', portfolioImg1);
    formData.append('portfolio_img2_give', portfolioImg2);
    formData.append('portfolio_img3_give', portfolioImg3);
    formData.append('portfolio_img4_give', portfolioImg4);
    formData.append('portfolio_movie_give', portfolioMovie);

    // 유효성 검사(제목, 이미지 1만)
    if (portfolioTitle == "") {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (portfolioImg1 == null) {
        alert("이미지1을 첨부해주세요.");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/portfolio_server",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 포트폴리오 보여주기
function showPortfolio() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/portfolio_server",
        data: {},
        success: function (response) {
            let portfolios = response['all_portfolios'].reverse()
            if (portfolios.length != 0) {
                for (let i = 0; i < portfolios.length; i++) {
                    let portfolioNum = portfolios[i]['portfolio_num']
                    let portfolioTitle = portfolios[i]['portfolio_title']
                    let portfolioImg1 = portfolios[i]['portfolio_img1']

                    // 포트폴리오 내역 생성
                    let temp_html = `<div>
                                        <a href="/portfolio/${portfolioNum}">
                                            <div class="portfolio-img">
                                            <img src="/static/portfolio/${portfolioImg1}" alt="${portfolioTitle}">
                                            </div>
                                            <p class="portfolio-text">${portfolioTitle}</p>
                                        </a>
                                    </div>`
                    $('#portfolio-wrap').append(temp_html)
                }
            } else {
                let temp_html = `<p class="portfolio-none">포트폴리오 준비 중입니다.</p>`
                $('#portfolio-wrap').append(temp_html)
            }

        }
    })
}

// 관리자 포트폴리오 내역 수정
function updatePortfolio() {
    let portfolioNum = $('#portfolio-num').val();
    let portfolioTitle = $('#portfolio-title').val();
    let portfolioImg1 = $('#portfolio-img1')[0].files[0];
    let portfolioImg2 = $('#portfolio-img2')[0].files[0];
    let portfolioImg3 = $('#portfolio-img3')[0].files[0];
    let portfolioImg4 = $('#portfolio-img4')[0].files[0];
    let portfolioMovie = $('#portfolio-movie').val();

    // FormDate 객체 생성
    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    formData.append('portfolio_title_give', portfolioTitle);
    formData.append('portfolio_img1_give', portfolioImg1);
    formData.append('portfolio_img2_give', portfolioImg2);
    formData.append('portfolio_img3_give', portfolioImg3);
    formData.append('portfolio_img4_give', portfolioImg4);
    formData.append('portfolio_movie_give', portfolioMovie);

    // 유효성 검사(제목만)
    if (portfolioTitle == "") {
        alert("제목을 입력해주세요.");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/portfolio_server/update",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 관리자 포트폴리오 내역 확인
function adminPortfolio() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/portfolio_server",
        data: {},
        success: function (response) {
            let portfolios = response['all_portfolios'].reverse()

            for (let i = 0; i < portfolios.length; i++) {
                let portfolioNum = portfolios[i]['portfolio_num']
                let portfolioTitle = portfolios[i]['portfolio_title']
                let portfolioImg1 = portfolios[i]['portfolio_img1']
                let portfolioImg2 = portfolios[i]['portfolio_img2']
                let portfolioImg3 = portfolios[i]['portfolio_img3']
                let portfolioImg4 = portfolios[i]['portfolio_img4']
                let portfolioMovie = portfolios[i]['portfolio_movie']

                // 포트폴리오 내역 생성
                let temp_html = `<tr>
                                    <td>${portfolioTitle}</td>
                                    <td><img class="admin-img" src="/static/portfolio/${portfolioImg1}"></td>
                                    ${portfolioImg2 !== undefined ?
                        `<td><img class="admin-img" src="/static/portfolio/${portfolioImg2}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${portfolioImg3 !== undefined ?
                        `<td><img class="admin-img" src="/static/portfolio/${portfolioImg3}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${portfolioImg4 !== undefined ?
                        `<td><img class="admin-img" src="/static/portfolio/${portfolioImg4}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${portfolioMovie !== '' ?
                        `<td><a class="admin-url" href="https://www.youtube.com/embed/${portfolioMovie}">
                                            https://www.youtube.com/<br>embed/${portfolioMovie}
                                        </a></td>` :
                        '<td></td>'
                    }
                                    <td><a class="admin-table-update" href="/portfolio_admin/${portfolioNum}">수정</a></td>
                                    <td><button class="admin-table-delete" type="button" onclick="deletePortfolio(${portfolioNum})">삭제</button></td>
                                </tr>`
                $('#portfolio-admin').append(temp_html)
            }
        }
    })
}


// 포트폴리오 내역 삭제
function deletePortfolio(portfolioNum) {
    $.ajax({
        type: "POST",
        url: "/portfolio_server/delete",
        data: { portfolio_delete_give: portfolioNum },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 이미지2 삭제
function deletePortfolioImg2() {
    let portfolioNum = $('#portfolio-num').val();
    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);

    $.ajax({
        type: "POST",
        url: "/portfolio_img2",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 이미지3 삭제
function deletePortfolioImg3() {
    let portfolioNum = $('#portfolio-num').val();
    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    $.ajax({
        type: "POST",
        url: "/portfolio_img3",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 이미지4 삭제
function deletePortfolioImg4() {
    let portfolioNum = $('#portfolio-num').val();
    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    $.ajax({
        type: "POST",
        url: "/portfolio_img4",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}


// 이미지가 변경되지 않았을 경우
$("#portfolio-img1").on('change', function () {
    let fileName = $("#portfolio-img1").val();
    $("#portfolio-file1").val(fileName);
})

$("#portfolio-img2").on('change', function () {
    let fileName = $("#portfolio-img2").val();
    $("#portfolio-file2").val(fileName);
})

$("#portfolio-img3").on('change', function () {
    let fileName = $("#portfolio-img3").val();
    $("#portfolio-file3").val(fileName);
})

$("#portfolio-img4").on('change', function () {
    let fileName = $("#portfolio-img4").val();
    $("#portfolio-file4").val(fileName);
})
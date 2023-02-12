$(document).ready(function() {
    adminPortfolio();
    showPortfolio();
});

function uploadPortfolio() {
    let portfolioTitle = $('#portfolio-title').val();
    let portfolioImg1 =  $('#portfolio-img1')[0].files[0];
    let portfolioImg2 =  $('#portfolio-img2')[0].files[0];
    let portfolioImg3 =  $('#portfolio-img3')[0].files[0];
    let portfolioImg4 =  $('#portfolio-img4')[0].files[0];
    let portfolioMovie =  $('#portfolio-movie').val();

    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let portfolioNum = year + month + day + hours + minutes + seconds;

    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    formData.append('portfolio_title_give', portfolioTitle);
    formData.append('portfolio_img1_give', portfolioImg1);
    formData.append('portfolio_img2_give', portfolioImg2);
    formData.append('portfolio_img3_give', portfolioImg3);
    formData.append('portfolio_img4_give', portfolioImg4);
    formData.append('portfolio_movie_give', portfolioMovie);

    if (portfolioTitle == "") {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (portfolioImg1 == null) {
        alert("이미지1을 첨부해주세요.");
        return false;
    }

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

function updatePortfolio() {
    let portfolioNum = $('#portfolio-num').val();
    let portfolioTitle = $('#portfolio-title').val();
    let portfolioImg1 =  $('#portfolio-img1')[0].files[0];
    let portfolioImg2 =  $('#portfolio-img2')[0].files[0];
    let portfolioImg3 =  $('#portfolio-img3')[0].files[0];
    let portfolioImg4 =  $('#portfolio-img4')[0].files[0];
    let portfolioMovie =  $('#portfolio-movie').val();


    let formData = new FormData();
    formData.append('portfolio_num_give', portfolioNum);
    formData.append('portfolio_title_give', portfolioTitle);
    formData.append('portfolio_img1_give', portfolioImg1);
    formData.append('portfolio_img2_give', portfolioImg2);
    formData.append('portfolio_img3_give', portfolioImg3);
    formData.append('portfolio_img4_give', portfolioImg4);
    formData.append('portfolio_movie_give', portfolioMovie);

    if (portfolioTitle == "") {
        alert("제목을 입력해주세요.");
        return false;
    }

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

function adminPortfolio() {
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

                
                let temp_html = `<tr>
                                    <td>${portfolioTitle}</td>
                                    <td><img class="admin-img" src="/static/${portfolioImg1}"></td>
                                    ${portfolioImg2 !== undefined ? 
                                        `<td><img class="admin-img" src="/static/${portfolioImg2}"></td>` : 
                                        `<td><div class="admin-img"><div></td>`
                                    }
                                    ${portfolioImg3 !== undefined ? 
                                        `<td><img class="admin-img" src="/static/${portfolioImg3}"></td>` : 
                                        `<td><div class="admin-img"><div></td>`
                                    }
                                    ${portfolioImg4 !== undefined ? 
                                        `<td><img class="admin-img" src="/static/${portfolioImg4}"></td>` : 
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

function showPortfolio() {
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
    
                    let temp_html = `<div>
                                        <a href="/portfolio/${portfolioNum}">
                                            <div class="portfolio-img">
                                            <img src="/static/${portfolioImg1}" alt="${portfolioTitle}">
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

$("#portfolio-img1").on('change',function(){
    let fileName = $("#portfolio-img1").val();
    $("#portfolio-file1").val(fileName);
})

$("#portfolio-img2").on('change',function(){
    let fileName = $("#portfolio-img2").val();
    $("#portfolio-file2").val(fileName);
})

$("#portfolio-img3").on('change',function(){
    let fileName = $("#portfolio-img3").val();
    $("#portfolio-file3").val(fileName);
})

$("#portfolio-img4").on('change',function(){
    let fileName = $("#portfolio-img4").val();
    $("#portfolio-file4").val(fileName);
})
$(document).ready(function() {
    adminSns();
    showSns();
});

function changeFacebook() {
    let facebook = $('#facebook').val();
    let facebookUrl = $('#facebook-url').val();

    if (facebookUrl == "") {
        alert("페이스북 URL을 입력해주세요.");
        return false;
    };

    $.ajax({
        type: "POST",
        url: "/facebook",
        data: {facebook_give: facebook, facebook_url_give: facebookUrl},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

function changeInstagram() {
    let instagram = $('#instagram').val();
    let instagramUrl = $('#instagram-url').val();

    if (instagramUrl == "") {
        alert("인스타그램 URL을 입력해주세요.");
        return false;
    };

    $.ajax({
        type: "POST",
        url: "/instagram",
        data: {instagram_give: instagram, instagram_url_give: instagramUrl},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}


function changeYoutube() {
    let youtube = $('#youtube').val();
    let youtubeUrl = $('#youtube-url').val();

    if (youtubeUrl == "") {
        alert("유튜브 URL을 입력해주세요.");
        return false;
    };

    $.ajax({
        type: "POST",
        url: "/youtube",
        data: {youtube_give: youtube, youtube_url_give: youtubeUrl},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

function changeTiktok() {
    let tiktok = $('#tiktok').val();
    let tiktokUrl = $('#tiktok-url').val();

    if (tiktokUrl == "") {
        alert("틱톡 URL을 입력해주세요.");
        return false;
    };

    $.ajax({
        type: "POST",
        url: "/tiktok",
        data: {tiktok_give: tiktok, tiktok_url_give: tiktokUrl},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}


function changeBlog() {
    let blog = $('#blog').val();
    let blogUrl = $('#blog-url').val();

    if (blogUrl == "") {
        alert("네이버 블로그 URL을 입력해주세요.");
        return false;
    };

    $.ajax({
        type: "POST",
        url: "/blog",
        data: {blog_give: blog, blog_url_give: blogUrl},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

function showSns() {
    $.ajax({
        type: "GET",
        url: "/sns",
        data: {},
        success: function (response) {
            let sns = response['all_sns']
            let facebookUrl = sns[0]['facebook_url']
            let instagramUrl = sns[1]['instagram_url']
            let youtubeUrl = sns[2]['youtube_url']
            let tiktokUrl = sns[3]['tiktok_url']
            let blogUrl = sns[4]['blog_url']

            let temp_html = `<a class="icon" href="${facebookUrl}"><i class="fa-brands fa-facebook-f"></i></a>
                            <a class="icon" href="${instagramUrl}"><i class="fa-brands fa-instagram"></i></a>
                            <a class="icon" href="${youtubeUrl}"><i class="fa-brands fa-youtube"></i></a>
                            <a class="icon" href="${tiktokUrl}"><i class="fa-brands fa-tiktok"></i></a>
                            <a class="icon" href="${blogUrl}"><i class="fa fa-a"></i></a>`
            $('#sns-box').prepend(temp_html)
        }
    })
}

function adminSns() {
    $.ajax({
        type: "GET",
        url: "/sns",
        data: {},
        success: function (response) {
            let sns = response['all_sns']
            let facebookUrl = sns[0]['facebook_url']
            let instagramUrl = sns[1]['instagram_url']
            let youtubeUrl = sns[2]['youtube_url']
            let tiktokUrl = sns[3]['tiktok_url']
            let blogUrl = sns[4]['blog_url']

            let temp_html = `<div>
                                <input class="sns-name" value="페이스북" id="facebook" disabled>
                                <input class="sns-url" value="${facebookUrl}" type="text" id="facebook-url">
                                <button class="sns-btn" onclick="changeFacebook()" type="button">변경하기</button>
                            </div>
                            <div>
                                <input class="sns-name" value="인스타그램" id="instagram" disabled>
                                <input class="sns-url" value="${instagramUrl}" type="text" id="instagram-url">
                                <button class="sns-btn" onclick="changeInstagram()" type="button">변경하기</button>
                            </div>
                            <div>
                                <input class="sns-name" value="유튜브" id="youtube" disabled>
                                <input class="sns-url" value="${youtubeUrl}" type="text" id="youtube-url">
                                <button class="sns-btn" onclick="changeYoutube()" type="button">변경하기</button>
                            </div>
                            <div>
                                <input class="sns-name" value="틱톡" id="tiktok" disabled>
                                <input class="sns-url" value="${tiktokUrl}" type="text" id="tiktok-url">
                                <button class="sns-btn" onclick="changeTiktok()" type="button">변경하기</button>
                            </div>
                            <div>
                                <input class="sns-name" value="블로그" id="blog" disabled>
                                <input class="sns-url"  value="${blogUrl}"type="text" id="blog-url">
                                <button class="sns-btn" onclick="changeBlog()" type="button">변경하기</button>
                            </div>`
            $('#sns-admin').prepend(temp_html)
        }
    })
}
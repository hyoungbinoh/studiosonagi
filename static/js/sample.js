// adminSample, showSample 함수 실행
$(document).ready(function () {
    adminSample();
    showSample();
});

// 3D 샘플 등록
function uploadSample() {
    let sampleTitle = $('#sample-title').val();
    let sampleIcvfx = $('#sample-icvfx').prop("checked");
    let sampleImg1 = $('#sample-img1')[0].files[0];
    let sampleImg2 = $('#sample-img2')[0].files[0];
    let sampleImg3 = $('#sample-img3')[0].files[0];
    let sampleImg4 = $('#sample-img4')[0].files[0];
    let sampleMovie = $('#sample-movie').val();
    let sampleInfo = $('#sample-info').val();

    // ID 값 등록 시간으로 대체
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let sampleNum = year + month + day + hours + minutes + seconds;

    // FormDate 객체 생성
    let formData = new FormData();
    formData.append('sample_num_give', sampleNum);
    formData.append('sample_title_give', sampleTitle);
    formData.append('sample_icvfx_give', sampleIcvfx);
    formData.append('sample_img1_give', sampleImg1);
    formData.append('sample_img2_give', sampleImg2);
    formData.append('sample_img3_give', sampleImg3);
    formData.append('sample_img4_give', sampleImg4);
    formData.append('sample_movie_give', sampleMovie);
    formData.append('sample_info_give', sampleInfo);

    // 유효성 검사(제목, 이미지 1만)
    if (sampleTitle == "") {
        alert("제목을 입력해주세요.");
        return false;
    }

    if (sampleImg1 == null) {
        alert("이미지1을 등록해주세요.");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_server",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 3D 샘플 보여주기
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

// 관리자 3D 샘플 내역 확인
function adminSample() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/sample_server",
        data: {},
        success: function (response) {
            let samples = response['all_samples'].reverse()

            for (let i = 0; i < samples.length; i++) {
                let sampleNum = samples[i]['sample_num']
                let sampleTitle = samples[i]['sample_title']
                let sampleIcvfx = samples[i]['sample_icvfx']
                let sampleImg1 = samples[i]['sample_img1']
                let sampleImg2 = samples[i]['sample_img2']
                let sampleImg3 = samples[i]['sample_img3']
                let sampleImg4 = samples[i]['sample_img4']
                let sampleMovie = samples[i]['sample_movie']

                // 3D 샘플 내역 생성
                let temp_html = `<tr>
                                    <td>${sampleTitle}</td>
                                    ${sampleIcvfx === 'true' ?
                        '<td>가능</td>'
                        : '<td>불가능</td>'
                    }
                                    <td><img class="admin-img" src="/static/sample/${sampleImg1}"></td>
                                    ${sampleImg2 !== undefined ?
                        `<td><img class="admin-img" src="/static/sample/${sampleImg2}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${sampleImg3 !== undefined ?
                        `<td><img class="admin-img" src="/static/sample/${sampleImg3}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${sampleImg4 !== undefined ?
                        `<td><img class="admin-img" src="/static/sample/${sampleImg4}"></td>` :
                        `<td><div class="admin-img"><div></td>`
                    }
                                    ${sampleMovie !== '' ?
                        `<td><a class="admin-url" href="https://www.youtube.com/embed/${sampleMovie}">
                                            https://www.youtube.com/<br>embed/${sampleMovie}
                                        </a></td>`
                        : '<td></td>'
                    }
                                    <td><a class="admin-table-update" href="/sample_admin/${sampleNum}">수정</a></td>
                                    <td><button class="admin-table-delete" type="button" onclick="deleteSample(${sampleNum})">삭제</button></td>
                                </tr>`
                $('#sample-admin').append(temp_html)
            }
        }
    })
}

// 관리자 3D 샘플 내역 수정
function updateSample() {
    let sampleNum = $('#sample-num').val();
    let sampleTitle = $('#sample-title').val();
    let sampleIcvfx = $('#sample-icvfx').prop("checked");
    let sampleImg1 = $('#sample-img1')[0].files[0];
    let sampleImg2 = $('#sample-img2')[0].files[0];
    let sampleImg3 = $('#sample-img3')[0].files[0];
    let sampleImg4 = $('#sample-img4')[0].files[0];
    let sampleMovie = $('#sample-movie').val();
    let sampleInfo = $('#sample-info').val();

    // FormDate 객체 생성
    let formData = new FormData();
    formData.append('sample_num_give', sampleNum);
    formData.append('sample_title_give', sampleTitle);
    formData.append('sample_icvfx_give', sampleIcvfx);
    formData.append('sample_img1_give', sampleImg1);
    formData.append('sample_img2_give', sampleImg2);
    formData.append('sample_img3_give', sampleImg3);
    formData.append('sample_img4_give', sampleImg4);
    formData.append('sample_movie_give', sampleMovie);
    formData.append('sample_info_give', sampleInfo);

    // 유효성 검사(제목만)
    if (sampleTitle == "") {
        alert("제목을 입력해주세요.");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_server/update",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 3D 샘플 내역 삭제
function deleteSample(sampleNum) {
    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_server/delete",
        data: { sample_delete_give: sampleNum },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 이미지2 삭제
function deleteImg2() {
    let sampleNum = $('#sample-num').val();
    let formData = new FormData();
    formData.append('sample_num_give', sampleNum);

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_img2",
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
function deleteImg3() {
    let sampleNum = $('#sample-num').val();
    let formData = new FormData();
    formData.append('sample_num_give', sampleNum);

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_img3",
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
function deleteImg4() {
    let sampleNum = $('#sample-num').val();
    let formData = new FormData();
    formData.append('sample_num_give', sampleNum);

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/sample_img4",
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
$("#sample-img1").on('change', function () {
    let fileName = $("#sample-img1").val();
    $("#sample-file1").val(fileName);
})

$("#sample-img2").on('change', function () {
    let fileName = $("#sample-img2").val();
    $("#sample-file2").val(fileName);
})

$("#sample-img3").on('change', function () {
    let fileName = $("#sample-img3").val();
    $("#sample-file3").val(fileName);
})

$("#sample-img4").on('change', function () {
    let fileName = $("#sample-img4").val();
    $("#sample-file4").val(fileName);
})
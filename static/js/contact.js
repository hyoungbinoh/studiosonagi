$(document).ready(function () {
    showMessage();
});

// 예약날짜
$(function () {
    $('.datepicker').datepicker({
        minDate: 0,
        dateFormat: 'yy/mm/dd'
    });
})

// 시작시간
$('#start-time').timepicker({
    timeFormat: 'HH:00',
    interval: 60,
    startTime: '08:00',
    minTime: '00:00',
    maxTime: '23:00',
    dynamic: false,
}).timepicker('option', 'change', function () {
    // 종료시간은 시작시간과 사용시간을 더함
    let startTime = parseInt($('#start-time').val().substring(0, 2));
    let usageTime = parseInt($('#usage-time').val().substring(0, 2));
    let sumTime = (startTime + usageTime).toString().concat();
    if (sumTime > 24) {
        if (sumTime < 34) {
            endTime = "0" + (sumTime - 24) + ":00"
        } else {
            endTime = (sumTime - 24) + ":00"
        }
    } else if (sumTime <= 24) {
        if (sumTime < 10) {
            endTime = "0" + sumTime + ":00"
        } else {
            endTime = sumTime + ":00"
        }
    } else {
        endTime = ""
    }
    $('#end-time').attr('value', endTime);
})

// 사용시간
$('#usage-time').timepicker({
    timeFormat: 'H시간',
    interval: 60,
    minTime: '03:00',
    maxTime: '12:00',
    dynamic: false,
}).timepicker('option', 'change', function () {
    // 종료시간은 시작시간과 사용시간을 더함
    let startTime = parseInt($('#start-time').val().substring(0, 2));
    let usageTime = parseInt($('#usage-time').val().substring(0, 2));
    let sumTime = (startTime + usageTime).toString().concat();
    if (sumTime > 24) {
        if (sumTime < 34) {
            endTime = "0" + (sumTime - 24) + ":00"
        } else {
            endTime = (sumTime - 24) + ":00"
        }
    } else if (sumTime <= 24) {
        if (sumTime < 10) {
            endTime = "0" + sumTime + ":00"
        } else {
            endTime = sumTime + ":00"
        }
    } else {
        endTime = ""
    }
    $('#end-time').attr('value', endTime);
})

var getMail = RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/); // 이메일 주소 정규식
var getPhone = RegExp(/^\d{10,11}$/); // 핸드폰 번호 정규식

// 예약 신청
function sendMessage() {
    let name = $('#name').val();
    let phone = $('#phone').val();
    let email = $('#email').val();
    let reservationDate = $('#date').val();
    let startTime = $('#start-time').val();
    let usageTime = $('#usage-time').val();
    let endTime = $('#end-time').val();
    let produce = $('#produce').val();
    let confirm = 'UNCONFIRMED' //예약 승인 여부(최초값은 미승인)

    // ID 값 등록 시간으로 대체
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + date.getMonth() + 1).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let num = year + month + day + hours + minutes + seconds;


    // 유효성 검사
    if (name == "") {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (phone == "") {
        alert("휴대전화 번호를 입력해주세요.");
        return false;
    }

    if (!getPhone.test(phone)) {
        alert("잘못된 전화번호 형식입니다.('-'없이 입력)");
        return false;
    }

    if (email == "") {
        alert("이메일을 입력해주세요.");
        return false;
    }

    if (!getMail.test(email)) {
        alert("잘못된 이메일 형식입니다.");
        return false;
    }

    if (reservationDate == "") {
        alert("예약 날짜를 선택해주세요.");
        return false;
    }

    if (startTime == "") {
        alert("시작 시간을 선택해주세요.");
        return false;
    }

    if (usageTime == "") {
        alert("사용하실 시간을 선택해주세요.");
        return false;
    }


    if (produce == "") {
        alert("무엇을 제작하는지 선택해주세요.(ex.영화, 드라마 등)");
        return false;
    }

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/message",
        data: { name_give: name, phone_give: phone, email_give: email, date_give: reservationDate, produce_give: produce, num_give: num, confirm_give: confirm, start_give: startTime, end_give: endTime, usage_give: usageTime },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 관리자 페이지 예약 내역
function showMessage() {
    // Flask에서 Ajax 받기
    $.ajax({
        type: "GET",
        url: "/message",
        data: {},
        success: function (response) {
            let messages = response['all_messages']
            for (let i = 0; i < messages.length; i++) {
                let num = messages[i]['num']
                let name = messages[i]['name']
                let phone = messages[i]['phone']
                let email = messages[i]['email']
                let reservationDate = messages[i]['date']
                let startTime = messages[i]['start_time']
                let endTime = messages[i]['end_time']
                let usageTime = messages[i]['usage_time']
                let produce = messages[i]['produce']
                let confirm = messages[i]['confirm']

                //예약 내역 생성
                let temp_html = `<tr>
                                    <td>${name}</td>
                                    <td>${phone}</td>
                                    <td>${email}</td>
                                    <td>${reservationDate}</td>
                                    <td>${startTime}</td>
                                    <td>${endTime}</td>
                                    <td>${usageTime}</td>
                                    <td>${produce}</td>
                                    <td><button type="button" class="toggle" onClick="confirmMessage(${num})">${confirm === 'UNCONFIRMED' ? '미승인' : '승인'}</button></td>
                                    <td><button type="button" onClick="deleteMessage(${num})">삭제</button></td>
                                </tr>`
                $('#message-box').prepend(temp_html)
            }
        }
    })
}


// 예약 내역 삭제
function deleteMessage(num) {
    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/message/delete",
        data: { delete_give: num },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}

// 예약 승인
function confirmMessage(num) {
    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/message/confirm",
        data: { delete_give: num },
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}
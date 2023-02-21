var getPassword = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/); // 비밀번호 정규식(영문, 숫자, 특수문자 입력)

// 관리자페이지 비밀번호 변경
function changeAdmin() {
    let id = $('#admin-id').val(); // 로그인 ID 값(고정)
    let password = $('#admin-pw').val();
    let passwordCheck = $('#admin-pw-check').val();

    // 유효성 검사
    if (password == "") {
        alert("비밀번호를 입력해주세요");
        return false;
    }

    if (!getPassword.test(password)) {
        alert("비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요");
        return false;
    }

    if (passwordCheck !== password) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return false;
    }

    // FormData 객체생성
    let formData = new FormData();
    formData.append('id_give', id);
    formData.append('password_give', password);

    // Flask에 Ajax 보내기
    $.ajax({
        type: "POST",
        url: "/admin_server",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        }
    })
}
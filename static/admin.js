var getPassword = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

function changeAdmin() {
    let id = $('#admin-id').val();
    let password = $('#admin-pw').val();
    let passwordCheck = $('#admin-pw-check').val();

    if  (password == "") {
        alert("비밀번호를 입력해주세요");
        return false;
    }

    if  (!getPassword.test(password)) {
        alert("비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요");
        return false;
    }

    if (passwordCheck !== password) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return false;
    }

    let formData = new FormData();
    formData.append('id_give', id);
    formData.append('password_give', password);

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
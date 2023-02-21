//Date 객체 생성
let date = new Date();

// 달력 생성
const renderCalender = () => {
    //showMessage 함수 실행
    $(document).ready(function () {
        showMessage();
    });

    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // 년월 표기
    if (viewMonth > 8) {
        document.querySelector('.year-month').textContent = `${viewYear} / ${viewMonth + 1}`;
    } else {
        document.querySelector('.year-month').textContent = `${viewYear} / ${'0' + (viewMonth + 1)}`;
    }

    // 지난 달 마지말 날, 이번 달 마지막 날 구하기
    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    // 날짜 배열
    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
            prevDates.unshift(PLDate - i);
        }
    }

    for (let i = 1; i < 7 - TLDay; i++) {
        nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);


    // 날짜 생성
    dates.forEach((date, i) => {
        const condition = i >= firstDateIndex && i < lastDateIndex + 1

        if (condition) {
            dates[i] = `<div class="date"><span class="this">${date}</span></div>`;
        } else {
            dates[i] = `<div class="date"><span class="other">${date}</span></div>`;
        }
    });

    document.querySelector('.dates').innerHTML = dates.join('');

    //오늘 날짜 표시
    const today = new Date();
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
        for (let date of document.querySelectorAll('.this')) {
            if (+date.innerText === today.getDate()) {
                if (today.getDate() < 10) {
                    date.classList.add('today-padding');
                    break;
                } else {
                    date.classList.add('today');
                    break;
                }
            }
        }
    }

    //예약 날짜에 예약 내역 붙이기
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
};


const dateFunc = () => {
    const dates = document.querySelectorAll('.date');
    const year = document.querySelector('.year');
    const month = document.querySelector('.month');

    console.log(year + month + dates)
};

renderCalender();

//지난달로 이동
const prevMonth = () => {
    date.setMonth(date.getMonth() - 1);
    renderCalender();
};

//다음달로 이동
const nextMonth = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalender();
};

//오늘 날짜로 이동
const goToday = () => {
    date = new Date();
    renderCalender();
};
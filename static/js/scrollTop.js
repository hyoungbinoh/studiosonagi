// 위로가기 버튼
let topBtn = document.querySelector("#top-btn")

topBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" })

// 위로가기 버튼 특정위치에서 생성
// 위로가기 버튼 핸드폰 사이즈에서 안 보이기
window.onscroll = () => window.scrollY > innerHeight / 2 && innerWidth > 425 ?
    topBtn.style.display = "block" :
    topBtn.style.display = "none";
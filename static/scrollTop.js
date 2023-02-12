let topBtn = document.querySelector("#top-btn")

topBtn.onclick = () => window.scrollTo({top: 0, behavior: "smooth"})

window.onscroll = () => window.scrollY > innerHeight / 2 && innerWidth > 425? 
                        topBtn.style.display = "block" :
                        topBtn.style.display = "none";
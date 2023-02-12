window.addEventListener("scroll", function(){
    const sections = document.querySelectorAll(".home-text-box2")
    for (let i = 0; i < sections.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = sections[i].getBoundingClientRect().top;
        const elementVisible = 0;

        if (elementTop < windowHeight - elementVisible) {
            sections[i].classList.add("active");
        } else {
            sections[i].classList.remove("active");
        }
    }
});
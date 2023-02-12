const toggleBtn = document.querySelector('.nav-btn');
const menu = document.querySelector('.nav-menu');
toggleBtn.addEventListener('click',()=>{
    menu.classList.toggle('active');
});
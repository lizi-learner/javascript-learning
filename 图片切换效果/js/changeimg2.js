const btns = document.querySelectorAll(".change-img-btn");
const imgs = document.querySelectorAll(".img-wrapper img");

btns.forEach(btn => btn.addEventListener("mouseover", changeImg))
btns.forEach(btn => btn.addEventListener("mouseover", changeBtn))

function changeImg(e){

  imgs.forEach(img => img.classList.remove("active-img"))
  const img = document.querySelector(`img[data-img = '${this.dataset.btn}']`)
  img.classList.add("active-img");

}

function changeBtn(){

  btns.forEach(btn => btn.classList.remove("active-btn"));
  this.classList.add("active-btn")
}
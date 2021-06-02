const btns = document.querySelectorAll(".change-img-btn");
const imgs = document.querySelectorAll(".img-wrapper img");

btns.forEach(btn => btn.addEventListener("mouseover", changeImg))
btns.forEach(btn => btn.addEventListener("mouseover", changeBtn))
// btns.forEach(btn => btn.addEventListener("click", changeImg))
// btns.forEach(btn => btn.addEventListener("click", changeBtn))

function changeImg(e){
  //排他
  //把其他图片的z-index设成0
  // imgs.forEach(img => img.style.zIndex = 0);
  
  // //把当前图片z-index设为1
  // const img = document.querySelector(`img[data-img = '${this.dataset.btn}']`)
  // img.style.zIndex = 1;

  //设置类
  imgs.forEach(img => img.classList.remove("active-img"))
  const img = document.querySelector(`img[data-img = '${this.dataset.btn}']`)
  img.classList.add("active-img");

}

function changeBtn(){
  //其他按钮的背景变成白色
  // btns.forEach(btn => btn.style.backgroundColor = "#fff");
  // this.style.backgroundColor = "#ffccff"
  btns.forEach(btn => btn.classList.remove("active-btn"));
  this.classList.add("active-btn")
}
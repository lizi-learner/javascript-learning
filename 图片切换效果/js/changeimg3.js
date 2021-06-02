const btns = document.querySelectorAll(".change-img-btn");
const imgs = document.querySelectorAll(".img-wrapper img");
const imageWrapper = document.querySelector('.images');

btns.forEach(btn => btn.addEventListener("mouseover", changeImg))
btns.forEach(btn => btn.addEventListener("mouseover", changeBtn))

function changeImg(e){

  //将图片整体向下移动之前所有图片的宽度
  let topMove = 0;
  const currImg = document.querySelector(`img[data-img = '${this.dataset.btn}']`)

  for(img of imgs){
    //获取之前所有图片的宽度
    if(img === currImg) break;
    topMove += img.clientHeight;
  }

  imageWrapper.style.top = -topMove + "px";

}

function changeBtn(){
  btns.forEach(btn => btn.classList.remove("active-btn"));
  this.classList.add("active-btn")
}


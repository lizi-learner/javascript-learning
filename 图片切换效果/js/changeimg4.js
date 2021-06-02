const btns = document.querySelectorAll(".change-img-btn");
const imgs = document.querySelectorAll(".img-wrapper img");
const imageWrapper = document.querySelector('.images');

btns.forEach(btn => btn.addEventListener("mouseover", changeImg))
btns.forEach(btn => btn.addEventListener("mouseover", changeBtn))

//index代表当前的按钮索引或图片索引
//这里设置的自动播放时间间隔要大于transition设置的过渡的时间
let index = 0
let timer = setInterval(autoPlayImg, 2000);

//重启计时器
btns.forEach(btn => btn.addEventListener("mouseout", ()=>timer=setInterval(autoPlayImg, 2000)))


function autoPlayImg(){
  if(index == 0){
    btns[btns.length-1].classList.remove("active-btn");
  }else{
    btns[btns.length-1].classList.remove("active-btn");
  }
  btns[!index ? btns.length-1 : index-1].classList.remove("active-btn");

  let btn = btns[index];
  btn.classList.add("active-btn");
  const currImg = document.querySelector(`img[data-img = '${btn.dataset.btn}']`);
  let topMove = 0;
  for(img of imgs){
    if(img === currImg) break;
    topMove += img.clientHeight;
  }

  imageWrapper.style.top = -topMove + "px";

  //更新index
  index = index == btns.length-1 ? 0 : index + 1;
}

//触发事件时需要清除定时器，令定时器重新开始计时
//同时需要更新index
function changeImg(){

  let topMove = 0;
  const currImg = document.querySelector(`img[data-img = '${this.dataset.btn}']`)

  for(img of imgs){
    if(img === currImg) break;
    topMove += img.clientHeight;
  }

  imageWrapper.style.top = -topMove + "px";

}

function changeBtn(){

  //清除定时器
  clearInterval(timer);
  //更新index,为下一次开启定时器做准备
  for(let i=0; i<btns.length; i++){
    if(btns[i] === this){
      index = i == btns.length-1 ? 0 : i + 1;
    }
  }

  btns.forEach(btn => btn.classList.remove("active-btn"));
  this.classList.add("active-btn")
}




//同样使用js初始化界面
const imgWrapper = document.querySelector('.img-wrapper');
const images = document.querySelectorAll('img[data-img]');

const totalWidth = imgWrapper.clientWidth;
const imageWidth = images[0].clientWidth;
const len = images.length;
const step = totalWidth / len;

init()

//给图片添加监听事件
images.forEach(img => img.addEventListener('mouseover', showImg))
images.forEach(img => img.addEventListener('mouseout', init))

function showImg(){
  //和上一种滑动效果一样
  let isLeft = true;
  let sStep = (totalWidth - imageWidth) / (len - 1); 
  for(let i=0; i<len; i++){
    if(isLeft){
      images[i].style.left = i * sStep + "px";
    }else{
      images[i].style.left = (i-1) * sStep + imageWidth + "px";
    }
    if(this === images[i]){
      isLeft = false;
    }
  }
}

function init(){
  let leftMove = 0;
  images.forEach(img => {
    img.style.left = leftMove + "px";
    leftMove += step;
  })
}
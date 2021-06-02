//在js内自适应添加样式，不用考虑图片数量变化
//容器的除去放图片的位置，剩下位置放等待被展示的图片的折叠效果
const images = document.querySelectorAll('img[data-img]');
const imgWrapper = document.querySelector('.img-wrapper');
const imgWidth = images[0].clientWidth;
const len = images.length;
const step = (imgWrapper.clientWidth - imgWidth) / (len - 1);

let leftMove = imgWidth;
for(let i=1; i<len; i++){
  images[i].style.left = leftMove + "px";
  leftMove += step;
}

//给图片添加监听事件
images.forEach(img => img.addEventListener("mouseover", moveLeft));

function moveLeft(){
  //改变当前图片且其左边图片的left值，这里可以使用data-img去判断要移动哪些图片
  //也可以使用DOM结构来判断，倾向于这一种
  //分别改变左边图片和右边图片的left值
  let left = true;
  for(let i=0; i<len; i++){
    if(left){
      images[i].style.left = step * i + "px";
    }else{
      images[i].style.left = step * (i-1) + imgWidth + "px";
    }
    if(images[i] === this){
      left = false;
      continue;
    }
  }
}

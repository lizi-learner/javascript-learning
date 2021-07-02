//创建游戏中的小格子
class BoxUtil {

  static nums = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192]

  static createBackgroundBox(left, top, size, borderRadius, color){
    const box = document.createElement('div');
    box.style.position = "absolute";
    box.style.left = left + 'px';
    box.style.top = top + 'px';
    box.style.width = size + 'px';
    box.style.height = size + 'px';
    box.style.borderRadius = borderRadius + 'px';
    box.style.backgroundColor = color;
    box.style.zIndex = 0;

    return box;
  }

  static createNumBox(num, col, row, size, borderRadius, gap){
    const box = document.createElement('div');
    box.style.position = "absolute";
    box.style.left = gap + (size + gap) * col + 'px';
    box.style.top = gap + (size + gap) * row + 'px';
    box.style.width = size + 'px';
    box.style.height = size + 'px';
    box.style.borderRadius = borderRadius + 'px';
    box.style.lineHeight = size + 'px';
    box.innerHTML = num;

    box.classList.add("num-" + num);
    box.classList.add("num-box");

    return box;
  }
}

class NumBox {
  
  //封装数字盒子的创建移动合并
  constructor(container, num, col, row, size, borderRadius, gap){
    this.container = container;
    this.num = num;
    this.col = col;
    this.row = row;
    this.size = size;
    this.borderRadius = borderRadius;
    this.gap = gap;

    //记录盒子有没有被合并
    this.isMerged = false;

    this.refresh();
  }

  //更新数字盒子的位置
  refresh(){
    //刷新盒子位置
    if(this.box){
      this.box.remove();
    }

    this.box = BoxUtil.createNumBox(this.num, this.col, this.row, this.size, this.borderRadius, this.gap);
    this.container.append(this.box);

  }

  //实现数字向空位移动的功能
  moveTo(newCol, newRow){
    return new Promise(resolve => {
      //移动盒子是一个需要时间的操作(动画时间)，因此返回一个Promise
      const hMovDis = (newCol - this.col) * (this.size + this.gap);
      const vMovDis = (newRow - this.row) * (this.size + this.gap);
  
      if(hMovDis + vMovDis){
        //移动盒子
        this.col = newCol;
        this.row = newRow;
        
  
        // 计算动画时间
        //默认移动一块盒子的距离的时间是80毫秒，给盒子添加过渡效果
        const moveTime = Math.abs(hMovDis + vMovDis) / (this.size + this.gap) * 80;
        this.box.style.transitionDuration = moveTime + 'ms';

        //监听transitionend事件，当transition结束时，承诺得到解决
        this.box.addEventListener('transitionend', () => {
          resolve();
        })
  
        //在同一个事件循环中（微任务处理）修改dom元素的属性不会触发transition事件，因此把修改属性放到下一次事件循环中去。
        setTimeout(()=>{
          this.box.style.left = this.gap + (this.size + this.gap) * newCol + 'px';
          this.box.style.top = this.gap + (this.size + this.gap) * newRow + 'px';
        })
      }
    })
  }

  //销毁盒子，即将DOM元素卸下
  destroy(){
    this.box.remove();
  }

  //实现数字盒子的合并功能
  async mergeTo(otherBox){
    //把当前盒子和一个另外的盒子合并
    this.box.style.zIndex = 2;
    await this.moveTo(otherBox.col, otherBox.row);
    otherBox.num *= 2;
    otherBox.refresh();
    this.destroy();
  }

}

class Game2048 {

  constructor(container, uiConfig){

    //默认的游戏样式配置
    const defaultConfig = {
      perBoxSize: 100,
      gap: 4,
      borderRadius: 4,
      backgroundColor: "#bbada0",
      backgroundBoxColor: "rgba(238, 228, 218, 0.35)"
    }


    this.uiConfig = uiConfig || defaultConfig;

    //记录16个格子存放盒子的情况
    this.numBoxs = new Array(16).fill(null);

   //记录分数和游戏是否结束
    this.score = 0;
    this.isGameOver = false;

    //记录当前是否在执行动画
    //有点像节流,一段时间内只处理一个动画
    this.isMerging = false;

    this.container = document.querySelector(container);

    //检查容器是否存在
    if(this.container.length){
      throw new Error(`container${container} not found`);
    }

    this.initUi();
    this.bindKeys();
    this.newGame();
  }

  initUi(){
    //计算容器宽度
    const width = this.uiConfig.perBoxSize * 4 + this.uiConfig.gap * 5;

    //设置样式
    this.container.style.width = width + 'px';

    //添加ui面板
    const uiPanel = `
      <div class="uiPanel">
        <div class="score" style="float: left;">score: <span class="scoreSpan">0</span></div>
        <div class="newGame">New Game</div>
      </div>
    `
    this.container.innerHTML = uiPanel;

    //获取分数
    this.scoreSpan = document.querySelector('.scoreSpan');

    //给重新开始按钮绑定事件
    const newGameButton = document.querySelector('.newGame');
    newGameButton.addEventListener('click', this.newGame.bind(this));

    //添加游戏主面板
    this.mainPanel = document.createElement('div');
    this.mainPanel.className = "mainPanel";
    this.mainPanel.style.width = width + 'px';
    this.mainPanel.style.height = width + 'px';
    this.mainPanel.style.borderRadius = this.uiConfig.borderRadius + 'px';

    this.container.append(this.mainPanel);

    this.mainPanel.append(BoxUtil.createBackgroundBox(0, 0, width, this.uiConfig.borderRadius, this.uiConfig.backgroundColor))
    //创建16个小格子
    for (let i=0; i<16; i++){
      this.mainPanel.append(BoxUtil.createBackgroundBox(
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * (i % 4) + this.uiConfig.gap,
        (this.uiConfig.perBoxSize + this.uiConfig.gap) * Math.floor(i / 4) + this.uiConfig.gap,
        this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.backgroundBoxColor
      ))
    }

  }

  bindKeys(){

    //绑定键盘事件
    //每次执行完事件需要判断游戏是否结束
    document.addEventListener('keyup', e => {
      switch(e.code){
        //向右合并
        case "ArrowRight":
          this.merge([3, 7, 11, 15], -1);
          break;
        case "ArrowLeft":
          this.merge([0, 4, 8, 12], 1);
          break;
        case "ArrowUp":
          this.merge([0, 1, 2, 3], 4);
          break;
        case "ArrowDown":
          this.merge([12, 13, 14, 15], -4);
      }
    })
  }

  newGame(){
    //重置游戏的各项属性
    this.mainPanel.querySelectorAll('.num-box').forEach(el => el.remove());
    this.score = 0;
    this.numBoxs.fill(null);
    this.isGameOver = false;
    this.isMerging = false;

    //重新绘制
    this.addNewNumBox(2);
  }

  addNewNumBox(size){
    //每次移动合并后会随机添加一个数字盒子，数字是2或4
    //得到空闲的位置
    const emptyPosArr = this.getRandomEmptyGrids(size);
    for(let index of emptyPosArr){
      const num = Math.random() < 0.8 ? 2 : 4;
      this.numBoxs[index] = new NumBox(this.mainPanel, num, index % 4, Math.floor(index / 4), 
                                       this.uiConfig.perBoxSize, this.uiConfig.borderRadius, this.uiConfig.gap);
      this.score += num;                             
    }
    //显示分数
    this.scoreSpan.innerHTML = this.score;
  }

  getRandomEmptyGrids(size){
    const emptyPosArr = [];
    //返回空闲的位置
    this.numBoxs.forEach((item, index) => {
      if(!item){
        emptyPosArr.push(index);
      }
    })

    const res = [];
    while(res.length < size && emptyPosArr.length > 0){
      let randomI = Math.floor(Math.random() * emptyPosArr.length);
      res.push(emptyPosArr.splice(randomI, 1)[0]);
    }

    return res;
  }

  //实现按键
  //startIndexes: [0, 1, 2, 3] | [0, 4, 8, 12] | [12, 13, 14, 15] | [3, 7, 11, 15]
  async merge(startIndexes, nextDelta){
    //记录动画正在执行
    if (this.isGameOver || this.isMerging){
      return
    }

    this.isMerging = true;

    //记录一下是否会发生移动或合并的情况
    let addNew = false;

    //记录合并过的盒子
    // const isMerged = [];

    this.numBoxs.forEach(item => item && (item.isMerged = false))

    const promises = [];
    for(let startIndex of startIndexes){
      //针对每一个边界扫描其上面的盒子
      //比如，用户想向下合并，就以[12, 13, 14, 15]为边界向上扫描
      for(let i=1; i<4; i++){
        const curIndex = startIndex + nextDelta * i;
        const curBox = this.numBoxs[curIndex];
        //如果盒子不是空的，需要找它合并和移动的位置
        if(curBox){
          const reachableBox = this.findReachableBox(curIndex, -nextDelta, startIndex);
          if(reachableBox){
            addNew = true;
            if(reachableBox.box){
              //合并盒子
              this.numBoxs[curIndex] = null;
              //异步操作，返回一个promise
              promises.push(curBox.mergeTo(reachableBox.box));
              reachableBox.box.isMerged = true;
              // isMerged.push(reachableBox.box);
            } else {
              this.numBoxs[curIndex] = null;
              this.numBoxs[reachableBox.index] = curBox;
              promises.push(curBox.moveTo(reachableBox.index % 4, Math.floor(reachableBox.index / 4)));
            }
          }
        }
      }
    }
    await Promise.all(promises);

    this.isMerging = false;
    //把所有盒子的isMerged改成false
    // isMerged.forEach(box => box.isMerged = false);

    if(addNew){
      this.addNewNumBox(1)
    }

    //判断游戏有没有结束
    if(this.checkGameover()){
      setTimeout(()=>{
        alert("Game Over! Your score is " + this.score)
      })

    };
  }

  findReachableBox(curIndex, nextDelta, endIndex){
    let reachableInfo = null;
    const curNumBox = this.numBoxs[curIndex];
    for(let i=1; i<=(curIndex - endIndex) / (-nextDelta); i++){
      let otherIndex = curIndex + nextDelta * i;
      const otherBox = this.numBoxs[otherIndex];
      if(!otherBox){
        reachableInfo = {
          index: otherIndex,
          box: null,
        }
      }else if(!otherBox.isMerged && curNumBox.num == otherBox.num){
        reachableInfo = {
          index: otherIndex,
          box: otherBox
        }
      }else{
        //找不到就跳出，说明后面的位置不会有当前盒子没有能够移动或者合并的位置
        break
      }
    }

    return reachableInfo;
  }

  //检测游戏是否结束
  checkGameover(){
    for(let i=0; i< 16; i++){
      let curBox = this.numBoxs[i];
      if(!curBox) return false

      //检查右下有没有可以合并的选项
      //这里并不用检查左上，如果左上可以合并，在左上检测右下的时候肯定检测出来了
      if( i % 4 < 3){
        //检查右方
        const rightNumBox = this.numBoxs[i+1];
        if(!rightNumBox || rightNumBox.num == curBox.num){
          return false
        }
        
      }

      if( Math.floor(i / 4) < 3){
        //检查下方
        const downNumBox = this.numBoxs[i+4];
        if(!downNumBox || downNumBox.num == curBox.num){
          return false
        }
      }
    }
    this.isGameOver = true;
    return true;

  }
}
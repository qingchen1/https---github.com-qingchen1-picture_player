<template>
  <div class="buttons">
      <button @click="stop">暂停</button>
      <button @click="play">播放(重置速率)</button>
      <button @click="speedup">加速</button>
      <button @click="speeddown">减速</button>
      <p>当前{{speed/10}}倍速</p>
  </div>
  <div class="wrapper">
    <vue3-auto-scroll :hideScrollBar="false" :speed="speed" :delay="10" :backSpeed="0" :control ="true" ref="autoScroll">
      <img v-for="(pic, i) of list" :key="i" :src="pic.img" :class="pic.class" 
      @dblclick="showModal($event,i)" >
      <div v-if="showOverlay" class="overlay" @click="hideModal">
        <div ref="imgWrap" class="wrap" >
          <img :src="list[activeImage].img"  ref="image" @mousedown.prevent="moveImg" @mousewheel.prevent="rollImg">
        </div>
      </div>
    </vue3-auto-scroll>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Vue3AutoScroll } from "vue3-auto-scroll";
import "vue3-auto-scroll/dist/style.css";

const image = ref(null)
let offsetY = ref(0)
let offsetX = ref(0)
const rollImg = async(e) => {
  let transform = image.value.style.transform
  let zoom = transform.indexOf("scale") != -1 ? +transform.split("(")[1].split(")")[0] : 1
  let zoomt = zoom

  zoom += e.wheelDelta / 1200
  offsetY.value = ((zoom - zoomt) * image.value.naturalHeight) / 2
  offsetX.value = ((zoom - zoomt) * image.value.naturalWidth) / 2

  if (zoom > 0.4 && zoom < 2) {
      image.value.style.transform = "scale(" + zoom + ")"
      await(100); 
      if(e.offsetY < image.value.naturalHeight/2 ){   
        if(e.wheelDelta>0){
          image.value.style.top = parseFloat(image.value.style.top) + 
          (-0.1) * e.offsetY + offsetY.value + 70 +'px'       
            
        }    
        else{
          image.value.style.top = parseFloat(image.value.style.top) + 0.1 * e.offsetY + offsetY.value + 70 + 'px'
        }
      }
      else{
        if(e.wheelDelta>0){
          image.value.style.top = parseFloat(image.value.style.top) 
          + (-0.1) * e.offsetY + offsetY.value - 50  + 'px'
        }    
        else{
          image.value.style.top = parseFloat(image.value.style.top) + 0.1 * e.offsetY + offsetY.value - 50 + 'px'
        }
      }
      
  }
}

const imgWrap = ref(null)
const moveImg = (e) => {
  let wrap = imgWrap.value
  let img = image.value
  let x = e.pageX - img.offsetLeft
  let y = e.pageY - img.offsetTop
  // 添加鼠标移动事件
  wrap.addEventListener('mousemove', move)
  function move(e) {
      img.style.left = e.pageX - x + 'px'
      img.style.top = e.pageY - y + 'px'
  }
  // 添加鼠标抬起事件，鼠标抬起，将事件移除
  img.addEventListener('mouseup', () => {
      wrap.removeEventListener('mousemove', move)
  })
  // 鼠标离开父级元素，把事件移除
  wrap.addEventListener('mouseout', () => {
      wrap.removeEventListener('mousemove', move)
  })
}
const showOverlay = ref(false);
const activeImage = ref(0);
let offset = ref(0)


const showModal = async(event,index) => {
  let img = event.target
  let ratio = img.naturalHeight/img.height
  offset.value = img.naturalHeight/2 - event.offsetY * ratio
  activeImage.value = index;
  showOverlay.value = true;
  await(100);

  image.value.style.top =  offset.value - img.naturalHeight/2 + 300 + 'px';
  //image.value.top -= offset.value //纵坐标
};

const hideModal = (event) => {
  if (event.target.tagName.toLowerCase() !== 'img') {
    showOverlay.value = false;
  }
};

let isAtBottom = false;
const autoScroll = ref(null);
onMounted(() => {
  if (autoScroll.value) {
    autoScroll.value.$el.addEventListener("scroll", handleScroll);
  }
});

const handleScroll = (event) => {
  if (autoScroll.value) {
    const container = autoScroll.value.$el;
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottom = scrollTop + clientHeight >= scrollHeight;
    if (isAtBottom) {
      speed.value = 0;
    }
  }
};


const list = ref([
  {
    img: "./src/assets/full_imgnew4.jpg",
    class: "fit-image4"
  },
  {
    img: "./src/assets/full_imgnew3.jpg",
    class: "fit-image3"
  },
  {
    img: "./src/assets/full_imgnew2.jpg",
    class: "fit-image2"
  },
  {
    img: "./src/assets/full_imgnew1.jpg",
    class: "fit-image1"
  },
  {
    img: "./src/assets/full_imgnew0.jpg",
    class: "fit-image0"
  }
]);

const speed = ref(0);

const stop = () => {
  speed.value = 0;
};

const play = () => {
  speed.value = 10;
};

const speedup = () => {
  speed.value += 5;
};

const speeddown = () => {
  speed.value -= 5;
  if(speed.value <= 0){
    speed.value =1
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 80%;
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
}

.wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper {
  position: relative;
  height: 600px;
  width: 650px;
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.fit-image4 {
  /* clip-path: inset(0 0 140px 0);   */
  overflow: hidden;
  width: 600px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 5;
}

.fit-image3 {
  /* clip-path: inset(0 0 140px 0);  
  margin-top: -400px; */
  width: 600px;
  position: relative;
  z-index: 4;
  transition: transform 0.3s ease;
}
.fit-image2 {
  /* clip-path: inset(0 0 140px 0);  
  margin-top: -400px; */
  width: 600px;
  position: relative;
  z-index: 3;
  transition: transform 0.3s ease;
}
.fit-image1 {
  /* clip-path: inset(0 0 140px 0);    
  margin-top: -400px; */
  width: 600px;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}
.fit-image0 {
  /* margin-top: -400px; */
  width: 600px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}


.buttons {
  margin-top: 20px;
}
.buttons button {
  margin-right: 10px;
}
img {
  position: absolute;
  cursor: move;
}

</style>

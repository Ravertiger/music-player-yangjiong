<template>
  <div class="hello">
    <div class="left">
      <div v-for="(item, index) in items" :key="index" class="items">
        <div
          :class="['item', { active: item === currentItem }]"
          @click="jump2song(item)"
        >
          {{ item.singer }} - {{ item.name }}
        </div>
      </div>
    </div>
    <div class="right">
      <div class="player">
        <div class="record"></div>
        <audio ref="audioPlayer" :src="musicUrl" @timeupdate="updateProgress">
          您的浏览器不支持音频播放。
        </audio>
        <div class="title">
          {{ currentItem.url }}
        </div>
        <div class="controls">
          <button @click="playPrevious">
            <img src="../assets/prep.svg" />
          </button>
          <button @click="togglePlay"><img :src="playIconPath" /></button>
          <button @click="playNext"><img src="../assets/next.svg" /></button>
        </div>
        <div class="processBarAll">
          <div class="currentTime">{{ currentTime }}</div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="totalTime">{{ totalTime }}</div>
        </div>
        <div class="volume-controls">
          <img src="../assets/volume.svg" style="width: 20px" />
          <input
            type="range"
            min="0"
            max="100"
            v-model="currentVolume"
            class="volume-range"
            @input="setVolume"
            style="margin-right: 10px"
          />
          {{ currentVolume }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import playIcon from "../assets/play.svg";
import pauseIcon from "../assets/pause.svg";
import http from "@/utils/http";
export default {
  name: "HelloWorld",
  data() {
    return {
      items: [],
      currentItem: {},
      isPlaying: false,
      progress: 0,
      currentTime: "0:00", // 初始化为'00:00'
      totalTime: "0:00", // 初始化为'00:00'
      playIconPath: playIcon, //初始化最开始为播放图标
      currentVolume: 50, // 初始化音量值
      musicUrl: "",
      currentPage: 1, // 歌曲页码（每页15首歌，在后台getSongList接口配置）
    };
  },
  methods: {
    togglePlay() {
      if (this.currentItem) {
        if (this.isPlaying) {
          this.audio.pause();
          this.playIconPath = playIcon;
          this.timeCounter(false);
        } else {
          this.audio.play();
          this.playIconPath = pauseIcon;
          this.timeCounter(true);
        }
        this.isPlaying = !this.isPlaying;
      }
    },
    timeCounter(flag) {
      // flag 表示需要播放
      if (!flag) clearInterval(this.mainTimer); // 清除计时器
      else {
        this.mainTimer = setInterval(() => {
          //设置计时器
          this.currentTime = this.getCurrentTime(); // 更新当前时间
          this.totalTime = this.getTotalTime(); // 更新总时间
        }, 1000); // 每秒更新一次时间
      }
    },
    playPrevious() {
      this.audio.pause();
      this.timeCounter(false);
      const currentIndex = this.items.findIndex(
        (item) => item === this.currentItem
      );
      if (currentIndex > 0) {
        this.currentItem = this.items[currentIndex - 1];
        this.playIconPath = pauseIcon;
        setTimeout(() => {
          this.audio.play();
          this.audio.currentTime = 0; // 将当前播放时间重置为起始位置
          this.isPlaying = true;
          this.timeCounter(true);
        }, 500);
      }
    },
    playNext() {
      this.audio.pause();
      this.timeCounter(false);
      const currentIndex = this.items.findIndex(
        (item) => item === this.currentItem
      );
      if (currentIndex < this.items.length - 1) {
        this.currentItem = this.items[currentIndex + 1];
        this.playIconPath = pauseIcon;
        setTimeout(() => {
          this.audio.play();
          this.audio.currentTime = 0; // 将当前播放时间重置为起始位置
          this.isPlaying = true;
          this.timeCounter(true);
        }, 500);
      }
    },
    jump2song(item) {
      this.audio.pause();
      this.timeCounter(false);
      this.currentItem = item;
      this.playIconPath = pauseIcon;
      setTimeout(() => {
        this.audio.play();
        this.audio.currentTime = 0; // 将当前播放时间重置为起始位置
        this.isPlaying = true;
        this.timeCounter(true);
      }, 500);
    },
    updateProgress() {
      const audio = this.$refs.audioPlayer;
      const progress = (audio.currentTime / audio.duration) * 100;
      this.progress = Number.isNaN(progress) ? 0 : progress;
    },
    getCurrentTime() {
      if (!this.audio) {
        return "0:00";
      }
      const currentTime = this.audio.currentTime;
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    },
    getTotalTime() {
      if (!this.audio || isNaN(this.audio.duration)) {
        return "0:00";
      }
      const totalTime = this.audio.duration;
      const minutes = Math.floor(totalTime / 60);
      const seconds = Math.floor(totalTime % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    },
    setVolume() {
      this.audio.volume = this.currentVolume / 100;
    },
    getMusicUrl() {
      this.musicUrl =
        "http://localhost:6789/getSong/" +
        encodeURIComponent(this.currentItem.url);
    },
    handleAudioEnded() {
      this.playNext();
    },
  },
  watch: {
    currentItem: {
      immediate: true, // 立即执行watch回调函数
      handler() {
        this.getMusicUrl();
      },
    },
  },
  mounted() {
    this.audio = this.$refs.audioPlayer; // 将引用赋给audio属性
    this.audio.addEventListener('ended', this.handleAudioEnded); //添加结束自动下一曲监听
    http.get("http://localhost:6789/getSongList/" + this.currentPage).then((res) => {
      this.items = res.data;
      if (this.items.length > 0) {
        if(this.items[0] === undefined) return;
        this.currentItem = this.items[0];
        this.musicUrl =
          "http://localhost:6789/getSong/" +
          encodeURIComponent(this.currentItem.url);
        this.audio.volume = this.currentVolume / 100; // 初始化音量
      }
    });
  },
  beforeDestroy() {
    this.audio.removeEventListener('ended', this.handleAudioEnded); //移除结束自动下一曲监听
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.hello {
  display: flex;
  height: calc(100vh - 40px);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.left {
  display: flex;
  flex-direction: column;
  flex-basis: 20%;
  background-color: #4da3b3;
  border-radius: 5px 0 0 5px;
  overflow: auto;
  padding: 16px 2px;
}

.right {
  display: flex;
  flex-basis: 80%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.title {
  margin: 10px 0;
}

.item {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 13px;
  backdrop-filter: blur(10px);
  /* 添加毛玻璃效果，可根据需要调整模糊程度 */
  background-color: rgba(255, 255, 255, 0.2);
  /* 设置背景颜色并透明化以显示毛玻璃效果 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  /* 添加底部阴影，可根据需要调整阴影效果 */
  margin: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;
}

.active {
  background-color: #a1e3ef;
  color: #2b2b2b;
}

.processBarAll {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 50%;
}

.record {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-image: url("../assets/rotate-main.jpg");
  background-size: 100% 100%;
  animation: rotate 10s infinite linear;
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  width: 40px;
  height: 40px;
  padding: 4px;
  margin: 0 16px;
  border-radius: 50%;
  /* 设置背景颜色并透明化以显示毛玻璃效果 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #4da3b3;
  border: none;
  opacity: 0.9;
  cursor: pointer;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #ccc;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 5px;
}

.progress {
  height: 100%;
  background-color: #42b983;
  transition: width 0.2s linear;
}
.volume-controls {
  display: flex;
  align-items: center;
  margin-top: 40px;
  font-size: 14px;
}

.volume-range {
  width: 150px;
  margin-left: 10px;
  -webkit-appearance: none; /* Remove default styling */
  appearance: none;
  height: 5px;
  background-color: #e0e0e0;
  outline: none;
}

.volume-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #1db585; /* Customize thumb color */
  cursor: pointer;
}
.volume-range::-moz-range-track {
  height: 5px;
  background-color: #e0e0e0; /* Default track color */
}

.volume-range::-webkit-progress-value {
  background-color: #4caf50; /* Customize left side color */
}

.volume-range::-moz-range-progress {
  background-color: #4caf50; /* Customize left side color */
}
</style>

<template>
  <div>
    <h3
      ref="color"
    >tweenMax动画</h3>
    <div ref="time" class="time">时间线</div>
    <div ref="bse" class="bse">贝塞尔</div>
  </div>
</template>
<script>

import { gsap } from 'gsap'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      size: 14
    }
  },
  created() {},
  mounted() {
    gsap.to(this.$refs.title, { color: '#8c0', duration: 3 })

    gsap.timeline()
      // .addLabel('step2', 7) // 新增标记，（name，time）当前处于时间线的时间
      .to(this.$refs.time, { duration: 2, x: 100 }, 1)// 暂停1.5秒，后进行下一步

      .to(this.$refs.time, { duration: 1, y: 100 }, 'step2') // 设置标记

      .to(this.$refs.time, { duration: 3, rotation: 360 }, '+=1') // 提前1秒
      .reverse(0) // 反向播放,value 从哪一个时间点为起始点，然后开始反向播放，为0时，从结束点反向播放
    // .seek('step2') // 直接跳到标签step2处，并跳过前面的7秒内容，注意加上动画本身duration的时间
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
h3{
    transition: all .2s;
}
.time{
  width: 100px;
  height: 100px;
  background: #000;
}
</style>

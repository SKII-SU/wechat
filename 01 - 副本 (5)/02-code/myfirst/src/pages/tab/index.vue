<template>
  <div>
    <!-- <div v-text='msg'></div> -->
    <div class="tab">
      <button @click='handle(index)' :key='item.id' v-for='(item, index) in listData'>
        {{item.title}}
      </button>
      <!-- active类名的存在与否取决于后面的值：如果值是true，那么就添加该类名，否则不添加 -->
      <div :class="{active: currentIndex == index}" :key='item.id' v-for='(item, index) in listData'>
        {{item.content}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: 'nihao',
      // 选项卡当前位于哪个位置：默认0表示第一个
      currentIndex: 0,
      listData: [{
        id: 1,
        title: 'apple',
        content: '苹果'
      }, {
        id: 2,
        title: 'orange',
        content: '橘子'
      }, {
        id: 3,
        title: 'banana',
        content: '香蕉'
      }, {
        id: 3,
        title: 'lemon',
        content: '柠檬'
      }]
    }
  },
  methods: {
    handle (index) {
      // 点击标题：触发选项卡切换(本质上就是控制currentIndex的索引值)
      // console.log(index)
      this.currentIndex = index;
    }
  }
}
</script>
<style scoped>
  .tab div {
    width: 300px;
    height: 200px;
    background-color: lightblue;
    display: none;
  }
  .tab div.active {
    display: block;
  }
  .tab button {
    display: inline-block;
  }

</style>
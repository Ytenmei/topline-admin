<template>
<!--
  vue中获取DOM方式
  1. 给节点声明 ref
  2. 通过this.$refs.ref名字 来访问
 -->
  <div ref="main" style="width: 600px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'FansOverview2',
  data () {
    return {
    }
  },
  mounted () {
    // 初始化图表组件
    this.initChart()
    // 发请求，更新数据
  },
  methods: {
    initChart () {
      var myChart = echarts.init(this.$refs.main)
      myChart.setOption({
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    }
  }
}
</script>

<style>

</style>

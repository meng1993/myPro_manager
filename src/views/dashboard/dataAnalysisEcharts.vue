<template>
  <div class="dataEchart">
    <el-row>
      <el-col :span="2"><h3>数据来源分析</h3></el-col>
      <el-radio-group >
        <el-radio-button label="昨天"></el-radio-button>
        <el-radio-button label="一周"></el-radio-button>
        <el-radio-button label="一月"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row :gutter="20" style="margin-top: 50px">
      <el-col :span="10" :offset="2">
        <div id="userChart"  :style="{width: '70%', height: '400px'}"></div>
      </el-col>
      <el-col :span="10">
        <div id="orderChart" :style="{width: '70%', height: '400px'}"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {}
    },
    mounted() {
      this.drawLine()
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        const userChart = echarts.init(document.getElementById('userChart'))
        // 绘制图表
        userChart.setOption({
          title: {
            text: '用户来源',
            // subtext: '纯属虚构',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['课程分销', '附近小程序', '社交立减金', '公众号', '社群分享', '广告投放', '搜索小程序', '线下扫码']
          },
          // toolbox: {
          //   show: true,
          //   feature: {
          //     mark: { show: true },
          //     dataView: { show: true, readOnly: false },
          //     magicType: {
          //       show: true,
          //       type: ['pie', 'funnel'],
          //       option: {
          //         funnel: {
          //           x: '25%',
          //           width: '50%',
          //           funnelAlign: 'left',
          //           max: 1548
          //         }
          //       }
          //     },
          //     restore: { show: true },
          //     saveAsImage: { show: true }
          //   }
          // },
          calculable: true,
          series: [
            {
              name: '用户来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '课程分销' },
                { value: 310, name: '附近小程序' },
                { value: 234, name: '社交立减金' },
                { value: 135, name: '公众号' },
                { value: 1548, name: '社群分享' },
                { value: 1548, name: '广告投放' },
                { value: 1548, name: '搜索小程序' },
                { value: 1548, name: '线下扫码' }
              ]
            }
          ]
        })
        // 订单饼状图
        const orderChart = echarts.init(document.getElementById('orderChart'))
        // 绘制图表
        orderChart.setOption({
          title: {
            text: '订单来源',
            // subtext: '纯属虚构',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: ['直播课', '系列课', '单词课', '用户充值']
          },
          calculable: true,
          series: [
            {
              name: '订单来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '直播课' },
                { value: 310, name: '系列课' },
                { value: 234, name: '单词课' },
                { value: 135, name: '用户充值' }
              ]
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>
  .dataEchart{
    margin: 50px 0 auto 0;
  }
</style>

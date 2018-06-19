<template>
  <div class="dashboard-container" style="padding: 0 15px;">
    <!-- 统计数据 -->
    <template>
      <el-row class="count-number">
        <el-col :span="8" >
         总用户数<br>
         <h2>36462</h2>
        </el-col>
        <el-col :span="8" >
          总上架课程数<br>
          <h2>1208</h2>
        </el-col>
        <el-col :span="8" >
          总销售额<br>
          <h2>1200</h2>
        </el-col>
      </el-row>
    </template>
    <!-- 运营概况 -->
    <s-echarts></s-echarts>
    <!-- 数据来源分析 -->
    <d-echarts></d-echarts>
    <!-- 课程销售榜单 -->

    <div style="margin-top: 50px; margin-bottom: 50px">
      <h3>课程销售榜单(TOP10)</h3>
      <el-table class="sale-table"
                border
                :data="saleTable"
                tooltip-effect="dark">
        <el-table-column align="center" label="课程名称" prop="courseName">

        </el-table-column>
        <el-table-column align="center" label="访客数(UV)" prop="visitNum">

        </el-table-column>
        <el-table-column align="center" label="购买数" prop="buyNum">

        </el-table-column>
        <el-table-column align="center" label="转换率(%)" prop="rate">

        </el-table-column>
        <el-table-column align="center" label="销售收入(元)" prop="saleMoney">

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import situationEcharts from './situationEcharts'
import dataAnalysisEcharts from './dataAnalysisEcharts'
export default {
  data() {
    return {
      saleTable: [{
        courseName: '创意X技术，引爆社交媒体营销',
        visitNum: 23879,
        buyNum: 2701,
        rate: 11.31,
        saleMoney: 26739.9
      }, {
        courseName: '知识变现的门道',
        visitNum: 12345,
        buyNum: 1234,
        rate: 6.31,
        saleMoney: 4320.8
      }, {
        courseName: '咨询短视频的7个必然',
        visitNum: 12345,
        buyNum: 1234,
        rate: 6.31,
        saleMoney: 4320.8
      }, {
        courseName: '十点读书如何通过新媒体变现',
        visitNum: 12345,
        buyNum: 1234,
        rate: 6.31,
        saleMoney: 4320.8
      }, {
        courseName: '社交媒体时代的短视频玩法',
        visitNum: 12345,
        buyNum: 1234,
        rate: 6.31,
        saleMoney: 4320.8
      }, {
        courseName: '用社群思维构架直播逻辑',
        visitNum: 12345,
        buyNum: 1234,
        rate: 6.31,
        saleMoney: 4320.8
      }]
    }
  },
  components: {
    's-echarts': situationEcharts,
    'd-echarts': dataAnalysisEcharts
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .count-number{
    height: 130px;
    margin: 2% 10% auto 10%;
  }
  .sale-table{
    width: 70%;
    margin: 0px 10% auto 10%;
  }
</style>

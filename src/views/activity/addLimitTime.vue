<template>
  <div class="addLive_container" style="padding: 0 15px;">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" >
      <el-form-item  label="选择课程" >
        <el-button @click="dialogVisible = true">选择课程</el-button>
      </el-form-item>

      <div v-if="willShow" style="height: 140px;padding-left: 30px;border:1px dashed #b8c1c5;width: 550px;line-height: 1.5;margin-bottom: 20px; margin-left: 80px">

        <img  align="left"  width="150px" height="100px" :src="this.imgSrc" style="margin-top: 20px;"/>
        <h3 style="margin-top: 30px;margin-left: 170px;"> {{this.mainTitle1}}</h3>
        <p style="margin-left: 170px;">¥ {{this.price}}</p>
      </div>
      <el-form-item label="优惠时间" >
        <el-col :span="4">
          <el-form-item prop="seckillBeginTime">
            <el-date-picker prop="seckillBeginTime" v-model="form.seckillBeginTime" type="datetime"  placeholder="开始时间"></el-date-picker>
          </el-form-item>
        </el-col>
        至
        <!-- <el-col class="line" :span="2">-</el-col>-->
        <el-col :span="3">
          <el-form-item prop="seckillEndTime">
            <el-date-picker prop="seckillEndTime" v-model="form.seckillEndTime" type="datetime"  placeholder="结束时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item prop="seckillPrice" label="优惠价格">
          <el-input style="width: 13%" v-model="form.seckillPrice">
            <template slot="append">元</template>
          </el-input>
      </el-form-item>
      <el-button type="primary" @click="onSubmit(form)">立即保存</el-button>
      <span v-if="this.err">{{this.errMsg}}</span>
    </el-form>
    <el-dialog style="" title="选择课程" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%" @row-click="rowClick">
        <el-table-column align="center" label="课程名称" width="400">
          <template slot-scope="scope">
            <el-row :gutter="100">
              <el-col :span="5" >
                <img  align="left"  width="75px" height="50px" :src="scope.row.smallCover"/>
              </el-col>
              <el-col :span="17" align="left" style="    padding-left: 50px">
                <div >
                  <p> {{scope.row.mainTitle}}</p>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格">
          <template slot-scope="scope" ><p style="color: red">¥{{scope.row.sellPrice/100}}</p></template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.pageData.total"
        :page-size="5"
        @current-change="onCurrentChange" style="text-align: center;margin-top: 15px;">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          courseId: '',
          seckillPrice: 0,
          seckillBeginTime: '',
          seckillEndTime: '',
          seckillId: '0'
        },
        rules: {
          courseId: [
            { required: true, message: '请选择课程', trigger: 'blur' }
          ],
          seckillPrice: [
            { required: true, message: '请输入活动价', trigger: 'blur' }
          ],
          seckillBeginTime: [
            { required: true, message: '请输入活动开始时间', trigger: 'blur' }
          ],
          seckillEndTime: [
            { required: true, message: '请输入活动结束时间', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        editMessage: '',
        imgSrc: '',
        willShow: false,
        mainTitle1: '',
        price: 0,
        pageNum: 1,
        errMsg: '',
        err: false,
        pageData: {
          total: 0
        },
        // 表格数据
        tableData: [{
          courseId: '',
          mainTitle: '',
          secondTitle: '',
          sellPrice: '',
          smallCover: ''
        }]
      }
    },
    created() {
      this.getParams()
      this.initList()
      this.initEdit()
    },
    methods: {
      initList: function() {
        this.$api.post('/limitTime/qryCourseList', { pageNum: this.pageNum, pageSize: 5 }, false, r => {
          console.log(r)
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          this.tableData = r.data.list
          console.log(r.data.total)
          this.pageData.total = r.data.total
          // console.log(JSON.stringify(this.pageData))
          // console.log( this.tableData)
        })
      },
      onCurrentChange: function(pageIndex) {
        console.log('接收的数据--------->' + pageIndex)
        this.pageNum = pageIndex
        this.initList()
      },
      initEdit: function() {
        console.log(this.form.seckillId)
        if (this.form.seckillId < 1) return
        this.$api.post('/limitTime/getDetail', { id: this.form.seckillId }, false, r => {
          console.log(r)
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          this.form = r.data
          this.dialogVisible = false
          this.imgSrc = r.data.course.smallCover
          this.willShow = true
          this.mainTitle1 = r.data.course.mainTitle
          this.price = r.data.course.sellPrice / 100
          this.form.seckillPrice = this.form.seckillPrice / 100
          console.log(this.form)
        })
      },
      onEditorReady(editor) {
        console.log(editor)
      },
      handleClose(done) {
        done()
      },
      rowClick(row, event, column) {
        console.log('123' + row.courseId)
        this.dialogVisible = false
        this.imgSrc = row.smallCover
        this.willShow = true
        this.mainTitle1 = row.mainTitle
        this.price = row.sellPrice / 100
        this.form.courseId = row.courseId
      },
      // 提交
      onSubmit(form) {
        console.log(this.form)
        // a.liveStartTime = a.liveStartTime.getTime()
        console.log(this.form)
        console.log(this.form.courseId)
        if (form.courseId === '' || form.courseId === '0') {
          this.$message.error('请选择课程')
          return false
        }
        if (form.seckillBeginTime === '') {
          this.$message.error('请选择开始时间')
          return false
        }
        if (form.seckillEndTime === '') {
          this.$message.error('请选择结束时间')
          return false
        }
        if (form.seckillEndTime <= form.seckillBeginTime) {
          this.$message.error('活动结束时间必须大于开始时间')
          return false
        }
        if (form.seckillPrice === '' || form.seckillPrice == 0) {
          this.$message.error('请输入活动价格')
          return false
        }
        if (form.seckillPrice > this.price) {
          this.$message.error('活动价格不能大于销售价格')
          return false
        }
        const params = {
          'courseId': this.form.courseId,
          'seckillBeginTime': this.form.seckillBeginTime,
          'seckillEndTime': this.form.seckillEndTime,
          'seckillPrice': this.form.seckillPrice * 100,
          'seckillId': this.form.seckillId
        }
        if (this.form.seckillId !== '0') {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('limitTime/edit', params, true, r => {
                console.log(JSON.stringify(r))
                this.$router.push({ name: 'limitTime' })
              }, f => {
                if (f.status !== 0) {
                  this.$message.error(f.msg)
                  return
                }
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          this.form.seckillId = '0'
          // 新增
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('limitTime/save', params, true, r => {
                console.log('-------' + r)
                this.$message({ message: '保存成功', type: 'success' })
                this.$router.push({ name: 'limitTime' })
              }, f => {
                if (f.status !== 0) {
                  this.$message.error(f.msg)
                  return
                }
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      },
      // 获取数据
      getParams() {
        const routerParams = this.$route.params.id
        if (routerParams !== undefined) {
          console.log(routerParams)
          this.form.seckillId = routerParams
          // routerParams.sellPrice /= 100
          // this.form = routerParams
        }
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      // '$route': 'getParams'
    },
    components: {
      // 使用编辑器
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon-big {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 142px;
    line-height: 142px;
    text-align: center;
  }
  .avatar-uploader-icon-small {
    font-size: 28px;
    color: #8c939d;
    width: 142px;
    height: 142px;
    line-height: 142px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .addLive_container {
    margin: 15px 0;
  }


</style>

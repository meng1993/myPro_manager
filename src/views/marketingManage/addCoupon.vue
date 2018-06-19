<template>
  <div class="addCoupon_container" style="padding: 0 15px;">
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" >
      <el-form-item prop="couponName" label="优惠券名称">
        <el-input style="width: 60%" v-model="form.couponName" placeholder="请输入优惠券名称"></el-input>
      </el-form-item>
      <el-form-item prop="couponMoney" label="券面额度">
        <el-input style="width: 13%" v-model="form.couponMoney">
          <template slot="append">元</template>
          <p>额度必须大于0元</p>
        </el-input>
      </el-form-item>
      <el-form-item prop="useLimit" label="课程范围">
        <el-select style="width: 13%" v-model="form.useLimit" placeholder="课程范围">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="couponType" label="使用条件">
        <el-row>
          <el-radio  v-model="form.couponType"   v-bind:label="0">无门槛</el-radio>
        </el-row>
        <el-row>
        <el-radio  v-model="form.couponType"  v-bind:label="1">满   <el-input style="width: 40%" v-model="form.spendMoney"><template slot="append">元</template></el-input>   使用</el-radio>
        </el-row>
      </el-form-item>
      <el-form-item  prop="validEndTime" label="有效期限">
        <el-date-picker
          prop="validBeginTime"
          v-model="form.validBeginTime"
          type="datetime"
          placeholder="可用时间">
        </el-date-picker>
        <el-date-picker
          prop="validEndTime"
          v-model="form.validEndTime"
          type="datetime"
          placeholder="失效时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="sendNum" label="发行数量">
        <el-input style="width: 13%" v-model="form.sendNum">
          <p>数量必须大于0，修改时只能增加不能减少，请慎重</p>
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="onSubmit(form)">立即创建</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    created() {
      this.getParams()
    },
    data() {
      return {
        form: {
          couponId: '',
          couponMoney: '',
          couponName: '',
          couponType: '',
          sendNum: '',
          spendMoney: '',
          useLimit: '',
          validBeginTime: '',
          validEndTime: ''
        },
        rules: {
          couponName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          couponMoney: [
            { required: true, message: '请输入券面金额', trigger: 'blur' }
          ],
          couponType: [
            { required: true, message: '请选择课程范围', trigger: 'blur' }
          ],
          useLimit: [
            { required: true, message: '请选择使用条件', trigger: 'blur' }
          ],
          validBeginTime: [
            { required: true, message: '请选择有效期限', trigger: 'blur' }
          ],
          validEndTime: [
            { required: true, message: '请选择有效期限', trigger: 'blur' }
          ],
          sendNum: [
            { required: true, message: '请选择发行数量', trigger: 'blur' }
          ]
        },
        options: [{
          value: 0,
          label: '所有课程'
        }, {
          value: 1,
          label: '录播课程'
        }, {
          value: 2,
          label: '直播课程'
        }]
      }
    },
    methods: {
      onSubmit(data) {
        console.log(this.form)
        this.form.couponMoney = this.form.couponMoney * 100
        if (this.form.couponType === 1) {
          this.form.spendMoney = this.form.spendMoney * 100
        }
        console.log(this.form)
        console.log(this.form.couponId)
        if (this.form.couponId !== '') {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('coupon/update', this.form, true, r => {
                console.log(JSON.stringify(r))
                this.$router.push({ name: 'coupon' })
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          // 新增
          // if (this.form.validBeginTime === '' || this.form.validEndTime === '' || (this.form.couponType === 1 && this.form.spendMoney === '')){
          //   alert('请填写使用日期或者最低消费金额')
          //   return
          // }
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('coupon/add', this.form, true, r => {
                console.log(JSON.stringify(r))
                this.$router.push({ name: 'coupon' })
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
        const routerParams = this.$route.params.dataObj
        console.log(routerParams)
        if (routerParams !== undefined) {
          routerParams.couponMoney /= 100
          routerParams.spendMoney /= 100
          this.form = routerParams
        }
      }
    }
  }
</script>

<style scoped>
  .addCoupon_container {
    margin: 15px 0;
  }
</style>

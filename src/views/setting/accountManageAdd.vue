<template>
  <div class="addVideo_container" style="padding: 0 15px;">
    <el-form :rules="formRules" ref="userForm" :model="userForm" label-width="80px" >
      <el-form-item label="用户名" prop="userName">
        <el-input style="width: 60%" v-model="userForm.userName" placeholder="请输入用户名" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input style="width: 60%" v-model="userForm.realName" placeholder="请输入真实姓名" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="账号手机" prop="moblie">
        <el-input style="width: 60%" v-model="userForm.moblie" placeholder="请输入手机号码" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="用户头像" prop="headImg">
        <el-upload class="avatar-uploader" :action="uploadUrl" :limit="1" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="userForm.headImg" :src="userForm.headImg" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon-big"></i>
        </el-upload>
      </el-form-item>
      <el-button class="submitCla" type="primary" @click="onSubmit()">保存</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        uploadUrl: '', // 拼接路径
        // 表单数据
        userForm: {
          userId: '',
          userName: '',
          realName: '',
          headImg: '',
          moblie: ''
        },
        // 校验规则
        formRules: {
          userName: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
          moblie: [{ required: true, trigger: 'blur', message: '手机号号码不能为空' }],
          headImg: [{ required: true, trigger: 'blur', message: '用户头像不能为空' }]
        }
      }
    },
    mounted() {
      this.uploadUrl = this.WORKPATH + '/common/uploadFile/image'
    },
    created() {
      const self = this
      self.getUserIdByRouter()
      if (self.userForm.userId !== '') {
        self.initLoadData()
      }
    },
    methods: {
      // 通过路由获取上个页面传递过来的courseId
      getUserIdByRouter() {
        const self = this
        const userId = self.$route.query.id
        if (userId !== undefined) {
          self.userForm.userId = userId
        }
      },
      // 初始化加载数据
      initLoadData() {
        const self = this
        const params = { 'userId': self.userForm.userId }
        self.$api.post('/accountManage/detail', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('详情查询失败')
          }
          self.userForm = r.data
        })
      },
      // 上传头像成功回调
      handleAvatarSuccess(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传头像失败')
        }
        const data = file.response.data
        this.userForm.headImg = data.url
      },
      // 上传限制
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isLt5M
      },
      // 保存数据
      onSubmit() {
        const self = this
        self.$refs.userForm.validate((valid) => {
          if (valid) {
            // 深拷贝
            const params = JSON.parse(JSON.stringify(self.userForm))
            // console.log('onSubmit', params)
            self.$api.post('/accountManage/edit', params, true, r => {
              if (r.status === 0) {
                this.$router.go(-1)
                return self.$message.success('保存成功')
              } else {
                return self.$message.error('保存失败')
              }
            })
          }
        })
      }
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .addVideo_container {
    margin: 15px 0;
  }

  .edit_container {
    max-width: 1200px;
    width: auto;
    height: 500px;
  }

</style>

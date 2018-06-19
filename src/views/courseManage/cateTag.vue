<template>
  <div class="tag_container" style="padding: 0 15px;">
    <el-row class="margin_top_bottom_15">
      <el-button @click="dialogVisible = true,addTagName = ''">新增标签</el-button>
    </el-row>
    <!--添加课时标签弹框-->
    <el-dialog style=""
               title="添加课时标签"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <el-input v-model="addTagName" maxlength="10" type="text" placeholder="标签名称"></el-input>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button  type="primary" @click="addTag(addTagName)">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog style= ""
               title="编辑课程分类"
               :visible.sync="editVisible"
               width="30%"
               :before-close="handleClose">
      <el-input v-model="editMessage" type="text" placeholder="分类名称"></el-input>
      <span slot="footer" class="dialog-footer">
                  <el-button @click="editVisible = false">取 消</el-button>
                  <el-button type="primary" @click="edit">确 定</el-button>
          </span>
    </el-dialog>

    <!--表格-->
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="tagId"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="标签名称"
      >
        <template slot-scope="scope">{{ scope.row.tagName }}</template>
      </el-table-column>
      <el-table-column
        prop="cateCount"
        label="标记课时"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text"
                     @click="openDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          tagId: '',
          tagName: '',
          cateCount: ''
        }],
        dialogVisible: false,
        editVisible: false,
        addTagName: '',
        editMessage: '',
        id: ''
      }
    },
    created() {
      this.getMessage()
    },
    methods: {
      // 获取表格数据
      getMessage() {
        this.$api.post('tag/list', { pageNum: 1, pageSize: 20 }, false, r => {
          console.log(JSON.stringify(r))
          this.tableData = r.data.list
        })
      },
      // 添加标签
      addTag(addName) {
        console.log(addName)
        if (addName === '') {
          return this.$message.error('请输入标签名称')
        }
        this.$api.post('tag/add', { tagName: addName }, false, r => {
          console.log(JSON.stringify(r))
          this.dialogVisible = false
          this.getMessage()
        })
      },
      // 编辑标签
      openDialog(index, row) {
        this.editVisible = true
        this.editMessage = row.tagName
        this.id = row.tagId
      },
      handleSelectionChange(selection) {
        this.selectData = selection
        console.log(selection)
      },
      // 删除选中事件（批量删除）
      deleteSelect(section) {
        console.log(this.selectData)
        if (this.selectData.length !== 0) {
          // 选中的有，就弹出是否确认删除
          this.$confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const arr = []
            this.selectData.forEach(function(value) {
              arr.push(value.id)
            })
            const planId = arr.join(',')
            console.log(planId)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          // 如果没选中就弹
          this.$alert('请选择您要删除的课程', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '',
            type: 'error'
          })
        }
      },
      // 单个删除
      handleDelete(index, row) {
        console.log(index)
        console.log(row)
        this.id = row.tagId
        this.$api.post('tag/delete', { tagId: this.id }, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
          }
        })
        this.getMessage()
      },
      handleClose(done) {
        done()
      },
      closeDialog(a) {
        if (a === 'add') {
          console.log(this.dialogVisible)
          this.dialogVisible = false
        } else {
          console.log(this.editVisible)
          this.editVisible = false
        }
      },
      edit() {
        console.log(this.id)
        console.log(this.editMessage)
        this.$api.post('tag/update', { tagId: this.id, tagName: this.editMessage }, false, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            return this.$message.error('修改失败')
          }
          this.editVisible = false
          this.id = ''
          this.$message.success('修改成功')
          this.getMessage()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
   .margin_top_bottom_15{
     margin: 15px 0;
   }
</style>


<template>
    <div class="course_container" style="padding: 0 15px;">
        <el-row class="margin_top_bottom_15">
            <el-button @click="dialogVisible = true,addTypeName = ''">新增分类</el-button>
        </el-row>
        <!--添加课程名称弹框-->
        <el-dialog
            style=""
            title="添加课程分类"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-input v-model="addTypeName" maxlength="10" type="text" placeholder="分类名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button  type="primary" @click="addType(addTypeName)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类 -->
        <el-dialog style= ""
          title="编辑课程分类"
          :visible.sync="editVisible"
          width="30%"
          :before-close="handleClose">
          <el-input v-model="editMessage" maxlength="10" type="text" placeholder="分类名称"></el-input>
          <span slot="footer" class="dialog-footer">
                  <el-button @click="editVisible = false">取 消</el-button>
                  <el-button type="primary" @click="edit(editMessage)">确 定</el-button>
          </span>
        </el-dialog>

        <!--表格-->
        <el-table
            border
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                prop="typeId"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="分类名称"
                >
                <template slot-scope="scope">{{ scope.row.typeName }}</template>
            </el-table-column>
            <el-table-column
                prop="courseCount"
                label="课程数"
                >
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" button :disabled="scope.$index===0"
                        @click="moveTop(scope.$index, scope.row)">上移</el-button>
                    <el-button type="text" :disabled="scope.$index===tableData3.length-1"
                        @click="moveBottom(scope.$index, scope.row)">下移</el-button>
                    <el-button type="text"
                        @click="openDialog(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--批量操作按钮-->
        <el-row class="margin_top_bottom_15">
            <el-button @click="deleteSelect">批量删除</el-button>
            <el-button @click="removeSelect">批量上移</el-button>
            <el-button>批量下移</el-button>
        </el-row>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData3: [{
        typeId: '',
        typeName: '',
        courseCount: '',
        sort: ''
      }],
      multipleSelection: [],
      selectData: [],
      // 新增弹框是否显示出来
      dialogVisible: false,
      editVisible: false,
      // 编辑分类变量
      editMessage: '',
      addTypeName: '',
      id: '',
      selectId: {},
      selectIdStr: ''
    }
  },
  created() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      // let data = { pageNum: 1, pageSize: 5 }
      this.$api.post('type/list', { pageNum: 1, pageSize: 20 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData3 = r.data.list
      })
    },
    handleSelectionChange(selection) {
      this.selectData = selection
      console.log(selection)
    },
    // 删除选中事件（批量删除）
    deleteSelect() {
      console.log(this.selectData)
      for (var i = 0; i < this.selectData.length; i++) {
        if (i !== this.selectData.length - 1) {
          this.selectIdStr += this.selectData[i].typeId + ','
        } else {
          this.selectIdStr += this.selectData[i].typeId
        }
      }
      console.log('==selectIdStr' + this.selectIdStr)
      this.$api.post('/type/batchDelete', { typeId: this.selectIdStr }, false, r => {
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.selectIdStr = ''
        this.getMessage()
      })
    },
    // 批量上移
    removeSelect() {
      console.log(this.selectData)
      for (var i = 0; i < this.selectData.length; i++) {
        if (i !== this.selectData.length - 1) {
          this.selectIdStr += this.selectData[i].typeId + ','
        } else {
          this.selectIdStr += this.selectData[i].typeId
        }
      }
      console.log('==selectIdStr' + this.selectIdStr)
      this.$api.post('/type/batchUpRemove', { typeId: this.selectIdStr }, false, r => {
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.getMessage()
      })
    },
    // 单个删除
    handleDelete(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm('是否确定要删除此课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$api.post('type/delete', { typeId: row.typeId }, false, r => {
          console.log(JSON.stringify(r))
          this.getMessage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 上移
    moveTop(a, b) {
      console.log(a)
      console.log(b)
      this.$api.post('type/upRemove', { typeId: b.typeId }, false, r => {
        console.log(JSON.stringify(r))
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.getMessage()
      })
    },
    // 下移
    moveBottom(a, b) {
      this.$api.post('type/downRemove', { typeId: b.typeId }, false, r => {
        console.log(JSON.stringify(r))
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.getMessage()
      })
    },
    openDialog(a, b) {
      console.log(a)
      console.log(b)
      console.log(b.typeName)
      this.editVisible = true
      this.editMessage = b.typeName
      this.id = b.typeId
    },
    handleClose(done) {
      done()
    },
    addType(a) {
      console.log(a)
      var name = a
      if (a.length === 0) {
        return this.$message.error('请填写课程分类')
      }
      this.$api.post('type/add', { typeName: name }, false, r => {
        console.log(JSON.stringify(r))
        this.closeDialog('add')
        this.getMessage()
      })
    },
    closeDialog(a) {
      console.log(a)
      if (a === 'add') {
        console.log(this.dialogVisible)
        this.dialogVisible = false
      } else if (a === 'edit') {
        console.log(this.editVisible)
        this.editVisible = false
      }
    },
    edit(msg) {
      if (msg.length === 0) {
        return this.$message.error('请填写课程分类')
      }
      this.$api.post('type/update', { typeId: this.id, typeName: this.editMessage }, false, r => {
        console.log(JSON.stringify(r))
        this.closeDialog('edit')
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

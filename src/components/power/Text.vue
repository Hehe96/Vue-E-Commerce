<template>
  <div>
    <el-button type="primary" @click="addRolesShow">添加角色</el-button>
    <el-dialog title="添加角色" :visible.sync="addVisible" width="50%">
      <el-form :model="addFormData" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="username">
          <el-input v-model="addFormData.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Text',
  data() {
    return {
      addFormData: {
        name: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      addVisible: false
    }
  },
  methods: {
    addRolesShow() {
      this.addVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>

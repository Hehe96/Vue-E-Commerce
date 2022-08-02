<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与用户添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="qureyinfo.query" clearable @clear="getUserList"> <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button> </el-input
        ></el-col>
        <el-col :span="4"><el-button type="primary" @click="addDialogVisible = true">添加</el-button></el-col>
      </el-row>
      <!-- 表格数据区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="ID"> </el-table-column>
        <el-table-column prop="username" label="名称"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="{ row }">
            <el-switch v-model="row.mg_state" @change="userStateChanged(row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateShowDialog(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(row)"></el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="qureyinfo.pagenum" :page-sizes="[1, 3, 5, 7]" :page-size="qureyinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="updateDialogVisible" width="50%">
      <el-form :model="updateForm" :rules="updateFormRul" ref="updateFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogReset">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户数据 -->
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号验证
    var checkMobile = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      qureyinfo: {
        query: '',
        // 当前所在页数
        pagenum: 1,
        // 每页显示的条目数
        pagesize: 3
      },
      // 用户数据列表
      userList: [],
      // 总共多少条数据
      total: 0,
      // 控制添加用户对话框显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框显示与隐藏
      updateDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单数据
      updateForm: {},
      // 添加用户表单验证对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户的表单验证对象
      updateFormRul: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户的数据列表
    async getUserList() {
      const { data: res } = await this.$http.get('/users', { params: this.qureyinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 每页条目数发生改变时会调用
    handleSizeChange(val) {
      this.qureyinfo.pagesize = val
      this.getUserList()
    },
    // 当前页数发生改变会调用
    handleCurrentChange(val) {
      this.qureyinfo.pagenum = val
      this.getUserList()
    },
    // 改变用户的状态并保存在数据中
    async userStateChanged(val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('用户状态设置失败')
      }
      this.$message.success(res.meta.msg)
    },
    // 监听用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加事件
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败!')
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 根据用户id查询用户信息
    async updateShowDialog(row) {
      const { data: res } = await this.$http.get(`users/${row.id}`)
      if (res.meta.status !== 200) return
      this.updateForm = res.data
      this.updateDialogVisible = true
    },
    // 修改 点击取消重置输入框
    updateDialogReset() {
      this.$refs.updateFormRef.resetFields()
      this.$message.warning('取消修改')
      this.updateDialogVisible = false
    },
    // 修改 点击确定确认修改
    updateUser() {
      this.$refs.updateFormRef.validate(async (val) => {
        if (!val) return
        const { data: res } = await this.$http.put(`users/${this.updateForm.id}`, this.updateForm)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getUserList()
        this.updateDialogVisible = false
      })
    },
    // 删除用户数据
    async deleteUser(row) {
      const confirmRes = await this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 确认删除 会返回一个字符串confirm
      // 取消删除 会返回一个cancel
      if (confirmRes !== 'confirm') {
        this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${row.id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped></style>

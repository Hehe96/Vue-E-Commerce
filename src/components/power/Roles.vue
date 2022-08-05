<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addShowDialog">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolesData" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row :class="['bdbottom', l1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, l1) in row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(row, item1.id)" closable> {{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row :class="['vcenter', l2 === 0 ? '' : 'bdtop']" v-for="(item2, l2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRightById(row, item2.id)" closable type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRightById(row, item3.id)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="address" label="操作" width="290px">
          <template slot-scope="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShowDialog(row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="showSetRightDialog(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="60%" :before-close="addhandleClose">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addResetForm">取 消</el-button>
        <el-button type="primary" @click="addRloes">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="60%" :before-close="edithandleClose">
      <el-form :model="editForm" :rules="editFormRul" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editResetForm">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogclosed">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色数据
      rolesData: [],
      // 控制添加角色显示与隐藏
      addDialogVisible: false,
      // 添加角色数据对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [{ min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }]
      },
      // 编辑角色
      editDialogVisible: false,
      // 编辑角色的数据
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色的表单验证
      editFormRul: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [{ min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }]
      },
      // 控制分配权限的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选定的节点的id值
      defKeys: [],
      roleid: ''
    }
  },
  created() {
    this.rolesList()
  },
  methods: {
    // 获取角色列表数据
    async rolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      this.rolesData = res.data
    },
    // 点击显示添加角色对话框
    addShowDialog() {
      this.addDialogVisible = true
    },
    // 点击有上角的叉号重置表单
    addhandleClose() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.$message('取消添加角色')
    },
    // 点击取消重置表单
    addResetForm() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.$message('取消添加角色')
    },
    // 点击确定验证表单并发送添加请求
    addRloes() {
      this.$refs.addFormRef.validate(async (val) => {
        if (!val) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success(res.meta.msg)
        this.rolesList()
        this.addDialogVisible = false
        this.$refs.addFormRef.resetFields()
      })
    },
    // 编辑角色
    // 点击显示添加角色对话框 并通过id来查询角色的信息 并放到表单中
    async editShowDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击有上角的叉号重置表单
    edithandleClose() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
      this.$message('取消编辑')
    },
    // 点击取消按钮
    editResetForm() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
      this.$message('取消编辑')
    },
    // 点击确定编辑角色
    editRoles() {
      this.$refs.editFormRef.validate(async (val) => {
        if (!val) return
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
        this.$message.success('编辑用户成功')
        this.editDialogVisible = false
        this.rolesList()
      })
    },
    // 删除角色
    async removeRoles(id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 确认删除 会返回一个字符串confirm
      // 取消删除 会返回一个cancel
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.rolesList()
    },
    // 根据,id删除对应的权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 确认删除 会返回一个字符串confirm
      // 取消删除 会返回一个cancel
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('权限取消失败')
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 分配权限
    async showSetRightDialog(row) {
      this.roleid = row.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('权限获取失败')
      this.rightsList = res.data
      console.log(this.rightsList)
      this.getLeafKeys(row, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取角色下所有三级权限的id 并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogclosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.rolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsData" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightsData: []
    }
  },
  created() {
    this.rightsList()
  },
  methods: {
    async rightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return
      this.rightsData = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>

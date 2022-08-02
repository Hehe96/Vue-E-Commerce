<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="" />

        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧边栏  -->
      <el-aside :width="isToggle ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleCollapse">| | |</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isToggle" :collapse-transition="false" :router="true">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 左侧菜单图标对象
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isToggle: false,
      // 被激活的状态
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.localStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    loginOut() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.sg)
      this.menuList = res.data
    },
    // 左侧菜单栏折叠
    toggleCollapse() {
      this.isToggle = !this.isToggle
    },
    // 左侧菜单激活状态
    saveNavState(activePath) {
      window.localStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: 24px;
  text-align: center;
  cursor: pointer;
}
</style>

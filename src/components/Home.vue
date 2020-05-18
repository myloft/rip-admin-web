<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/home-logo.png" alt />
        <span>Snow-Raws Rip 进度管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width>
        <!-- 菜单区域 -->
        <el-menu unique-opened router :default-active="this.$route.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.Id + ''" v-for="item in menuList" :key="item.Id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.Id]"></i>
              <!-- 文本 -->
              <span>{{item.Name}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.Path"
              v-for="subItem in item.Children"
              :key="subItem.Id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subItem.Name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        0: 'el-icon-film',
        1: 'el-icon-user'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.localStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      try {
        const { data: res } = await this.$http.get('menus')
        this.menuList = res.data
      } catch {
        return this.$message.error('获取菜单失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  color: #303133;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20;
  border-bottom: solid 1px #dcdfe6;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  color: #333;
  border-right: solid 1px #e6e6e6;
}
</style>

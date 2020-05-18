<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理用户</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 占坑列表 -->
      <el-table :data="userslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="Name"></el-table-column>
        <el-table-column label="管理员权限">
          <template v-slot="scope">
            <el-switch v-model="scope.row.Admin" @change="adminChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: ''
      },
      userslist: [],
      total: 0
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      try {
        const { data: res } = await this.$http.get('users', {
          params: this.queryInfo
        })
        this.userslist = res.data
      } catch {
        return this.$message.error('获取用户数据失败！')
      }
    },
    // 监听管理员权限变更
    async adminChange(adminInfo) {
      try {
        console.log(adminInfo)
        const { data: res } = await this.$http.put(
          `users?username=${adminInfo.Name}&admin=${adminInfo.Admin}`
        )
        if (res.status !== 200) {
          return this.$message.error('更新权限失败')
        }
        return this.$message.success('更新权限成功')
      } catch {
        return this.$message.error('更新权限失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

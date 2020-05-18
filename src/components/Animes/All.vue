<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>占坑管理</el-breadcrumb-item>
      <el-breadcrumb-item>全部占坑</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-input
              placeholder="检索 Anid 或中文关键字"
              v-model="queryInfo.query"
              clearable
              @clear="getAllAnimes"
            >
              <el-button slot="append" icon="el-icon-search" @click="getAllAnimes"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 占坑列表 -->
      <el-table :data="animeslist" border stripe>
        <el-table-column label="Anid" prop="Anid" width="55"></el-table-column>
        <el-table-column label="日文名" prop="Official_name"></el-table-column>
        <el-table-column label="中文名" prop="Zh_name"></el-table-column>
        <el-table-column label="占坑人" prop="Owner" width="100"></el-table-column>
        <el-table-column label="占坑时间" prop="CreatedAt" width="220"></el-table-column>
        <el-table-column label="状态" width="75">
          <template v-slot="scope">
            <span v-if="scope.row.Status===2">
              <el-tag type="success">已发布</el-tag>
            </span>
            <span v-else-if="scope.row.Status===1">
              <el-tag>仅占坑</el-tag>
            </span>
            <span v-else-if="scope.row.Status===3">
              <el-tag type="info">压制中</el-tag>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      animeslist: [],
      total: 0,
      valid: false
    }
  },
  created() {
    this.getAllAnimes()
  },
  methods: {
    async getAllAnimes() {
      try {
        const { data: res } = await this.$http.get('animes', {
          params: this.queryInfo
        })
        this.animeslist = res.data
        this.total = res.total
      } catch {
        return this.$message.error('获取占坑数据失败！')
      }
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAllAnimes()
    },
    // 监听 page 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getAllAnimes()
    },
    async getAnimeInfo() {
      try {
        const { data: res } = await this.$http.get(
          `animeinfo?aid=${this.addForm.Anid}`
        )
        this.addForm.Official_name = res.data.Official_name
        this.addForm.Zh_name = res.data.Zh_name
      } catch {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

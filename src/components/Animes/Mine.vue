<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>占坑管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的占坑</el-breadcrumb-item>
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
              @clear="getMineAnimes"
            >
              <el-button slot="append" icon="el-icon-search" @click="getMineAnimes"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">我要开坑</el-button>
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
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="setAnimeStatus(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除开坑" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteAnime(scope.row)"
              ></el-button>
            </el-tooltip>
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
    <el-dialog title="开坑" :visible.sync="addDialogVisible" width="50%" @close="getMineAnimes">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Anid" prop="Anid">
              <el-input v-model="addForm.Anid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="getAnimeStatus">检索</el-button>
          </el-col>
        </el-row>
        <el-form-item label="日文名" prop="Official_name">
          <el-input v-model="addForm.Official_name"></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="Zh_name">
          <el-input v-model="addForm.Zh_name"></el-input>
        </el-form-item>
        <el-form-item label="占坑状态" prop="Status">
          <el-select placeholder="请选择占坑状态" v-model="addForm.Status">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewAnime">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" @close="getMineAnimes">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-row :gutter="20"></el-row>
        <el-form-item label="日文名" prop="Official_name">
          <el-input v-model="addForm.Official_name"></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="Zh_name">
          <el-input v-model="addForm.Zh_name"></el-input>
        </el-form-item>
        <el-form-item label="占坑状态" prop="Status">
          <el-select placeholder="请选择占坑状态" v-model="addForm.Status">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAnime">确 定</el-button>
      </span>
    </el-dialog>
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
      // 控制开坑对话框
      addDialogVisible: false,
      addForm: {
        Anid: '',
        Official_name: '',
        Zh_name: '',
        Status: ''
      },
      addFormRules: {
        Anid: [{ required: true, message: '请输入 AniDB ID', trigger: 'blur' }],
        Official_name: [
          { required: true, message: '请输入日文名', trigger: 'blur' }
        ],
        Zh_name: [{ required: true, message: '请输入中文名', trigger: 'blur' }]
      },
      options: [
        {
          value: '1',
          label: '仅占坑'
        },
        {
          value: '3',
          label: '压制中'
        },
        {
          value: '2',
          label: '已发布'
        }
      ],
      // 控制修改对话框
      editDialogVisible: false
    }
  },
  created() {
    this.getMineAnimes()
  },
  methods: {
    async getMineAnimes() {
      try {
        const { data: res } = await this.$http.get('users/animes', {
          params: this.queryInfo
        })
        this.animeslist = res.data
        this.total = res.total
        this.addForm.Anid = ''
        this.addForm.Official_name = ''
        this.addForm.Zh_name = ''
        this.addForm.Status = ''
      } catch {
        return this.$message.error('获取占坑数据失败！')
      }
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getMineAnimes()
    },
    // 监听 page 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getMineAnimes()
    },
    async getAnimeInfo() {
      try {
        const { data: res } = await this.$http.get(
          `animeinfo?aid=${this.addForm.Anid}`
        )
        this.addForm.Official_name = res.data.Official_name
        this.addForm.Zh_name = res.data.Zh_name
      } catch {}
    },
    async getAnimeStatus() {
      try {
        const { data: res } = await this.$http.get(
          'animes/' + this.addForm.Anid
        )
        if (res.status === 404) {
          this.getAnimeInfo()
          return this.$message.success('恭喜你可以占坑！')
        } else {
          return this.$message.error('已经被' + res.data.Owner + '占啦！')
        }
      } catch {}
    },
    addNewAnime() {
      this.$refs.addFormRef.validate(async valid => {
        try {
          if (!valid) return
          const { data: res } = await this.$http.post(
            'animes',
            this.$qs.stringify(this.addForm)
          )
          if (res.status === 202) {
            return this.$message.success('占坑成功！')
          }
          return this.$message.error('失败了')
        } catch {
          return this.$message.error('失败了')
        }
      })
    },
    async updateAnime() {
      try {
        const { data: res } = await this.$http.put(
          'animes',
          this.$qs.stringify(this.addForm)
        )
        if (res.status === 202) {
          return this.$message.success('更新成功！')
        }
        return this.$message.error('失败了')
      } catch {
        return this.$message.error('失败了')
      }
    },
    async deleteAnime(row) {
      try {
        const { data: res } = await this.$http.delete('animes/' + row.Anid)
        if (res.status === 202) {
          this.getMineAnimes()
          return this.$message.success('删除成功！')
        }
        return this.$message.error('失败了')
      } catch {
        return this.$message.error('失败了')
      }
    },
    setAnimeStatus(row) {
      this.addForm.Anid = row.Anid
      this.addForm.Official_name = row.Official_name
      this.addForm.Zh_name = row.Zh_name
      this.editDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-co>
        <el-form :model="passwordForm" ref="passwordFormRef" :rules="passwordFormRules">
          <el-form-item label="新的密码" prop="password">
            <el-input v-model="passwordForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="updatePassword">修改</el-button>
      </el-co>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwordForm: {
        password: ''
      },
      // 密码规则
      passwordFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度在 6 个字符以上', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  methods: {
    updatePassword() {
      this.$refs.passwordFormRef.validate(async valid => {
        try {
          if (!valid) return
          const { data: res } = await this.$http.put(
            'users/password',
            this.$qs.stringify(this.passwordForm)
          )
          if (res.status === 202) {
            return this.$message.success('更新成功！')
          }
          return this.$message.error('失败了')
        } catch {
          return this.$message.error('失败了')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

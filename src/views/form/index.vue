<template>
  <div class="app-container">
    <div class="form-container" style="height: 70px">
      <el-row>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>节目名称：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>分辨率：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end" style="margin-bottom: -15px">
            <div>
              <el-button plain>重置</el-button>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="缩略图"></el-table-column>
      <el-table-column label="节目名称"></el-table-column>
      <el-table-column label="分辨率"></el-table-column>
      <el-table-column label="节目时长"></el-table-column>
      <el-table-column label="更新时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="check(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="">编辑</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        username: '',
        organization: ''
      },
      value: '',
      options: '',
      input1: ''
    }
  },
  methods: {
    async onSubmit() {
      this.$message('submit!')
    },
    async onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

.app-container {
  background-color: rgb(240, 242, 245);
}

.el-row {
  margin-bottom: 20px;
}

.form-container, .btn-container {
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 15px;
}

.input {
  width: 60%;
}
</style>


<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备名称：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属机构：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属分组：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>MAC地址：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>当前计划：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备状态：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row type="flex" justify="end" style="margin-bottom: -15px">
            <div>
              <el-button plain>重置</el-button>
              <el-button type="primary">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="设备名称"></el-table-column>
      <el-table-column prop="organization" label="所属机构"></el-table-column>
      <el-table-column prop="group" label="所属分组"></el-table-column>
      <el-table-column prop="MAC" label="MAC地址"></el-table-column>
      <el-table-column prop="state" label="设备状态"></el-table-column>
      <el-table-column prop="plan" label="当前计划"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="check(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="">编辑</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="设备详情" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="计划详情" name="first">
        </el-tab-pane>
        <el-tab-pane label="设备详情" name="second">设备详情</el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      activeName: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      input1: '',
      value: '',
      options: '',
      dialogTableVisible: false,
      dialogFormVisible: false
    }
  },
  methods: {
    check(row) {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style>
.app-container {
  background-color: rgb(240, 242, 245);
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

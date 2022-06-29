<template>
  <div>
    <div class="app-container">
      <div class="form-container">
        <el-row>
          <el-col :span="8">
            <el-row>
              <span>分组名称：</span>
              <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium"
                        class="input"
              />
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
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
            <el-row type="flex" justify="end">
              <div>
                <el-button plain>重置</el-button>
                <el-button type="primary">查询</el-button>
                <el-button type="primary" @click="handleCreate">新建分组</el-button>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list" border style="width: 100%">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="分组ID">
          <template v-slot="{row}">
            <span>{{ row.ID }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分组名称">
          <template v-slot="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="organization" label="所属机构" width="200">
          <template v-slot="{row}">
            <span>{{ row.OrganizationID }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="设备数量" width="100">

        </el-table-column>
        <el-table-column prop="describe" label="描述">
          <template v-slot="{row}">
            <span>{{ row.Describe }}</span>
          </template>
        </el-table-column>
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

    <el-dialog title="设备详情" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="计划详情" name="first">计划详情</el-tab-pane>
        <el-tab-pane label="设备详情" name="second">设备详情</el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建分组" :visible.sync="dialogFormVisible">
      <el-row>
        <span>选择设备</span>
        <el-tabs v-model="activeName" tab-position="top">
          <el-table
            :key="tableKey"
            :data="deviceLists"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column label="设备名称" align="center" width="80">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="MAC地址" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属分组" min-width="150px">
              <template slot-scope="{row}">
                <span>{{ row.group }}</span>
              </template>
            </el-table-column>
            <el-table-column label="分辨率" width="110px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ratio }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属机构" width="80px">
              <template slot-scope="{row}">
                <span>{{ row.organ }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前计划" align="center" width="95">
              <template slot-scope="{row}">
                <span>{{ row.plan }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备状态" width="100">
              <template slot-scope="{row}">
                <el-tag>
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                      @pagination="getList"
          />
        </el-tabs>
      </el-row>
      <div class="btn-container">

        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">发布</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDeviceList } from '@/api/device'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  name: 'index',
  data() {
    return {
      activeName: 'first',
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
      dialogFormVisible: false,
      deviceLists: [
        {
          name: '测试巫山',
          address: 'sss',
          group: 'fff',
          ratio: '1920*1080',
          organ: '城院罗老师测试',
          plan: '-',
          status: '离线'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      fetchDeviceList(this.listQuery).then(response => {
        this.list = response.data.groups
        console.log(response)
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    async handleCreate() {
      this.dialogFormVisible = true
    },
    async check(row) {
      this.dialogTableVisible = true
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

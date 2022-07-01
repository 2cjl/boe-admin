<template>
  <div>
    <div class="app-container">
      <div class="form-container">
        <el-row>
          <el-col :span="8">
            <span>分组名称：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
          </el-col>
          <el-col :span="8">
            <span>所属机构：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
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
          <template v-slot="{row}">

          </template>
        </el-table-column>
        <el-table-column prop="describe" label="描述">
          <template v-slot="{row}">
            <span>{{ row.Describe }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="check(row)">详情</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList"
      />
    </div>

    <el-dialog title="分组详情" :visible.sync="dialogTableVisible" width="80%">
      <el-row>
        <el-col :span="12" style="margin-bottom: 30px">
          <span>分组名称：</span>
        </el-col>
        <el-col :span="12">
          <span>所属机构：</span>
        </el-col>

        <el-col :span="24" style="margin-bottom: 30px">
          <span>描述：</span>
          <template v-slot="{row}">
            <span>{{ row.Describe }}</span>
          </template>
        </el-col>
      </el-row>
      <span style="padding-top: 20px">设备选择</span>
      <el-tabs v-model="activeName" tab-position="top">
        <el-table :key="tableKey" :data="deviceLists" border fit highlight-current-row style="width: 100%;">
          <el-table-column label="设备名称" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="MAC地址" align="center">
            <template slot-scope="{row}">
              <span>{{ row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属分组" align="center">
            <template slot-scope="{row}">
              <span>{{ row.group }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分辨率" align="center">
            <template slot-scope="{row}">
              <span>{{ row.ratio }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属机构" align="center">
            <template slot-scope="{row}">
              <span>{{ row.organ }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前计划" align="center">
            <template slot-scope="{row}">
              <span>{{ row.plan }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备状态" align="center">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-row>
        <el-col :span="12" style="margin-bottom: 30px">
          <span>分组名称：</span>
          <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
        </el-col>
        <el-col :span="12">
          <span>所属机构：</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
      </el-row>
      <el-col :span="24" style="margin-bottom: 30px">
        <span>描述：</span>
        <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
      </el-col>
      <el-row>
        <span style="padding-top: 20px">选择设备</span>
        <el-tabs v-model="activeName" tab-position="top">
          <el-table :key="tableKey" :data="deviceLists" border fit highlight-current-row style="width: 100%;">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="设备名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="MAC地址" align="center">
              <template slot-scope="{row}">
                <span>{{ row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属分组" align="center">
              <template slot-scope="{row}">
                <span>{{ row.group }}</span>
              </template>
            </el-table-column>
            <el-table-column label="分辨率" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ratio }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属机构" align="center">
              <template slot-scope="{row}">
                <span>{{ row.organ }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前计划" align="center">
              <template slot-scope="{row}">
                <span>{{ row.plan }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备状态" align="center">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { delGroup, getAllGroup } from '@/api/group'

export default {
  components: { Pagination },
  name: 'index',
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      list: null,
      deviceCnt: null,
      total: 0,
      listLoading: true,
      dialogStatus: '',
      textMap: {
        update: '编辑分组',
        create: '新建分组'
      },
      listQuery: {
        page: 1,
        limit: 5
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
      getAllGroup(this.listQuery).then(response => {
        this.list = response.data.groups
        this.deviceCnt = response.data.deviceCnt
        console.log(response)
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    //删除分组
    async handleDelete(row, index) {
      await delGroup(row.ID).then(() => {
        // console.log(row.ID)
        this.$notify({
          title: 'Success',
          message: '成功删除分组',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    //新增分组
    async handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },

    //更新分组
    async handleUpdate(row) {
      this.form = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
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

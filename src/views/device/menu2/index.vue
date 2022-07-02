<template>
  <div>
    <div class="app-container">
      <div class="form-container">
        <el-row>
          <el-col :span="8">
            <span>分组名称：</span>
            <el-input v-model="searchInput" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input" />
          </el-col>
          <el-col :span="8">
            <el-row type="flex" justify="end">
              <div>
                <el-button plain @click="searchInput = ''">重置</el-button>
                <el-button type="primary" @click="search()">查询</el-button>
                <el-button type="primary" @click="handleCreate">新建分组</el-button>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="ID" label="分组ID" />
        <el-table-column prop="Name" label="分组名称" />
        <el-table-column label="所属机构" width="200">
          <template v-slot="{row}">
            <span>{{ organname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DeviceCnt" label="设备数量" width="100" />
        <el-table-column prop="Describe" label="描述" />
        <el-table-column fixed="right" label="操作">
          <template v-slot="{row, $index}">
            <el-button type="text" size="mini" @click="check(row)">详情</el-button>
            <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-if="row.status!=='deleted'" size="mini" type="text" @click="handleDelete(row, $index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <el-dialog title="分组详情" :visible.sync="dialogTableVisible" width="80%">
      <el-row>
        <el-col :span="12" style="margin-bottom: 30px">
          <span>分组名称：{{ form.groupName }}</span>
        </el-col>
        <el-col :span="12">
          <span>所属机构：{{ form.organization }}</span>
        </el-col>

        <el-col :span="24" style="margin-bottom: 30px">
          <span>描述：{{ form.describe }}</span>
        </el-col>
      </el-row>
      <span style="padding-top: 20px">所有设备</span>
      <el-tabs v-model="activeName" tab-position="top">
        <el-table :key="tableKey" :data="form.deviceLists" border fit highlight-current-row style="width: 100%;">
          <el-table-column prop="Name" label="设备名称" align="center" />
          <el-table-column prop="Mac" label="MAC地址" align="center" />
          <el-table-column label="所属机构" align="center">
            <template slot-scope="{row}">
              <span>{{ organname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="PlanID" label="当前计划" align="center" />
          <el-table-column label="设备状态" align="center">
            <template slot-scope="{row}">
              <el-tag>
                {{ row.State === 'ONLINE' ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </el-tabs>
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
          <el-input
            v-model="form.groupName"
            placeholder="请输入设备名称"
            suffix-icon="el-icon-search"
            size="medium"
            class="input"
          />
        </el-col>
        <el-col :span="12">
          <span>所属机构：</span>
          <el-select v-model="form.organization" placeholder="请选择">
            <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="24" style="margin-bottom: 30px">
          <span>描述：</span>
          <el-input v-model="form.describe" placeholder="请输入设备描述" size="medium" class="input" />
        </el-col>
      </el-row>
      <el-row>
        <span style="padding-top: 20px">选择设备</span>
        <el-tabs v-model="activeName" tab-position="top">
          <el-table
            :key="tableKey"
            :data="form.deviceLists"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="Name" label="设备名称" align="center" />
            <el-table-column prop="Mac" label="MAC地址" align="center" />
            <el-table-column label="所属机构" align="center">
              <template slot-scope="{row}">
                <span>{{ organname }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="PlanID" label="当前计划" align="center" />
            <el-table-column label="设备状态" align="center">
              <template slot-scope="{row}">
                <el-tag>
                  {{ row.State === 'ONLINE' ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-tabs>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?create():update()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { createGroup, delGroup, getAllGroup, getGroupDevice } from '@/api/group'
import { fetchDeviceList } from '@/api/device'

export default {
  inject: ['reload'],
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      list: null,
      deviceCnt: null,
      total: 0,
      listLoading: true,
      searchInput: '',
      dialogStatus: '',
      textMap: {
        update: '编辑分组',
        create: '新建分组'
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        groupName: '',
        organization: this.organname,
        options: [],
        describe: '',
        multipleSelection: [],
        deviceLists: [
          {
            ID: 1,
            Name: '',
            Max: '',
            PlanID: 1,
            State: ''
          }

        ]
      },
      dialogTableVisible: false,
      dialogFormVisible: false
    }
  },
  computed: {
    organname() {
      return this.$store.state.user.OrganName
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {

    },

    async getList() {
      this.listLoading = true
      getAllGroup(this.listQuery).then(response => {
        this.list = response.data.groups
        this.deviceCnt = response.data.deviceCnt
        // console.log(response)
        this.total = response.data.total
      })
    },

    // 删除分组
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

    // 新增分组
    async handleCreate() {
      this.form.groupName = ''
      this.form.describe = ''
      this.form.options.splice(0, this.form.options.length)
      this.form.options.push({ label: this.organname, value: this.organname })
      this.form.organization = ''
      this.form.deviceLists.splice(0, this.form.deviceLists.length)
      this.form.multipleSelection.splice(0, this.form.multipleSelection.length)
      fetchDeviceList().then((res) => {
        this.form.deviceLists = res.data.devices
      }).finally(() => {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      })
    },

    handleSelectionChange(val) {
      this.form.multipleSelection = val
    },

    // 更新分组
    async handleUpdate(row) {
      this.form.groupName = row.Name
      this.form.describe = row.Describe
      this.form.options.push({ label: this.organname, value: this.organname })
      this.form.organization = this.organname
      getGroupDevice(row.ID).then((res) => {
        if (res.code === 200) {
          this.form.deviceLists = res.data
        }
      }).finally(() => {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      })
    },

    create() {
      createGroup({
        name: this.form.groupName,
        describe: this.form.describe,
        devices: this.form.multipleSelection.map((v) => v.ID)
      }).then((res) => {
        if (res.code === 200) {
          getAllGroup(this.listQuery).then(response => {
            this.list = response.data.groups
            this.deviceCnt = response.data.deviceCnt
            console.log(response)
            this.total = response.data.total
          })
        }
      }).finally(() => {
        this.dialogFormVisible = false
      })
    },

    update() {
      this.dialogFormVisible = false
      console.log('更新成功')
    },

    async check(row) {
      this.form.groupName = row.Name
      this.form.describe = row.Describe
      this.form.organization = this.organname
      getGroupDevice(row.ID).then((res) => {
        if (res.code === 200) {
          this.form.deviceLists = res.data
        }
      }).finally(() => {
        this.dialogTableVisible = true
      }
      )
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

<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备名称： </span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input"/>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属机构：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属分组：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
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
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备状态：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row type="flex" justify="end">
            <div>
              <el-button plain>重置</el-button>
              <el-button type="primary">查询</el-button>
              <el-button type="primary" @click="handleCreate">新建设备</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <el-table :data="list" border style="width: 100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="设备名称">
        <template v-slot="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organization" label="所属机构">test_o</el-table-column>
      <el-table-column prop="group" label="所属分组">
        <template v-slot="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MAC" label="MAC地址">
        <template v-slot="{row}">
          <span>{{ row.Mac }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="设备状态">
        <template v-slot="{row}">
          <span v-if="row.State ==='ONLINE'">
            <el-tag type="success" effect="dark" size="medium">在线</el-tag>
          </span>
          <span v-else-if="row.State ==='OFFLINE'">
            <el-tag type="danger" effect="dark" size="medium">离线</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="plan" label="当前计划">
        <template v-slot="{row}">
          <span>{{ row.PlanID }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="check(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="">控制</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <el-dialog title="设备详情" :visible.sync="dialogFormVisible" width="40%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="设备信息" name="first">
          <el-row>
            <el-col :span="12"><span>设备型号：{{ info.Model }}</span></el-col>
            <el-col :span="12"><span>设备IP：{{ info.IP }}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span>设备ID：{{ info.HardwareID }}</span></el-col>
            <el-col :span="12"><span>设备版本：{{ info.AppVersion }}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span>经度：{{ info.Latitude }}</span></el-col>
            <el-col :span="12"><span>纬度：{{ info.Longitude }}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span>运行内存：{{ info.Memory }}</span></el-col>
            <el-col :span="12"><span>存储空间：{{ info.Storage }}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="状态信息" name="second">
          <el-row>
            <el-col :span="12"><span>最后心跳时间：{{ info.LastHeartbeat }}</span></el-col>
            <el-col :span="12"><span>运行时间：{{ info.RunningTime }}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><span>分辨率：{{ info.Resolution }}</span></el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="编辑设备" :visible.sync="dialogEditVisible" width="30%">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
        <el-form-item label="设备名称" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="所属分组" prop="phone">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delDevice, fetchDeviceInfo, fetchDeviceList } from '@/api/device'
import Pagination from '@/components/Pagination'
import { delGroup } from '@/api/group'

export default {
  inject: ['reload'],
  components: { Pagination },
  name: 'index',
  data() {
    return {
      activeName: '',
      tableKey: 0,
      list: null,
      info: {
        ID: '',
        Model: '',
        IP: '',
        HardwareID: '',
        Latitude: '',
        Longitude: '',
        LastHeartbeat: '',
        RunningTime: '',
        Resolution: '',
        AppVersion: '',
        Memory: '',
        Storage: ''
      },
      devices: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 5
      },
      form: {
        username: '',
        passwd: '',
        group: ''
      },
      input1: '',
      value: '',
      options: '',
      dialogEditVisible: false,
      dialogTableVisible: false,
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      fetchDeviceList(this.listQuery).then(response => {
        this.list = response.data.devices
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    //删除设备
    async handleDelete(row, index) {
      await delDevice(row.ID).then(()=>{
        // console.log(row.ID)
        this.$notify({
          title: 'Success',
          message: '成功删除设备',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },

    //更新设备
    async handleUpdate(row) {
      this.form = Object.assign({}, row) // copy obj
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    check(row) {
      this.dialogFormVisible = true
      fetchDeviceInfo(row.ID).then(response => {
        this.info = response.data
        console.log(response.data)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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

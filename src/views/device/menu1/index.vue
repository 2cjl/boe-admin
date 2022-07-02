<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备名称： </span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input" />
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属机构：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>所属分组：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>MAC地址：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input" />
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>当前计划：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>设备状态：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="设备名称">
        <template v-slot="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organization" label="所属机构">{{ organname }}</el-table-column>
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
          <el-button type="text" size="mini" @click="check(row)">详情</el-button>
          <el-button type="text" size="mini" @click="handleControl(row)">控制</el-button>
          <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="text" @click="handleDelete(row)">删除
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
          </el-row>
          <el-row>
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

    <el-dialog title="控制设备" :visible.sync="dialogControlVisible" width="40%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="截屏" name="first">
          <el-image
            v-if="screenshotUrl === ''"
            class="screenshot-image"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <el-image v-else style="width: 500px" />
          <el-button type="primary" @click="capture()">截屏</el-button>
        </el-tab-pane>
        <el-tab-pane label="调节亮度" name="second">
          <div class="block">
            <span class="demonstration">亮度（0～100）</span>
            <el-slider v-model="brightnessValue" />
          </div>
          <el-button type="primary" @click="setb()">设置</el-button>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogControlVisible = false">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建设备" :visible.sync="dialogCreateVisible" width="30%">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
        <el-form-item label="设备名称" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="MAC 地址" prop="username">
          <el-input v-model="form.mac" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="create()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑设备" :visible.sync="dialogEditVisible" width="30%">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
        <el-form-item label="设备名称" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="MAC 地址" prop="username">
          <el-input v-model="form.mac" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createDevice,
  delDevice,
  fetchDeviceInfo,
  fetchDeviceList, getLastScreenshot,
  screenshot,
  setBrightness,
  updateDevice
} from '@/api/device'
import Pagination from '@/components/Pagination'

export default {
  inject: ['reload'],
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      activeName: 'first',
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
        id: 0,
        username: '',
        mac: ''
      },
      input1: '',
      value: '',
      options: '',
      dialogCreateVisible: false,
      dialogEditVisible: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogControlVisible: false,
      brightnessValue: 60,
      screenshotUrl: '',
      isScreenLoading: false
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
    async getList() {
      this.listLoading = true
      fetchDeviceList(this.listQuery).then(response => {
        this.list = response.data.devices
        this.total = response.data.total
      })
    },

    handleCreate() {
      this.form.username = ''
      this.form.mac = ''
      this.dialogCreateVisible = true
    },

    create() {
      createDevice({ name: this.form.username, mac: this.form.mac }).then((res) => {
        fetchDeviceList(this.listQuery).then(response => {
          this.list = response.data.devices
          this.total = response.data.total
        })
      }).finally(() => {
        this.dialogCreateVisible = false
      })
    },

    // 删除设备
    async handleDelete(row, index) {
      await delDevice(row.ID).then(() => {
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

    // 更新设备
    async handleUpdate(row) {
      // this.form = Object.assign({}, row) // copy obj
      this.form.id = row.ID
      this.form.username = row.Name
      this.form.mac = row.Mac
      this.dialogEditVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },

    update() {
      updateDevice({
        id: this.form.id,
        name: this.form.username,
        mac: this.form.mac
      }).then((res) => {
        fetchDeviceList(this.listQuery).then(response => {
          this.list = response.data.devices
          this.total = response.data.total
        })
      }).finally(() => {
        this.dialogEditVisible = false
      })
    },

    handleControl(row) {
      this.form.id = row.ID
      this.dialogControlVisible = true
    },

    capture() {
      this.isScreenLoading = true
      screenshot(this.form.id).then((res) => {
        if (res.code === 200) {
          const interval = setInterval(() => {
            getLastScreenshot(this.form.id).then((res) => {
              if (res.code === 200) {
                this.screenshotUrl = 'data:image/png;base64,' + res.data
                this.isScreenLoading = false
                clearInterval(interval)
              }
            })
          }, 250)
          setTimeout(() => {
            if (interval != null) clearInterval(interval)
          }, 5000)
        }
      })
    },

    setb() {
      setBrightness(this.form.id, { data: this.brightnessValue / 100 }).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '调节亮度成功',
            type: 'success'
          })
        }
      }).catch(e => {
        this.$message.error('调节亮度失败')
      })
    },

    check(row) {
      fetchDeviceInfo(row.ID).then(response => {
        this.info = response.data
        console.log(response.data)
        this.dialogFormVisible = true
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

.screenshot-image {
  width: 500px;
  height: 250px;
  display: flex;
  background: #f5f7fa;
  justify-content: center;
  align-items: center;
}
</style>

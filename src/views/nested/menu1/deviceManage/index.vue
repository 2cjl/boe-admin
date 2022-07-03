<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="9">
          <el-row>
            <span>设备名称：</span>
            <el-input
              v-model="input1"
              placeholder="请输入设备名称"
              suffix-icon="el-icon-search"
              size="medium"
              class="input"
            />
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-row>
            <span>所属机构：</span>
            <el-select v-model="organ" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <!-- <el-col :span="6">
          <el-row>
            <span>所属分组：</span>
            <el-select v-model="group" placeholder="请选择所属分组">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col> -->
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <div>
              <el-button plain @click="resetting">重置</el-button>
              <el-button type="primary" @click="checkDevices(input1,organ)">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="device-container">
      <el-row>
        <span>选择设备</span>
        <el-tabs v-model="activeName" tab-position="top">
          <el-tab-pane label="单个设备" name="first">
            <el-table
              :data="deviceList"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @selection-change="handleDeviceSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="设备名称" prop="Name" align="center" width="150px" />
              <el-table-column label="MAC地址" prop="Mac" width="150px" align="center" />
              <!-- <el-table-column label="所属分组" prop="OrganizationID" min-width="150px" /> -->
              <!-- <el-table-column label="分辨率" min-width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.ratio }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="所属机构" width="150px" prop="OrganizationID" align="center">
                <!-- <template slot-scope="{row}">
                  <span>{{ row.OrganizationID }}</span>
                </template> -->
              </el-table-column>
              <el-table-column label="当前计划" prop="PlanID" align="center" width="150px" />
              <el-table-column label="设备状态" width="150px" align="center">
                <template slot-scope="{row}">
                  <el-tag v-if="row.State === 'OFFLINE'" type="danger" effect="dark">
                    离线
                  </el-tag>
                  <el-tag v-else effect="dark">
                    在线
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
          </el-tab-pane>
          <el-tab-pane label="分组设备" name="second">
            <el-table
              :data="deviceByGroup"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @selection-change="handleGroupSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="分组名称" align="center" width="450">
                <template slot-scope="{row}">
                  <span>{{ row.Name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属机构" min-width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.OrganizationID }}</span>
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
          </el-tab-pane>
        </el-tabs>
      </el-row>

    </div>
    <div class="btn-container">

      <el-button @click="$router.push('menu1')">取消</el-button>
      <el-button @click="$router.go(-1)">上一步</el-button>
      <el-button type="primary" @click="pub()">发布</el-button>

    </div>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getDeviceList, getGroupDevice, createPlan } from '@/api/plan'
import { generatePlayHtml } from '@/utils/html-generate'
import moment from 'moment'

export default {
  components: { Pagination },
  data() {
    return {
      total: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      deviceListSelection: [],
      groupListSelection: [],
      devicelist: [],
      deviceByGroup: [],
      activeName: 'first',
      input1: '',
      options: [{
        value: '1',
        label: 'test2'
      }],
      options1: [{
        value: '1',
        label: '123'
      },

      {
        value: '2',
        label: '222'
      },
      {
        value: '3',
        label: '473737'
      }],
      organ: '',
      group: '',
      // deviceLists: [
      //   {
      //     name: '测试巫山',
      //     address: 'sss',
      //     group: 'fff',
      //     ratio: '1920*1080',
      //     organ: '城院罗老师测试',
      //     plan: '-',
      //     status: '离线'
      //   }
      // ]
      beforeData: null
    }
  },
  computed: {
    organname() {
      return this.$store.state.user.OrganName
    }
  },
  mounted() {
    this.getList()
    this.beforeData = this.$route.params.message
  },
  methods: {
    handleDeviceSelectionChange(val) {
      this.deviceListSelection = val
    },
    handleGroupSelectionChange(val) {
      this.groupListSelection = val
    },
    checkDevices(name, group) {
      this.activeName = 'first'
      getDeviceList((this.listQuery.page - 1) * 10, this.listQuery.limit, name, group).then((res) => {
        this.deviceList = res.data.devices
        this.total = res.data.total
        // console.log(this.deviceList)
        this.deviceList.forEach((v) => {
          v.OrganizationID = this.organname
          // console.log(this.deviceList)
        })
      })
    },
    resetting() {
      this.input1 = ''
      this.organ = ''
      this.group = ''
    },
    getList() {
      getDeviceList((this.listQuery.page - 1 * 10), this.listQuery.limit).then((res) => {
        this.deviceList = res.data.devices
        this.total = res.data.total
        this.deviceList.forEach((v) => {
          v.OrganizationID = this.organname
        })
      })
      getGroupDevice().then((res) => {
        this.deviceByGroup = res.data
        // console.log(this.deviceByGroup)
      })
    },
    pub() {
      const weekMap = new Map()
      weekMap.set('星期一', 1)
      weekMap.set('星期二', 2)
      weekMap.set('星期三', 3)
      weekMap.set('星期四', 4)
      weekMap.set('星期五', 5)
      weekMap.set('星期六', 6)
      weekMap.set('星期七', 7)
      const deviceIds = []
      this.groupListSelection.forEach((v1) => {
        getGroupDevice(v1.ID).then((res) => {
          res.data.forEach((v2) => deviceIds.push(v2.ID))
        })
      })
      this.deviceListSelection.forEach((v) => {
        if (deviceIds.indexOf(v.ID) === -1) {
          deviceIds.push(v.ID)
        }
      })
      createPlan({
        name: this.beforeData.name,
        mode: this.beforeData.mode,
        startDate: moment(this.beforeData.playTime[0]).format('YYYY-MM-DD'),
        endDate: moment(this.beforeData.playTime[1]).format('YYYY-MM-DD'),
        DeviceIds: deviceIds,
        playPeriods: this.beforeData.PlayPeriods.map((v) => {
          let loopMode = ''
          if (v.day.period === '每天') {
            loopMode = JSON.stringify({ mode: '每天' })
          } else if (v.day.period === '每周') {
            loopMode = JSON.stringify({ mode: '每周', times: v.day.week.map((v) => weekMap.get(v)) })
          } else if (v.day.period === '每月') {
            loopMode = JSON.stringify({ mode: '每月', times: v.day.date })
          }
          const shows = []
          v.programs.forEach((v) => {
            for (const vElement of v.Images) {
              shows.push({ imgUrl: vElement, duration: v.Duration })
            }
          })
          return {
            LoopMode: loopMode,
            startTime: v.startTime,
            endTime: v.endTime,
            showIds: v.programs.map((v) => v.ID),
            html: generatePlayHtml(shows)
          }
        })
      }).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '创建计划成功',
            type: 'success'
          })
        }
      }).catch((e) => {
        console.log(e)
      })
      this.$router.push('menu1')
    }
  }
}
</script>
<style scoped>
.app-container {
  background-color: rgb(240, 242, 245);
}

.form-container, .device-container {
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 15px;
}

.input {
  width: 60%;
}
</style>

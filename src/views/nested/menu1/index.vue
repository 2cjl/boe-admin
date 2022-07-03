<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="8">
          <el-row>
            <span>计划名称：</span>
            <el-input
              v-model="input1"
              placeholder="请输入计划名称"
              suffix-icon="el-icon-search"
              size="medium"
              class="input"
            />
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <span>计划状态：</span>
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
              <el-button plain @click="resetting">重置</el-button>
              <el-button type="primary" @click="checkPlan(input1,value)">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="btn-container">
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="$router.push('new')">新建计划</el-button>
        <el-button v-if="multipleSelection.length <= 0" plain disabled>批量删除</el-button>
        <el-button v-else plain @click="deletePlans(multipleSelection)">批量删除</el-button>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="planList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="缩略图" align="center" width="130">

        <template slot-scope="{row}">
          <img :src="row.Preview" class="img-content"></img>
        </template>
      </el-table-column>
      <el-table-column label="计划名称" prop="Name" width="150px" align="center" />
      <el-table-column label="计划状态" min-width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.State === '未发布'" type="warning" effect="dark">
            {{ row.State }}
          </el-tag>
          <el-tag v-else-if="row.State === '已发布'" type="danger" effect="dark">
            {{ row.State }}
          </el-tag>
          <el-tag v-else type="info" effect="dark">
            {{ row.State }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="播放模式" width="110px" align="center" prop="Mode" />
      <el-table-column label="播放日期" width="80px">
        <template slot-scope="{row}">
          <span v-if="row.StartDate === row.EndDate">{{ row.StartDate }}</span>
          <span v-else>{{ row.StartDate }}~{{ row.EndDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="95" prop="Author.Username" />
      <!-- <el-table-column label="审核人" class-name="status-col" width="100" prop="Author.Username" /> -->
      <el-table-column label="更新时间" width="110px" align="center" prop="UpdatedAt" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="check(row.ID)">
            详情
          </el-button>
          <el-button v-if="row.State === '发布中' || row.State === '发布成功'" type="text" disabled size="mini">
            修改
          </el-button>
          <el-button v-else type="text" size="mini" @click="handleUpdate(row.ID)">修改</el-button>
          <el-button type="text" size="mini" @click="copyPLan(row,$index)">
            复制
          </el-button>
          <el-button type="text" size="mini" @click="deleteSiglePlan(row,$index)">
            删除
          </el-button>
          <el-button type="text" size="mini">
            加密下载
          </el-button>
          <el-button v-if="row.State === '未发布'" type="text" size="mini">
            发布
          </el-button>
          <el-button v-else-if="row.State === '发布中'" type="text" size="mini" disabled>
            重新发布
          </el-button>
          <el-button v-else type="text" size="mini" disabled>
            重新发布
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :model="choosePlanList" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="计划详情" name="first">
          <el-row class="plan-detail-container">
            <el-col :span="12">
              <span>
                计划名称：{{ choosePlanList.Name }}
              </span>
              <template slot-scope="{row}">
                <span>{{ row.Name }}</span>
              </template>
            </el-col>
            <el-col :span="12">
              <span v-if="choosePlanList.StartDate != choosePlanList.EndDate">播放日期：{{ choosePlanList.StartDate }} ~ {{ choosePlanList.EndDate }}</span>
              <span v-else>播放日期：{{ choosePlanList.StartDate }}</span>
              <template slot-scope="{row}">
                <span>{{ row.CreatedAt }}</span>
              </template>
            </el-col>
          </el-row>
          <el-row class="plan-detail-container">
            <el-col :span="12">
              <span>
                播放模式：{{ choosePlanList.Mode }}
              </span>
              <template slot-scope="{row}">
                <span>{{ row.Mode }}</span>
              </template>
            </el-col>
            <el-col :span="12"><span>播放策略：替换</span></el-col>
          </el-row>
          <el-row class="plan-detail-container">
            <el-col :span="12">
              <span>
                多屏同步：打开
              </span>
            </el-col>
            <el-col :span="12"><span>发布状态：{{ choosePlanList.State }}</span></el-col>
          </el-row>
          <el-row class="plan-detail-container">
            <span>创建时间：{{ choosePlanList.CreatedAt }}</span>
          </el-row>
          <el-row class="plan-detail-container">
            <span>播放时段：{{ choosePlanList.Mode }}</span>
          </el-row>
          <el-row class="plan-detail-container">
            循环类型：<span v-if="choosePlanList.PlayPeriods">{{ choosePlanList.PlayPeriods[0].LoopMode.mode }}</span>
          </el-row>

          <div>循环时间段：
            <el-tag v-for="(choosePlan,index) in choosePlanList.PlayPeriods" :key="index" class="time-period" @click="changeShow(index)">
              {{ choosePlan.StartTime }}~{{ choosePlan.EndTime }}
            </el-tag>
          </div>

          <el-row>
            <div v-if="choosePlanList.PlayPeriods">
              <span>已选节目：</span>
              <div class="program-content">
                <div v-for="(item,idx) in choosePlanList.PlayPeriods[timeListsSelect].Shows" :key="idx" class="program-card">
                  <div>
                    <el-image

                      :src="item.Images"
                      class="img-container"
                    />
                    <div class="mask">
                      <el-row>
                        <el-col :span="20"><div class="name">{{ item.Name }}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="16"><div>{{ item.Resolution }}</div></el-col>
                        <el-col :span="8"><div>{{ item.Duration }}秒</div></el-col>
                      </el-row>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </el-row>
          <el-row class="plan-detail-container">
            <span>原因：</span>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="设备详情" name="second">
          <el-table
            :data="deviceList"

            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="设备名称" align="center" width="120" prop="Name" />
            <el-table-column label="MAC地址" align="center" width="120" prop="Mac" />
            <el-table-column label="分辨率" align="center" width="100" prop="Resolution" />
            <el-table-column label="所属机构" align="center" width="120">
              test2
            </el-table-column>
            <el-table-column label="当前计划" align="center" width="100" prop="PlanName" />
            <el-table-column label="设备状态" align="center" width="105">
              <template slot-scope="{row}">
                <el-tag v-if="row.State === 'OFFLINE'" type="danger" effect="dark">{{ row.State }}</el-tag>
                <el-tag v-else effect="dark">{{ row.State }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import moment from 'moment'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getPlanList, getPlanDetailList, queryPlan, copyProgram, deleteProgram, deletePlan } from '@/api/plan'
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }

]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      activeName: 'first',
      planList: [],
      choosePlanList: {},
      deviceList: [],
      input1: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      timeListsSelect: 0,
      checkPlanItem: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      options: [{
        value: '1',
        label: '所以状态'
      }, {
        value: '2',
        label: '未发布'
      }, {
        value: '3',
        label: '发布中'
      }, {
        value: '4',
        label: '发布成功'
      }, {
        value: '5',
        label: '部分成功'
      },
      {
        value: '6',
        label: '发布失败'
      },
      {
        value: '7',
        label: '已结束'
      },
      {
        value: '8',
        label: '已失效'
      },
      {
        value: '9',
        label: '审核中'
      }
      ],
      value: '',
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  // mounted() {
  //   this.query()
  // },
  methods: {
    copyPLan(row, index) {
      copyProgram(row.ID).then((res) => {
        console.log(res)
      })
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    checkPlan(name, state) {
      this.listLoading = true
      getPlanList((this.listQuery.page - 1) * 10, this.listQuery.limit, name, state).then((res) => {
        this.planList = res.data.plans
        this.total = res.data.total
        this.planList.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    deletePlans(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.planList.splice(i, 1)
      }
      this.multipleSelection = []
    },
    deleteSiglePlan(row, index) {
      deletePlan(row.ID).then((res) => {
        if (res.code === 200) {
          this.planList.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    resetting() {
      this.value = ''
      this.input1 = ''
    },
    getList() {
      this.listLoading = true
      getPlanList((this.listQuery.page - 1) * 10, this.listQuery.limit).then((res) => {
        this.planList = res.data.plans
        this.total = res.data.total
        this.planList.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        // this.planList.forEach((v) => {v.CreatedAt = moment(v.CreatedAt).format('MMMM Do YYYY')})
        console.log(this.planList)
      }).finally(() => {
        this.listLoading = false
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    changeShow(idx) {
      this.timeListsSelect = idx
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(id) {
      console.log(id)
      getPlanDetailList(id).then((res) => {
        this.choosePlanList = res.data.plan
        console.log(this.choosePlanList)
        this.$router.push({
          name: 'New',
          params: {
            choosePlanList: this.choosePlanList
          }
        })
      })

      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Update Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    // handleDelete(row, index) {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },
    check(id) {
      this.dialogFormVisible = true
      getPlanDetailList(id).then((res) => {
        this.choosePlanList = res.data.plan
        this.deviceList = res.data.devices
        this.choosePlanList.CreatedAt = moment(this.choosePlanList.CreatedAt).format('YYYY-MM-DD HH:mm:ss')
        this.choosePlanList.PlayPeriods.forEach((v) => {
          v.LoopMode = JSON.parse(v.LoopMode)
          v.Shows.forEach((item) => {
            item.Images = JSON.parse(item.Images)
            // console.log(item.Images)
          })

          // console.log(v.LoopMode)
        })

        console.log(this.choosePlanList)
      })

      // console.log(row)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal) {
    //   return this.list.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style scoped>
.app-container {
   background-color: rgb(240, 242, 245);
}
.form-container ,.btn-container{
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 15px;
}
.input {
  width: 60%;
}
.program-card {
  position: relative;
  width: 120px;
  height: 202px;
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;

}
.program-content {
  margin-top: 1rem;
  padding: 1rem;
    overflow: auto;
    border: 1px solid #d9d9d9;
}
.img-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}
.mask {
  position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 14px;
    color: #ccc;
    height: 4.5rem;
    background: rgba(0,0,0,.4);
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

}
.time-period {
  cursor: pointer;
  margin: 5px;
}
.plan-detail-container {
  padding: 5px 0;

}
.img-content {
  width: 75px;
  height: 75px;
}
</style>

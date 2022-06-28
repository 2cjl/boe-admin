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
              <el-button plain>重置</el-button>
              <el-button type="primary">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="btn-container">
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="$router.push('new')">新建计划</el-button>
        <el-button plain disabled>批量删除</el-button>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="planList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="缩略图" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.pic }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="计划名称" prop="Name" width="150px" align="center">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Name }}</span>
        </template> -->
        <!-- <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="计划状态" min-width="150px" prop="State">
        <!-- <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.State }}</el-tag>
        </template> -->
      </el-table-column>
      <el-table-column label="播放模式" width="110px" align="center" prop="Mode">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Mode }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="播放日期" width="80px" prop="CreatedAt">
        <!-- <template slot-scope="{row}"> -->
        <!-- <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" /> -->
        <!-- <span>{{ row.CreatedAt }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="作者" align="center" width="95" prop="Author.Username">
        <!-- <template slot-scope="{row}"> -->
        <!-- <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span> -->
        <!-- <span>{{ row.Author.Username }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="审核人" class-name="status-col" width="100" prop="Author.Username">
        <!-- <template slot-scope="{row}"> -->
        <!-- <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag> -->
        <!-- <span>{{ row.Author.Username }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="更新时间" width="110px" align="center" prop="UpdatedAt">
        <!-- <template slot-scope="{row}">
          <span>{{ row.UpdatedAt }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="check(row.ID)">
            详情
          </el-button>
          <el-button type="text" disabled size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="text" size="mini">
            复制
          </el-button>
          <el-button type="text" size="mini">
            删除
          </el-button>
          <el-button type="text" size="mini">
            加密下载
          </el-button>
          <el-button type="text" size="mini" disabled>
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
          <el-row>
            <el-col :span="12">
              <span>
                计划名称：{{ choosePlanList.Name }}
              </span>
              <template slot-scope="{row}">
                <span>{{ row.Name }}</span>
              </template>
            </el-col>
            <el-col :span="12">
              <span>播放日期：{{ choosePlanList.StartDate }}</span>
              <template slot-scope="{row}">
                <span>{{ row.CreatedAt }}</span>
              </template>
            </el-col>
          </el-row>
          <el-row>
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
          <el-row>
            <el-col :span="12">
              <span>
                多屏同步：打开
              </span>
            </el-col>
            <el-col :span="12"><span>发布状态：{{ choosePlanList.State }}</span></el-col>
          </el-row>
          <el-col>
            <span>创建时间：{{ choosePlanList.CreatedAt }}</span>
          </el-col>
          <el-col>
            <div>播放时段：{{ choosePlanList.Mode }}<br>
              <!-- 循环类型：{{ choosePlanList.PlayPeriods[0].LoopMode }}<br> -->
              循环时间段：
              <!-- <div v-for="item in choosePlanList.PlayPeriods" :key="item">
                {{ item }}
              </div> -->
            </div>

          </el-col>
          <el-col>
            <div>已选节目：
              <!-- <div v-for="item in choosePlanList.PlayPeriods[0].Shows" :key="item">
                {{ item.Name }}
              </div> -->
            </div>
          </el-col>
          <el-col>
            <div>原因：</div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="设备详情" name="second">设备详情</el-tab-pane>
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
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getPlanList, getPlanDetailList } from '@/api/plan'
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
      // list: [
      //   {
      //     pic: '1.jpg',
      //     name: 'xxx',
      //     status: '发布中',
      //     mode: '按时段播放',
      //     date: '2022-07-03',
      //     author: 'catman',
      //     admin: 'catmain',
      //     updateTime: '2022-06-24 10:16:17'
      //   },
      //   {
      //     pic: '1.jpg',
      //     name: 'xxx',
      //     status: '发布中',
      //     mode: '按时段播放',
      //     date: '2022-07-03',
      //     author: 'catman',
      //     admin: 'catmain',
      //     updateTime: '2022-06-24 10:16:17'
      //   }
      // ],
      input1: 'hh',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
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
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶',
        disabled: true
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  created() {
    this.getList()
  },
  // mounted() {
  //   this.query()
  // },
  methods: {
    // query() {
    //   getPlanList(0, 10).then((res) => {
    //     this.planList = res.data
    //     console.log(this.planList)
    //   })
    // },
    getList() {
      this.listLoading = true
      getPlanList(0, 10).then((res) => {
        this.planList = res.data.plans
        this.total = res.data.total
        console.log(this.planList)
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    check(id) {
      this.dialogFormVisible = true
      getPlanDetailList(id).then((res) => {
        this.choosePlanList = res.data.plan
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
</style>

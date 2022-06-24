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
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="缩略图" prop="pic" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.pic }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
        <!-- <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="计划状态" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="播放模式" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播放日期" width="80px">
        <template slot-scope="{row}">
          <!-- <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" /> -->
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="95">
        <template slot-scope="{row}">
          <!-- <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span> -->
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <!-- <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag> -->
          <span>{{ row.admin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="check(row)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="计划详情" name="first">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="Type" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="Date" prop="timestamp">
              <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
            </el-form-item>
            <el-form-item label="Title" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
            <el-form-item label="Status">
              <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="Imp">
              <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
            </el-form-item>
            <el-form-item label="Remark">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item>
          </el-form></el-tab-pane>
        <el-tab-pane label="设备详情" name="second">设备详情</el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button> -->
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
      activeName: 'second',
      list: [
        {
          pic: '1.jpg',
          name: 'xxx',
          status: '发布中',
          mode: '按时段播放',
          date: '2022-07-03',
          author: 'catman',
          admin: 'catmain',
          updateTime: '2022-06-24 10:16:17'
        },
        {
          pic: '1.jpg',
          name: 'xxx',
          status: '发布中',
          mode: '按时段播放',
          date: '2022-07-03',
          author: 'catman',
          admin: 'catmain',
          updateTime: '2022-06-24 10:16:17'
        }
      ],
      input1: 'hh',
      total: 10,
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
  methods: {
    getList() {
      this.listLoading = true
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
    check(row) {
      this.dialogFormVisible = true
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

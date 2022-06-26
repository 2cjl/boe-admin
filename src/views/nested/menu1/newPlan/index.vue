<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <div>设置日程</div>
      <el-form-item
        label="计划名称"
        :rules="[
          { required: true},
        ]"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="播放策略">
        <el-radio-group v-model="form.resource">
          <el-radio label="替换" />
          <el-radio label="插播" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="播放模式">
        <el-radio-group v-model="form.resource">
          <el-radio label="时段播放" />
          <el-radio label="持续播放" />
        </el-radio-group>
        <span>（打开此功能后会使播放同一计划的设备画面保持统一）</span>
      </el-form-item>
      <el-form-item label="多屏同步">
        <el-radio-group v-model="form.resource">
          <el-radio label="打开" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="播放日期"
        :rules="[
          { required: true},
        ]"
      >
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="left-content" @click="handleAddTime">
            <div v-if="timeLists.length > 0">
              <div v-for="(time,idx) in timeLists" :key="idx">
                <div class="time-list">
                  <el-row>
                    <span>循环时间段：</span>
                    <i class="el-icon-edit" />
                    <i class="el-icon-delete" />
                  </el-row>

                  <div>{{ time.cicrleTime }}</div>
                  <div>循环周期：</div>
                  <el-tag v-if="time.day =='每天'">{{ time.day }}</el-tag>
                  <div v-else>{{ time.day }}</div>
                </div>

              </div>
            </div>
            <div class="add">
              <span><i class="el-icon-circle-plus-outline" /></span>
              <span>
                添加时间段
              </span>
            </div>
          </div>
        </el-col>

        <el-col :span="16">
          <div class="right-content">
            <div>
              <div>
                <div class="add1">
                  <span><i class="el-icon-circle-plus-outline" /></span>
                  <span>
                    添加节目
                  </span>
                </div>
              </div>
            </div>
          </div>

        </el-col>

      </el-row>
      <el-form-item>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button>保存</el-button>
        <el-button type="primary" @click="$router.push('device')">下一步</el-button>
      </el-form-item>

      <el-dialog title="设置播放时间段" :visible.sync="dialogFormVisible">
        <el-form label-position="left" label-width="100px" style="width: 400px; margin-left:50px;height:250px;" :model="timeForm">
          <el-form-item
            label="循环时间段"
            :rules="[
              { required: true},
            ]"
          >
            <el-time-picker
              v-model="value2"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
          </el-form-item>
          <el-form-item
            label="循环周期"
            :rules="[
              { required: true},
            ]"
          >
            <el-select v-model="value" placeholder="请选择" clearable @change="itemChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-col v-if="isShow">
            <el-checkbox-group v-model="checkDates">
              <el-checkbox v-for="date in dateLists" :key="date" :label="date">{{ date }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col v-if="isShow1" class="choose-day">
            <!-- <el-checkbox-group v-model="checkDays">
              <el-checkbox-button v-for="day in dayLists" :key="day" :label="day">{{ day }}</el-checkbox-button>
            </el-checkbox-group> -->
            <ul>
              <li v-for="(day,index) in dayLists" :key="index"><span :class="highlightClass(index)" @click="checkIndex(index)">{{ day }}</span></li>
            </ul>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createTime">
            确认
          </el-button>
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </el-form>

  </div>
</template>
<script>

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // timeForm: {
      //   cicrleTime: '',
      //   day: '',
      //   week: [],
      //   month: []

      // },
      timeLists: [],
      currentLists: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      dateLists: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期七'],
      dayLists: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      checkDates: [],
      checkDays: [],
      isShow: false,
      isShow1: false,
      dialogFormVisible: false,
      value1: '',
      value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      options: [{
        value: '1',
        label: '每天'
      }, {
        value: '2',
        label: '每周'
      }, {
        value: '3',
        label: '每月'
      }],
      value: ''
    }
  },
  computed: {

  },

  methods: {
    createTime() {
      this.dialogFormVisible = false
      this.timeLists = [...this.timeLists]
      this.timeLists.push({
        cicrleTime: this.value2,
        day: this.value

      })
      const h = new Date(this.timeLists[0].cicrleTime[0])
      const hours = h.getHours()
      console.log(hours)
      console.log(this.timeLists[0])
    },
    highlightClass(i) {
      // console.log(this.currentLists[i])
      return this.currentLists[i] ? 'selected' : 'not-selected'
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleAddTime() {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    checkIndex(i) {
      this.currentLists = [...this.currentLists]
      this.currentLists[i] = !this.currentLists[i]
    },
    itemChange() {
      console.log(this.value)
      if (this.value == '每周') {
        this.isShow = true
        this.isShow1 = false
      } else if (this.value == '每月') {
        this.isShow1 = true
        this.isShow = false
      } else {
        this.isShow = false
        this.isShow1 = false
      }
    }
  }
}
</script>

<style scoped>
.left-content {
    border: 1px solid #d9d9d9;
    padding: 1rem;
}
.right-content {
     border: 1px solid #d9d9d9;
     padding: 1rem;
}
.add {
    cursor: pointer;
    margin: 1rem 0;
    height: 95px;
    text-align: center;
    line-height: 95px;
    border: 2px dashed #dadada;
    border-radius: 5px;
    color: #dadada;
}
.time-list {
   margin: 1rem 0;
   padding: 5px;
    /* height: 95px; */
    text-align: left;
    line-height: 18px;
    /* line-height: 95px; */
    border: 2px solid #dadada;
    color: #1890ff;
    font-size: 14px;
}
.add1 {
    cursor: pointer;
    margin: 1rem 0;
    height: 95px;
    text-align: center;
    line-height: 95px;
    border: 2px dashed #dadada;
    border-radius: 5px;
    color: #dadada;
    width: 150px;

}
ul {
    list-style: none;

}
.choose-day ul {
  overflow: hidden;
  width: 301px;
  margin: 0 auto;
  padding: 0;
}
.choose-day ul li {
  float: left;
  width: 43px;
  text-align: center;
  padding: 3px 0;
}
.choose-day ul li span {
  width: 24px;
  height: 24px;
  line-height: 24px;
  display: inline-block;
  cursor: pointer;
}
.choose-day ul li span.selected{
 color: #fff;
 background: #1890ff;
}
</style>

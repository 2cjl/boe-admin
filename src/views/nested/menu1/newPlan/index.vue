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
        <el-radio-group v-model="form.policy">
          <el-radio label="替换" />
          <el-radio label="插播" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="播放模式">
        <el-radio-group v-model="form.mode">
          <el-radio label="时段播放" />
          <el-radio label="持续播放" />
        </el-radio-group>
        <span>（打开此功能后会使播放同一计划的设备画面保持统一）</span>
      </el-form-item>
      <el-form-item label="多屏同步">
        <el-radio-group v-model="form.syn">
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
          v-model="form.playTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="left-content">
            <div v-if="timeLists.length > 0">
              <div v-for="(time,idx) in timeLists" :key="idx">
                <div class="time-list" @click="changeProgramList(idx)">
                  <el-row>
                    <el-col :span="18">循环时间段：</el-col>
                    <el-col :span="6" class="icon-container">
                      <i class="el-icon-edit" @click="handleEdit(idx)" />
                      <i class="el-icon-delete" @click="handleDelete(idx)" />
                    </el-col>
                  </el-row>

                  <div class="time-container">
                    <span>{{ time.startTime }}</span>~<span>{{ time.endTime }}</span>

                  </div>
                  <div>循环周期：</div>
                  <el-tag v-if="time.day.period =='每天'">{{ time.day.period }}</el-tag>
                  <div v-else-if="time.day.period =='每周'">
                    {{ time.day.period }}:
                    <el-tag v-for="(item,idx) in time.day.week" :key="idx">
                      {{ time.day.week[idx] }}
                    </el-tag>
                  </div>
                  <div v-else>
                    {{ time.day.period }}:
                    <el-tag v-for="(item,idx) in time.day.date" :key="idx">
                      {{ time.day.date[idx] }}号
                    </el-tag>
                  </div>
                </div>

              </div>
            </div>
            <div class="add" @click="handleAddTime">
              <span><i class="el-icon-circle-plus-outline" /></span>
              <span>
                添加时间段
              </span>
            </div>
          </div>
        </el-col>

        <!-- 添加节目按钮 -->
        <el-col :span="16">
          <div class="right-content">
            <div class="program-list">
              <div v-if="timeListsSelect !== -1">
                <div
                  v-for="(program, idx) in timeLists[timeListsSelect].programs"
                  :key="idx"
                  class="program-card"
                >
                  <div>
                    <el-image

                      :src="program.pic"
                      class="img-container"
                    />
                    <div class="mask">
                      <el-row>
                        <el-col :span="20"><div class="name">{{ program.name }}</div></el-col>
                        <el-col :span="4"><i class="el-icon-close" @click="handleProgramDelete(idx)" /></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="16"><div>{{ program.ratio }}</div></el-col>
                        <el-col :span="8"><div>{{ program.time }}</div></el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add1" @click="handleAddProgram">
                <span><i class="el-icon-circle-plus-outline" /></span>
                <span>
                  添加节目
                </span>
              </div>
            </div>
          </div>

        </el-col>

      </el-row>
      <el-form-item>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button>保存</el-button>
        <el-button type="primary" @click="nextStep(form)">下一步</el-button>
      </el-form-item>

      <el-dialog title="设置播放时间段" :visible.sync="dialogFormVisible">
        <el-form label-position="left" label-width="100px" style="width: 400px; margin-left:50px;height:250px;">
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
              <li v-for="(day,index) in dayLists" :key="index"><span
                :class="highlightClass(index)"
                @click="checkIndex(index)"
              >{{ day }}</span></li>
            </ul>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createTime">
            确认
          </el-button>
          <el-button @click="cancelTime(time)">
            取消
          </el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加节目" :visible.sync="dialogProgramVisible">
        <div class="form-container">
          <el-row>
            <el-col :span="8">
              <el-row>
                <span>节目名称：</span>
                <el-input
                  v-model="input1"
                  placeholder="请输入节目名称"
                  suffix-icon="el-icon-search"
                  size="medium"
                  class="input"
                />
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <span>分辨率：</span>
                <el-select v-model="ratio" placeholder="请选择">
                  <el-option
                    v-for="item in ratioLists"
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
        <el-table
          ref="programSelectTable"
          :data="programList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleProgramSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="缩略图" prop="pic" align="center" width="80">
            <template slot-scope="{row}">
              <el-image
                :src="row.pic"
              />
            </template>
          </el-table-column>
          <el-table-column label="节目名称" min-width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
            <!-- <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template> -->
          </el-table-column>
          <el-table-column label="分辨率" width="150px">
            <template slot-scope="{row}">
              <el-tag>{{ row.ratio }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="节目时长" width="110px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="节目大小" width="80px">
            <template slot-scope="{row}">
              <span>{{ row.size }}</span>
            </template>
          </el-table-column>

        </el-table>

        <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProgramVisible = false">
            返回
          </el-button>
          <el-button type="primary" @click="programDialogSave">
            保存
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
        policy: '',
        mode: '',
        syn: '',
        playTime: '',
        PlayPeriods: [
          { LoopMode: '',
            // startTime: this.timeLists.startTime,
            // endTime: this.timeLists.endTime,
            // circlePeriod: this.timeLists.period,
            shows: [
              {
                name: '',
                Author: '',
                Duration: ''

              }
            ]
          }
        ]
      },
      ratio: '',
      input1: '',
      programList: [
        {
          pic: 'https://s3.bmp.ovh/imgs/2022/06/24/415d5ef060f6b058.jpeg',
          name: '测试节目1',
          ratio: '1920x1080',
          time: '5 秒',
          size: '123 kb'
        },
        {
          pic: 'https://s3.bmp.ovh/imgs/2022/06/24/50dedbe0da3b01f5.jpeg',
          name: '测试节目2',
          ratio: '1920x1080',
          time: '10 秒',
          size: '982 kb'
        }
      ],
      programListSelection: [],
      // timeForm: {
      //   cicrleTime: '',
      //   day: '',
      //   week: [],
      //   month: []

      // },
      timeListsSelect: -1, // TODO shanchu 当前所选时间段，用于展示节目
      timeLists: [],
      ratioLists: [{
        value: '1',
        label: '全部分辨率'
      }, {
        value: '2',
        label: '3840x2160'
      }, {
        value: '3',
        label: '2160x3840'
      }, {
        value: '4',
        label: '1920x1080'
      }, {
        value: '5',
        label: '1080x1920'
      }],
      currentLists: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      dateLists: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期七'],
      dayLists: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      checkDates: [],
      checkDays: [],
      chooseDays: [],
      isShow: false,
      isShow1: false,
      dialogFormVisible: false,
      dialogProgramVisible: false,
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
      value: '',
      startTime: '',
      endTime: '',
      nowModifyTime: -1
    }
  },
  computed: {},

  methods: {
    nextStep(form) {
      // this.router.push('device')
      console.log(form)
    },
    handleEdit(idx) {
      this.nowModifyTime = idx
      const time = this.timeLists[idx]
      this.dialogFormVisible = true
      this.value = time.day.period
      if (time.day.period === '每周') {
        this.isShow = true
        this.isShow1 = false
        this.checkDates = time.day.week
      } else if (time.day.period === '每月') {
        this.isShow = false
        this.isShow1 = true
        const dayArr = time.day.date
        for (var i = 0; i < dayArr.length; i++) {
          this.currentLists[dayArr[i] - 1] = true
        }
      } else {
        this.isShow = false
        this.isShow1 = false
      }
    },
    cancelTime(time) {
      for (var i = 0; i < this.currentLists.length; i++) {
        this.currentLists[i] = false
      }
      this.checkDates = []
      this.dialogFormVisible = false
    },
    handleDelete(idx) {
      this.$confirm('确定删除此时间段', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.timeLists.splice(idx, 1)
        // 节目由于时间段删除变换
        if (this.timeLists.length === 0) {
          this.timeListsSelect = -1
        } else if (this.timeListsSelect === idx) {
          this.timeListsSelect = 0
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createTime() {
      const s = new Date(this.value2[0])
      const e = new Date(this.value2[1])
      console.log(e.toLocaleString())
      this.startTime = s.toLocaleString().substring(11, 19)

      this.endTime = e.toLocaleString().substring(11, 19)
      // 判断时间是否重复
      for (let i = 0; i < this.timeLists.length; i++) {
        const sList = this.timeLists[i].startTime.split(':')
        const eList = this.timeLists[i].endTime.split(':')
        const s1 = new Date(2016, 9, 10, sList[0], sList[1], sList[2]).getTime()
        const e1 = new Date(2016, 9, 10, eList[0], eList[1], eList[2]).getTime()
        const s2 = s.getTime()
        const e2 = e.getTime()
        if ((s2 >= s1 && s2 <= e1) || (e2 >= s1 && e2 <= e1) || (s2 <= s1 && e2 >= e1)) {
          this.$message.error('循环时间不能与其他重叠')
          return
        }
      }

      // const t1 = []
      // const t2 = []
      // for (var i = 0; i < this.checkDates.length; i++) {
      //   t1.push(this.checkDates[i])
      // }
      // this.checkDates = []
      for (var j = 0; j < this.currentLists.length; j++) {
        if (this.currentLists[j] === true) {
          this.chooseDays.push(j + 1)
          this.currentLists[j] = false
        }
      }
      this.dialogFormVisible = false
      if (this.nowModifyTime !== -1) { // 更新
        this.timeLists[this.nowModifyTime] = {
          startTime: this.startTime,
          endTime: this.endTime,
          // day: this.value
          day: {
            period: this.value,
            week: this.checkDates,
            date: this.chooseDays

          },
          programs: this.timeLists[this.nowModifyTime].programs // 节目不变
        }
        this.nowModifyTime = -1
      } else {
        // 置 0
        if (this.timeLists.length === 0) this.timeListsSelect = 0
        this.timeLists = [...this.timeLists]
        this.timeLists.push({
          startTime: this.startTime,
          endTime: this.endTime,
          // day: this.value
          day: {
            period: this.value,
            week: this.checkDates,
            date: this.chooseDays

          },
          programs: []
        })
      }
      this.checkDates = []
      this.chooseDays = []
      console.log('timeLists', this.timeLists)
      // const h = new Date(this.timeLists[0].cicrleTime[0])
      // const hours = h.getHours()
      // console.log(hours)
      // console.log(this.timeLists[0])
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
    handleAddProgram() {
      if (this.timeListsSelect === -1) {
        this.$message.error('请先添加循环时间段')
        return
      }
      this.dialogProgramVisible = true
      this.$refs.programSelectTable.clearSelection()
    },
    handleProgramSelectionChange(val) {
      this.programListSelection = val
    },
    programDialogSave() {
      this.dialogProgramVisible = false
      this.timeLists[this.timeListsSelect].programs.push(...this.programListSelection)
      console.log(this.timeLists[0])
    },
    handleProgramDelete(idx) {
      this.timeLists[this.timeListsSelect].programs.splice(idx, 1)
    },
    changeProgramList(idx) {
      this.timeListsSelect = idx
      console.log(this.timeListsSelect)
    },
    checkIndex(i) {
      this.currentLists = [...this.currentLists]
      this.currentLists[i] = !this.currentLists[i]
      // this.chooseDays.push(i + 1)
      // for (var idx = 0; idx < this.currentLists.length; idx++) {
      //   if (this.currentLists[idx] === true) {
      //     this.chooseDays.push(idx + 1)
      //     this.currentLists[idx] = false
      //   }
      // }
      // console.log(this.chooseDays)
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
  height: 480px;
}

.right-content {
  border: 1px solid #d9d9d9;
  padding: 1rem;
  height: 480px;
  /* float: left; */
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
  height: 202px;
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

.choose-day ul li span.selected {
  color: #fff;
  background: #1890ff;
}

.icon-container i {
  padding-left: 20px;
}

.icon-container {
  position: absolute;
  right: 0;
  top: 0;
}
.program-card {
  position: relative;
  width: 120px;
  height: 202px;
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;
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
.program-list {
  display: flex;
}
</style>

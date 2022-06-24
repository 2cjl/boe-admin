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
            <ul />
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
            <ul>
              <li>
                <div class="add1">
                  <span><i class="el-icon-circle-plus-outline" /></span>
                  <span>
                    添加时间段
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </el-col>

      </el-row>
      <el-form-item>
        <el-button @click="onSubmit">取消</el-button>
        <el-button @click="onCancel">保存</el-button>
        <el-button type="primary">下一步</el-button>
      </el-form-item>

      <el-dialog title="设置播放时间段" :visible.sync="dialogFormVisible">
        <el-form label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
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
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
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
      dialogFormVisible: false,
      value1: '',
      value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
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
  methods: {
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
</style>

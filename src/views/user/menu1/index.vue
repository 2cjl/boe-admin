<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="账户名：">
                <el-input v-model="formInline.username" placeholder="请输入账户名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="所属机构：">
                <el-select v-model="formInline.organization">
                  <el-option label="城院罗老师测试" value="shanghai"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">新建用户
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="账户名"></el-table-column>
        <el-table-column prop="organization" label="所属机构"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="updated_at" label="更新时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="账户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passwd">
            <el-input placeholder="请输入密码" v-model="form.passwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="passwd">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="城院罗老师测试" value="shanghai"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

let validPassword = (rule, value, callback) => {
  let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
  if (!reg.test(value)) {
    callback(new Error('密码为8到16位，且同时包含字母数字'))
  } else {
    callback()
  }
}
let checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formInline: {
        username: '',
        organization: ''
      },
      temp: {
        id: undefined,
        importance: 1,
        username: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      tableData: [{
        username: 'luorladd1',
        organization: '城院罗老师测试',
        phone: '12345',
        email: '12345@qq.com',
        updated_at: '2016-05-04'
      }, {
        username: 'luorladd2',
        organization: '城院罗老师测试',
        phone: '12345',
        email: '12345@qq.com',
        updated_at: '2016-05-04'
      }, {
        username: 'luorladd3',
        organization: '城院罗老师测试',
        phone: '12345',
        email: '12345@qq.com',
        updated_at: '2016-05-04'
      }],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        username: '',
        passwd: '',
        phone: '',
        email: '',
        organization: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新建用户'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur', validator: validPassword }
        ],
        email: [
          { required: true, trigger: 'blur', validator: checkEmail }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getList() {
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
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>

<style>
.app-container {
  background-color: rgb(240, 242, 245);
}

.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

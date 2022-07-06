<template>
  <div class="app-container">
    <div class="form-container" style="height: 70px">
      <el-row>
        <el-col :span="8">
          <el-row>
            <span>账户名：</span>
            <el-input
              v-model="formInline.username"
              class="input"
              suffix-icon="el-icon-search"
              placeholder="请输入账户名称"
            />
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end" style="margin-bottom: -15px">
            <div>
              <el-button plain @click="reset()">重置</el-button>
              <el-button type="primary" @click="checkUser(formInline.username)">查询</el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">新建用户
              </el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border style="width: 100%" highlight-current-row>
      <el-table-column width="100" prop="username" label="账户名">
        <template v-slot="{row}">
          <span>{{ row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organization" label="所属机构">
        <template v-slot="{row}">
          <span>{{ organname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="state" label="状态">
        <template v-slot="{row}">
          <span v-if="row.Status ==='启用'">
            <el-tag type="success" effect="dark" size="medium">
              已启用
            </el-tag>
          </span>
          <span v-else-if="row.Status ==='正常'">
            <el-tag type="success" effect="dark" size="medium">
              已启用
            </el-tag>
          </span>
          <span v-else-if="row.Status ==='停用'">
            <el-tag type="danger" effect="dark" size="medium">
              已停用
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template v-slot="{row}">
          <span>{{ row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template v-slot="{row}">
          <span>{{ row.Email }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间">
        <template v-slot="{row}">
          <span>{{ row.UpdatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="text" size="mini" @click="handleStop(row)">停用</el-button>
          <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(row,$index)">删除
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="form" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="账户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="form.passwd" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="所属机构">
          <el-select v-model="form.organization" placeholder="请选择所属机构">
            <el-option label="2cjl" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { createUser, delUser, fetchUserList, putStop, updateUser } from '@/api/user' // secondary package based on el-pagination
import moment from 'moment'

const validPassword = (rule, value, callback) => {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
  if (!reg.test(value)) {
    callback(new Error('密码为8到16位，且同时包含字母数字'))
  } else {
    callback()
  }
}
const checkEmail = (rule, value, callback) => {
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
  inject: ['reload'],
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formInline: {
        username: '',
        organization: ''
      },
      total: 0,
      tableKey: 0,
      temp: {
        username: '',
        passwd: '',
        phone: '',
        email: '',
        organization: ''
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        username: '',
        passwd: '',
        phone: '',
        email: '',
        organization: '',
        realName: '管理员',
        status: '启用'
      },
      list: null,
      users: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
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
      // const selectQuery = {}
      // if (this.formInline.username !== '') {
      //   selectQuery.name = this.formInline.username
      // }
      fetchUserList((this.listQuery.page - 1) * 10, this.listQuery.limit).then(response => {
        this.list = response.users
        this.total = response.total
        this.list.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        // console.log(response)
      }).finally(() => {
        this.listLoading = false
      })
    },
    checkUser(name) {
      fetchUserList((this.listQuery.page - 1) * 10, this.listQuery.limit, name).then(response => {
        this.list = response.users
        this.total = response.total
        this.list.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        // console.log(response)
      }).finally(() => {
        this.listLoading = false
      })
    },

    reset() {
      this.formInline.username = ''
    },

    async resetForm() {
      this.form = {
        username: '',
        passwd: '',
        phone: '',
        email: '',
        organization: '',
        realName: '管理员',
        status: '启用'
      }
    },

    // 停用用户
    async handleStop(row) {
      await putStop({
        userId: row.ID.toString()
      })
      this.$notify({
        title: 'Success',
        message: '成功停用账户',
        type: 'success',
        duration: 2000
      })
      this.reload()
    },

    // 更新用户
    async handleUpdate(row) {
      this.form.email = row.Email
      this.form.username = row.Username
      this.form.phone = row.Phone
      this.form.organization = this.organname
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      await this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const form1 = Object.assign({}, this.form)
          form1.organization = parseInt(form1.organization)
          form1.userId = form1.ID.toString()
          const form2 = {
            userId: form1.userId,
            username: form1.username
          }
          console.log(form2)
          updateUser(form2).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '成功更新账户',
              type: 'success',
              duration: 2000
            })
          })
        }
        this.reload()
      })
    },

    // 新建用户
    async handleCreate() {
      await this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    async createData() {
      await this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const form1 = Object.assign({}, this.form)
          form1.organization = parseInt(form1.organization)
          console.log(form1)
          createUser(form1).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '成功创建账户',
              type: 'success',
              duration: 2000
            })
          })
        }
        this.reload()
      })
    },

    // 删除用户
    async handleDelete(row, index) {
      await delUser({
        userId: row.ID.toString()
      })
      this.$notify({
        title: 'Success',
        message: '成功删除账户',
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

.form-container, .btn-container {
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 15px;
}

.input {
  width: 60%;
}

</style>

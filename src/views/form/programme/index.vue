<template>
  <div class="app-container">
    <div class="form-container" style="height: 70px">
      <el-row>
        <el-col :span="8">
          <el-row style="margin-bottom: 10px">
            <span>节目名称：</span>
            <el-input v-model="input1" placeholder="请输入设备名称" suffix-icon="el-icon-search" size="medium" class="input" />
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end" style="margin-bottom: -15px">
            <div>
              <el-button plain @click="reset()">重置</el-button>
              <el-button type="primary" @click="checkPrograms(input1)">查询</el-button>
              <el-button type="primary" @click="handleCreate">创建节目</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="缩略图" width="100px" align="center">
        <template v-slot="{row}">
          <el-image :src="row.Preview" />
        </template>
      </el-table-column>
      <el-table-column label="节目名称" width="220px" align="center">
        <template v-slot="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分辨率" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.Resolution }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目时长" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.Duration }}秒</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.Author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template v-slot="{row}">
          <span>{{ row.UpdatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template v-slot="{row,$index}">
          <el-button type="text" size="mini" @click="handlePictureCardPreview(row.Preview)">预览</el-button>
          <el-button type="text" size="mini">编辑</el-button>
          <el-button type="text" size="mini">发布</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="text">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
        <el-form-item label="节目名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-input v-model="form.resolution" />
        </el-form-item>
        <el-form-item label="节目时长">
          <el-input v-model="form.duration" />
        </el-form-item>

        <el-upload
          ref="imgUpload"
          list-type="picture-card"
          :auto-upload="false"
          :http-request="uploadSectionFile"
          action="#"
        >
          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file.url)">
                <i class="el-icon-zoom-in" />
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { fetchShowList, preview, upload } from '@/api/show'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import Pagination from '@/components/Pagination'
import moment from 'moment'
export default {
  components: { Pagination },
  inject: ['reload'],
  data() {
    return {
      list: null,
      total: 0,
      formInline: {
        username: '',
        organization: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑节目',
        create: '创建节目'
      },
      form: {
        name: '',
        duration: '',
        phone: '',
        email: '',
        organization: 1,
        realName: '管理员',
        status: '启用'
      },
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      value: '',
      options: '',
      input1: '',
      fileData: {},
      headers: { // 请求头部参数
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // const selectQuery = {}
      // if (this.input1 !== '') {
      //   selectQuery.name = this.input1
      // }
      fetchShowList((this.listQuery.page - 1) * 10, this.listQuery.limit).then(response => {
        this.list = response.data.shows
        this.total = response.data.total
        this.list.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        console.log(response)
      }).finally(() => {
        this.listLoading = true
      })
    },
    checkPrograms(name) {
      fetchShowList((this.listQuery.page - 1) * 10, this.listQuery.limit, name).then(response => {
        this.list = response.data.shows
        this.total = response.data.total
        this.list.forEach((v) => { v.UpdatedAt = moment(v.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') })
        console.log(response)
      }).finally(() => {
        this.listLoading = true
      })
    },

    reset() {
      this.input1 = ''
    },

    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },

    // 创建节目
    async handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },

    // 图片上传成功的操作
    // handleAvatarSuccess(res, file, filelist) {
    //   if (res.msgCode === 200) {
    //     this.imageUrl = URL.createObjectURL(file.raw)
    //   } else {
    //     this.$message.error(res.msgContent)
    //   }
    // },
    // // 图片上传前的判断
    // beforeAvatarUpload(file, filelist) {
    //   upload
    //   const isLt1M = file.size / 1024 / 1024
    //   if (isLt1M > 1) {
    //     this.$message.error('上传头像图片大小不能超过1MB')
    //   }
    //   return true
    // },

    uploadSectionFile(params) {
      const file = params.file
      console.log(params)
      preview({ path: file.name }).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          axios({
            method: 'put',
            url: res.data,
            data: file
          })
            .then((res) => {
              console.log(res)
            })
          // const reader = new FileReader()
          // reader.readAsBinaryString(file)
          // reader.onload = function() {
          //   axios({
          //     method: 'put',
          //     url: res.data,
          //     data: reader.result
          //   })
          //     .then((res) => {
          //       console.log(res)
          //     })
          // }
        }
      })
    },

    async createData() {
      this.$refs.imgUpload.submit()
    },
    async onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped>
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


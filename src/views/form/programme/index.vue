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
              <el-button type="primary" @click="getList()">查询</el-button>
              <el-button type="primary" @click="handleCreate">创建节目</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="缩略图" width="100px">
        <template v-slot="{row}">
          <el-image :src="row.Preview" />
        </template>
      </el-table-column>
      <el-table-column label="节目名称" width="220px">
        <template v-slot="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分辨率" width="150px">
        <template v-slot="{row}">
          <span>{{ row.Resolution }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目时长" width="100px">
        <template v-slot="{row}">
          <span>{{ row.Duration }}秒</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="100px">
        <template v-slot="{row}">
          <span>{{ row.Author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template v-slot="{row}">
          <span>{{ row.UpdatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="text" size="mini" @click="handlePictureCardPreview(row.Preview)">预览</el-button>
          <el-button type="text" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="mini">发布</el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="text">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="form" label-position="left" label-width="100px">
        <el-form-item label="节目名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-select v-model="form.resolution" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节目时长">
          <el-input v-model="form.duration" />
        </el-form-item>

        <el-upload
          ref="imgUpload"
          list-type="picture-card"
          :auto-upload="false"
          :http-request="uploadSectionFile"
          :file-list="inputFileList"
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
import { createShow, fetchShowList, getUploadToken, updateShow } from '@/api/show'
import axios from 'axios'

export default {
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
        id: 0,
        name: '',
        duration: '',
        resolution: '',
        fileData: []
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
      options: [{
        label: '1920x1080',
        value: '1920x1080'
      }],
      input1: '',
      inputFileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const selectQuery = {}
      if (this.input1 !== '') {
        selectQuery.name = this.input1
      }
      fetchShowList(Object.assign(selectQuery, this.listQuery)).then(response => {
        this.list = response.data.shows
        this.total = response.data.total
        console.log(response)
      }).finally(() => {
        this.listLoading = true
      })
    },

    reset() {
      this.input1 = ''
    },

    handleRemove(file) {
      for (let i = 0; i < this.inputFileList.length; i++) {
        if (this.inputFileList[i].name === file.name) {
          this.inputFileList.splice(i, 1)
          break
        }
      }
      console.log(file)
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },

    // 创建节目
    async handleCreate() {
      this.form = {
        name: '',
        duration: '',
        resolution: '',
        fileData: []
      }
      this.inputFileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },

    handleEdit(row) {
      this.form = {
        id: row.ID,
        name: row.Name,
        duration: row.Duration,
        resolution: row.Resolution
      }
      this.inputFileList = JSON.parse(row.Images).map((v) => {
        return {
          name: v.substring(v.lastIndexOf('/') + 1),
          url: v
        }
      })

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },

    uploadSectionFile(params) {
      console.log('params', params)
      const file = params.file
      getUploadToken().then((res) => {
        // console.log(res);
        if (res.code === 200) {
          const formData = new FormData()
          formData.set('key', '/boe-img/' + file.name)
          formData.set('token', res.data)
          formData.set('file', file)
          axios({
            method: 'post',
            url: 'http://up-z2.qiniup.com',
            data: formData
          })
            .then((res) => {
              if (res.status === 200) {
                this.form.fileData.push(`http://cdn.yuzzl.top/${res.data.key}`)
              }
            })
        }
      })
    },

    async createData() {
      this.$refs.imgUpload.submit()
      setTimeout(() => {
        createShow({
          name: this.form.name,
          duration: parseInt(this.form.duration),
          images: JSON.stringify(this.form.fileData),
          resolution: this.form.resolution
        }).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.$message({
              message: '创建节目成功',
              type: 'success'
            })
          } else {
            this.$message.error('创建节目失败')
          }
        }).finally(() => {
          this.dialogFormVisible = false
          this.getList()
        })
      }, 500)
    },

    updateData() {
      this.form.fileData = []
      this.$refs.imgUpload.submit()
      setTimeout(() => {
        updateShow({
          id: this.form.id,
          name: this.form.name,
          duration: parseInt(this.form.duration),
          images: JSON.stringify(this.form.fileData),
          resolution: this.form.resolution
        }).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.$message({
              message: '更新节目成功',
              type: 'success'
            })
          } else {
            this.$message.error('更新节目失败')
          }
        }).finally(() => {
          this.dialogFormVisible = false
          this.getList()
        })
      }, 500)
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


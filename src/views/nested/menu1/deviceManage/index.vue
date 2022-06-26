<template>
  <div class="app-container">
    <div class="form-container">
      <el-row>
        <el-col :span="6">
          <el-row>
            <span>设备名称：</span>
            <el-input
              v-model="input1"
              placeholder="请输入设备名称"
              suffix-icon="el-icon-search"
              size="medium"
              class="input"
            />
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <span>所属机构：</span>
            <el-select v-model="organ" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <span>所属分组：</span>
            <el-select v-model="group" placeholder="请选择所属分组">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <div>
              <el-button plain>重置</el-button>
              <el-button type="primary">查询</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="device-container">
      <el-row>
        <span>选择设备</span>
        <el-tabs v-model="activeName" tab-position="top">
          <el-tab-pane label="单个设备" name="first">
            <el-table
              :key="tableKey"
              :data="deviceLists"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="设备名称" align="center" width="80">
                <template slot-scope="{row}">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="MAC地址" width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.address }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属分组" min-width="150px">
                <template slot-scope="{row}">
                  <span>{{ row.group }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分辨率" width="110px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.ratio }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属机构" width="80px">
                <template slot-scope="{row}">
                  <span>{{ row.organ }}</span>
                </template>
              </el-table-column>
              <el-table-column label="当前计划" align="center" width="95">
                <template slot-scope="{row}">

                  <span>{{ row.plan }}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备状态" width="100">
                <template slot-scope="{row}">
                  <el-tag>
                    {{ row.status }}
                  </el-tag>

                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
          </el-tab-pane>
          <el-tab-pane label="分组设备" name="second">
            <el-table
              :key="tableKey"
              :data="deviceLists"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column label="分组名称" align="center" width="80">
                <template slot-scope="{row}">
                  <span>{{ row.group }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属机构" width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.organ }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
          </el-tab-pane>
        </el-tabs>
        <!-- <el-button @click="">单个设备</el-button>
        <el-button>分组设备</el-button> -->
      </el-row>

    </div>
    <div class="btn-container">

      <el-button @click="$router.push('menu1')">取消</el-button>
      <el-button @click="$router.go(-1)">上一步</el-button>
      <el-button type="primary" @click="$router.push('menu1')">发布</el-button>

    </div>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
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
      activeName: 'first',
      input1: '',
      options: [{
        value: '1',
        label: '城院罗老师'
      }],
      options1: [{
        value: '1',
        label: '123'
      },

      {
        value: '2',
        label: '222'
      },
      {
        value: '3',
        label: '473737'
      }],
      organ: '',
      group: '',
      deviceLists: [
        {
          name: '测试巫山',
          address: 'sss',
          group: 'fff',
          ratio: '1920*1080',
          organ: '城院罗老师测试',
          plan: '-',
          status: '离线'
        }
      ]

    }
  }

}

</script>
<style scoped>
.app-container {
   background-color: rgb(240, 242, 245);
}
.form-container, .device-container{
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 15px;
}
.input {
  width: 60%;
}
</style>

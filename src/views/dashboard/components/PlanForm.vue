<template>
  <el-table
    :key="tableKey"
    v-loading="listLoading"
    :data="list"
    border
    fit
    highlight-current-row
    style="width: 100%;"
  >
    <el-table-column label="序号" prop="id" align="center" width="80">
      <template slot-scope="{row}">
        <span>{{ row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="计划名称" width="150px" align="center">
      <template slot-scope="{row}">
        <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="计划状态" min-width="150px">
      <template slot-scope="{row}">
        <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        <el-tag>{{ row.type | typeFilter }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="提交时间" width="110px" align="center">
      <template slot-scope="{row}">
        <span>{{ row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column label="提交人" width="80px">
      <template slot-scope="{row}">
        <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">
          Edit
        </el-button>
        <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
          Publish
        </el-button>
        <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
          Draft
        </el-button>
        <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    }
  }
}
</script>

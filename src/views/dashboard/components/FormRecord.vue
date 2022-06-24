<template>
  <div class="app-container">
    <!-- <el-scrollbar style="height: 100%" class="main-content"> -->
    <div v-for="(item,i) in recordList" :key="i" class="main-container">
      <div class="time">
        {{ item.time }}
      </div>
      <div class="content">
        {{ item.content }}
      </div>
      <el-divider class="divider" />
    </div>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      recordList: [
        {
          time: '2022-06-23 11:28:01',
          content: '[设备]测试误删设备注册成功'
        },
        {
          time: '2022-06-23 11:04:01',
          content: '[设备]测试误删设备已上线'
        },
        {
          time: '2022-06-23 11:28:01',
          content: '[设备]测试误删设备注册成功'
        },
        {
          time: '2022-06-23 11:04:01',
          content: '[设备]测试误删设备已上线'
        },
        {
          time: '2022-06-23 11:28:01',
          content: '[设备]测试误删设备注册成功'
        },
        {
          time: '2022-06-23 11:04:01',
          content: '[设备]测试误删设备已上线'
        },
        {
          time: '2022-06-23 11:28:01',
          content: '[设备]测试误删设备注册成功'
        },
        {
          time: '2022-06-23 11:04:01',
          content: '[设备]测试误删设备已上线'
        }
      ]

    }
  }

}
</script>
<style scoped>
.time {
    font-size: 12px;
}
.content {
    font-size: 14px;
}
.app-container {
    /* height: 330px; */
    overflow: auto;
    /* overflow-x: hidden; */
}
.divider {
    margin:12px
}
/* .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
} */

</style>

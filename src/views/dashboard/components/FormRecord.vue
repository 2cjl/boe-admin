<template>
  <div class="app-container">
    <!-- <el-scrollbar style="height: 100%" class="main-content"> -->
    <div class="main-container">
      <div v-for="(item,i) in recordList" :key="i">
        <div class="time">
          {{ item.time }}
        </div>
        <div class="content">
          {{ item.content }}
        </div>
        <el-divider class="divider" />
      </div>

    <!-- </div></el-scrollbar> -->
    </div>
  </div></template>

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
.main-container {
    height: 270px;
    overflow-y: auto;
    overflow-x: hidden;

}
.divider {
    margin:12px
}
/* .main-content {
    height: 300px;
    overflow: auto;

} */

</style>

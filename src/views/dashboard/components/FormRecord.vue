<template>
  <div class="app-container">
    <!-- <el-scrollbar style="height: 100%" class="main-content"> -->
    <div class="main-container">
      <div v-for="(item,i) in eventsRecord" :key="i">
        <div class="time">
          {{ item.Time }}
        </div>
        <div class="content-container">
          <div class="object-type">
            [{{ item.ObjectType }}]
          </div>
          <div class="content">
            {{ item.Content }}
          </div>
        </div>
        <el-divider class="divider" />
      </div>

    <!-- </div></el-scrollbar> -->
    </div>
  </div></template>

<script>
import { getEventsRecord } from '@/api/home'
export default {
  data() {
    return {
      eventsRecord: {}
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      getEventsRecord().then((res) => {
        this.eventsRecord = res.data.events
        console.log(this.eventsRecord)
      })
    }
  }

}
</script>
<style scoped>
.time {
    font-size: 12px;
}
/* .content {
    font-size: 14px;
} */
.main-container {
    height: 270px;
    overflow-y: auto;
    overflow-x: hidden;
}

.divider {
    margin:12px
}
.content-container {
  display: flex;
  font-size: 14px;
}
/* .main-content {
    height: 300px;
    overflow: auto;

} */

</style>

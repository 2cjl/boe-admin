<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <img
            class="pic"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAgVBMVEUAAAAYkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP+63v9esv9yvP9Zr/+v2f8/o/+02/8ckv+Sy/89ov/0yFK+AAAAIHRSTlMA8NMJBOmVQPz1X7l+c29lNSYPw7BYHvnatYliRuQa0NeNlRUAAAHGSURBVFjDrZjrcoIwEIVPAkEiCNQL3ttV8db3f8A6Y6fWGCIh+z3A92N3stk9cBBX69VUbgWR2Mrpal3F6EFdTAUZiGnxCS+i4YTspNksQlfGuSIHKh+jC/FI0BvEqEO1BgvqwGLwrjgJdSRxlupDUmfkB1rZCPJAbNDCMCUv0iGslORNCQuzlLxJZ5a2z6kH88FLvwT1Qhi9iyT1REZPooR6kzwViAL4V6ZYUgDy8YJHFMTob/4YHTs1e4Pm5OzcGHdyw7O38E0O8t/WG/OwsYkacqCi+1ulZ/ZWyMX99U7CRRPcqClcRDWAgkNUAMg4RBkQaw6RjlERh4gqlDyiEgmPKMGSR7SE5BFJqDbR9bxr5Xi4mM8NukV03Tk5mKME1CI6u0VHMsC8RbR7w4tI8Yg0tjwihS8ekcSSR7REwiNKUPKISlQ8ogqx5hDpGMg4RBmAIkz0GP41h6i2fZCNv2hi/bJP/qKhdYmgU+M5RlT0WGteOHgMtvyxaL1yORy7jloxZl79wpdR9vU4fGHnPyHCj5rwM4v98As/RfmP4/BzPTxA4I80wkOW8NiHM4gKj8Z8w7pMk4HO3GGdOz5U+mZQb+PDH63m/T608r+qAAAAAElFTkSuQmCC"
          >
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            设备数量
          </div>
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          <img class="pic" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAArlBMVEUAAAAYkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP9esv+63v9Yr/9Oq/8qmf+03P9Urf8znf+f0f9vuv9pt/8jlf+o1v+Yzv+Aw/8+ov89ov+q1v+Kx/93vv9htP9fs/8hlP+cHoNLAAAAInRSTlMA0wT78ZVk7rJf9ermuX5vQh0PCgjDWDZz2olGPCcmcjPQup6IIwAAAg9JREFUWMOtmAd2gzAMQM0KhIaQNLMjo4IQsldX7n+xZjUEGWPD0z/Af8+SLUtiOejjyquj1UwAs6Y5r5WxzkrQ9B0bELbjN4tZ2tUOZGN43bay5rn+BDk81Z+VNHrfBgl2XyFajRdQ4KUh0bQsUMRq5XmGGiijDcWeNxMKYL6JPFUDCmFUsz0VKEwly9M1oDBGNyPtyKNoanD5MqEUJspdS4OSaOn7ZEFprEfPO/BMD9EkSDGJ9lPgeU88On+w+SzIZDbnD5e84BEgjlEgJDoCYnSvPzY+FToTOiE+n/1fn+rYE0jApvqtrqJ6uJ7IRJM1qpnt61tF/iiQEkGa6+vtoHwFCqDcdS7/DrLPVEQzSHP+pXx5pOXx9k8iD1IcgoTVNg43u98s0QFSeIzprjDUqzg88/ktD7ersx6kecj9IryxWPI3ANL0uAIbJMThne0Km7iia4lF4QPx10+uyGKORJSodnkih2k5IsRmKRZprKYuCuOlUFRjZgFRuBCKTAZFRLFQBMygEtlER6ML9gdR+skuJNkTIXu0ZGWErrDhUrsvV2rJij/Zd0T1QZJ92WRNBFVbQ91o8a3fOq/1WwOiT9aMStrjvWp7TNmw048QbFB2qBlQjVlUgx/VKEo1HNOP65hBkQXCgGqlQbRkoV/70C+i6FdjeFnnuYBwPb/JSqD3LutD92S4rA97eZH5A3VUIdCcqKG5AAAAAElFTkSuQmCC"></img>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            节目数量
          </div>
          <!-- <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
          <img class="pic" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAtFBMVEUAAAAYkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP8YkP9Gpv+63v8bkf8wnP9Epf8nmP8flP9ApP88ov81nv8rmv9yu/84oP8jlf8hlf9Pq/+k1P+Bwv+t2P+bz/+Ryv9Yr/+Ixv9T34eyAAAAJHRSTlMA8AkE05XruPz1XuZvZUImD7BiNh751cN9c9qJVkY8f3IzGsRdQbloAAADBklEQVRYw7WYaVvjIBCAc7XppfbQ2nq7O5RArk2qru7+//+1kK5iGCRp8vh+0j7p2zADA4xjwX9cXi+CqQvgToPF9fLRdzpwPlu4oOEuZj+Os3iTSzAzCidea818MwQLw828lcbfutDAcNsiWqdX0IKr06bgDKAlA2uozgJozfrsa8+tC0fg3n7lmYzgKEYTs+cEjubE5LkZwdGMbgxpv4AOXJyifLnQCVfLnRdAR4L6fBpAZwafPXdgIo6SPSjKJIrBwJ3y+IFJkxFCIlBE4v/MoArUCn4ABI2IJAVFSiQRIB4+6s8Qv05CBElOxZ+c55zHwp0fPkQv5b7Xpw3ycCa/wYHmBSMHWCGsXKoYB43N/9QPkacaA6WRtCiY/IgIdNPQO6xVk4eVkDOiw3IomcF0WL16nd8zGQhaEBMFleFje6hxWe07er7kgzFNiZmUxvKHKNQ4F6KZJpLTpxS2D152z081UyknFNSYCVGoDUw8lUNKFLvd7ldtdNXUrA8uFLN6DDWEIhVPYpEiOjz0mbHvrPSUpaSMiVVE4pKkWuJWhgK7h6JBVMAeF90BIGLSICKxoZiEgIgaRXjlLpwAEEmjKMG1xJmaR4ZF9rFNnTES5S1EHJUSxxIiJLIFycHbWdZClGERro4FFu3+6EUANMbOtPGNXoTot2bKcLCDRhH5K01PdlHghIZg67wJ03PNlINGaFginCBehenVmv6BYdFSLHp6FqY3oqB40a4AkeKiX5nIBynorBy/YWqrd3rRQqQVNkO0KSN2GEWxVsXflrfmBTJT25G2I9lIAHGON8iK0irag84l2rJxvDE5IJb4ENEcpggQQw8da7AJezD37wctFwxwRjCMA8adq6OfCZohT0bBwBYdRvF5lBEFy2IwEfjoeIyhPEsTOXXSjFMwc/cdB3bHW0NH1t53XGr6X7P6X/y+8yra/3Lc/7qOOVt3byD0b2n0b7L0b/u4W79dI+re3oi6nztt8ZY/O7fGcLMuHKP9NBTNug74q6p9OBaGqn24skXmH/ZiQhMcW+9aAAAAAElFTkSuQmCC"></img>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            计划数量
          </div>
          <!-- <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import CountTo from 'vue-count-to'

export default {
  components: {
    // CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.pic {
  width: 45px;
  height: 45px;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

<template>
  <div class="detailbar">
    <div class="titleHead">
      <span :style="{ color: tableData.proLevel === 1 ? 'red' : 'inherit' }">
        <strong>{{ tableData.proName }}</strong>
      </span>
    </div>
    <el-divider class="row-divider" />
    <div class="project-details">
      <div class="common first-content">
        <div class="image-block">
          <el-image :src="require('@/assets/task_icon.png')" fit="fill" />
        </div>
        <div class="text-block">
          <p style="font-size: 18px; margin: 30px 0 10px 0;">
            <strong>发现了<span style="font-size: 24px; color: orange;">&nbsp;{{ overtimeCount }}&nbsp;</span>个任务超时</strong>
          </p>
          <p v-if="overtimeCount !== 0" style="color: #818693; margin: 15px 0;">
            当前项目中存在任务超时，请您关注！
          </p>
          <p v-else style="color: #818693; margin: 15px 0;">
            当前项目中暂无超时任务，请继续保持！
          </p>
        </div>
      </div>
      <el-divider direction="vertical" class="column-divider" />
      <div class="common second-content">
        <div class="second-content-container">
          <div class="second-content-block">
            <span style="color: #818693; margin: 3px 0;">未关闭任务</span>
            <span style="margin: 3px 0;"><strong> {{ taskCount - overtimeCount }} </strong></span>
          </div>
          <div class="second-content-block">
            <span style="color: #818693; margin: 3px 0;">任务总数</span>
            <span style="margin: 3px 0;"><strong> {{ taskCount }} </strong></span>
          </div>
        </div>
        <div class="second-content-container">
          <div class="second-content-block">
            <span style="color: #818693; margin: 3px 0;">当前状态</span>
            <span
              :style="{ color: tableData.proState === 1 ? 'green' : (tableData.proState === 2 ? 'red' : 'black'), margin: '3px 0' }"
            >
              <strong> {{ tableData.proState === 0 ? '未开始' : (tableData.proState === 1 ? '进行中' : '已关闭') }} </strong>
            </span>
          </div>
          <div class="second-content-block">
            <span style="color: #818693; margin: 3px 0;">项目成员</span>
            <span style="margin: 3px 0;"><strong> {{ promenCount }} </strong></span>
          </div>
        </div>
      </div>
      <el-divider direction="vertical" class="column-divider" />
      <div class="common third-content">
        <div class="third-content-container">
          <div class="third-content-block">
            <span style="color: #818693;">项目类型</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ tableData.proType === 0 ? '短期项目' : '长期项目' }} </strong></span>
          </div>
          <div class="third-content-block">
            <span style="color: #818693;">项目工期</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ (tableData.finishtime - tableData.starttime) / (1000 * 60 * 60 * 24) }} 天</strong></span>
          </div>
          <div class="third-content-block">
            <span style="color: #818693;">开始日期</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ formatDateTime(tableData.starttime) }} </strong></span>
          </div>
        </div>
        <div class="third-content-container">
          <div class="third-content-block">
            <span style="color: #818693;">责任部门</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ tableData.proDepartment }} </strong></span>
          </div>
          <div class="third-content-block">
            <span style="color: #818693;">负责人员</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ tableData.managerName }} </strong></span>
          </div>
          <div class="third-content-block">
            <span style="color: #818693;">结束日期</span>
            <span>&nbsp;&nbsp;</span>
            <span><strong> {{ formatDateTime(tableData.finishtime) }} </strong></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { countTaskByProId } from '@/api/task'
import { getProMenByProId } from '@/api/employee'

@Component({
  name: 'Detailbar',
})

export default class extends Vue {
  private proId: Number = 0
  private taskCount: Number = 0
  private overtimeCount: Number = 0
  private promenCount: Number = 0
  private tableData: [] = []
  private taskData: [] = []
  private overtimedTask: any[] = []

  created() {
    this.tableData = this.$store.state.proInfo
    console.log('detailbar tableData =', this.tableData)
    this.proId = this.$store.state.proInfo.proId
    console.log('detailbar proId =', this.proId)
  }

  mounted() {
    this.countOvertimeTask()
  }

  private async countOvertimeTask() {
    await this.countTaskByProId()
    await this.countProMenByProId()
    this.overtimedTask = this.taskData.filter((item: any) => {
      return item.taskState === 4;
    })
    console.log('overtimedTask =', this.overtimedTask)
    this.overtimeCount = this.overtimedTask.length
  }

  private async countTaskByProId() {
    await countTaskByProId(this.proId)
    .then(res => {
      if (res.data.code === 1) {
        this.taskData = res.data.data
        console.log('taskData =', this.taskData)
        this.taskCount = this.taskData.length
      } else {
        this.$message.error('error occured in countTaskByProId：' + res.data.msg)
      }
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
  }

  private async countProMenByProId() {
    await getProMenByProId(this.proId)
    .then(res => {
      console.log('countpromen.res =', res)
      if (res.data.code === 1) {
        let promenData = res.data.data
        console.log('promenData =', promenData)
        this.promenCount = promenData.length
      } else {
        this.$message.error('error occured in getProMenByProId：' + res.data.msg)
      }
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
  }

  private formatDateTime(val: string|number|Date) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
</script>

<style lang="scss" scoped>
.titleHead {
  margin: 12px 0;
  padding-left: 20px;
  font-size: 18px;
}

.row-divider {
  margin: 0;
}

.column-divider {
  margin: 0 20px;
  height: auto;
}

.project-details {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.common {
  width: 350px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.first-content {
  .image-block {
    margin: auto 0;
  }
  .text-block {
    flex-grow: 1;
    padding: 0 20px;
  }
}

.second-content {
  .second-content-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .second-content-block {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 水平居中 */
    align-items: center;
  }
}

.third-content {
  padding: 0 0 0 10px;
  .third-content-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
  }
  .third-content-block {
    flex-grow: 1;
    display: flex;
    // justify-content: center; /* 水平居中 */
    align-items: center;
  }

}

</style>

<template>
  <div class="main-container">
    <el-dialog
      :visible.sync="localDialogVisible"
      width="1000px"
      class="info-container"
      @close="handleAddTaskClose()"
    >
      <div class="add-task-container">
        <div class="task-form-style">
          <div class="subform task-input-style">
            <span style="color: #818693; margin-right: 20px; font-size: 14px;">任务名称</span>
            <el-input v-model="taskForm.taskName" placeholder="请输入任务名称" style="width: 240px;" />
          </div>
          <div class="subform task-select-style">
            <span style="color: #818693; margin: 0 20px 0 40px; font-size: 14px;">责任人</span>
            <el-select v-model="taskForm.taskLeader" placeholder="请选择责任人" style="width: 150px;">
              <el-option
                v-for="promen in promenData"
                :key="promen.userName"
                :label="promen.userName"
                :value="promen.userName"
              />
            </el-select>
          </div>
          <div class="subform task-date-style">
            <span style="color: #818693; margin: 0 20px 0 40px; font-size: 14px;">开始日期</span>
            <el-date-picker
              v-model="taskForm.taskStarttime"
              placeholder="请选择截止日期"
              type="date"
              style="width: 160px"
            />
          </div>
        </div>
        <div class="task-form-style">
          <div class="subform task-date-style">
            <span style="color: #818693; margin-right: 20px; font-size: 14px;">截止日期</span>
            <el-date-picker
              v-model="taskForm.taskEndtime"
              placeholder="请选择截止日期"
              type="date"
              style="width: 160px"
            />
          </div>
          <div class="subform task-input-style">
            <span style="color: #818693; margin: 0 20px 0 40px; font-size: 14px;">任务简介</span>
            <el-input v-model="taskForm.taskInstroduction" placeholder="请输入任务简介" style="width: 505px;" />
          </div>
        </div>
      </div>
      <div class="intro-container">
        <span style="width: 56px; color: #818693; margin: 9px 20px 0 0; font-size: 14px;">任务描述</span>
        <el-input
          v-model="taskForm.taskDescription"
          placeholder="请输入任务描述"
          style="width: 795px;"
          :rows="6"
          type="textarea"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddTaskClose()">
          取 消
        </el-button>
        <el-button type="primary" @click="handleSave()">
          保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { addTask } from '@/api/task'
import { getProMenByProId } from '@/api/employee'
import { EventBus } from '@/eventBus'

@Component({
  name: 'AddTask',
})

export default class extends Vue {
  @Prop() private dialogFormVisible!: any
  private localDialogVisible: boolean = this.dialogFormVisible
  private taskForm = {
    taskName: '',
    taskLeader: '',
    taskStarttime: new Date(),
    taskEndtime: new Date(),
    taskDescription: '',
    taskInstroduction: '',
    taskState: 2,
    taskProcess: 0,
    proId: 0
  }
  private promenData: any[] = [] // 没有假数据
  private proId: 0

  created() {
    this.proId = this.$store.state.proInfo.proId
    this.taskForm.proId = this.$store.state.proInfo.proId
    this.getProMenByProId()
  }

  @Watch('dialogFormVisible')
  onDialogFormVisibleChange(newVal: boolean) {
    this.localDialogVisible = newVal
  }

  private handleAddTaskClose() {
    this.$emit('handle-close')
  }

  private async handleSave() {
    const sendData = {
      taskName: this.taskForm.taskName,
      taskLeader: this.taskForm.taskLeader,
      taskStarttime: this.taskForm.taskStarttime,
      taskEndtime: this.taskForm.taskEndtime,
      taskDescription: this.taskForm.taskDescription,
      taskInstroduction: this.taskForm.taskInstroduction,
      taskState: this.taskForm.taskState,
      taskProcess: this.taskForm.taskProcess,
      proId: this.taskForm.proId
    }
    console.log('sendDate =', sendData)
    if (sendData.taskStarttime <= sendData.taskEndtime) {
      await addTask(sendData)
      .then(res => {
        console.log('add task res =', res)
        if (res.data.code) {
          this.$message.success('任务新增成功！');
        } else {
          this.$message.error('请求出错了：' + res.data.msg)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
      this.$emit('handle-close')
      EventBus.$emit('updateTaskData')
    } else {
      this.$message.error('开始日期不能大于截止日期')
    }
  }

  private async getProMenByProId() {
    await getProMenByProId(this.proId)
    .then(res => {
      if (res.data.code === 1) {
        this.promenData = res.data.data
        console.log('promenData =', this.promenData)
      } else {
        this.$message.error('请求出错了：' + res.data.msg)
      }
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center; // 根据direction方向计算
  align-items: center;
  height: 100%; /* 使用整个视窗高度 */
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.info-container {
  .el-dialog__body {
    padding: 30px 100px 0;
  }
  .el-input__inner {
    padding: 0 12px;
  }
  .el-form-item {
    margin-bottom: 26px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-dialog__footer {
    padding-top: 14px;
  }
  .add-task-container {
    padding: 20px 40px 0;
    .task-form-style {
      display: flex;
      flex-direction: row;
      padding: 10px 0;
      .subform {
        flex-grow: 1;
      }
    }
  }
  .intro-container {
    display: flex;
    flex-direction: row;
    padding: 20px 40px;
  }
}
</style>

<template>
  <div class="main-content">
    <section class="task-list">
      <div class="table-controls">
        <button class="btn" @click="handleAddTask">
          新建
        </button>
        <button class="btn" @click="deleteTask">
          删除
        </button>
      </div>
      <div class="table-content">
        <el-table v-if="pagedData.length"
                  :data="pagedData"
                  stripe
                  class="tableBox"
                  @selection-change="handleSelectionChange"
                  @row-click="handleRowClick"
        >
          <el-table-column type="selection"
                           :min-width="50"
                           align="center"
          />
          <el-table-column prop="taskName"
                           label="任务名称"
                           :min-width="300"
                           align="center"
          />
          <el-table-column prop="taskState"
                           label="任务状态"
                           :min-width="120"
                           align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.taskState === 1 ? '已完成' :
                (scope.row.taskState === 2 ? '未开始' :
                  (scope.row.taskState === 3 ? '进行中' : '已超时')) }}
            </template>
          </el-table-column>
          <el-table-column prop="taskLeader"
                           label="责任人"
                           :min-width="120"
                           align="center"
          />
          <el-table-column prop="taskEndtime"
                           label="截止时间"
                           :min-width="200"
                           align="center"
          >
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.taskEndtime) }}
            </template>
          </el-table-column>
          <el-table-column prop="taskProcess"
                           label="任务进度"
                           :min-width="150"
                           align="center"
          >
            <template slot-scope="scope">
              <el-progress :percentage="Math.round(scope.row.taskProcess)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <el-pagination class="pageList"
                       :page-size="pageSize"
                       layout="total, prev, pager, next"
                       :total="counts"
                       @current-change="handleCurrentChange"
        />
      </div>
    </section>
    <AddTask :dialog-form-visible="dialogFormVisible"
             @handle-close="handleAddTaskClose"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  countTaskByProId,
  deleteSelectedTask
} from '@/api/task'
import AddTask from './addTask.vue'
import { EventBus } from '@/eventBus'

@Component({
  name: 'MainInterface',
  components: {
    AddTask
  },
})
export default class MainInterface extends Vue {
  private proId: Number = 0
  private page: number = 1
  private pageSize: number = 10
  private taskData: [] = []
  private pagedData: any[] = []
  private counts: number = 0
  private checkList: string[] = []
  private dialogFormVisible = false

  created() {
    this.proId = this.$store.state.proInfo.proId
    this.init()
  }

  mounted() {
    document.addEventListener('click', this.handleClose)
    EventBus.$on('updateTaskData', this.init)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClose)
    EventBus.$off('updateTaskData', this.init)
  }

  private handleClose() { }

  private handleAddTask() {
    console.log('handleAddTask is clicked')
    this.dialogFormVisible = true
  }

  private handleAddTaskClose() {
    this.dialogFormVisible = false
  }
  private handleRowClick(row: {taskId: any }){
    this.$router.push({
      path: 'taskList/taskDisassemble',
      query: {taskId: row.taskId}
    })
  }

  private async deleteTask() {
    console.log('checkList =', this.checkList);
    if (this.checkList.length === 0) {
      return this.$message.error('请选择删除对象');
    }
    try {
      const deletePromises = this.checkList.map(taskId =>
        deleteSelectedTask(Number(taskId))
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(`ID为 ${taskId} 的任务删除成功！`);
            } else {
              this.$message.error(`ID为 ${taskId} 的任务删除失败`);
            }
          })
          .catch(err => {
            this.$message.error(`ID为 ${taskId} 的任务删除出错：${err.message}`);
          })
      );
      await Promise.all(deletePromises);
      this.init();
    } catch (error) {
      console.error('删除任务时出现问题：', error);
    }
  }

  private async init() {
    await countTaskByProId(this.proId)
      .then(res => {
        if (res.data.code === 1) {
          this.taskData = res.data.data
          console.log('taskData =', this.taskData)
          this.counts = this.taskData.length
          this.updateDisplayedData();
        } else {
          this.$message.error('请求出错了：' + res.data.msg)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private handleSelectionChange(val: any) {
    let checkArr: any[] = []
    val.forEach((n: any) => {
      checkArr.push(n.taskId)
    })
    this.checkList = checkArr
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.updateDisplayedData();
  }

  private updateDisplayedData() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.taskData.slice(start, end);
  }

  private formatDateTime(val: string | number | Date) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 600px; /* 使用整个视窗高度 */
  margin: 0;
  padding: 0 20px 20px;
  background-color: #f5f5f5;
}

.task-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  height: 100%;
  flex-grow: 1; /* 使项目列表占满剩余的垂直空间 */

  .table-controls {
    margin-bottom: 20px;
    .btn {
      height: 40px;
      width: 72px;
      padding: 6px 12px;
      margin-right: 10px;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .table-content {
    flex-grow: 1;
    height: 100%;
    .tableBox {
      flex-flow: 1;
      width: 100%;
      border: 1px solid $gray-5;
      border-bottom: 0;
    }
  }

  .table-pagination {
    .pageList {
      text-align: center;
      margin: 10px 0 0;
    }
  }
}
</style>

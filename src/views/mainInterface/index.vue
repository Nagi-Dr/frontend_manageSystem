<template>
  <div class="main-interface">
    <aside class="sidetree">
      <h2>工作台</h2>
      <ul class="folder-list">
        <li>
          <el-button type="text" class="clickable-div" @click="handleAllClick">
            全部项目
          </el-button>
        </li>
        <li>
          <el-button type="text" class="clickable-div" @click="handleLongTimeClick">
            长期项目
          </el-button>
        </li>
        <li>
          <el-button type="text" class="clickable-div" @click="handleShortTimeClick">
            短期项目
          </el-button>
        </li>
      </ul>
    </aside>

    <div class="main-content">
      <div class="overview">
        <div class="overviewBox">
          <div class="buttom-container">
            <el-button class="btn keynote-style" @click="handleKeynoteClick">
              <span><strong>重点项目</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span><strong>{{ keynoteCount }}</strong></span>
            </el-button>
          </div>
          <div class="buttom-container">
            <el-button class="btn normal-style" @click="handleNormalClick">
              <span><strong>普通项目</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span><strong>{{ normalCount }}</strong></span>
            </el-button>
          </div>
          <div class="buttom-container">
            <el-button class="btn perform-style" @click="handlePerformClick">
              <span><strong>进行中项目</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span><strong>{{ performCount }}</strong></span>
            </el-button>
          </div>
          <div class="buttom-container">
            <el-button class="btn closed-style" @click="handleClosedClick">
              <span><strong>已关闭项目</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span><strong>{{ closedCount }}</strong></span>
            </el-button>
          </div>
        </div>
      </div>

      <section class="project-list">
        <div class="table-controls">
          <button class="btn" @click="addProject">
            新建
          </button>
          <button class="btn" @click="deleteProject">
            删除
          </button>
        </div>
        <div class="table-content">
          <el-table v-if="filteredTable.length"
                    :data="filteredTable"
                    stripe
                    class="tableBox"
                    @row-click="handleRowClick"
                    @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"
                             :min-width="50"
                             align="center"
            />
            <el-table-column prop="proId"
                             label="项目编号"
                             :min-wodth="70"
                             align="center"
            />
            <el-table-column prop="proProcess"
                             label="项目进度"
                             :min-width="150"
                             align="center"
            >
              <template slot-scope="scope">
                <el-progress :percentage="Math.round(scope.row.proProcess)" />
              </template>
            </el-table-column>
            <el-table-column prop="proName"
                             label="项目名称"
                             :min-width="220"
                             align="center"
            >
              <template slot-scope="scope">
                <span :style="{ color: scope.row.proLevel === 1 ? 'red' : 'inherit' }">
                  {{ scope.row.proName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="managerName"
                             label="负责人"
                             :min-width="80"
                             align="center"
            />
            <el-table-column prop="proState"
                             label="项目状态"
                             :min-width="80"
                             align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.proState === 0 ? '未开始' : (scope.row.proState === 1 ? '进行中' : '已关闭') }}
              </template>
            </el-table-column>
            <el-table-column prop="starttime"
                             label="开始时间"
                             :min-width="120"
                             align="center"
            >
              <template slot-scope="scope">
                {{ formatDateTime(scope.row.starttime) }}
              </template>
            </el-table-column>
            <el-table-column prop="finishtime"
                             label="截止时间"
                             :min-width="120"
                             align="center"
            >
              <template slot-scope="scope">
                {{ formatDateTime(scope.row.finishtime) }}
              </template>
            </el-table-column>
            <el-table-column prop="proDepartment"
                             label="责任部门"
                             :min-width="150"
                             align="center"
            />
          </el-table>
        </div>
        <div class="table-pagination">
          <el-pagination class="pageList"
                         :page-size="pageSize"
                         layout="total, prev, pager, next, jumper"
                         :total="counts"
                         @current-change="handleCurrentChange"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventBus } from '@/eventBus'
import {
  getAllProject,
  getKeynoteByProLevel,
  getNormalByProLevel,
  getPerformByProState,
  getClosedByProState,
  deleteSelectedProject
} from '@/api/project'

@Component({
  name: 'MainInterface',
  components: {},
})
export default class MainInterface extends Vue {
  private page: number = 1
  private pageSize: number = 10
  private keynoteCount: number = 0
  private normalCount: number = 0
  private performCount: number = 0
  private closedCount: number = 0
  private tableData: [] = []
  private filteredTable: any[] = []
  private counts: number = 0
  private checkList: string[] = []

  created() {
    this.init()
  }

  private async init() {
    await getAllProject({})
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.data
          console.log('tableDate', this.tableData)
          this.filteredTable = this.tableData
          this.counts = Number(res.data.data.length)
          this.updateDisplayedData()
          this.getKeynoteCount()
          this.getNormalCount()
          this.getPerformCount()
          this.getclosedCount()
        } else {
          this.$message.error('请求出错了：' + res.data.msg)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredTable = this.tableData.slice(start, end);
  }

  private formatDateTime(val: string|number|Date) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addProject() {
    this.$router.push({ path: '/project/add' })
  }

  private async deleteProject() {
    console.log('checkList =', this.checkList);
    if (this.checkList.length === 0) {
      return this.$message.error('请选择删除对象');
    }
    try {
      const deletePromises = this.checkList.map(proId =>
        deleteSelectedProject(Number(proId))
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(`ID为 ${proId} 的项目删除成功！`);
            } else {
              this.$message.error(`ID为 ${proId} 的项目删除失败`);
            }
          })
          .catch(err => {
            this.$message.error(`ID为 ${proId} 的项目删除出错：${err.message}`);
          })
      );
      await Promise.all(deletePromises);
      this.init();
      EventBus.$emit('updateDynamics')
    } catch (error) {
      console.error('删除项目时出现问题：', error);
    }
  }

  private handleSelectionChange(val: any) {
    let checkArr: any[] = []
    val.forEach((n: any) => {
      checkArr.push(n.proId)
    })
    this.checkList = checkArr
  }

  private async getKeynoteCount() {
    await getKeynoteByProLevel({})
      .then(res => {
        if (res.data.code === 1) {
          this.keynoteCount = Number(res.data.data)
          console.log('keynoteCount', this.keynoteCount)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private async getNormalCount() {
    await getNormalByProLevel({})
      .then(res => {
        if (res.data.code === 1) {
          this.normalCount = res.data.data
          console.log('normalCount', this.normalCount)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private async getPerformCount() {
    await getPerformByProState({})
      .then(res => {
        if (res.data.code === 1) {
          this.performCount = res.data.data
          console.log('performCount', this.performCount)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private async getclosedCount() {
    await getClosedByProState({})
      .then(res => {
        if (res.data.code === 1) {
          this.closedCount = res.data.data
          console.log('closedlCount', this.closedCount)
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  private handleAllClick() {
    this.page = 1;
    this.updateDisplayedData();
  }

  private handleLongTimeClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proType === 1;
    })
  }

  private handleShortTimeClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proType === 0;
    })
  }

  private handleRowClick(row: { proId: any }) {
    console.log('project Info =', row)
    console.log('project id =', row.proId)
    this.$store.commit('changeInfo', row)
    this.$router.push({
      path: '/projectNote',
      query: {proId: row.proId}
    })
  }

  private handleKeynoteClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proLevel === 1;
    })
  }

  private handleNormalClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proLevel === 0;
    })
  }

  private handlePerformClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proState === 1;
    })
  }

  private handleClosedClick() {
    this.filteredTable = this.tableData.filter((item: any) => {
      return item.proState === 2;
    })
  }
}
</script>

<style lang="scss" scoped>
.main-interface {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: 100%; /* 使用整个视窗高度 */
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.sidetree {
  height: 100%;
  width: 240px;
  padding: 30px 50px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* 保证侧边栏不被压缩 */
  .folder-list {
    list-style: none;
    padding: 0;
    li {
      padding: 10px 0;
      font-size: 20px;
      color: #333;
    }
    .clickable-div {
      width: 100%;
      text-align: left;
      font-size: 16px;
      font-weight: 500;
      color: #555;
      padding: 10px 0;
      border-radius: 8px;
      transition: background-color 0.3s;
    }
    .clickable-div:hover {
      // background-color: #e6f7ff;
      color: #409eff;
    }
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  height: 100%; /* 确保占据父容器的全部高度 */
  max-height: 100%;
  margin-left: 20px;
}

.overview {
  height: 140px;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  .overviewBox {
  display: flex;
  flex-direction: row;
  text-align: left;
  height: 120px;
    .buttom-container {
      flex-grow: 1;
      flex-shrink: 0;
      height: 100%;
      margin: 10px 15px;
      border-radius: 4px;
    }
    .btn {
      width: 290px;
      height: 100px;
      border-radius: 12px;
      font-size: 28px;
      color: #fff;
    }
    .btn:hover {
      color: #79b7f5
    }
    .keynote-style {
      background: #c04848;
    }
    .normal-style {
      background: #c77946;
    }
    .perform-style {
      background: #c670d1;
    }
    .closed-style {
      background: #74d374;
    }
  }
}

.project-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
    }
  }
}
</style>

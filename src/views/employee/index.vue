<template>
  <section class="container">
    <div class="tableBar">
      <el-button class="btn" type="primary" style="float: left" @click="handleAddEmployee">
        添加
      </el-button>
      <el-button class="btn" type="primary" style="float: left" @click="deleteMember()">
        删除
      </el-button>
    </div>
    <div class="table-content">
      <el-table v-if="promenData.length" :data="promenData" stripe class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         :min-width="50"
                         align="center"
        />
        <el-table-column :min-width="50" label="成员头像" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" class="avatar" alt="成员头像">
            <img v-else src="@/assets/TZY.png" class="avatar">
          </template>
        </el-table-column>
        <el-table-column prop="promenId" :min-width="100" label="成员Id" align="center" />
        <el-table-column prop="userName" :min-width="100" label="成员姓名" align="center" />
        <el-table-column prop="proId" :min-width="100" label="项目编号" align="center" />
        <el-table-column prop="promenPosi" :min-width="100" label="成员职位" align="center" />
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
    <AddEmployee :dialog-form-visible="dialogFormVisible"
                 @handle-close="handleAddEmployeeClose"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getEmployeeList, deleteEmployee, getProMenByProId } from '@/api/employee'
import { EventBus } from '@/eventBus';
import AddEmployee from './addEmployee.vue'

@Component({
  name: 'Employee',
   components: {
    AddEmployee
  },
})
export default class employee extends Vue {
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private tableData = []
  private id = ''
  private status = ''
  private checkList: any[] = []
  private searchId: number
  private promenData: any[]=[]
   private dialogFormVisible = false

   mounted() {
    this.searchId = this.$store.state.proInfo.proId
    this.init()
    document.addEventListener('click', this.handleClose)
    EventBus.$on('updateEmployeeData', this.init)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClose)
    EventBus.$off('updateEmployeeData', this.init)
  }

  private async init() {
    console.log('searchId1',this.searchId)
   await getProMenByProId(this.searchId)
    .then(res => {
        console.log('resdata',res.data)
        this.promenData = res.data.data
        console.log('promenData =', this.promenData)
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
  }

  // 添加
  private addEmployeeHandle() {
    this.$router.push({ path: '/employee/add' })
  }

   private handleSelectionChange(val: any) {
    let checkArr: any[] = []
    val.forEach((n: any) => {
      checkArr.push(n.promenId)
    })
    console.log('checkarr',checkArr)
    this.checkList = checkArr
    console.log(this.checkList)
  }

  private handleClose() { }

  //删除
  private async deleteMember() {
   console.log('checkList =', this.checkList);
    if (this.checkList.length === 0) {
      return this.$message.error('请选择删除对象');
    }
    try {
      const deletePromises = this.checkList.map(promenId =>
        deleteEmployee(promenId)
          .then(res => {
            console.log('delete',promenId)
            if (res.data.code === 1) {
              this.$message.success(`ID为 ${promenId} 的项目成员删除成功！`);
            } else {
              this.$message.error(`ID为 ${promenId} 的项目成员删除失败`);
            }
          })
          .catch(err => {
            this.$message.error(`ID为 ${promenId} 的项目成员删除出错：${err.message}`);
          })
      );
      await Promise.all(deletePromises);
      this.init();
      EventBus.$emit('updateDynamics')
    } catch (error) {
      console.error('删除项目时出现问题：', error);
    }
  }

   private handleAddEmployee() {
    console.log('handleAddEmployee is clicked')
    this.dialogFormVisible = true
  }

  private handleAddEmployeeClose() {
    this.dialogFormVisible = false
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.init()
  }

  private handleRowClick(row: { promenId: any }) {
    console.log('promen Info =', row)
    console.log('promen id =', row.promenId)
    this.$store.commit('changeInfo', row)
    this.$router.push({
      path: '/employee',
      query: {promenId: row.promenId}
    })
  }

}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;  /* 使容器充满视口高度 */
}

.table-content {
  flex: 1;  /* 使表格内容部分占据剩余空间 */
  border: 1px solid $gray-5;
  border-bottom: 0;
  background-color: #fff;
}

.table-pagination {
  display: flex;
  position: fixed; /* 固定在页面底部 */
  bottom: 20px;    /* 离底部的距离 */
  left: 42%;
}
.container{
  display: flex;
  flex-direction: column;
  height: 575px;
  background-color: #fff;
  flex-grow: 1;
  padding-bottom: 20px;
  margin: 0  20px 20px 20px;
}

.el-table{
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
}

.tableBox{
  flex-flow: 1;
  width: 100%;
      border: 1px solid $gray-5;
      border-bottom: 0;
}
.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.avatar-name {
  margin-top: 5px; /* 设置姓名和头像之间的间距 */
  font-size: 14px; /* 字体大小 */
  color: #333; /* 字体颜色 */
}

.btn {
      height: 40px;
      width: 72px;
      padding: 6px 12px;
      margin-right: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
      margin-left: 10px;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
</style>

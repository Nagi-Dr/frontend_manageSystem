<template>
  <div class="addBrand-container">
    <el-dialog
      :visible.sync="localDialogVisible"
      width="500px"
      class="info-container"
      @close="handleAddEmployeeClose()"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="false" label-width="160px"
               class="demo-ruleForm"
      >
        <el-form-item label="成员姓名:" prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入成员姓名" maxlength="20" />
        </el-form-item>
        <el-form-item label="项目ID:" prop="proId">
          <el-input v-model="ruleForm.proId" disabled placeholder="请输入项目ID" maxlength="20" />
        </el-form-item>
        <el-form-item label="成员职位:" prop="promenPosi">
          <el-select v-model="ruleForm.promenPosi" placeholder="请选择成员职位">
            <el-option label="服务工程师" :value="'服务工程师'" />
            <el-option label="安全工程师" :value="'安全工程师'" />
            <el-option label="环境工程师" :value="'环境工程师'" />
            <el-option label="代理商" :value="'代理商'" />
          </el-select>
        </el-form-item>
        <div class="subBox address">
          <el-button class="btn" @click="handleAddEmployeeClose()">
            取消
          </el-button>
          <el-button class="btn" type="primary" :class="{ continue: actionType === 'add' }" @click="submitNewMember">
            保存
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { addEmployee} from '@/api/employee'
import { EventBus } from '@/eventBus'

@Component({
  name: 'addEmployee',
})
export default class Employee extends Vue {
  @Prop() private dialogFormVisible!: any
  private actionType = ''
  private localDialogVisible: boolean = this.dialogFormVisible
  private ruleForm = {
    userName: '',
    proId: '',
    promenPosi: ''
  }

  get rules() {
    return {
      userName: [
        {
          required: true,
          trigger: 'blur'
        }
      ],
      proId: [
        {
          required: true,
          validator: (rule: any, value: number, callback: Function) => {
            if (!value) {
              callback(new Error('请输入项目编号'))
            }
          },
          trigger: 'blur'
        }
      ],
      promenPosi: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入项目成员职位'))
            }
          },
          trigger: 'blur'
        }
      ]
    }
  }

  created() {
    this.ruleForm.proId = this.$store.state.proInfo.proId
    this.submitNewMember();
  }

 @Watch('dialogFormVisible')
  onDialogFormVisibleChange(newVal: boolean) {
    this.localDialogVisible = newVal
  }

private handleAddEmployeeClose() {
    this.$emit('handle-close')
  }

async submitNewMember() {
    // 准备要提交的数据
    const memberData = {
    userName: this.ruleForm.userName,
    proId: this.ruleForm.proId,
    promenPosi: this.ruleForm.promenPosi
    };
    console.log(memberData)
    // 调用 API 接口进行项目创建
      await addEmployee(memberData)
      .then(response => {
        // 根据返回结果进行处理
        if (response.data.code === 1) {
          this.$message.success('团队成员创建成功！');
        }
      })
      .catch(error => {
        this.$message.error('请求出错：' + error.message);
      });
    this.$emit('handle-close')
    EventBus.$emit('updateEmployeeData')
  }
}

</script>

<style lang="scss" scoped>
.el-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.addBrand-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center; // 根据direction方向计算
  align-items: center;
  height: 100%; /* 使用整个视窗高度 */
  margin: 0;
  padding: 20px;
  background-color: #ffffff;
}

.subBox {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" label-width="180px" class="demo-ruleForm">
        <div>
          <el-form-item label="项目名称:" prop="proName">
            <el-input v-model="ruleForm.proName" placeholder="请填写项目名称" maxlength="14" />
          </el-form-item>
          <el-form-item label="项目分类:" prop="proType">
            <el-select v-model="ruleForm.proType" placeholder="请选择项目分类">
              <el-option label="长期项目" :value="1" />
              <el-option label="短期项目" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目等级:" prop="proLevel">
            <el-select v-model="ruleForm.proLevel" placeholder="请选择项目等级">
              <el-option label="重点项目" :value="1" />
              <el-option label="普通项目" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期:" prop="starttime">
            <el-input v-model="ruleForm.starttime" type="date" placeholder="请填写项目开始日期" />
          </el-form-item>
          <el-form-item label="截止日期:" prop="finishtime">
            <el-input v-model="ruleForm.finishtime" type="date" placeholder="请填写项目截止日期" />
          </el-form-item>
          <el-form-item label="责任部门:" prop="proDepartment">
            <el-select v-model="ruleForm.proDepartment" placeholder="请选择责任部门">
              <el-option label="软件开发团队" :value="'软件开发团队'" />
              <el-option label="审核部门" :value="'审核部门'" />
              <el-option label="维护部门" :value="'维护部门'" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责领导:" prop="managerName">
            <el-input v-model="ruleForm.managerName" placeholder="请填写项目负责人" />
          </el-form-item>
          <el-form-item label="客户姓名:" prop="clientName">
            <el-input v-model="ruleForm.clientName" placeholder="请填写客户姓名" />
          </el-form-item>
          <el-form-item label="客户电话:" prop="clientPhone">
            <el-input v-model="ruleForm.clientPhone" placeholder="请填写客户电话号码" />
          </el-form-item>
          <el-form-item label="上线日期:" prop="launchTime">
            <el-input v-model="ruleForm.launchTime" type="date" placeholder="请填写项目上线日期" />
          </el-form-item>
          <el-form-item label="验收日期:" prop="acceptTime">
            <el-input v-model="ruleForm.acceptTime" type="date" placeholder="请填写项目截止日期" />
          </el-form-item>
          <el-form-item label="驻场时间:" prop="sitService">
            <el-input v-model="ruleForm.sitService" placeholder="请填写驻场服务时间" />
          </el-form-item>
          <el-form-item label="维保期限:" prop="warranty">
            <el-input v-model="ruleForm.warranty" placeholder="请填写维保期限" />
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item label="项目简介:" prop="proDescription">
            <el-input v-model="ruleForm.proDescription" type="textarea" :rows="10" maxlength="200"
                      placeholder="项目描述,最长200字"
            />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="() => $router.back()">
              取消
            </el-button>
            <el-button type="primary" :class="{ continue: actionType === 'add' }" @click="submitNewProject">
              保存
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addProject, deleteSelectedProject } from '@/api/project'

@Component({
  name: 'addShop',
})
export default class Project extends Vue {
  private actionType: string = '';
  private ruleForm = {
    proName: '',
    proType: '',
    starttime: '',
    proLevel: '',
    finishtime: '',
    proDepartment: '',
    managerName: '',
    proPower: 0,
    proProcess: 0,
    proState: 0,
    clientName: '',
    clientPhone: '',
    proDescription: '',
    launchTime: '',
    acceptTime: '',
    sitService: '',
    warranty: ''
  };

  private formatDateTime(val: string|number|Date) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get rules() {
    return {
      proName: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入项目名称'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
            if (!reg.test(value)) {
              callback(new Error('项目名称输入不符，请输入2-20个字符'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
      proType: {
        required: true,
        message: '请选择项目分类',
        trigger: 'change',
        type: 'number'
      },
      proLevel: {
        required: true,
        message: '请选择项目等级',
        trigger: 'change',
        type: 'number'
      },
      starttime: {
        required: true,
        validator: (rules: any, value: string, callback: Function) => {
          if (!value) callback(new Error('请输入开始日期'));
          else callback();
        },
        trigger: 'blur'
      },
      finishtime: {
        required: true,
        validator: (rules: any, value: string, callback: Function) => {
          if (!value) callback(new Error('请输入结束日期'));
          else callback();
        },
        trigger: 'blur'
      },
      proDepartment: {
        required: true,
        message: '请选择项目责任部门',
        trigger: 'change'
      },
      managerName: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('项目负责人不能为空，请输入2-20个字符'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
            if (!reg.test(value)) {
              callback(new Error('项目负责人格式不符，请输入2-20个字符，仅支持字母、数字或汉字'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
      // proPower: {
      //   required: true,
      //   message: '请选择项目权限',
      //   trigger: 'change',
      //   type: 'number'
      // },
      // proProcess: {
      //   required: true,
      //   message: '请输入项目进度',
      //   trigger: 'blur'
      // },
      // proState: {
      //   required: true,
      //   message: '请输入项目状态',
      //   trigger: 'blur',
      //   type: 'number'
      // },
      clientName: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入客户姓名'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
            if (!reg.test(value)) {
              callback(new Error('客户姓名输入不符，请输入2-20个字符'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
      clientPhone: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          const reg = /^1[3-9]\d{9}$/;
          if (!value) {
            callback(new Error('请输入客户电话号码'));
          } else if (!reg.test(value)) {
            callback(new Error('电话号码格式不正确'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      },
      proDescription: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入项目简介，不超过200字'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,200}$/;
            if (!reg.test(value)) {
              callback(new Error('项目简介输入不符，请输入2-200个字符'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
       launchTime: {
        required: true,
        validator: (rules: any, value: string, callback: Function) => {
          if (!value) callback(new Error('请输入上线时间'));
          else callback();
        },
        trigger: 'blur'
      },
      acceptTime: {
        required: true,
        validator: (rules: any, value: string, callback: Function) => {
          if (!value) callback(new Error('请输入验收时间'));
          else callback();
        },
        trigger: 'blur'
      },
      sitService: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入驻场服务时间'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
            if (!reg.test(value)) {
              callback(new Error('驻场服务时间输入不符，请输入2-20个字符'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
      warranty: {
        required: true,
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入维保期'));
          } else {
            const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,20}$/;
            if (!reg.test(value)) {
              callback(new Error('维保期输入不符，请输入2-20个字符'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      },
    };
  }

async submitNewProject() {
  const projectData = { ...this.ruleForm };
  console.log(projectData);
  try {
    projectData.starttime = this.formatDateTime(projectData.starttime);
    projectData.finishtime = this.formatDateTime(projectData.finishtime);
    projectData.launchTime = this.formatDateTime(projectData.launchTime);
    projectData.acceptTime = this.formatDateTime(projectData.acceptTime);
    const response = await addProject(projectData);
    if (response.data.code === 1) { // 修正后的代码
      this.$message.success('项目创建成功！');
      this.$router.push({
        path: '/mainInterface',
      })
    } else {
      this.$message.error('项目创建失败');
    }
  } catch (error) { // 移除类型注解
    this.$message.error('请求出错：' + (error.message || '未知错误'));
  }
}
}
</script>

<style>
.avatar-uploader .el-icon-plus:after {
  position: absolute;
  display: inline-block;
  content: ' ' !important;
  left: calc(50% - 20px);
  top: calc(50% - 40px);
  width: 40px;
  height: 40px;
  background: url('./../../assets/icons/icon_upload@2x.png') center center no-repeat;
  background-size: 20px;
}
</style>
<style lang="scss">
.addBrand-container {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #ffc200;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 160px;
    display: block;
  }

  .el-input {
    width: 200px;
  }

  .address {
    .el-form-item__content {
      width: 980px;
    }
  }

  .el-input__prefix {
    top: 2px;
  }

  .addProject {
    .el-input {
      width: 130px;
    }

    .el-input-number__increase {
      border-left: solid 1px #fbe396;
      background: #fffbf0;
    }

    .el-input-number__decrease {
      border-right: solid 1px #fbe396;
      background: #fffbf0;
    }

    input {
      border: 1px solid #fbe396;
    }

    .table {
      border: solid 1px #ebeef5;
      border-radius: 3px;

      th {
        padding: 5px 0;
      }

      td {
        padding: 7px 0;
      }
    }
  }

  .addDishList {
    .seachDish {
      position: absolute;
      top: 12px;
      right: 20px;
    }

    .el-dialog__footer {
      padding-top: 27px;
    }

    .el-dialog__body {
      padding: 0;
      border-bottom: solid 1px #efefef;
    }

    .seachDish {
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 5px;
    height: 835px;
    place-items: center;
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 110px 20px 20px 20px;
      border-radius: 4px;
      height: 100%;

      .subBox {
        padding-top: px;
        text-align: center;
        border-top: solid 1px $gray-5;
        border: none;
        place-items: center;
      }

      .el-input {
        width: 200px;
      }

      .addDish {
        width: 777px;

        .addBut {
          background: #ffc200;
          display: inline-block;
          padding: 0px 20px;
          border-radius: 3px;
          line-height: 40px;
          cursor: pointer;
          border-radius: 4px;
          color: #333333;
          font-weight: 500;
          position: absolute;
          /* 绝对定位 */
          bottom: 10px;
          left: 100px;
        }

        .content {
          background: #fafafb;
          padding: 20px;
          border: solid 1px #d8dde3;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

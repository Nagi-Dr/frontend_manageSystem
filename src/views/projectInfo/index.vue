<template>
  <!-- 项目信息详细 -->
  <div class="project-details">
    <el-divider content-position="left">
      <span style="color: #409EFF; font-weight: bold; font-size: 18px;">项目信息</span>
    </el-divider>
    <table class="info-table">
      <tbody>
        <tr>
          <th>项目全称：</th>
          <td>{{ projectDetails.proName }}</td>
          <th>甲方负责人：</th>
          <td>{{ projectDetails.clientName }}</td>
          <th>甲方联系方式：</th>
          <td>{{ projectDetails.clientPhone }}</td>
        </tr>
        <tr>
          <th>上线日期：</th>
          <td>{{ formatDate(projectDetails.launchTime) }}</td>
          <th>验收日期：</th>
          <td>{{ formatDate(projectDetails.acceptTime) }}</td>
          <th>项目等级：</th>
          <td>{{ formatproLevel(projectDetails.proLevel) }}</td>
        </tr>
        <tr>
          <th>项目权限：</th>
          <td>{{ formatProjectPower(projectDetails.proPower) }}</td>
          <th>项目进度：</th>
          <td>{{ formatProgress(projectDetails.proProcess) }}</td>
          <th>维保期：</th>
          <td>{{ projectDetails.warranty }}</td>
        </tr>
        <tr>
          <th>驻场服务：</th>
          <td>{{ projectDetails.sitService }}</td>
          <td colspan="2" /> <!-- 占位，保持表格结构 -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { getProjectInfo } from '@/api/project';

@Component
export default class ProjectDetails extends Vue {
  projectDetails = {
    proName: '',
    clientName: '',
    clientPhone: '',
    launchTime: '',
    acceptTime: '',
    proLevel: '',
    proPower: '',
    proProcess: '',
    proState: '',
    warranty: '',
    sitService: '',
  };

  created() {
    this.fetchProjectDetails();
  }

  async fetchProjectDetails() {
    try {
      const response = await getProjectInfo(this.$store.state.proInfo.proId);
      if (response.data.code === 1) {
        this.projectDetails = response.data.data;
        this.projectDetails.launchTime = new Date(this.projectDetails.launchTime);
        this.projectDetails.acceptTime = new Date(this.projectDetails.acceptTime);
      } else {
        this.$message.error('获取项目详情失败');
      }
    } catch (error) {
      this.$message.error('请求出错了：' + error.message);
    }
  }

  formatDate(date) {
    if (!date) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
  }

  // 格式化项目进度
  formatProgress(progress) {
    if (progress === undefined || progress === null) return '未定义';
    return `${progress}%`; // 添加百分号
  }

  // 格式化项目权限
  formatProjectPower(power) {
    return power === 1 ? '私有项目' : '公开项目'; // 根据值返回相应的字符串
  }
  formatproLevel(level) {
    return level === 1 ? '重点项目' : '普通项目'; // 根据值返回相应的字符串
  }
}
</script>

<style scoped>
.project-details {
  margin: 12px 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.info-table th,
.info-table td {
  padding: 10px 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.info-table th {
  width: 9%;
  background-color: #e3f2fd;
  color: #1565c0;
  font-size: 14px;
}

.info-table td {
  width: 9%;
  text-align: center;
  padding: 10px 15px;
  background-color: white;
  color: #555;
}

.info-table td:hover {
  background-color: #f5f5f5;
}
</style>

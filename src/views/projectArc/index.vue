<template>
  <div class="page-layout">
    <!-- 左侧菜单栏 -->
    <!-- 右侧内容部分 -->
    <div class="main-content">
      <el-divider content-position="left">
        <span style="color: #409EFF; font-weight: bold; font-size: 18px;">升级记录</span>
      </el-divider>
      <table class="upgrade-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>升级后版本</th>
            <th>升级内容</th>
            <th>升级开始时间</th>
            <th>升级结束时间</th>
            <th>发起人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(upgradeRecord, index) in upgradeRecords" :key="index">
            <td>{{ upgradeRecord.archiveTitle }}</td>
            <td>{{ upgradeRecord.archiveVersion }}</td>
            <td>{{ upgradeRecord.archiveContent }}</td>
            <td>{{ upgradeRecord.archiveStarttime }}</td>
            <td>{{ upgradeRecord.archiveEndtime }}</td>
            <td>{{ upgradeRecord.archivePromoter }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getArchive } from '@/api/project';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue{
  upgradeRecords = [];// 初始化为空数组
  proId = 0;

  created() {
    this.proId = Number(this.$store.state.proInfo.proId)
    console.log('proId =', this.proId)
      this.fetchUpgradeRecords(); // 调用方法加载数据
      console.log('upgradeRecords', this.upgradeRecords);
  }
    async fetchUpgradeRecords() {
      // try {
      //   console.log('2345-', this.proId);
        const response = await getArchive(this.proId);
        // 假设接口返回的数据结构为 { data: [...] }
      // if (response.data.code === 1) {
       this.upgradeRecords = response.data.data;
    }
}
</script>

<style scoped>
/* 页面布局 */
.page-layout {
  display: flex;
  height: 100vh;
  background-color: #f4f6f8; /* 更柔和的背景色 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 左侧菜单栏 */
.sidebar {
  width: 240px; /* 稍加宽 */
  background-color: #ffffff; /* 纯白背景 */
  padding: 30px 20px;
  border-right: 1px solid #e5e5e5;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 14px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #4a4a4a;
  transition: background-color 0.3s, color 0.3s; /* 添加颜色过渡 */
}

.sidebar li:hover {
  background-color: #e6f7ff; /* 鼠标悬停变浅蓝 */
  color: #1e88e5;
}

.sidebar .active {
  font-weight: bold;
  background-color: #c8e6c9; /* 活跃项的背景颜色 */
  border-radius: 6px;
  color: #388e3c;
}

/* 右侧内容区 */
.main-content {
  flex-grow: 1;
  padding: 40px 30px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 右侧内容增加阴影 */
  border-radius: 8px; /* 添加圆角 */
  margin: 20px; /* 增加内边距 */
}

/* 表格样式 */
.upgrade-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 柔和的表格阴影 */
  border-radius: 8px;
  overflow: hidden; /* 圆角 */
}

.upgrade-table th,
.upgrade-table td {
  border: 1px solid #e0e0e0;
  padding: 14px;
  text-align: center;
  color: #555;
}

.upgrade-table th {
  background-color: #f7f8fa;
  font-weight: bold;
  color: #333;
}

.upgrade-table tr:nth-child(even) {
  background-color: #fcfcfc;
}

.upgrade-table td:hover {
  background-color: #f5f5f5; /* 鼠标悬停行背景 */
}

/* 表格标题栏 */
.upgrade-table th {
  background-color: #e3f2fd; /* 轻微蓝色 */
  color: #1565c0;
  font-weight: 600;
}

.upgrade-table tr {
  transition: background-color 0.3s; /* 行背景渐变效果 */
}
</style>

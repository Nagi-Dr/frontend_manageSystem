<template>
  <div class="dynamic-list">
    <div style="text-align: center">
      <h2>动态</h2>
    </div>
    <div class="timeline">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in displayedData" :key="index">
          <p>{{ item.userName }} {{ item.action }} 【{{ item.proName }}】</p>
          <span>{{ formatDateTime(item.createTime) }}</span>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :pager-count="pagerCount"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { getDynamics } from '@/api/project' // 导入API请求
import { EventBus } from '@/eventBus'

export default {
  data() {
    return {
      total: 0,
      pageSize: 7, // 每页显示条目数
      pagerCount: 5,
      currentPage: 1,
      allData: [], // 所有数据
      displayedData: [], // 当前页显示的数据
    };
  },

  created() {
    this.fetchData();
  },

  mounted() {
    EventBus.$on('updateDynamics', this.fetchData)
  },

  beforeDestroy() {
    EventBus.$off('updateDynamics', this.fetchData)
  },

  methods: {
    async fetchData() {
      await getDynamics({})
      .then(res => {
        if (res.data.code === 1) {
          this.allData = res.data.data;
          this.total = this.allData.length;
          this.updateDisplayedData();
        }
      })
      .catch(err => {
        this.$message.error('请求出错了：' + err.message)
      })
    },

    updateDisplayedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedData = this.allData.slice(start, end);
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.updateDisplayedData();
    },

    formatDateTime(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
};
</script>

<style scoped>
.dynamic-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline {
  flex-grow: 1;
  margin-left: -40px;
}

.pagination {
  margin-bottom: 10px;
  text-align: center;
}
</style>

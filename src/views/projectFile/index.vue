<template>
  <div class="main-content">
    <section class="project-file">
      <div class="table-controls">
        <button class="btn" @click="deleteDocument">
          删除
        </button>
      </div>
      <div class="table-content">
        <el-table v-if="pagedData.length"
                  :data="pagedData"
                  stripe
                  class="tableBox"
                  @row-click="handleRowClick"
                  @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"
                           :min-width="50"
                           align="center"
          />
          <el-table-column prop="docName"
                           label="文档名称"
                           :min-width="500"
                           align="center"
          />
          <el-table-column prop="docUptime"
                           label="上传时间"
                           :min-width="200"
                           align="center"
          >
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.docUptime) }}
            </template>
          </el-table-column>
          <el-table-column prop="upUser"
                           label="上传人"
                           :min-width="100"
                           align="center"
          />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getDocumentByProId,
  deleteSelectedDocument,
  downloadDocument
} from '@/api/document'

@Component({
  name: 'ProjectFile'
})

export default class extends Vue {
  private page: number = 1
  private pageSize: number = 8
  private docData: [] = []
  private pagedData: any[] = []
  private checkList: string[] = []
  private proId: Number = 0
  private counts: Number = 0

  created() {
    this.proId = this.$store.state.proInfo.proId
    this.init()
  }

  private async init() {
    await getDocumentByProId(this.proId)
    .then(res => {
      if (res.data.code === 1) {
        this.docData = res.data.data
        console.log('docData =', this.docData)
        this.counts = this.docData.length
        this.updateDisplayedData()
      }
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
  }

  private async deleteDocument () {
    console.log('checkList =', this.checkList);
    if (this.checkList.length === 0) {
      return this.$message.error('请选择删除对象');
    }
    try {
      const deletePromises = this.checkList.map(docId =>
        deleteSelectedDocument(Number(docId))
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success(`ID为 ${docId} 的文档删除成功！`);
            } else {
              this.$message.error(`ID为 ${docId} 的文档删除失败`);
            }
          })
          .catch(err => {
            this.$message.error(`ID为 ${docId} 的文档删除出错：${err.message}`);
          })
      );
      await Promise.all(deletePromises);
      this.init();
    } catch (error) {
      console.error('删除文档时出现问题：', error);
    }
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.docData.slice(start, end);
    console.log('pagedData =', this.pagedData)
  }

  private formatDateTime(val: string|number|Date) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private handleSelectionChange(val: any) {
    let checkArr: any[] = []
    val.forEach((n: any) => {
      checkArr.push(n.docId)
    })
    this.checkList = checkArr
  }

  private async handleRowClick(row: any) {
    const url = row.docUrl;
    if (!url) {
      return this.$message.error('文档URL不存在');
    }
    await downloadDocument({
      objectName: url,
      pathName: 'D:\\ZZZ\\' + row.docName
    })
    .then(res => {
      if (res.data.code === 1) {
        this.$message.success('文档下载成功！');
      }
    })
    .catch(err => {
      this.$message.error('请求出错了：' + err.message)
    })
    // 使用window.open方式下载
    // window.open(url, '_blank');
    // 或者可以使用<a>标签下载
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%; /* 使用整个视窗高度 */
  margin: 0;
  padding: 0 20px 20px;
  background-color: #f5f5f5;
}

.project-file {
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

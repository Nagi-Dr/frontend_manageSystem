<template>
  <!-- 任务描述：显示任务的描述内容，并提供一个回退按钮返回上一个页面。
任务进度：显示多个分期的进度，并且每个分期可以展示不同阶段的状态，包括每个阶段的时间、环节名称以及上传的文件。 -->
  <div class="container">
    <!-- 左侧部分 -->
    <div class="left-section">
      <div class="header">
        <button class="back-btn" @click="goBack">
          返回
        </button>
      </div>
      <div class="outer-description-box">
        <!-- 任务描述框 -->
        <div class="description-box">
          <h2 class="title">
            任务描述
          </h2>
          <div class="task-description">
            {{ taskDescription }}
          </div> <!-- 独立的任务描述展示栏 -->
        </div>
      </div>
      <!-- 任务进度框 -->
      <div class="task-progress">
        <div class="task-header">
          <h3>任务进度</h3>
          <button class="add-phase-btn" @click="showAddPhaseDialog">
            添加分期
          </button>
        </div>
        <div v-for="(phase, index) in phases" :key="index" class="phase">
          <!-- 分期信息展示 -->
          <div class="phase-header">
            <h4>
              <span class="phase-title">{{ phase.title }}</span>
            </h4>
          </div>
          <!-- 圆圈进度展示 -->
          <div class="progress-bar">
            <div class="progress-stages">
              <div v-for="(stage, idx) in phase.stages" :key="idx" class="circle-container">
                <div class="circle-title">
                  {{ stage.linkName }}
                </div>
                <div
                  class="circle"
                  :class="{
                    active: idx <= phase.currentStage,
                    completed: stage.linkState === 1
                  }"
                  @click="showEditSubPhaseDialog(phase, idx)"
                />
                <div class="circle-date">
                  {{ stage.linkTime }}
                </div>
              </div>
            </div>
            <div class="date">
              {{ phase.date }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加分期的弹窗 -->
    <div v-if="showDialog" class="modal">
      <div class="modal-content">
        <h4>添加分期</h4>
        <input v-model="newPhase.title" placeholder="分期名称" class="modal-input">
        <button class="modal-btn primary" @click="addPhase">
          确认添加
        </button>
        <button class="modal-btn cancel" @click="closeDialog">
          取消
        </button>
      </div>
    </div>

    <!-- 编辑子环节的弹窗 -->
    <div v-if="showEditDialog" class="modal">
      <div class="modal-content">
        <h4>编辑子环节</h4>
        <!-- <input v-model="editSubPhaseTitle" placeholder="子环节名称" class="modal-input" /> -->
        <input v-model="editSubPhaseDate" type="date" class="modal-input">
        <textarea v-model="editSubPhaseFeedback" placeholder="环节反馈" class="modal-input" rows="4" />
        <input type="file" class="modal-input" @change="onFileChange">
        <button class="modal-btn primary" @click="saveSubPhase">
          完成
        </button>
        <button class="modal-btn cancel" @click="closeEditDialog">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getLink,addLink,upLoad,savePhase,getTaskdes,getUrl} from '@/api/link';
export default {
  data() {
    return {
      phases: [],
      taskDescription: '',
      showDialog: false,
      showEditDialog: false,
      newPhase: { title: '' },
      currentPhase: null,
      currentStageIdx: null, // 用来记录当前正在编辑的阶段索引
      editSubPhaseTitle: '',
      editSubPhaseDate: '',
      editSubPhaseFeedback: '',
      selectedFile: null,
      proId: 0,
      taskId: 0,
      upUser: '',
      isLoading:false,
    };
  },
  computed: {
    // 分组计算属性，每三个 phases 一组
    groupedPhases() {
      const grouped = [];
      for (let i = 0; i < this.phases.length; i += 3) {
        grouped.push(this.phases.slice(i, i + 3));
      }
      return grouped;
    }
  },
  created() {
    this.proId = this.$store.state.proInfo.proId
    this.upUser = this.$store.state.proInfo.managerName
    console.log('upUser =', this.upUser);
  },
  mounted() {
    const routeId = this.$route.query.taskId
    this.taskId = typeof routeId === 'string' ? Number(routeId) : (Array.isArray(routeId) ? Number(routeId[0]) : routeId)
    console.log('taskId =', this.taskId);
    this.fetchProjectInfo(); // 页面创建时获取项目信息
  },
  methods: {
    // 获取项目信息并展示
    goBack() {
      this.$router.push({
        path: '/projectNote',
      })
    },

    async fetchProjectInfo() {
      try {
        const response = await getLink(this.taskId); // 请求后端接口
        const fetchedPhases = response.data.data;
        console.log('fetchedPhases =', fetchedPhases);
       for (let i = 0; i < fetchedPhases.length; i += 3) {
          const newPhaseData = {
            title:fetchedPhases[i].phaseName,
            stages: fetchedPhases.slice(i, i + 3).map((phaseData) => ({
              linkId: phaseData.linkId,
              linkName: phaseData.linkName,
              linkState: phaseData.linkState,
              linkReact: '',
              linkTime: new Date(phaseData.linkTime).toLocaleDateString(),
              taskId: phaseData.taskId,
              file: null
            })),
            currentStage: -1, // 初始化当前阶段为 -1，表示未完成
          };
          this.phases.push(newPhaseData);
        }
        const descriptionResponse = await getTaskdes(this.taskId);
        const descriptionData = descriptionResponse.data.data;
        this.taskDescription = descriptionData.taskDescription;
      } catch (error) {
        console.error('获取项目信息失败:', error);
      }
    },

    // 显示添加分期弹窗
    showAddPhaseDialog() {
      this.showDialog = true;
      this.newPhase = {
        title: '',
        taskId: this.taskId,
        phaseName: ''
      };
    },
    closeDialog() {
      this.showDialog = false;
    },

    // 添加分期
    async addPhase() {
      if (this.newPhase.title) {
        const newPhaseData = {
          title: this.newPhase.title,
          taskId: this.taskId,
          phaseName: this.newPhase.title,
          stages: [],
          currentStage: -1,
          date: new Date().toLocaleDateString(),
        };

        try {
          await savePhase(newPhaseData); // 调用后端接口保存新阶段
          this.closeDialog(); // 关闭添加分期的弹窗
          window.location.reload();
          // 添加分期后重新获取项目数据
        } catch (error) {
          console.error('添加分期失败:', error);
        }
      } else {
        alert('请填写环节名称');
      }
    },

    // 显示编辑子环节弹窗
    showEditSubPhaseDialog(phase, stageIdx) {
      this.currentPhase = phase;
      this.currentStageIdx = stageIdx; // 记录当前阶段索引
      const currentStage = phase.stages[stageIdx];
      this.editSubPhaseTitle = currentStage.linkName;
      this.editSubPhaseDate = currentStage.linkTime;
      this.editSubPhaseFeedback = currentStage.feedback || '';
      this.selectedFile = currentStage.file || null;
      this.showEditDialog = true;
    },
    // 文件上传
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    // 保存子环节
    async saveSubPhase() {
      if (this.editSubPhaseTitle && this.editSubPhaseDate) {
        const currentStage = this.currentPhase.stages[this.currentStageIdx];
        // 更新当前阶段的内容
        currentStage.linkName = this.editSubPhaseTitle;
        currentStage.linkTime = this.editSubPhaseDate;
        currentStage.linkReact = this.editSubPhaseFeedback;
        try {
           if (this.selectedFile) {
            const formData = new FormData();
            formData.append('file', this.selectedFile); // 将文件添加到 FormData 对象中
            const response = await upLoad(formData); // 上传文件到后端
            const filePath = response.data.data; // 获取后端返回的文件路径
            console.log('filePath =', filePath);
            currentStage.file = filePath; // 将文件路径保存到当前阶段的文件属性中
              currentStage.linkState = 1;
              console.log('currentStage.linkState =', currentStage.linkId);
             await getUrl({
          docName: this.selectedFile.name,// 使用文件的原始名称作为文档名
          docUrl: filePath,// 文件路径
          proId: this.proId,// 项目编号，假设 taskId 对应 proId
          docUptime: new Date(), // 上传时间，使用当前时间
          linkId: currentStage.linkId,// 环节编号
          upUser: this.upUser,//
        });
          }
           await addLink(currentStage); // 调用API更新阶段数据
          this.closeEditDialog(); // 关闭编辑对话框
          this.$set(this.phases, this.phases.indexOf(this.currentPhase), { ...this.currentPhase });
        } catch (error) {
           this.$message.error('请输入时间');
        }
      } else {
         this.$message.error('请输入时间');
      }
    },
    closeEditDialog() {
      this.showEditDialog = false;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  font-family: 'Arial', sans-serif;
  background: #f8f9fb;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.left-section {
  flex: 2;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.outer-description-box {
  background-color: white; /* 外框的背景颜色 */
  padding: 20px; /* 外框的内边距 */
  border-radius: 10px; /* 外框的圆角 */
  margin-bottom: 20px; /* 与其他部分的间距 */
  border: 1px solid #ccc; /* 边框颜色和样式 */
}

.description-box {
  display: block; /* 使内容占满父元素宽度 */
}

.title {
  font-size: 20px; /* 标题字体大小 */
  font-weight: bold;
  background-color: #ffffff; /* 标题背景保持白色 */
  padding: 10px;
  border-radius: 8px 8px 0 0; /* 仅上边角圆弧 */
  display: inline-block; /* 使描述框宽度自适应内容 */
}

.task-description {
  background-color:#ffffff; /* 更淡的背景色 */
  border-radius: 5px; /* 圆角 */
  padding: 15px; /* 内边距 */
  max-width: 100%; /* 限制最大宽度 */
  word-wrap: break-word; /* 允许文本换行 */
  overflow-wrap: break-word; /* 支持不同浏览器的换行处理 */
}
.task-progress {
  margin-top: 20px;
  border-radius: 5px;
  background-color: white;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-phase-btn,
.edit-sub-phase-btn {
   background-color: #007bff; /* 纯蓝色背景 */
  color: white;
  border: none;
  border-radius: 25px; /* 圆角 */
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease; /* 平滑过渡效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  text-transform: uppercase; /* 大写字母 */
}

.add-phase-btn:hover,
.edit-sub-phase-btn:hover {
  background-color: #0056b3; /* 悬停时更深的蓝色 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
  transform: translateY(-2px); /* 鼠标悬停时轻微抬升 */
}

.add-phase-btn:active,
.edit-sub-phase-btn:active {
  transform: translateY(0); /* 点击时恢复原位 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 恢复点击时的阴影 */
}

.add-phase-btn {
  margin-top: 15px; /* 添加分期按钮上方的间距 */
}

.edit-sub-phase-btn {
  background: linear-gradient(145deg, #28a745, #218838); /* 编辑子环节按钮绿色渐变 */
}

.edit-sub-phase-btn:hover {
  background: linear-gradient(145deg, #218838, #1c7430); /* 悬停时的绿色渐变 */
}

.phase {
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phase-title {
  font-size: 16px;
  color: #007bff;
}

.progress-bar {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.progress-stages {
  display: flex;
  justify-content: space-between;
}

.circle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-title {
  font-size: 12px;
  color: #495057;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.circle.active {
  background-color: #007bff;
  border-color: #0056b3;
}

.circle.completed {
  background-color: #28a745;
  border-color: #218838;
}

.circle-date {
  font-size: 12px;
  color: #6c757d;
}

.date {
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  margin-top: 5px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
}

.modal-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.modal-btn {
  width: 48%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 为按钮容器设置 flexbox */
.modal-btn-container {
  display: flex;
  justify-content: center; /* 水平居中对齐按钮 */
  gap: 20px; /* 增加按钮之间的间距 */
  margin-top: 20px; /* 给按钮容器增加一些上边距 */
}

/* 完成按钮 */
.modal-btn.primary {
  background-color: #007bff; /* 纯蓝色 */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.modal-btn.primary:hover {
  background-color: #0056b3; /* 悬停时更深的蓝色 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.modal-btn.primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 取消按钮 */
.modal-btn.cancel {
  background-color: #dc3545; /* 纯红色 */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.modal-btn.cancel:hover {
  background-color: #c82333; /* 悬停时更深的红色 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.modal-btn.cancel:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 确认添加按钮 */
.modal-btn.primary-add {
  background-color: #28a745; /* 纯绿色 */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.modal-btn.primary-add:hover {
  background-color: #218838; /* 悬停时更深的绿色 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.modal-btn.primary-add:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 取消按钮（确认删除）*/
.modal-btn.cancel-delete {
  background-color: #f0ad4e; /* 纯橙色 */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
}

.modal-btn.cancel-delete:hover {
  background-color: #ec971f; /* 悬停时更深的橙色 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.modal-btn.cancel-delete:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  position: relative; /* 为了让绝对定位的元素相对于这个父元素 */
  margin-bottom: 20px; /* 与其他内容的间距 */
}

.back-btn {
  position: absolute;
  top: 10px; /* 距离顶部的距离 */
  right: 10px; /* 距离右侧的距离 */
  background-color: #f8f9fb;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #007bff;
  color: white;
}
</style>

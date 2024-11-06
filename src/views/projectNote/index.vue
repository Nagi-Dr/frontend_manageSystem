<template>
  <section class="project-note">
    <div class="note-container">
      <p>
        {{ proNote }}
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getProjectInfo } from '@/api/project'

@Component({
  name: 'ProjectNote'
})

export default class extends Vue {
  private searchId: Number
  private proNote: string = ''

  mounted() {
      // const routeId = this.$route.query.proId
      // this.searchId = typeof routeId === 'string' ? Number(routeId) : (Array.isArray(routeId) ? Number(routeId[0]) : routeId)
      // console.log('searchId =', this.searchId)
      this.searchId = this.$store.state.proInfo.proId
      this.getCurProject()
  }

  private async getCurProject() {
      await getProjectInfo(this.searchId)
      .then(res => {
          if (res.data.code === 1) {
              console.log('res.data.data =', res.data.data)
              this.proNote = res.data.data.proDescription
          }
      })
      .catch(err => {
          this.$message.error('请求出错了：' + err.message)
      })
  }
}
</script>

<style lang="scss" scoped>
.project-note {
  height: 100%; /* 适应父容器 */
  margin: 0px;
  padding: 0 20px 20px 20px;
  background: #f5f5f5;
}
.note-container {
  height: 100%;
  padding: 20px;
  background: #fff;
  font-size: 16px;
  text-indent: 2em;
  line-height: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>

<template>
  <div class="layout-container">
    <navbar class="navbar-container" />
    <div class="main-container">
      <sidebar v-if="isSidebarVisible" class="sidebar-container" />
      <div class="content-container">
        <detailbar v-if="isDetailbarVisible" class="detailbar-container" />
        <app-main class="app-main-container" />
      </div>
      <eventbar v-if="isEventbarVisible" class="eventbar-container" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { AppMain, Navbar, Sidebar, Eventbar, Detailbar } from './components'
import Vue from 'vue'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    Eventbar,
    Detailbar,
  },
})
export default class Layout extends Vue {
  get isDetailbarVisible() {
    return this.$route.meta.showDetailbar || false
  }
  get isSidebarVisible() {
    return this.$route.meta.showSidebar || false
  }
  get isEventbarVisible() {
    return this.$route.meta.showEventbar || false
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 1366px;
  background: #f5f5f5;
  overflow: hidden;
}

.navbar-container {
  height: 60px;
  width: 100%;
  background: rgb(123, 205, 249);
  flex-shrink: 0;
}

.main-container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow: hidden;
}

.sidebar-container {
  width: 240px;
  background: #f5f5f5;
  // transition: width 0.28s;
  margin: 20px 0 20px 20px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 5px;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.detailbar-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #fff;
  margin: 20px;
  height: 240px;
  flex-shrink: 0;
  border-radius: 5px;
}

.app-main-container {
  flex-grow: 1;
  position: relative; /* 确保内部元素相对于此容器定位 */
  background: #f5f5f5;
}

.eventbar-container {
  width: 270px;
  flex-shrink: 0;
  overflow: hidden;
  background: #fff;
  margin: 20px 20px 20px 0;
  border-radius: 5px;
}
</style>

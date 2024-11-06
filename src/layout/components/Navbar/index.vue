<template>
  <div class="navbar">
    <div class="titleHead">
      <strong>项目管理</strong>
    </div>
    <div class="right-menu">
      <div class="avatar-wrapper">
        <div :class="shopShow ? 'userInfo' : ''" @mouseenter="toggleShow" @mouseleave="mouseLeaves">
          <el-button type="primary" :class="shopShow ? 'active' : 'nonactive'">
            {{ name }}<i class="el-icon-arrow-down" />
          </el-button>
          <div v-if="shopShow" class="userList">
            <!-- <p class="amendPwdIcon" @click="handlePwd">
              修改密码<i />
            </p> -->
            <p class="outLogin" @click="logout">
              退出登录<i />
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <Password :dialog-form-visible="dialogFormVisible"
              @handleclose="handlePwdClose"
    /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Cookies from 'js-cookie'

// 修改密码弹层
// import Password from './password.vue'

@Component({
  name: 'Navbar',
  components: {
    // Password,
  },
})
export default class extends Vue {
  private shopShow = false
  private dialogFormVisible = false

  getuserInfo() {
    return UserModule.userInfo
  }

  get name() {
    return (UserModule.userInfo as any).name
      ? (UserModule.userInfo as any).name
      : JSON.parse(Cookies.get('user_info') as any).name
  }

  mounted() {
    document.addEventListener('click', this.handleClose)
  }

  private async logout() {
    this.$store.dispatch('LogOut').then(() => {
      // location.href = '/'
      this.$router.replace({ path: '/login' })
    })
    // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }
  // 下拉菜单显示
  toggleShow() {
    this.shopShow = true
  }
  // 下拉菜单隐藏
  mouseLeaves() {
    this.shopShow = false
  }
  // 触发空白处下来菜单关闭
  handleClose() { }
  // 修改密码
  handlePwd() {
    this.dialogFormVisible = true
  }
  // 关闭密码编辑弹层
  handlePwdClose() {
    this.dialogFormVisible = false
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  .titleHead {
    float: left;
    height: 100%;
    font-size: 24px;
    margin-left: 50px;
    align-items: center;
    display: flex;
  }
  .right-menu {
    float: right;
    margin-top: -3px;
    margin-right: 40px;
    color: #333333;
    font-size: 16px;

    span {
      padding: 0 10px;
      width: 130px;
      display: inline-block;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.52);
      }
    }
    // .amendPwdIcon {
    //   margin: 0;
    //   i {
    //     width: 18px;
    //     height: 18px;
    //     background: url(./../../../assets/icons/btn_gaimi@2x.png) no-repeat;
    //     background-size: contain;
    //     margin-top: 8px;
    //   }
    // }
    .outLogin {
      margin: 4px 0;
      cursor: pointer;
      i {
        width: 18px;
        height: 18px;
        background: url(./../../../assets/icons/btn_close@2x.png) no-repeat 100%
          100%;
        background-size: contain;
        margin-top: 8px;
      }
    }
    &:focus {
      outline: none;
    }
  }
  .avatar-wrapper {
    margin-top: 14px;
    margin-left: 18px;
    position: relative;
    // vertical-align: middle;
    float: right;
    width: 120px;
    text-align: left;
    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }

    .el-button--primary {
      background: rgba(255, 255, 255, 0.52);
      border-radius: 4px;
      font-size: 16px;
      padding: 0 20px 0 12px;
      position: relative;
      width: 120px;
      text-align: left;
      border: 0 none;
      height: 40px;
      line-height: 40px;
      &.active {
        color: #333;
        background: rgba(17, 17, 17, 0);
        border: 0 none;
        .el-icon-arrow-down {
          transform: rotate(-180deg);
        }
      }
      &.nonactive {
        color: #333
      }
    }
  }
}

.el-icon-arrow-down {
  background: url('./../../../assets/icons/up.png') no-repeat 50% 50%;
  background-size: contain;
  width: 8px;
  height: 8px;
  transform: rotate(0eg);
  margin-left: 16px;
  position: absolute;
  right: 16px;
  top: 16px;
  &:before {
    content: '';
  }
}

.userInfo {
  background: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 99;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  width: 100%;
  border-radius: 4px;
  line-height: 32px;
  padding: 0 0 5px;
  height: 80px;
  .userList {
    width: 95%;
    padding-left: 5px;
  }
  p {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    padding: 0 5px 0 7px;
    i {
      margin-left: 10px;
      vertical-align: middle;
      margin-top: 4px;
      float: right;
    }
    &:hover {
      background: #f6f1e1;
    }
  }
}
</style>

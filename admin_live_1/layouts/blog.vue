<template>
  <div>
    <el-container>
      <el-aside width="180px">
        <nuxt-link class="logo" to="/">
          <img src="~assets/images/aside_logo.png" class="logo" />
        </nuxt-link>
        <div class="aside-tabs">
          <nuxt-link class="aside-tab-item studio" to="/">
            <i class="icon"></i>
            <span class="tab-name">直播间</span>
          </nuxt-link>
          <nuxt-link class="aside-tab-item list" to="/has-layout">
            <i class="icon"></i>
            <span class="tab-name">直播列表</span>
          </nuxt-link>
        </div>
      </el-aside>
      <el-container>
        <!-- <el-header height="60px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页index.page</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/has-layout' }">布局页面has-layout.page</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          </el-breadcrumb>
          <head-user-info class="user-info" />
        </el-header> -->
        <el-main>
          <nuxt/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import HeadUserInfo from '~/components/HeadUserInfo'

export default {
  components: {
    HeadUserInfo
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
  .el-header, .el-header {
    display flex
    position relative
    align-items center
    min-width 1000px
    .user-info {
      position absolute
      top 0
      right 20px
      bottom 0
    }
  }
  
  .el-aside {
    position fixed
    top 0
    left 0
    min-height 100vh 
    background-color: #273144;
    color: #fff;
    text-align: center;
    .aside-tabs {
      display block
      width 100%
      .aside-tab-item {
        display block
        position relative
        width 100%
        height 40px
        margin-top 20px
        .icon {
          display inline-block
          position absolute
          top 12px
          left 24px
          width 16px
          height 16px
          // background #ededed
        }
        .tab-name {
          display inline-block
          width 100%
          height 40px
          padding-left 48px
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color #fff
          line-height 40px
          text-align left
          text-decoration none
          no-wrap()
        }
        &.studio {
          .icon {
            background url('~assets/images/backstage_live_de.png') center center / 16px 16px no-repeat
          }
        }
        &.list {
          .icon {
            background url('~assets/images/backstage_livelistings_de.png') center center / 16px 16px no-repeat
          }
        }
        &.list {
        }
        &.nuxt-link-exact-active.studio,
        &.nuxt-link-exact-active.list {
          background-color #fff
          .tab-name {
            color #273144
          }
        }
        &.nuxt-link-exact-active.studio {
          .icon {
            background url('~assets/images/backstage_live_ac.png') center center / 16px 16px no-repeat
          }
        }
        &.nuxt-link-exact-active.list {
          .icon {
            background url('~assets/images/backstage_livelistings_ac.png') center center / 16px 16px no-repeat
          }
        }
      }
    }
  }
  
  .el-main {
    width 100%
    background-color: #F6F7FA;
    padding 20px
    padding-left 200px
    color: #333;
    text-align: center;
  }
  
  .el-container {
    margin-bottom: 40px;
  }
  .el-menu-vertical-demo {
    width 180px
  }
</style>

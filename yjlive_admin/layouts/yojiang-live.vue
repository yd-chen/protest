<template>
  <div class="live-main-nav">
    <el-container>
      <el-aside width="180px">
        <nuxt-link class="logo" to="/create-studio">
          <img src="~assets/images/aside_logo.png" class="logo" />
        </nuxt-link>
        <div class="aside-tabs">
          <nuxt-link class="aside-tab-item studio" to="/create-studio">
            <i class="icon"></i>
            <span class="tab-name">直播间</span>
          </nuxt-link>
          <nuxt-link class="aside-tab-item list" :class="{active: linkActive }" to="/lives/">
            <i class="icon"></i>
            <span class="tab-name">直播列表</span>
          </nuxt-link>
        </div>
      </el-aside>
      <el-container>
        <el-header height="60px">
          <!-- 直播间 -->
          <el-breadcrumb v-if="$route.path === '/create-studio'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/create-studio' }">直播间</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 直播列表>新建直播 -->
          <el-breadcrumb
            v-if="$route.path === '/lives/' || $route.path === '/lives/new' || $route.path === '/lives/edit'"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item :to="{ path: '/lives/' }">直播列表</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path === '/lives/edit'" :to="{ path: '/lives/new' }">>新建直播</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path === '/lives/edit'" :to="{ path: '/list/edit' }">>编辑直播</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 直播列表>编辑直播 -->
          <!-- <el-breadcrumb
            v-if="$route.path === '/lives/' || $route.path === '/lives/edit'"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item :to="{ path: '/lives/' }">直播列表</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path === '/lives/edit'" :to="{ path: '/list/edit' }">>编辑直播</el-breadcrumb-item>
          </el-breadcrumb> -->
          <head-user-info class="user-info" />
        </el-header>
        <el-main>
          <nuxt/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import HeadUserInfo from '~/components/HeadUserInfo/HeadUserInfo'

export default {
  components: {
    HeadUserInfo
  },
  data() {
    return {
      linkActive: this.$route.path === '/lives/new' || this.$route.path === '/lives/edit'
    }
  },
  mounted() {
    console.log('路由', this.$route)
    console.log('linkActvie？', this.linkActive)
  }
}
</script>

<style lang="stylus" scoped>
  .el-header, .el-header {
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    display flex
    align-items center
    width 100%
    min-width 1200px
    padding-left 200px
    background-color #fff
    z-index 2
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
    background-color #273144
    color #fff
    text-align center
    z-index 3
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
        }
        .tab-name {
          display inline-block
          width 100%
          height 40px
          padding-left 48px
          font-size 14px
          font-family PingFangSC-Regular,PingFang SC
          font-weight 400
          color #fff
          line-height 40px
          text-align left
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
        &.active.list
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
        &.active.list,
        &.nuxt-link-exact-active.list {
          .icon {
            background url('~assets/images/backstage_livelistings_ac.png') center center / 16px 16px no-repeat
          }
        }
      }
    }
  }
  
  .el-main {
    display block
    width 100%
    height 100vh
    padding 60px 0 0 180px
    color #333
    text-align center
  }
</style>

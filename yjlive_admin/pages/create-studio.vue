<template>
  <div class="set-livestudio-pagearea">
    <div class="in-main">
      <warning-text :text="'请您遵守国家相关规定，切勿上传低俗色情、暴力恐怖、谣言诈骗、侵权盗版等相关内容，有讲课堂保有依据国家规定及平台规则进行处理的权利。'" />
      <section class="info-section">
        <div class="tittle">设置直播间</div>
        <div class="cover-img-info">
          <div class="subscribe">直播间头像</div>
          <el-avatar class="cover-img" :size="160" :src="coverImgPath" @error="errorHandler">
            <img src="~assets/images/default_radius_portrait@2x.png"/>
          </el-avatar>
          <div class="upload-img">
            <label class="upload-btn" for="cover_file">选择文件</label>
            <input
              id="cover_file"
              ref="cover-img"
              type="file"
              accept="image/*"
              hidden
              @change="headImgPreview($event)"
            />
            <div class="text">建议尺寸比例1：1，JPG、PNG格式，图片小于2M。</div>
          </div>
        </div>
        <div class="studio-name-info">
          <div class="subscribe">直播间名称</div>
          <input type="text" class="studio-name-input" placeholder="请输入直播间名称">
        </div>
        <div class="save-area">
          <button class="save-btn">保存</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import WarningText from '~/components/WarningText/WarningText'

export default {
  layout: 'yojiang-live',
  components: {
    WarningText
  },
  data() {
    return {
      coverImgPath: '',
      atudioName: ''
    }
  },
  methods: {
    errorHandler() {
      return true
    },
    headImgPreview(e) {
      console.log(e)
      const _this = this

      // 图片限制小于2MB
      const isLessThan2M = e.target.files[0].size / 1024 / 1024 < 2
      if (!isLessThan2M) {
        this.$message({
          showClose: true,
          message: '请选择 <2MB 的图片上传！',
          type: 'warning'
        })
        return
      }
      // 获取预览图
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ((e) => {
        _this.uploadOssBase64Data(this.result)
      })
    },
    // 图片上传阿里云
    uploadOssBase64Data(base) {
      const _this = this
      _this.$axios
        .post('/api/upload/oss_base64_data', {
          base64: base,
          // prefix: 'user_portrait/' + user_id
          prefix: 'user_portrait/2'
        })
        .then((res) => {
          if (res.success) {
            _this.coverImgPath = res.data.url
          } else {
            this.$message({
              showClose: true,
              message: '操作错误，请稍后重试！',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.set-livestudio-pagearea {
  width 100%
  min-width 1200px
  height 100%
  padding 20px
  .in-main {
    width 100%
    height 100%
    padding 32px
    background #fff
  }
}
.in-main {
  .info-section {
    .tittle {
      position relative
      width 100%
      height 16px
      margin 32px 0
      padding-left 8px
      font-size 16px
      font-family  PingFangSC-Medium,PingFang SC
      font-weight 500
      color $color-text
      line-height 16px
      text-align left
      &::before {
        content: ''
        display inline-block
        position absolute
        left 0
        top 0
        width 2px
        height 16px
        background-color #FF9645
        border-radius 1px
      }
    }
    .subscribe {
      position absolute
      left 0
      top 0
      width 126px
      height 40px
      font-size 14px
      font-family PingFangSC-Regular,PingFang SC
      font-weight 400
      color $color-text-l
      line-height 40px
      text-align left
      &::after {
        content '*'
        display inline-block
        width 8px
        height 14px
        margin-left 2px
        font-size 14px
        font-family PingFangSC-Regular,PingFang SC
        font-weight 400
        color #FC5244
        line-height 14px
      }
    }
    .cover-img-info {
      position relative
      width 100%
      height 160px
      margin-bottom 32px
      .cover-img {
        position absolute
        left 126px
        top 0
      }
      .upload-img {
        position absolute
        left 310px
        top 0
        text-align left
        .upload-btn {
          display inline-block
          width 88px
          height 36px
          margin-bottom 20px
          background #F7F7F7
          border-radius 4px
          border 1px solid #DADADA
          font-size 14px
          font-family PingFangSC-Regular,PingFang SC
          font-weight 400
          color $color-text-l
          line-height 36px
          text-align center
          &:hover {
            cursor pointer
          }
        }
        .text {
          height 20px
          font-size 14px
          font-family PingFangSC-Regular,PingFang SC
          font-weight 400
          color $color-text-l
          line-height 20px
        }
      }
    }
    .studio-name-info {
      position relative
      width 100%
      height 120px
      text-align left
      .studio-name-input {
        position absolute
        left 126px
        top 0
        display inline-block
        width 320px
        height 40px
        padding-left 16px
        border-radius 4px
        border 1px solid #DCDFE6
        font-size 14px
        font-family PingFangSC-Regular,PingFang SC
        font-weight 400
        color $color-text
        line-height 14px
        line-height 40px
        text-align left
        &::-webkit-input-placeholder {
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color #DADADA
        }

        &:-ms-input-placeholder {
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color #DADADA
        }

        &::-ms-input-placeholder {
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color #DADADA
        }

        &::placeholder {
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color #DADADA
        }
      }
    }
    .save-area {
      width 100%
      padding-left 126px
      text-align left
      .save-btn {
        display inline-block
        border none
        outline none
        width:92px;
        height:40px;
        background #FF9645
        border-radius:4px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height 40px
        text-align center
        &:hover {
          cursor pointer
        }
      }
    }
  }
}
</style>

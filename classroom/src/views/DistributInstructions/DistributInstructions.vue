<template>
  <explain-rules :rules="promotionData"></explain-rules>
</template>

<script>
import explainRules from '@/components/explainRules/explainRules.vue';
import { promotionData } from '@/config/explainData';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

export default {
  name: 'distribut-instructions',
  components: {
    explainRules,
  },
  mixins: [wxJssdkMixin],
  data() {
    return {
      promotionData,
    };
  },
  mounted() {
    this.initWxJssdk();
  },
};
</script>

<style scoped lang="stylus">
</style>

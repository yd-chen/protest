<template>
  <explain-rules :rules="explainData"></explain-rules>
</template>

<script>
import explainRules from '@/components/explainRules/explainRules.vue';
import { explainData } from '@/config/explainData';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

export default {
  name: 'explain',
  mixins: [wxJssdkMixin],
  components: {
    explainRules,
  },
  data() {
    return {
      explainData,
    };
  },
  mounted() {
    this.initWxJssdk();
  },
};
</script>

<style scoped lang="stylus">
</style>

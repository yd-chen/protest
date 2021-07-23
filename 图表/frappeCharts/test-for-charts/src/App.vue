<template>
  <div id="app">
    <vue-frappe
            id="test"
            :labels="[
                '03.01', '03.02', '03.03', '03.04',
                '03.05', '03.06', '03.07'
            ]"
            title=""
            type="axis-mixed"
            :height="300"
            :colors="['#FF9645']"
            :dataSets="this.data">
        </vue-frappe>
  </div>
</template>

<script>
import { VueFrappe } from 'vue2-frappe'

export default {
  name: 'App',
  data () {
    return {
      data: [
        {
          chartType: 'line',
          values: [20, 40, 15, 30, 28, 18, 30]
        }
      ]
    }
  },
  components: {
      VueFrappe,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

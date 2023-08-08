<template>
  <div>
   
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      size: 14
    }
  },
   
  created() {},
  mounted() { },
  methods: {
    create(name,value){
      name+1
      return {
        name,value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
h3{
    transition: all .2s;
}
.time{
  width: 100px;
  height: 100px;
  background: #000;
}
</style>

<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import exportFile from '@/vendor/exportFile'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess(data) {
      this.tableData = data.results
      this.tableHeader = data.header
      console.log(data.results)
      // [{title:"保险业",desc:'总数',children:[{name:'2021',value:10}]}]
      let name = ''; let json = {}; const arr = []; let children = []
      data.results.forEach((item) => {
        if (!item) {
          return
        }
        if (item?.name?.indexOf('总计') > -1) {
          return
        }
        if (item?.name?.indexOf('汇总') > -1) {
          // 如果存在汇总，代表是上一个数据的汇总
          json.desc = item.count
          return
        }
        if (item.name) {
          // 存在名称
          json = {}
          children = []
          json.children = children
          name = item.name
          json.title = name
          arr.push(json)
        }
        children.push({
          name: item.year.replace('年', ''),
          value: item.count
        })
      })
      arr.sort((a, b) => {
        return b.desc - a.desc
      })
      exportFile('window.hyzqData=' + JSON.stringify(arr), 'hyzdData.json')

      console.log(arr)
      //    exportFile(text, 'template.vue')
    }
  }
}
</script>

<template>
  <div>x</div>
</template>
<script>
const data = [
  {
    type: 'input',
    label: '订单编号',
    value: 'outOrderNo'
  },
  {
    type: 'select',
    label: '签署类型',
    value: 'recordType',
    labelKey: 'recordTypeName',
    valueKey: 'recordTypeCode',
    list: '[]'
  },
  {
    type: 'time',
    label: '开始时间',
    value: 'startTime',
    startTimeName: 'beginTimeStart',
    endTimeName: 'endTimeStart'
  }
]

const scriptData = []
const temData = []
const searchData = []
const vueData = {
  scriptData,
  temData,
  searchData
}

const vueObj = {
  name: 'TemPate',
  components: [],
  data: vueData
}

function getLabelWidth(value) {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return Math.max(
      ...value.map(item => {
        return getLabelWidth(item.length)
      })
    )
  }
  return value * 14 + 12
}

const htmlStr = `
<template>
  <div class="app-container">
    <el-form ref="formSearch" label-position="right" :inline="true"  ${
  data.length > 6
    ? `label-width="${getLabelWidth(
      data.map(ite => {
        return ite.label
      })
    )}"`
    : ''
} :model="formSearch" size="small" class="search-box">
${
  data.length > 6
    ? `<el-row type="flex" align="middle">
        <el-col :lg="21" :md="18">`
    : ``
}

    ${data
    .map(item => {
      if (item.type == 'input') {
        searchData.push(`${item.value}: '', // ${item.label}`)
        return ` <el-form-item label="${item.label}">
        <el-input v-model.trim="formSearch.${item.value}" placeholder="请输入${item.label}" clearable />
      </el-form-item>`
      } else if (item.type == 'select') {
        searchData.push(`${item.value}: '', // ${item.label}`)
        temData.push(
          `${item.value}List:${item.list || '[]'}, // ${item.label}的数据列表`
        )
        return `<el-form-item label="${item.label}">
        <el-select v-model.trim="formSearch.${item.value}" placeholder="请选择${
  item.label
}">
          <el-option label="全部" value="" />
          <el-option v-for="(item, index) in ${
  item.value
}List" :key="'formSearch-${
  item.value
}List-' + index" :value="item.${item.valueKey ||
            'value'}" :label="item.${item.labelKey || 'label'}" />
        </el-select>
      </el-form-item>`
      } else if (item.type == 'time') {
        searchData.push(`${item.value}: '', // ${item.label}`)
        if (
          !vueObj.components.find(ite => {
            return ite.name == 'datePicker'
          })
        ) {
          vueObj.components.push('datePicker')
          scriptData.push({
            name: 'datePicker',
            value: `import datePicker from '@/components/TimeInterval/dateRange.vue'`
          })
        }
        return `<el-form-item label="${item.label}"><datePicker islimitlength :longtime="longtime" :default-time="[formSearch.startTime, formSearch.endTime]" is-auto-add-time @change-time="changeTime" /></el-form-item>`
      }
    })
    .join('\n')}
    ${
  data.length > 6
    ? ` </el-col>
         <el-col :lg="3" :md="6" class="search-box-right">
          <el-button type="primary" size="small" @click="onSearch">搜 索</el-button>
        </el-col>
      </el-row>`
    : `<el-form-item label-width="">
          <el-button type="primary" size="small" @click="onSearch">搜 索</el-button>
        </el-form-item>`
}
    </el-form>
`
const scriptStr = `
<script>
${scriptData
    .map(item => {
      return item.value
    })
    .join('\n')}
export default {
  name: 'template',
  components: {},
  data() {
    return {
      ${temData.join('\n')}
      searchData: {
        ${searchData.join('\n')}
      }
    }
  }
}
<\/script>
`
const cssStr = ``

export default {
  name: 'ToolHtml',
  components: {},
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {
    console.log(htmlStr, scriptStr, cssStr, vueData)
  },
  methods: {}
}
</script>

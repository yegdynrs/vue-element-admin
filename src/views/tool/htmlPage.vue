<template>
  <div class="content">
    <template slot="header">页面生成-wanghao</template>
    <a ref="rely" href="./static/rely.zip" download="依赖文件" class="d-none" />
    <pre>
该table表示detail的所有字段
    1：占据宽度（table）  auto/具体px  当为auto表示table将自动计算宽度
    2：新增表单，勾选后将纳入到新增修改的detail中
    3：为搜索条件，纳入表单的搜索中
    4：搜索key，当字段key与搜索条件的key不同时，设置搜索的key
    5：超出隐藏，表格的超出隐藏开关
    6：slot列表，当类型为select或者radio时，需要与关联list配合使用，table和detail详情，会自动写上$utils.find(.....)
    7：关联list，代表当前字段需要关联的列表数据，name:列表的name，
    8：name:[{xxx:'名字',aaa:'01' }] 这里的xxx代表label，aaa代表key,当不存在列表数据的时候，list默认初始化只为[]
    9：当类型为radio时，将会拿列表数据的第一个json的key代表字段的数据
    10：dialog只支持select radio text格式
    11：需要自己调整下格式化出来的空格问题。。。

</pre>
    <el-form ref="form" inline :model="form">
      <el-table ref="table" :data="form.keyList" style="width: 100%" row-key="rowKey">
        <el-table-column label="字段key" prop="key" min-width="120px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key" placeholder="key" />
          </template>
        </el-table-column>
        <el-table-column label="字段名" prop="label" min-width="120px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="label" />
          </template>
        </el-table-column>
        <el-table-column label="占据宽度" prop="minWidth" min-width="120px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.minWidth" placeholder="minWidth" />
          </template>
        </el-table-column>
        <el-table-column label="选择类型" prop="type" min-width="120px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择类型">
              <el-option
                v-for="(ite, inx) in typeList"
                :key="'formSearch-typeList-' + scope.$index + '-' + inx"
                :value="ite.value"
                :label="ite.label"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="新增表单" prop="dialog.value" min-width="120px">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.dialog.value"
            >为dialog</el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="table" prop="table.value" min-width="120px">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.table.value"
            >为table</el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="搜索" prop="search.value" min-width="120px">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox
                v-model="scope.row.search.value"
              >为搜索条件</el-checkbox>
              <div v-if="scope.row.search.value">
                <div
                  v-if="scope.row.type !== 'time' && scope.row.type !== 'money'"
                >
                  <el-input
                    v-model="scope.row.search.key"
                    placeholder="搜索key"
                  />
                </div>

                <div v-else>
                  <el-input
                    v-model="scope.row.search.label"
                    placeholder="搜索别名"
                  />
                  <el-input
                    v-model="scope.row.search.combination.key1"
                    placeholder="key1"
                  />

                  <el-input
                    v-model="scope.row.search.combination.key2"
                    placeholder="key2"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="超出隐藏" prop="tooltip">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.tooltip" />
          </template>
        </el-table-column>
        <el-table-column label="slot列表" prop="slot.value">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox v-model="scope.row.slot.value" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联List" prop="list.value" width="200px">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox v-model="scope.row.list.value" />
              <div v-if="scope.row.list.value">
                <el-input v-model="scope.row.list.name" placeholder="name" />
                <el-input
                  v-model="scope.row.list.labelKey"
                  placeholder="label"
                />
                <el-input v-model="scope.row.list.key" placeholder="key" />
                <el-input
                  v-model="scope.row.list.data"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 14 }"
                  placeholder="请输入列表数据"
                />

              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="80px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="removeList(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button size="small" class="bt" @click="addList">新增 </el-button>
      <div>
        <h3>导入数据</h3>
        <pre class="text-left">
测试数据：
chnExtinfo (string, optional): 渠道配置扩展 ,
chnlCode (string, optional): 渠道代码 ,
chnlId (string, optional): 渠道ID ,
chnlName (string, optional): 渠道名称 ,
createTime (string, optional): 创建时间 ,
id (integer, optional): 主键ID ,
isValid (integer, optional): 是否生效,0:无效，1：有效 ,
payChnl (string, optional): 渠道 ,
payWay (string, optional): 支付方式 ,
settleAcctBank (string, optional): 对应结算账户银行 ,
settleAcctName (string, optional): 对应结算账户名称 ,
settleAcctNo (string, optional): 对应结算账户 ,
settleCnapsNo (string, optional): 对应结算账户银行联行号 ,
settleFlag (string, optional): 结算标识 ,
settleRule (string, optional): 结算标识 ,
singleQuota (number, optional): 单笔限额 ,
updateTime (string, optional): 最后更新时间
        </pre>
        <el-input
          v-model="importFormData"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入数据模板"
          @input="importFormDataModal"
        />
      </div>
      <div>
        <el-button size="small" class="bt" @click="submit">生成页面</el-button>
        <el-button size="small" class="bt" @click="submitAdd">增加字段</el-button>
        <el-button size="small" class="bt" @click="submitRely">下载依赖文件</el-button>
      </div>
      <div>
        <h3>数据模板</h3>
        <el-input
          v-model="defauleJsonModal"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入数据模板"
        />
      </div>
      <div>
        <h3>完整数据</h3>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入表单"
          :value="JSON.stringify(form)"
          @input="formJsonModal"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import exportFile from '@/vendor/exportFile'
let defauleJson = {
  key: '',
  label: '',
  minWidth: 'auto', // auto或者具体的px值
  tooltip: true,
  list: {
    name: '',
    key: '',
    labelKey: '',
    data: '',
    value: false
  },
  slot: { value: false }, // 有slot的添加slot-scope
  dialog: { // 是否是新增，编辑弹窗
    value: false
  },
  table: {
    value: true
  },
  type: 'text',
  search: {
    value: false,
    key: '',
    combination: {
      key1: '',
      key2: ''
    },
    label: ''
  },
  rowKey: new Date().getTime()
}
export default {
  name: 'HtmlPage',
  data() {
    return {
      defauleJsonModal: JSON.stringify(defauleJson),
      importFormData: '',
      importFormDataJson: {},
      typeList: [
        {
          value: 'text',
          label: 'text'
        },
        {
          value: 'select',
          label: '下拉选择'
        },
        {
          value: 'radio',
          label: '单选'
        },
        {
          value: 'time',
          label: '时间'
        },
        {
          value: 'money',
          label: '数字范围'
        }
      ],
      form: {
        keyList: [JSON.parse(JSON.stringify(defauleJson))],
        hasTime: false, // 存在搜索时间
        hasMoney: false, // 存在搜索钱范围
        hasDialog: false, // 存在dialog，新增，详情
        searchRow: false // 搜索内容较多时，采用row
      }
    }
  },
  watch: {
    defauleJsonModal(val) {
      val.rowKey = this.form.keyList.length + 1 + new Date().getTime()
      defauleJson = JSON.parse(val)
    }
  },
  mounted() {
    const sortable = new Sortable(this.$refs.table.$el.querySelector('tbody'), {
      animation: 150,
      onEnd: this.onEnd,
      ghostClass: 'blue-background-class'
    })
  },
  methods: {
    onEnd({ newIndex, oldIndex }) {
      const old = this.form.keyList[oldIndex]
      this.form.keyList.splice(oldIndex, 1)
      this.form.keyList.splice(newIndex, 0, old)
    },
    formJsonModal(val) {
      this.form = JSON.parse(val)
    },
    importFormDataModal(val) {
      var a = val.trim()
      a = a[a.length - 1] === ',' ? a : (a += ',')
      a = a.split('\n')
      let str = ''
      let isNumber = false; let isRadio = false
      const json = {}
      const keyList = []
      a.map((item, index) => {
        var arr = /(\w*)\s*(\([^\)]*\))([^:：]*[:：]\s*([a-zA-Z0-9\u4e00-\u9fa5]*)\s*(.*)\s*,)?/gim.exec(
          item
        )
        // arr值分为null，和非null
        if (arr && arr[1]) {
          json[arr[1]] = json[arr[1]] || ''
          str += `
          ${arr[1]}:'', // ${arr[4]} ${arr[5]}
          `
          isNumber = !!(arr[2] && arr[2].indexOf('integer') > -1)
          isRadio = !!(arr[2] && arr[2].indexOf('boolean') > -1)
          // 优化点：数据里面包含 json或者数组的数据的处理方式
          const data = JSON.parse(JSON.stringify(defauleJson))
          data.key = arr[1]
          data.label = arr[4]
          data.table.value = true
          data.rowKey = keyList.length + 1 + new Date().getTime()

          if (arr[5] && arr[5] !== ' ') {
            arr[5] = arr[5]
              .trim()
              .replace(/[（()）]/gim, '')
              .replace(/[-\s?]/gim, ' ')
              .replace(/[：:\s?]/gim, ' ')
              .replace(/\s+/gim, ' ').replace(/，/gim, ',')
            const list = arr[5].split(',')
            const selectList = []
            list.forEach(item => {
              const arr = item.split(' ')
              if (arr[1] !== undefined && arr[0] !== undefined) {
                selectList.push({
                  label: arr[1],
                  value: isNumber ? Number(arr[0]) : arr[0]
                })
              }
            })
            data.type = isRadio ? 'radio' : 'select'
            data.dialog.value = false
            data.slot.value = true
            data.list.name = arr[1] + 'List'
            data.list.value = true
            data.list.key = 'value'
            data.list.labelKey = 'label'
            data.list.data = JSON.stringify(selectList)
          }
          keyList.push(data)
        }
        return item
      })
      str = `{
        ${str}
      }`
      console.log(str)
      this.importFormDataJson = json
      this.form.keyList = keyList
    },
    addList() {
      const data = JSON.parse(JSON.stringify(defauleJson))
      data.rowKey = this.form.keyList.length + 1 + new Date().getTime()
      this.form.keyList.push(data)
    },
    removeList(index) {
      this.form.keyList.splice(index, 1)
    },
    getLabelWidth(value) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        return Math.max(...(value.map((item) => {
          return this.getLabelWidth(item.length)
        })))
      }
      return value * 14 + 12
    },
    getForm() {
      if (!this.form.hasForm) {
        return ''
      }
      if (!this.form.searchRow) {
        return `
         <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="${this.getSearchLabelWidth()}px" size="small" class="search-box">
       <el-row type="flex" align="middle">
        <el-col :lg="19" :md="12">
      ${this.getFormItem()}
      </el-col>
         <el-col :lg="5" :md="12" class="search-box-right">
          <el-button type="primary" size="small" @click="onSearch">搜 索</el-button>
        </el-col>
      </el-row>
       </el-form>
        `
      }
      return `
      <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="70px" size="small" class="search-box">
      ${this.getFormItem()}
      <el-form-item label-width="">
          <el-button type="primary" size="small" @click="onSearch">搜 索</el-button>
        </el-form-item>
      </el-form>`
    },
    getSearchLabelWidth() {
      const obj = this.form.keyList.filter((item) => {
        return item.search.value
      }).map((item) => {
        return item.label
      })
      return this.getLabelWidth(obj)
    },
    getFormItem() {
      const data = this.form.keyList.filter((item) => {
        return item.search.value
      })
      let text = ''
      data.forEach((item, index) => {
        const fnName = this.getFormItemFn(item.type)
        const json = JSON.parse(JSON.stringify(item))
        text += this[fnName](json, this.form.searchRow) + '\n'
      })
      return text
    },
    // 搜索框是类似一行，还是多行
    getSearchRow() {
      return this.form.keyList.filter((item) => { return item.search.value }).length < 6
    },
    getFormItemFn(type) {
      let fn = ''
      switch (type) {
        case 'text':
          fn = 'getInputItem'
          break
        case 'select':
          fn = 'getSelectItem'
          break
        case 'radio':
          fn = 'getRadioItem'
          break
        case 'time':
          fn = 'getTimeItem'
          break
        case 'money':
          fn = 'getMoneyItem'
          break
        default:
          break
      }
      return fn
    },
    getInputItem(item, row = true) {
      return `<el-form-item label="${item.label}"  ${
        row && item.label.length > 4
          ? 'label-width="' + this.getLabelWidth(item.label.length) + 'px"'
          : ''
      }>
      <el-input v-model.trim="formSearch.${item.key}" placeholder="请输入${
  item.label
}" clearable />
      </el-form-item>`
    },
    getMoneyItem(item, row = true) {
      return `
      <el-form-item label="${item.label}" ${
  row && item.label.length > 4
    ? 'label-width="' + this.getLabelWidth(item.label.length) + 'px"'
    : ''
}>
       <NumberRange ref="NRange" :value="[formSearch.${item.search.combination.key1}, formSearch.${item.search.combination.key2}]" @change=";(formSearch.${item.search.combination.key1} = $event[0]), (formSearch.${item.search.combination.key2} = $event[1])" />
      </el-form-item>
      `
    },
    getTimeItem(item) {
      return `
       <el-form-item label="${item.label}">
        <datePicker islimitlength :longtime="longtime" :default-time="[formSearch.${item.search.combination.key1}, formSearch.${item.search.combination.key2}]" is-auto-add-time @change-time="changeTime" />
      </el-form-item>
      `
    },
    getRadioItem(item) {
      return this.getSelectItem(item)
    },
    getSelectItem(item, row = true) {
      return `<el-form-item label="${item.label}"  ${
        row && item.label.length > 4
          ? 'label-width="' + this.getLabelWidth(item.label.length) + 'px"'
          : ''
      }>
        <el-select v-model.trim="formSearch.${item.key}" placeholder="请输入${
  item.label
}">
          <el-option label="全部" value="" />
          <el-option v-for="(item, index) in ${
  item.list.name
}" :key="'formSearch-${item.list.name}-' + index" :value="item.${
  item.list.key
}" :label="item.${item.list.labelKey}" />
        </el-select>
      </el-form-item>`
    },
    getTable() {
      if (!this.form.hasForm) return ''
      return `
       <table-page :table-data="tableData" :show-pagination="true" :current-page="pageIndex"  :total-page="totalSize" :isload="loading" :page-size="pageSize" @changPage="currentChange" @sizeChange="handleSizeChange">
           <div slot="button_box" class="button-box">
        <el-button type="primary" size="small" @click="handleAdd">新 增</el-button>
      </div>

      <template slot="table_column">
      <el-table-column type="index" label="序号" width="60" align="center" />
      ${this.getTableItem()}
      <el-table-column label="操作" width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
       </template>
      </table-page>
      `
    },
    getTableItem() {
      const data = this.form.keyList.filter((item) => { return item.table.value })
      let text = ''
      data.forEach((item, index) => {
        const fnName = this.getTableItemFn(item.slot)
        const json = JSON.parse(JSON.stringify(item))
        text += this[fnName](json) + '\n'
      })
      return text
    },
    getTableItemFn(slot) {
      let fn = ''
      switch (slot.value) {
        case false:
          fn = 'getTableTextItem'
          break
        case true:
          fn = 'getTableSelectItem'
          break
        default:
          fn = 'getTableTextItem'
          break
      }
      return fn
    },
    getTableTextItem(item) {
      return `<el-table-column prop="${item.key}" label="${
        item.label
      }" align="center" :min-width="${
        item.minWidth === 'auto' ? 'tableWidth.' + item.key : item.minWidth
      }" ${item.tooltip ? 'show-overflow-tooltip' : ''} />
`
    },
    getTableSelectItem(item) {
      return `<el-table-column prop="${item.key}" label="${
        item.label
      }" align="center" :min-width="${
        item.minWidth === 'auto' ? 'tableWidth.' + item.key : item.minWidth
      }" ${item.tooltip ? 'show-overflow-tooltip' : ''} >
          <template slot-scope="scope">
            {{ $utils.find(${item.list.name},scope.row.${item.key},'${item.list
  .key || item.key}').${item.list.labelKey} || scope.row.${item.key}}}
          </template>
        </el-table-column>`
    },
    getScript() {
      return `
      import { listRequest, detailRequest, editRequest, addRequest } from '@/api/template'${this.getScriptImport()}${this.getScriptVue()}
      `
    },
    getScriptImport() {
      let str = '\n'
      str += this.form.hasTime
        ? `import datePicker from '@/components/TimeInterval/dateRange.vue'
import { getDateTime,longQueryTime,createColumnWidthWatchFn } from '@/utils/tools'
`
        : `import { createColumnWidthWatchFn } from '@/utils/tools'
        `
      str += this.form.hasMoney
        ? `import NumberRange from '@/components/Range/NumberRange'
        `
        : ''
      return str
    },
    getScriptVue() {
      return `
      export default {
        name: 'HtmlPage',
        components: {
          TablePage,
          ${this.form.hasTime ? 'datePicker' : ''}${
  this.form.hasTime && this.form.hasMoney ? ',' : ''
}
          ${this.form.hasMoney ? 'NumberRange' : ''}
          
        },
        props: {},
        data() {
          return {
            ${
  this.form.hasTime
    ? "longtime: longQueryTime(1, 'year'), // 限制时间"
    : ''
}${this.getBindList()}
            pageIndex: 1,
            pageSize: 10,
            totalSize: 0,
            loading: false,
            tableData: [],
            tableWidth: {
              ${this.getTableWidth()}
            },
            formSearch:{},
            searchData: {
              ${this.getScriptVueSearchData()}
            },
            ${this.getDialogVueData()}${this.getDetailVueData()}
          }
        },
        computed: {
        },
        watch: {},
        activated() {
          this.formSearch = JSON.parse(JSON.stringify(this.searchData))
          this._getTableList()
        },
          created() {
          this.formSearch = JSON.parse(JSON.stringify(this.searchData))
          this.$watch('tableData', createColumnWidthWatchFn(this.tableWidth))
          this._getTableList()
        },
        mounted() {},
        methods: {
          _getTableList(){
            const data = JSON.parse(JSON.stringify(Object.assign({}, this.searchData, {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
              })));
              this.$utils.deleteNull(data)
              this.formSearch = JSON.parse(JSON.stringify(this.searchData))
              this.loading = true;
              listRequest({
                data: data
              })
                .then(res => {
                  this.loading = false;
                  if (res.resultCode == "0000") {
                    this.tableData = res.data.list || [];
                    this.totalSize = res.data.total || res.data.pagination
                      ? res.data.pagination.totalRecord
                      : 0;
                  }
                })
                .catch(() => {
                  this.loading = false;
                });
          },
          ${this.form.hasTime ? this.getChangeTimeFn() : ''}
          onSearch() {
            for (const i in this.formSearch) {
              this.searchData[i] = this.formSearch[i]
            }
            this.pageIndex = 1
            this._getTableList()
          },
          // 分页
          currentChange(page) {
            this.pageIndex = page
            this._getTableList()
          },
          handleSizeChange(val){
            this.pageSize = val
            this.pageIndex = 1
            this._getTableList()
          },
          ${this.form.hasDialog ? this.getDialogMethods() : ''}
          ${this.getDetailMethods()}
        }
           
      }
    `
    },
    getBindList() {
      let str = ''
      this.form.keyList.forEach(item => {
        if (item.list.value) {
          if (item.list.data) {
            str += `
            ${item.list.name}:${item.list.data},`
          } else {
            str += `${item.list.name}:[],`
          }
        }
      })
      return str
    },
    getTableWidth() {
      let str = ''
      this.form.keyList.filter((item) => { return item.table.value }).forEach(item => {
        if (item.minWidth === 'auto') {
          str += `${item.key}: ${this.getLabelWidth(item.label.length) + 10},`
        }
      })
      return str + '\n'
    },
    getChangeTimeFn() {
      const timeJson = this.form.keyList.find(item => {
        return item.type === 'time'
      })
      return `changeTime(val) {
      this.formSearch.${timeJson.search.combination.key1 ||
        timeJson.key} = val[0]
      this.formSearch.${timeJson.search.combination.key2 ||
        timeJson.key} = val[1]
    },`
    },

    // 获取dialog的vue的data数据
    getDialogVueData() {
      if (!this.form.hasDialog) {
        return ''
      }
      return `formDetailDialog: false,
      formDetailJson: {
        type: 'add',
        title: '新增'
      },
      formDetail: {
        ${this.getDialogVueDataForm()}
      },
      formDetailRules: {
        ${this.getDialogVueDataRules()}
      },
      `
    },
    // 获取dialog的vue的data中的formDetail
    getDialogVueDataForm() {
      const data = this.form.keyList.filter((item) => {
        return item.dialog.value
      })
      let text = ''
      data.forEach((item, index) => {
        text += `${item.key}:${item.type === 'radio' ? this.getRadioDefault(item) : "''"}, // ${item.label}` + '\n'
      })
      return text
    },
    // 给radio设置默认初始值
    getRadioDefault(item) {
      if (item.list.value && item.list.data) {
        try {
          const data = JSON.parse(item.list.data)
          let res = data[0][item.list.key]
          res = (res === undefined ? '' : res)
          res = (typeof res === 'number') ? res : `'${res}'`
          return res
        } catch (error) {
          console.log(error)
        }
      }
      return "''"
    },
    // 获取dialog的vue的data中的formDetail的校验
    getDialogVueDataRules() {
      const data = this.form.keyList.filter((item) => {
        return item.dialog.value
      })
      let text = ''
      data.forEach((item, index) => {
        text += `${item.key}: [{
          required: true,
          message: '请${item.type === 'select' ? '选择' : '输入'}${item.label}',
          trigger: 'change'
        }],` + '\n'
      })
      return text
    },
    getDialogMethods() {
      return `handleAdd(){
          this.formDetailJson.type = 'add'
          this.formDetailJson.title = '新增'
          this.formDetail= {${this.getDialogVueDataForm()}}
          if (this.$refs.formDetail) this.$refs.formDetail.resetFields()
          this.formDetailDialog = true
      },
      handleEdit(row){
        this.formDetailJson.type = 'edit'
        this.formDetailJson.title = '修改'
          this.formDetail = Object.assign({}, row)
          this.formDetailDialog = true
      },
      dialogSubmitForm(formName){
        
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.formDetail)
          const formDetailJson = this.formDetailJson
          const api = formDetailJson.type == 'add' ? addRequest : editRequest
          this.$confirm(\`确定\${formDetailJson.type == 'add' ? '新增' : '修改'}？\`, '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'none'
          })
            .then((resj) => {
              api({ data })
                .then((res) => {
                  if (res.resultCode == '0000') {
                    this.$notify.closeAll()
                    this.$notify.success({
                      title: '提示',
                      message: formDetailJson.title + '成功'
                    })
                    this.formDetailDialog = false
                    this._getTableList()
                  } else {
                    throw Error(res.resultMessage)
                  }
                })
                .catch(() => {})
            })
            .catch(() => {
              console.log('取消')
            })
        }
      })
      },
      `
    },
    getDetailVueData() {
      return `dialogVisible: false,
      orderDetails: {}, // 详情`
    },
    getDetailMethods() {
      return `// 详情
    handleDetails(row) {
      detailRequest({ data: { id: row.id }}).then((res) => {
        if (res.resultCode == '0000') {
          this.orderDetails = Object.assign({},row, res.data)
          this.dialogVisible = true
        }
      })
    },
    `
    },
    getScriptVueSearchData() {
      let text = ''
      this.form.keyList.filter((item) => {
        return item.search.value
      }).forEach((item, index) => {
        const fnName = this.getScriptVueSearchDataFn(item.type)
        const json = JSON.parse(JSON.stringify(item))
        text += this[fnName](json) + '\n'
      })
      return text
    },
    getScriptVueSearchDataFn(type) {
      let fn = ''
      switch (type) {
        case 'time':
          fn = 'getVueSearchDataTime'
          break
        case 'money':
          fn = 'getVueSearchDataMoney'
          break
        default:
          fn = 'getVueSearchDataText'
          break
      }
      return fn
    },
    getVueSearchDataText(item) {
      return `${item.search.key || item.key}:'', // ${item.search.label || item.label}`
    },
    getVueSearchDataTime(item) {
      return `${item.search.combination.key1 ||
        item.key}:getDateTime(longQueryTime(1, 'month')), // 开始时间
      ${item.search.combination.key2 ||
        item.key}:getDateTime(0, 'date') + ' 23:59:59', // 结束时间`
    },
    getVueSearchDataMoney(item) {
      return `${item.search.combination.key1 || item.key}:'', // 金额范围
      ${item.search.combination.key2 || item.key}:'', // 金额范围
      `
    },

    getCSS() {
      return `
      ::v-deep {
          .search-box .el-input, .search-box .el-select, .search-box .el-date-editor--datetimerange.el-input__inner, .search-box .el-date-editor--daterange.el-input__inner {
          width: 230px;
      }
       .form-dialog-box{
          ::v-deep{
                .el-select{
                  width: 100%;
                }
          }
      }
      ${this.form.hasMoney ? '.range-box>.el-input{width: 109px;}' : ''}
      ${this.form.hasSelect ? '.search-box {.el-select {min-width: 230px;width: auto;.el-input { min-width: 230px;width: auto;}.el-select__tags{overflow: hidden;}}}' : ''}
        ${this.form.hasTime ? '.time-box{.el-date-editor.el-input .el-input__inner{padding-left: 10px;}}' : ''}
      }
      .w-100 {
        width: 100% !important;
      }
      `
    },
    getDialog() {
      if (!this.form.hasDialog) {
        return ''
      }
      const row = this.form.keyList.filter((item) => {
        return item.dialog.value
      }).length > 6
      return `
      <!--新增/修改-->
      <Dialog :title="formDetailJson.title" :visible.sync="formDetailDialog" width="${row ? 60 : 30}%" 
      ${row ? 'custom-class="form-dialog-row"' : ''}
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false">
       <template>
        <el-form ref="formDetail" :model="formDetail" :rules="formDetailRules" label-width="${this.getDialogLabelWidth() + 10}px" class="form-dialog-box">
        ${this.getDialogFormItem()}
        </el-form>
      </template>
      <template slot="footer">
        <el-button size="small" @click="formDetailDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogSubmitForm('formDetail')">确定</el-button>
      </template>
      </Dialog>
      `
    },
    getDialogLabelWidth() {
      const obj = this.form.keyList.filter((item) => {
        return item.dialog.value
      }).map((item) => {
        return item.label
      })
      return this.getLabelWidth(obj)
    },
    getDialogFormItem() {
      const data = this.form.keyList.filter((item) => {
        return item.dialog.value
      })
      let text = ''
      data.forEach((item, index) => {
        const fnName = this.getDiaLogFormItemFn(item.type)
        const json = JSON.parse(JSON.stringify(item))
        text += this[fnName](json) + '\n'
      })
      return text
    },
    getDiaLogFormItemFn(type) {
      let fn = ''
      switch (type) {
        case 'text':
          fn = 'getDialogInputItem'
          break
        case 'select':
          fn = 'getDialogSelectItem'
          break
        case 'radio':
          fn = 'getDialogRadiotem'
          break
        case 'time':
          fn = 'getDialogTimeItem'
          break
        case 'money':
          fn = 'getDialogMoneyItem'
          break
        default:
          break
      }
      return fn
    },
    // 获取dialog的输入框 item
    getDialogInputItem(item) {
      return `
          <el-form-item label="${item.label}" prop="${item.key}">
            <el-input v-model.trim="formDetail.${item.key}" type="text" placeholder="请输入${item.label}" clearable />
          </el-form-item>`
    },
    // 获取dialog的选择框 item
    getDialogSelectItem(item) {
      return `
          <el-form-item label="${item.label}" prop="${item.key}">
            <el-select v-model="formDetail.${item.key}" clearable filterable placeholder="请选择${item.label}">
              <template v-for="(item,index) in ${item.list.name}">
                <el-option :key="'item.${item.list.key || item.key}'+index" :label="item.${item.list.labelKey}" :value="item.${item.list.key || item.key}" />
              </template>
            </el-select>
          </el-form-item>`
    },
    getDialogRadiotem(item) {
      return `
      <el-form-item label="${item.label}" prop="${item.key}">
      <el-radio-group v-model="formDetail.${item.key}">
          <el-radio :label="item.${item.list.key}" v-for="(item,index) in ${item.list.name}" :key="'${item.key}'+index">{{item.${item.list.labelKey}}}</el-radio>
        </el-radio-group>
       </el-form-item>`
    },
    // 获取dialog的时间选择，后期扩展
    getDialogTimeItem() {
      return ''
    },
    // 获取dialog的金钱选择，后期扩展
    getDialogMoneyItem() {
      return ''
    },
    // 获取详情的view
    getDetail() {
      return `
      <!--详情-->
       <Dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="60%"
      custom-class="details-box"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="orderDetails" label-width="${this.getDetailLabelWidth() + 12}px">
          ${this.getDetailItem()}
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" @click="dialogVisible = false">关 闭</el-button>
      </div>
    </Dialog>
      `
    },
    getDetailLabelWidth() {
      const obj = this.form.keyList.map((item) => {
        return item.label
      })
      return this.getLabelWidth(obj)
    },
    getDetailItem() {
      let text = ''
      this.form.keyList.forEach((item, index) => {
        const w100 = index === (this.form.keyList.length - 1) && ((index + 1) % 2 === 1)
        text += ((item.type === 'select' || item.type === 'radio') && item.slot.value) ? `
         <div class="grid-content ${w100 ? 'w-100' : ''}">
          <el-form-item label="${item.label}:">
            <div>
                <span>{{
                (
                  ${item.list.name}.find(
                    item => item.${item.list.key} == orderDetails.${item.list.key}
                  ) || {}
                ).${item.list.labelKey} || orderDetails.${item.list.key}
              }}</span>
            </div>
          </el-form-item>
        </div>
         ` : `
          <div class="grid-content ${w100 ? 'w-100' : ''}">
          <el-form-item label="${item.label}:">
            <div> {{ orderDetails.${item.key} }}</div>
          </el-form-item>
        </div>
         ` + '\n'
      })
      return text
    },
    textInit() {
      let hasTime = false
      let hasMoney = false
      let hasForm = false
      let hasDialog = false
      let hasSelect = false
      let hasTable = false
      this.form.keyList.forEach(item => {
        if (item.search.value) {
          hasForm = true
        }
        if (item.table.value) {
          hasTable = true
        }
        if (item.type === 'time') {
          hasTime = true
        }
        if (item.type === 'money') {
          hasMoney = true
        }
        if (item.type === 'select') {
          hasSelect = true
        }
        if (item.dialog.value) {
          hasDialog = true
        }
      })
      this.form.hasForm = hasForm
      this.form.hasTime = hasTime
      this.form.hasMoney = hasMoney
      this.form.hasDialog = hasDialog
      this.form.hasSelect = hasSelect
      this.form.hasTable = hasTable
      this.form.searchRow = this.getSearchRow()
    },
    // 增添数据
    submitAdd() {
      this.textInit()
      const text = `
      <template>
      <div>
      表单html新增：
      ${this.getFormItem()}

      表单table新增：
      ${this.getTableItem()}

      dialog新增：
      ${this.getDialogFormItem()}

      dialog详情：
      ${this.getDetailItem()}
    </div>
</template>
<script>
 ${this.getScriptImport()}
      export default {
        name: 'HtmlPage',
        components: {
          ${this.form.hasTime ? 'datePicker' : ''}${
  this.form.hasTime && this.form.hasMoney ? ',' : ''
}
          ${this.form.hasMoney ? 'NumberRange' : ''}
        },
         data() {
          return {
            ${
  this.form.hasTime
    ? "longtime: longQueryTime(1, 'year'), // 限制时间"
    : ''
}${this.getBindList()}
            tableWidth: {
              ${this.getTableWidth()}
            },
            searchData: {
              ${this.getScriptVueSearchData()}
            },
            formDetail: {
              ${this.getDialogVueDataForm()}
            },
            formDetailRules: {
              ${this.getDialogVueDataRules()}
            },
          }
        },
        methods:{
          ${this.form.hasTime ? this.getChangeTimeFn() : ''}
          ${this.form.hasDialog ? ('handleAdd(){this.formDetail= {' + this.getDialogVueDataForm() + '}}') : ''}
        }
        <\/script>
      `
      exportFile(text, 'add.vue')
    },
    // 生成页面
    submit() {
      this.textInit()
      const text = `
<template>
    <div class="app-container">${this.getForm()}${this.getTable()}${this.getDialog()}${this.getDetail()}
    </div>
</template>
<script>
    import TablePage from '@/components/TablePage'${this.getScript()}<\/script>
<style lang="scss" scoped>
    ${this.getCSS()}
</style>
   `
      exportFile(text, 'template.vue')
    },
    // 生成依赖
    submitRely() {
      this.$refs.rely.click()
    }

  }
}
</script>
<style lang="scss" scoped>
.content{
    padding: 0 20px;
    margin-bottom: 40px;
    font: 13px/21px Arial,sans-serif;
    color: #333;
}
.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep {
  .el-input {
    width: 110px;
  }
  .el-form {
    text-align: center;
  }
  .bt {
    width: 100px;
    margin: 20px 0;
  }
}
.text-left{
    text-align: left;
}
.d-none{
    display: none;
}
</style>

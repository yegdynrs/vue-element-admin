<!--
代码重构思想：

循环keyList，生成每个keyList的 html，search，table，dialog，详情，script import依赖，data，methods，最后就行一个去重，编辑融合
-->
<template>
  <div class="content">
    <template slot="header">页面生成JSON-wanghao</template>
    <a ref="rely" href="./static/rely.zip" download="依赖文件" class="d-none" />
    <pre>
未完成事项：
    1、文字相似度匹配，原型的字段与后端注释的文字相似的匹配原型文字
    2、mock数据，表格、搜索条件mock、详情返回 一套生成
    3、考虑需不需要 纯简单页面，页面数据只保留接口字段string完成页面，（赶时间要求不高那种）

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

</pre
    >
    <el-form ref="form" inline :model="form">
      <el-checkbox v-model="form.hasDetail" @change="xqchange">需要详情</el-checkbox>
      <el-checkbox v-model="form.hasTable" @change="tabchange">需要table</el-checkbox>
      <el-checkbox v-model="form.hasDialog" @change="dialogChange">需要新增修改弹窗</el-checkbox>


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
              <el-option v-for="(ite, inx) in typeList" :key="'formSearch-typeList-' + scope.$index + '-' + inx" :value="ite.value" :label="ite.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="新增表单" prop="dialog.value" min-width="120px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.dialog.value">新增修改弹窗</el-checkbox>
            <div v-show="scope.row.dialog.value">
              <el-input v-model="scope.row.dialog.label" placeholder="表单名称别名" />
              <el-input v-model="scope.row.dialog.key" placeholder="表单Key别名" />
              <div v-if="(scope.row.type == 'time' || scope.row.type == 'moneyRange' || scope.row.type == 'dateLimit') && scope.row.dialog.value">
               
              <el-input v-model="scope.row.dialog.combination.key1" placeholder="key1" />

              <el-input v-model="scope.row.dialog.combination.key2" placeholder="key2" />
            </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="table" prop="table.value" min-width="120px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.table.value">为table</el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="搜索" prop="search.value" min-width="120px">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox v-model="scope.row.search.value">为搜索条件</el-checkbox>
              <div v-if="scope.row.search.value">

                <div >
                  <el-input v-model="scope.row.search.label" placeholder="搜索名称别名" />
                  <el-input v-model="scope.row.search.key" placeholder="搜索Key别名" />
                </div>
                <div v-if="scope.row.type == 'time' || scope.row.type=='dateLimit' || scope.row.type == 'moneyRange'">

                  <el-input v-model="scope.row.search.combination.key1" placeholder="key1" />
                  <el-input v-model="scope.row.search.combination.key2" placeholder="key2" />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="关联List" prop="list.value" width="200px">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox v-model="scope.row.list.value" @change="listChange(scope)" />
              <div v-if="scope.row.list.value">
                <el-input v-model="scope.row.list.name" placeholder="name" />
                <el-input v-model="scope.row.list.labelKey" placeholder="label" />
                <el-input v-model="scope.row.list.key" placeholder="key" />
                <el-input v-model="scope.row.list.data" type="textarea" :autosize="{ minRows: 2, maxRows: 14 }" placeholder="请输入列表数据" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="slot列表" prop="slot.value">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox v-model="scope.row.slot.value" />
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="超出隐藏" prop="tooltip">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.tooltip" />
          </template>
        </el-table-column> -->

        <el-table-column label="操作" fixed="right" min-width="80px">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeList(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button size="small" class="bt" @click="addList">新增 </el-button>

      <div>
        <el-button size="small" class="bt" @click="submit">生成页面</el-button>
                <el-button size="small" class="bt" @click="submitTableKey">提取mock</el-button>

      </div>
      <div class="section-box">
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
        <el-input v-model="importFormData" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入数据模板" @change="importFormDataModal" />

      </div>

      <!--  根据原型调整顺序，把和原型不一样的筛查到最前面  -->
      <div class="section-box">
                      <h3>根据原型顺序调整,把后端结构和原型不一样的筛查到最前面，</h3>

        <pre class="text-left">
测试数据：
规则名称


规则说明
        </pre>
        <el-input v-model="defaultSortData" @change="defaultSort" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入数据模板" />

      </div>
      <div class="section-box">
                <h3>apiDoc</h3>

        <pre class="text-left">
测试数据：
list[0].ruleId	Integer	是	规则主键id	
list[0].ruleName	String	是	规则名称
list[0].ruleDesc	String	是	规则说明
        </pre>
        <el-input v-model="defaultApiDocData" @change="defaultApiDoc" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入apiDoc数据" />
      </div>

      <div class="section-box">
                     <h3>JAVA注解结构</h3>

        <pre class="text-left">
@ApiModelProperty("主键")
private Integer shareId;

@ApiModelProperty("订单编号")
private String orderNo;
        </pre>
        <el-input v-model="defaultJavaData" @change="defaultJava" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入数据模板" />

      </div>

    
      <div class="section-box">
                      <h3>完整数据</h3>

        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入表单" :value="JSON.stringify(form)" @input="formJsonModal" />

      </div>
        <!-- <div>
        <h3>数据模板</h3>
        <el-input v-model="defauleJsonModal" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入数据模板" />
      </div> -->
    </el-form>
    <!-- <xklView class="xkl"></xklView> -->
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import exportFile from '@/vendor/exportFile'
import xklView from './xkl.vue'
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
    value: false,
  },
  slot: { value: false }, // 有slot的添加slot-scope
  dialog: {
    // 是否是新增，编辑弹窗
    key: '',
    label: '',
    value: false,
    combination: {
      key1: '',
      key2: '',
    },
  },
  table: {
    value: true,
  },
  type: 'input',
  search: {
    value: false,
    key: '',
    combination: {
      key1: '',
      key2: '',
    },
    label: '',
  },
  rowKey: new Date().getTime(),
}
export default {
  name: 'HtmlPage',
  components: {
    xklView,
  },
  data() {
    return {
      list: {
        defaultLabelKey: 'desc',
        defaultValueKey: 'code',
      },
      defauleJsonModal: JSON.stringify(defauleJson),
      importFormData: '',
      defaultSortData: '',
      defaultJavaData: '',
      defaultApiDocData: '',
      importFormDataJson: {},
      typeList: [
        {
          value: 'input',
          label: 'input',
        },
        {
          value: 'textarea',
          label: 'textarea',
        },

        {
          value: 'select',
          label: '下拉选择',
        },
        {
          value: 'radio',
          label: '单选',
        },
        {
          value: 'time',
          label: '过去时间',
        },
        {
          value: 'dateLimit',
          label: '未来时间'
        },
        {
          value: 'moneyRange',
          label: '数字范围',
        },
      ],
      form: {
        keyList: [JSON.parse(JSON.stringify(defauleJson))],
        hasDetail: false,
        hasTime: false, // 存在搜索时间
        hasMoney: false, // 存在搜索钱范围
        hasDialog: false, // 存在dialog，新增，详情
        searchRow: false, // 搜索内容较多时，采用row
        hasTable: true,
      },
    }
  },
  watch: {
    defauleJsonModal(val) {
      val.rowKey = this.form.keyList.length + 1 + new Date().getTime()
      defauleJson = JSON.parse(val)
    },
  },
  mounted() {
    const sortable = new Sortable(this.$refs.table.$el.querySelector('tbody'), {
      animation: 150,
      onEnd: this.onEnd,
      ghostClass: 'blue-background-class',
    })
  },
  methods: {
    upCase(data) {
      return data[0].toLocaleUpperCase() + data.substr(1)
    },
    onEnd({ newIndex, oldIndex }) {
      const old = this.form.keyList[oldIndex]
      this.form.keyList.splice(oldIndex, 1)
      this.form.keyList.splice(newIndex, 0, old)
    },
    formJsonModal(val) {
      this.form = JSON.parse(val)
    },
    // 根据原型排序，并筛查出
    defaultSort(val) {
      if (!val) {
        return
      }
      let arr = val.trim().split('\n')
      arr = arr
        .filter((item) => {
          return item.trim()
        })
        .map((item) => {
          return item.trim()
        })
      if (this.form.keyList?.length > 1) {
        this.form.keyList.forEach((item) => {
          let text = arr.find((ite) => {
            return ite.includes(item.label)
          })
          if (text ) {
            if(text.replace(/[（(元)）\s]/gim, '') == item.label.replace(/[（()）\s]/gim, '')){
              item.label = text
            }else{
              // 待扩展
            }
          }
        })
        this.form.keyList.sort((a, b) => {
          return arr.indexOf(a.label) - arr.indexOf(b.label)
        })
      } else {
        this.form.keyList = arr.map((item, index) => {
          const data = JSON.parse(JSON.stringify(defauleJson))
          data.label = item
          data.key = 'key' + (index + 1)
          data.rowKey = index + 1 + new Date().getTime()
          return data
        })
      }
      console.log(this.form.keyList)
    },
    defaultJava(val){
       if (!val) {
        return
      }
      
      let arr = val.split('\n\n')
      var str = ``;
     arr.map((item,index)=>{
        let c = /"(.*)".*\n.*\s([^\s]*)\s([^\s]*);/img.exec(item)
        str+= `${c[3]} (${c[2]}, optional): ${c[1]} ,\n`
      })
      this.importFormDataModal(str)
    },
    defaultApiDoc(val){
       if (!val) {
        return
      }
var str = ``;
val.split("\n").forEach((item)=>{
var text = item.replace(/[\s\n\t]/img,'--').split("--")
str+= `${text[0].replace("list[0].",'')} (${text[1]}, optional): ${text[3]} ,\n`

})
this.importFormDataModal(str)

    },
    importFormDataModal(val) {
      var a = val.trim()
      a = a[a.length - 1] === ',' ? a : (a += ',')
      a = a.split('\n')
      let str = ''
      let isNumber = false
      let isRadio = false
      const json = {}
      const keyList = []
      a.map((item, index) => {  
        var arr = /([\w\.]*)\s*(\([^\)]*\))([^:：]*[:：]\s*([a-zA-Z0-9\u4e00-\u9fa5\(\（\）\)]*)\s*(.*)\s*[,])?/gim.exec(item)
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
          if (data.label.includes('时间') || data.label.includes('日期')) {
            data.type = 'time'
          }

          if (arr[5] && arr[5] !== ' ') {
            arr[5] = arr[5]
              .trim()
              .replace(/[（()）]/gim, '')
              .replace(/\s+/gim, ',')
              .replace(/，/gim, ',')
              .replace(/[-\s?]/gim, ':')
              .replace(/[：:\s?]/gim, ':')
            console.log(arr)
            const list = arr[5].split(',')
            const selectList = []
            list.forEach((item) => {
              const arr = item.split(':')
              if (arr[1] !== undefined && arr[0] !== undefined) {
                selectList.push({
                  [this.list.defaultLabelKey]: arr[1],
                  [this.list.defaultValueKey]: isNumber ? Number(arr[0]) : isRadio ? Boolean(arr[0]) : arr[0],
                })
              }
            })
            data.type = isRadio ? 'radio' : 'select'
            data.dialog.value = false
            data.slot.value = true
            data.list.name = arr[1] + 'List'
            data.list.value = true
            data.list.key = this.list.defaultValueKey
            data.list.labelKey = this.list.defaultLabelKey
            data.list.data = JSON.stringify(selectList)
          }
          keyList.push(data)
        }
        return item
      })
      str = `{
        ${str}
      }`
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
        return Math.max(
          ...value.map((item) => {
            return this.getLabelWidth(item.length)
          })
        )
      }
      return value * 14 + 20
    },
    listChange(scope) {
      if (scope.row.list.value) {
        scope.row.list.key = this.list.defaultValueKey
        scope.row.list.labelKey = this.list.defaultLabelKey
        scope.row.list.name = scope.row.key && scope.row.key + 'List'
      } else {
        scope.row.list.key = ''
        scope.row.list.labelKey = ''
        scope.row.list.name = ''
      }
    },
    dialogChange() {
      if (!this.form.hasDialog) {
        this.form.keyList.forEach((item) => {
          item.dialog.value = this.form.hasDialog
        })
      }
    },
    tabchange() {
      if (!this.form.hasTable) {
        this.form.keyList.forEach((item) => {
          item.table.value = this.form.hasTable
        })
      } else {
        if (
          !this.form.keyList.some((item) => {
            return item.table.value
          })
        ) {
          this.form.keyList.forEach((item) => {
            item.table.value = this.form.hasTable
          })
        }
      }
    },
    xqchange() {
      if (!this.form.hasDetail) {
        this.form.keyList.forEach((item) => {
          item.dialog.value = this.form.hasDetail
        })
      }
    },
    getTableContent() {
      if (!this.form.hasTable) {
        return ''
      }
      let str = ''
      this.form.keyList.filter((item)=>{
             return item.table.value
           }).forEach((item) => {
        str += `{
          valueKey: '${item.key}',
          name: '${item.label}'${
          item.type == 'select' && item.slot.value
            ? `,
          // 列表slot
          moreParam: { slot: true, selectlabel: '${item.list.labelKey || this.list.defaultLabelKey}', selectValue: '${item.list.key || this.list.defaultValueKey}' },
          selectList: ${item.list.data || '[]'}`
            : ''
        }
        },\n`
      })
      return str
    },
    getTableSearch() {
      if (!this.form.hasTable) {
        return ''
      }
      let str = ''
      this.form.keyList.filter((item)=>{
             return item.search.value
           }).forEach((item) => {
        if (item.type == 'select' || item.type == 'radio') {
          str += `{
                    name: '${item.search.label||item.label}',
                    value: '',
                    valueKey: '${item.search.key||item.key}',
                    type: 'select',
                     selectList: ${item.list.data || '[]'},
                     moreParam: { hasAll: true, selectlabel: '${item.list.labelKey || this.list.defaultLabelKey}', selectValue: '${item.list.key || this.list.defaultValueKey}' },
                     attr: { filterable: true, clearable: true }
                },\n`
        } else if (item.type == 'time'||item.type=='dateLimit') {
          str += `{ valueKey: ['${item.search.combination.key1}', '${item.search.combination.key2}'], value: ['', ''], name: '${item.search.label||item.label}', type: 'dateLimit', attr: { islimitlength: true, dataNotLimit: ${item.type=='dateLimit'},  longtime: longQueryTime(1, 'year') }},\n`
        } else {
          str += `{
                    name: '${item.search.label||item.label}',
                    value: '',
                    valueKey: '${item.search.key||item.key}',
                    type: '${item.type}'
                  },\n`
        }
      })
      return str
    },
    getDialogForm(){
       if (!this.form.hasDialog) {
        return ''
      }
      let str = ''
            this.form.keyList.filter((item)=>{
             return item.dialog.value
           }).forEach((item) => {
                      if (item.type == 'select' || item.type == 'radio') {
                        str += `{
                            name: '${item.dialog.label||item.label}',
                            value: '',
                            valueKey: '${item.dialog.key||item.key}',
                            type: '${item.type}',
                            // 列表slot
                            moreParam: {  selectlabel: '${item.list.labelKey || this.list.defaultLabelKey}', selectValue: '${item.list.key || this.list.defaultValueKey}' },
                            selectList: ${item.list.data || '[]'},
                      },\n`
                      }else if(item.type=='dateLimit'||item.type=='time'){
                       str += `{ valueKey: ['${item.dialog.combination.key1}', '${item.dialog.combination.key2}'], value: ['', ''], name: '${item.dialog.label||item.label}', type: 'dateLimit', attr: { islimitlength: true,dataNotLimit: ${item.type=='dateLimit'}, longtime: longQueryTime(1, 'year') }},\n`
                      }else{
                        str +=` {
                        valueKey: '${item.dialog.key||item.key}',
                        name: '${item.dialog.label||item.label}',
                        type: '${item.type}',
                        attr: {},
                        rules: true
                      },\n`
               }
            })
            return str
    },
    submitTableKey(){

     
      let str = ''
           this.form.keyList.forEach((item) => {
              let mockVal = `'${item.label}'`
              if(item.type=='radio'||item.type=='select'){
                mockVal = `/${(JSON.parse(item.list.data)||[]).map(v=>`(${v[item.list.key]})`).join('|')}/`
              }
              if(item.type=='time'||item.type=='dateLimit'){
                mockVal = `'@datetime()'`
              }
              if(item.type=='number'||['元','总','金额','数','笔','次'].some(v=>item.label.includes(v))){
                 mockVal = `/[0-9]{3}/`
              }
               str+=`'${item.key}': data.${item.key} || ${mockVal}, //  ${item.label} \n`
            })
this.$message.success('结果在控制台输出')
  console.log(`export const getMockList = ({ data = {}}) => {
  return listCon(
    mock({
      'list|3-10': [{${str}} ]
    })
  )
}`)

},
    getDialogDefault(data,type='dialog'){
     data = data || this.form.keyList
      let str = ''
           data.filter((item)=>{
             return item[type].value
           }).forEach((item) => {
              if(item.type=='time'||item.type=='dateLimit'||item.type=='moneyRange'){
                str+=`'${item[type].combination.key1}':'',\n'${item[type].combination.key2}':'',\n`
              }else if(item.type=='hasChild'){
                str+=`'${item.key}':[],\n` // 暂未支持嵌套生成
              } else if(item.type=='radio'){
                let value = ''
                 try {
                 let list =  JSON.parse(item.list.data)
                  if(list.length){
                   value = list[0][item.list.key || this.list.defaultValueKey]
                   value = typeof value=='number'?value:`'${value}'`
                  }
                 } catch (error) {
                 }
                str+=`'${item.key}':${value},\n`
              }else{
                str+=`'${item.key}':'',\n`
              }
            })

            return str
    },
    formInit() {
      this.form.keyList.forEach((item) => {
        if(item.table.value){
          this.form.hasTable = true
        }
        if(item.dialog.value){
          this.form.hasDialog = true
        }
        if (item.type === 'time') {
          this.form.hasTime = true
        }
      })
    },
    zibao() {
      this.$xkl.start()
    },
    getImportCom(){
      let arr = [{
        name:'HhPage',
        value:this.form.hasTable,
        api:'listRequest',
        components:`import HhPage from '@/components/HhPage/page'`
      },
      {
        name:'HhFormDialog',
        value:this.form.hasDialog,
        api:' addRequest, editRequest',
        components:`import HhFormDialog from '@/components/HhPage/form-dialog'`
      },{
        name:'HhDetailDialog',
        value:this.form.hasDetail,
        api:'detailRequest',
        components:`import HhDetailDialog from '@/components/HhPage/detail-dialog'`
      }]
      return {
        api:arr.filter(v=>v.value).map(v=>v.api).join(', '),
        comImport: arr.filter(v=>v.value).map(v=>v.components).join('\n'),
        components: arr.filter(v=>v.value).map(v=>v.name).join(', '),
      }
    },
    // 生成页面
    submit() {
      if (!this.form.hasTable && !this.form.hasDetail && !this.hasDialog) {
        this.zibao()
        return
      }
      this.formInit()
      
      const text = `
<template>
  <div>
    ${this.form.hasTable ? `<hh-page ref="page" :table="table" :head="head" :content="content" :search-option="searchOption" :tools="tools" />` : ''}
    ${this.form.hasDialog?`<HhFormDialog ref="formDialog" :list="formKey" :dialog-attr="dialogAttr" :visible.sync="formVisible" :form-submit-api="formSubmit"></HhFormDialog>
`:''}
  </div>
</template>
<script>
${this.getImportCom().comImport}
import { ${this.getImportCom().api} } from '@/api/template'
${this.form.hasTime ? `import { longQueryTime } from '@/utils/tools'` : ''}
${this.form.hasDialog?`const defaultFormValue = {
              ${this.getDialogDefault()}
              }`:''}
export default {
  name: '',
  components: { ${this.getImportCom().components}  },
  data() {
    return {
      ${
        this.form.hasTable
          ? `
      table: {
        check: false && {
          // 开启列表多选
          attr: {
            selectable: item => {
              return true
            }
          }
        },
        getList: listRequest // 请求列表接口，如果需要自定义处理请求列表，那么传入绑定的函数 this._getTableList
      },
      content: [${this.getTableContent()}],
      searchOption: [${this.getTableSearch()}],
      head: [${
        this.form.hasDialog
          ? `
   
        {
          permiss: true, // or string 权限标识符
          name: '新增',
          click: this.hanldAdd
        }
 `
          : ''
      }],
     
         tools: [
      ${
        this.form.hasDetail
          ? `
   
         {
          permiss: true, // or string 权限标识符
          name: '详情',
          click: this.hanldDetail
        },
  
      `
          : ''
      }
      ${
        this.form.hasDialog
          ? `
   
         {
          permiss: true, // or string 权限标识符
          name: '修改',
          click: this.hanldEdit
        },
  
      `
          : ''
      }
      
          ],
      `
          : ''
      }
      ${this.form.hasDialog?`
      dialogAttr: { type: 'add', title: '新增' },
      formVisible: false,
      formKey: [${this.getDialogForm()}],
      formValue: JSON.parse(JSON.stringify(defaultFormValue)),
      `:''}

      
    }
  },
  created() {},
  mounted() {},
  methods: {
    ${this.form.hasDialog?`
       // 表格头部按钮、新增
  hanldAdd() {
      this.dialogAttr = { type: 'add', title: '新增', width: '60%' }
      this.formValue = JSON.parse(JSON.stringify(defaultFormValue))
      this.$nextTick(() => {
        this.formVisible = true
      })
  },
   // 操作、修改
  hanldEdit(){
    this.formVisible = true
      this.dialogAttr = { type: 'edit', title: '修改' }
      this.$nextTick(() => {
        // this.formValue = {} // 给表单赋值

      })
  },
      // 弹窗提交
    formSubmit(data) {
      console.log(data, 'formSubmit')
      let api = ''
      if (this.dialogAttr.type == 'add') {
        // 新增接口
        api = addRequest
      } else {
        // 修改接口处理
        api = editRequest
      }

      return api({
        data: JSON.parse(JSON.stringify(this.formValue))
      }).then(res => {
        this.$refs.page._getTableList()
        // 自定义使用 this._getTableList()
        return res
      })
    },
       // 表单弹窗取消事件，也可以不要
    formCancel(type) {
      if (type == 'success') {
        this.$refs.page._getTableList()
        this.formVisible = false
      }
    },
    `:''}
    ${this.form.hasDetail?`
  // 操作、详情
  hanldDetail(row){
      detailRequest({ data: { id: row.id }}).then(res => {
        if (res.resultCode == '0000') {
          this.details = Object.assign({}, row, res.data)
          this.$refs.detail.dialogVisible = true
        }
      })
  },
    `:''}
    ${
      this.form.hasTable
        ? `
  
  // 如果需要自定义搜索
   _getTableList(data) {
      // 没有设置getList，自定义搜索请求时
      console.log(data, '_getTableList')
      const refObj = this.$refs.page
      console.log('这是请求参数：', data)
      // return Promise.reject('我被拦截了')
      return listRequest(data).then(res => {
        console.log('这是返回结果')
        // refObj是组件，如果要搞啥，直接通过它改
        return res
      })
    },
    `
        : ``
    }
 
  }
}
<\/script>

`
      exportFile(text, 'template.vue')
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0 20px;
  margin-bottom: 40px;
  font: 13px/21px Arial, sans-serif;
  color: #333;
  position: relative;
  z-index: 1;
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
  .bt + .bt {
    margin-left: 20px;
  }
}
.text-left {
  text-align: left;
}
.d-none {
  display: none;
}
.xkl {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
}

.section-box{
  padding: 10px;
  border-radius: 10px;
  border-bottom: 1px solid #f5f5f5;
  box-shadow: 0 0 4px 1px #aaa;
  & + .section-box{
    margin-top: 30px;
  }
  pre{
      max-height: 100px;
    overflow-y: scroll;
}
}

</style>

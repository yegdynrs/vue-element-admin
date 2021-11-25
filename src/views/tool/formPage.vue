<!--
-->
<template>
  <div class="content">
    <template slot="header">表单生成-wanghao</template>
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
    11：需要自己调整下格式化出来的空格问题。。。

</pre>
    <el-form ref="form" inline :model="form">
      <el-table
        ref="table"
        :data="form.keyList"
        style="width: 100%"
        row-key="rowKey"
      >
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
            <div
              v-if="
                (scope.row.type == 'time' ||
                  scope.row.type == 'money' ||
                  scope.row.type == 'futureTime')
              "
            >
              <el-input
                v-model="scope.row.combination.key1"
                placeholder="key1"
              />

              <el-input
                v-model="scope.row.combination.key2"
                placeholder="key2"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联List" prop="list.value" width="200px">
          <template slot-scope="scope">
            <div class="flex-center">
              <el-checkbox
                v-model="scope.row.list.value"
                @change="listChange(scope)"
              />
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
        <el-button size="small" class="bt" @click="submit">生成表单</el-button>
        <el-button
          size="small"
          class="bt"
          @click="submitForm"
        >生成表单</el-button>

        <el-button
          size="small"
          class="bt"
          @click="submitRely"
        >下载依赖文件</el-button>
      </div>
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
  list: {
    name: '',
    key: '',
    labelKey: '',
    data: '',
    value: false
  },
  combination: {
    key1: '',
    key2: ''
  },
  type: 'text',
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
          label: '过去时间'
        },
        {
          value: 'futureTime',
          label: '未来时间'
        },
        {
          value: 'money',
          label: '数字范围'
        },
        // {
        //   value: 'file',
        //   label: '上传'
        // },
        {
          value: 'address',
          label: '地址联动'
        },
        {
          value: 'phone',
          label: '电话号码'
        },
        {
          value: 'enterprise',
          label: '社会信用代码'
        },
        {
          value: 'certNo',
          label: '身份证号码'
        },
        {
          value: 'bankCardNo',
          label: '银行账号'
        }
      ],
      form: {
        keyList: [JSON.parse(JSON.stringify(defauleJson))]
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
              .replace(/\s+/gim, ' ')
              .replace(/，/gim, ',')
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
        return Math.max(
          ...value.map(item => {
            return this.getLabelWidth(item.length)
          })
        )
      }
      return value * 14 + 12
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0 20px;
  margin-bottom: 40px;
  font: 13px/21px Arial, sans-serif;
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
</style>

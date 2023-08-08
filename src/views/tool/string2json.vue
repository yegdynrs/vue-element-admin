<!-- 字符串表格转json -->
<!--1：目前主要优先解决doc文档、表格转json对象-->
<template>
  <div class="content">
    测试数据：
    <template v-for="(item, index) in test">
      <pre :key="index">{{ item }}</pre>
    </template>
    <el-input
      v-model="tableStrData"
      @change="tableStrChange()"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="请输入数据模板"
    />
    <button @click="startTest">运行例子</button>
    <button @click="mockForm()">生成MOCK Form数据</button>
    <button @click="mockTable()">生成MOCK Table数据</button>
  </div>
</template>
<script>
import { mock } from "mockjs";
export default {
  name: "",
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      tableStrData: "",
      test: [
        `accountPhone	String	否	11	账户手机号
accountRegisterWay	Integer	是	2	注册方式：1静默接口 2密码 3验证码 4静默CA 5扫码
certType	Integer	否	2	证件号类型 1:统一社会信用代码、2:CA 3:手机号`,
        `openingTime	开标时间	string			yyyy-MM-dd HH:mm:ss
orgType	采购组织形式	string			1 - 委托项目; 2 - 自行组织项目
bidType	投标维度	string			 1-项目维度,2-标项维度`,
        `auditStatus	审批意见	String	5	是	 3-拒绝 2-通过
memo	意见说明	String	255	否	`,
        `userCertType	int	10	Y	证件类型	0 未认证
P_0 OA认证
P_1 手机短信验证
P_2 二要素验证
P_3 三要素验证
P_4 银行卡四要素验证
P_5 CA认证
P_MANUAL 人工审核
userCertTypeDesc	varchar	64	Y	证件类型描述	
userCertNo	varchar	64	Y	证件号码	2
userName	varchar	32	N	用户姓名	1
userType	varchar	10	Y	用户类型	sys系统用户
cust客户用户 默认`,
`configName (string, optional): 配置名称 ,
districtCityCode (string, optional): 收费规则市地区code(多个用|号分割) ,
districtSaveJson (string, optional): 前端传递地区json字段 ,
effectTimeEnd (string, optional): 生效时间结束 ,
isValid (string, optional): 是否有效(1:有效,0:无效) ,
lowestCost (number, optional): 最低收费金额 单位:元 保留小数点两位 ,
operationName (string, optional): 操作人名称 ,
productType (string, optional): 保函类型 1:投标保函 2:履约保函 3:融资保函 4:货运保函 5:工程保函 6:预付款保函保险 `
      ],
      valueList: [], // 渲染后的数据
      cardReg: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
      phoneReg: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
    };
  },
  methods: {
    callRes(data) {
      return {
        resultCode: "0000",
        resultMessage: "成功",
        data: mock(data)
      };
    },
    listCon(data) {
      let mockObj = mock({
        pagination: {
          pageIndex: 1,
          pageSize: 10,
          "totalPage|1-10": 1,
          "totalRecord|1-100": 1
        },
        "list|6-10": [data]
      });
      return this.callRes(mockObj);
    },
    mockForm(data = this.valueList) {
      let mockStr = "";
      data.forEach(item => {
        mockStr += `${this.getMockItem(item)}\n`;
      });
      let mockStrExport = `import { mock } from 'mockjs'
import { callRes } from '@/mock'
${this.getListEnumString(data)}

mock(/mockKey\=key/, options => {
  let data = JSON.parse(options.body)
  // dubbo 包了一层data
  data = data.data || data
  let mockRule =  {
${mockStr}
    }
    // 如果是搜索，将搜索的值，赋值给mock数据
    Object.key(data).forEach(v=>{
      if(mockRule[v]){
        mockRule[v] = data[v]
      }
    })
  return listCon(
   mockRule
  )
})

`;
      console.log(mockStrExport);
      console.log(this.mockData(data, "form"));
    },
    mockTable(data = this.valueList) {
      let mockStr = "";
      data.forEach(item => {
        mockStr += `${this.getMockItem(item)}\n`;
      });
      let mockStrExport = `import { mock } from 'mockjs'
import { listCon, callRes } from '@/mock'
${this.getListEnumString(data)}

mock(/mockKey\=key/, options => {
  let data = JSON.parse(options.body)
  // dubbo 包了一层data
  data = data.data || data
  let mockRule =  {
${mockStr}
    }
    // 如果是搜索，将搜索的值，赋值给mock数据
    Object.key(data).forEach(v=>{
      if(mockRule[v]){
        mockRule[v] = data[v]
      }
    })
  return listCon(
   mockRule
  )
})

`;
      console.log(mockStrExport);
      console.log(this.mockData(data, "table"));
    },
    // 生成mock，输出在控制台
    mockData(data, type) {
      let mockStr = "";
      data.forEach(item => {
        mockStr += `${this.getMockItem(item, "tools")}\n`;
      });
      let mockData;
      if (type == "table") {
        mockData = eval(`this.listCon({
          ${mockStr}
        })`);
      } else if (type == "form") {
        mockData = eval(`this.callRes({
           ${mockStr}
        })`);
      }

      console.log(mockData, JSON.stringify(mockData));
    },
    getMockItemEnum(item, type) {
      // 生成的时候生成的
      if (type == "build") {
        if (item.type == "select" || item.type == "radio") {
          return `"${item.valueKey}|1": ${item.valueKey}List.map(v=>v.code), // ${item.name}`;
        } else if (item.type == "selectDesc") {
          return `// ${item.name}：枚举值见${item.enumKey}List
        "${item.valueKey}": function(){
          return (${item.enumKey}List.find(v=>v.code==this.${item.enumKey})||{}).desc
        }, // ${item.name} `;
        }
      } else {
        // 工具中生成的
        if (item.type == "select" || item.type == "radio") {
          return `"${item.valueKey}|1": [${item.selectList
            .map(v => {
              if (item.valueType.includes("int")) {
                if (/^[0-9]+$/.test(v.code)) {
                  return `${v.code}`;
                } else {
                  console.log(
                    "这里发现一个类型与枚举值不匹配，请手动更正",
                    item.valueKey
                  );
                  return `"${v.code}"`;
                }
              }
              return `"${v.code}"`;
            })
            .join(",")}], // ${item.name}： ${JSON.stringify(item.selectList)}`;
        } else if (item.type == "selectDesc") {
          return `// ${item.name}：枚举值见${item.enumKey}
        "${item.valueKey}": function(){
          return (${JSON.stringify(item.selectList)}.find(v=>v.code==this.${
            item.enumKey
          })||{}).desc
        }, // ${item.name} `;
        }
      }
    },
    getMockItem(data, type = "build") {
      let item = { ...data };
      item.valueType = (item.valueType || "").toLocaleLowerCase();
      // if( ["","int","integer",'string','date','bigdecimal','boolean','float','long','file','photo'].includes(item.valueType)){
      if (["select", "radio", "selectDesc"].includes(item.type)) {
        return this.getMockItemEnum(item, type);
      } else if (
        item.type == "dateLimit" ||
        item.type == "dateDay" ||
        item.valueType == "date"
      ) {
        return `"${item.valueKey}": "@datetime()", // ${item.name}`;
      } else if (item.type == "file" || item.valueType.includes("file")) {
        return `"${item.valueKey}": "hhdoc2023021311010000002508", // ${item.name}  ossId、docId`;
      } else if (item.type == "file-mui") {
        return `// ${item.name}
        "${item.valueKey}": [{
          "fileName": "MOCK文件名1",
          "docId": "hhdoc2023021311010000002508"
        },{
          "fileName": "MOCK文件名2",
          "docId": "hhdoc2023021311010000002508"
        }],`;
      } else if (item.type == "card") {
        return `"${item.valueKey}": ${this.cardReg}, // ${item.name} `;
      } else if (item.type == "phone") {
        return `"${item.valueKey}": ${this.phoneReg}, // ${item.name} `;
      } else if (
        ["bigdecimal", "int", "integer", "strinBigDecimalg"].includes(
          item.valueType
        )
      ) {
        return `"${item.valueKey}": "@integer(100, 10000000)", // ${item.name} `;
      } else if (item.valueType == "boolean") {
        return `"${item.valueKey}|1-2": true, // ${item.name} `;
      } else {
        return `"${item.valueKey}": "@${([
          "string",
          "boolean",
          "float"
        ].includes(item.valueType)
          ? item.valueType
          : "ctitle"
        ).toLocaleLowerCase()}(1,${item.length < 18 ? item.length : 8})", // ${
          item.name
        } `;
      }
      //  }
    },
    getListEnumString(list) {
      let str = "";
      list.forEach(v => {
        if (v.type == "select" && v.selectList) {
          str += `
          // ${v.name}枚举
          const ${v.valueKey}List = ${JSON.stringify(v.selectList)}\n`;
        }
      });
      return str;
    },
    startTest() {
      this.test.forEach(item => {
        this.tableStrChange(item);
      });
    },
    tableStrChange(value) {
      let data = value || this.tableStrData;
      let type = "word";
      if (/\w* \(\w*(, )?\w*\)\:.*(, )?\n/.test(data)) {
        type = "swagger";
      }
      // console.log(type, data);
      // 切分为一行一行的数组
      let rowList = [];
      if (type == "word") {
        rowList = data
          .split(/\n(?=[^\t\n]+\t)/)
          .filter(v => v.trim())
          .map(v => {
            return v.split(/[\t]/);
          });
      } else if (type == "swagger") {
        rowList = data
          .split(/ *,?\n/)
          .filter(v => !(v.includes("pageIndex") || v.includes("pageSize")))
          .map(v => {
            let match = v.match(
              /(\w*) \((\w*),? *(\w*)\):? *([\u4E00-\u9FA5]+)(.*)/
            );
            if (match) {
              let matchList = [1, 2, 3, 4, 5].map(v => match[v]);
              if (
                matchList[4][0] &&
                matchList[4][0].match(/[\w\u4E00-\u9FA5]/)
              ) {
                // 如果最后一个数组的，第一个字符，不是分割开的，那排除枚举
                matchList[4] = "";
              }
              return matchList;
            }
            return [];
          });
      }

      console.log(rowList);
      // 获取类型的列
      let typeIndex = this.getTypeIndex(rowList);
      // 必填项的列
      let mustIndex = this.getMustIndex(rowList);
      // 获取长度的列的列
      let lenthIndex = this.getLengthIndex(rowList);
      // 获取key的列
      let keyIndex = this.getKeyIndex(rowList, [
        typeIndex,
        mustIndex,
        lenthIndex
      ]);
      // 获取名称的列
      let nameIndex = this.getNameIndex(rowList, [
        keyIndex,
        typeIndex,
        mustIndex,
        lenthIndex
      ]);
      // 获取枚举的列
      let descIndex = this.getDescIndex(rowList, [
        keyIndex,
        typeIndex,
        mustIndex,
        lenthIndex
      ]);
      // 如果名称与枚举列重叠，那么新启一列
      if (descIndex == nameIndex && nameIndex > -1) {
        rowList.forEach(v => {
          let value = v[nameIndex] || "";
          // 默认认为名称应当放在最前面
          let arr = value.split(/[ :：、,，\n\t]/);
          if (arr.length > 1) {
            v[nameIndex] = arr[0];
            let reg = new RegExp(`${v[nameIndex]}[ :：、\n\t]*`);
            v.push(value.replace(reg, ""));
          }
        });
      }
      // 重新获取desc的列
      descIndex = this.getDescIndex(rowList, [
        nameIndex,
        keyIndex,
        typeIndex,
        mustIndex,
        lenthIndex
      ]);

      console.log(
        typeIndex,
        mustIndex,
        lenthIndex,
        keyIndex,
        nameIndex,
        descIndex
      );
      let list = rowList
        .filter(v => v.length > 1)
        .map(v => {
          let json = {};
          if (v[keyIndex]) {
            json.valueKey = v[keyIndex].trim();
            json.valueKey = json.valueKey.match(/[a-zA-Z]*/)[0];
          }

          if (v[nameIndex]) {
            json.name = v[nameIndex].trim();
          }
          if (v[typeIndex]) {
            json.valueType = v[typeIndex].trim();
          }

          if (v[lenthIndex]) {
            json.length = Number(v[lenthIndex]);
          }
          if (v[mustIndex]) {
            json.must = /(是)|(YES)|(yes)|(y)/.test(v[mustIndex]) ? "Y" : "N";
          }
          if (v[descIndex]) {
            let enums = this.getEnum(v[descIndex],json);
            if (enums.length) {
              json.type = "select";
              json.selectList = enums;
              console.log(json.valueKey, JSON.stringify(enums));
            }
          }

          return json;
        })
        .filter(v => !["pageIndex", "pageSize"].includes(v.valueKey));
      // 有依赖上一个数组的结果，所有放到了这里
      list = list.map(v => {
        let json = v;
        json.type = this.getType(json, list);
        if (!json.type) {
          delete json.type;
        }
        return json;
      });
      let xxxx = list.map(v=>{
        return {
          name: v.name,
          valueKey: v.valueKey,
          selectList: v.selectList
        }
      })
      console.log(list, JSON.stringify(list));
      console.log(JSON.stringify(xxxx))
      this.valueList = list;
    },
    getType(item, list) {
      let name = item.name;
      if (!name) {
        return;
      }
      if (item.type) {
        return item.type;
      } else if (name.includes("元") || name.includes("金额")) {
        return "money";
      } else if (name.includes("日期") || name.includes("时间")) {
        return "dateDay";
      } else if (
        name.includes("文件") ||
        name.includes("正面") ||
        name.includes("反面")
      ) {
        return "file";
      } else if (
        name.includes("身份证") ||
        name.includes("信用代码") ||
        item.valueKey.toLocaleLowerCase().includes("certno")
      ) {
        return "card";
      } else if (item.valueKey.includes("Desc")) {
        // 存在desc，去除desc后，是否匹配    比如  orderStatus  orderStatusDesc   ，且orderStatus有枚举
        let obj = list.find(
          v =>
            v.valueKey == item.valueKey.replace("Desc", "") &&
            v.type == "select"
        );
        if (obj) {
          item.selectList = JSON.parse(JSON.stringify(obj.selectList));
          item.enumKey = obj.valueKey;
          return "selectDesc";
        }
      } else if (
        /([aA]rray)|([lL]ist *\<)/.test(item.valueType.toLocaleLowerCase())
      ) {
        return "array";
      }
    },
    getEnum(str,json) {
      if (!str) {
        return [];
      }
      let types = [
        {
          type: "number",
          reg: /[0-9]/,
          count: 0,
          index: -1
        },
        {
          type: "en",
          reg: /[a-zA-Z\_]/,
          count: 0,
          index: -1
        },
        {
          type: "china",
          count: 0,
          index: -1,
          reg: /[\u4E00-\u9FA5\(\（\)\）]/
          // reg: /[[\u4E00-\u9FA5]+[\w\(\（]*[\u4E00-\u9FA5][\)\）]?/g
        }
      ];

      // let fgArr = [' \n','\n','\t',String.raw`[、，, ](?=[^\n\t])`],fgMax = fgArr.map(v=>{
      //   let len = (str.match(new RegExp(`${v}`,'g'))||[]).length
      //   return len
      // })
      // let max = Math.max(...fgMax)
      // let fgf = fgArr.find((_v,i)=>max==fgMax[i]),reg = new RegExp(String.raw`[\u4E00-\u9FA5\w]+(${fgf})+`,'g')
      // let hasLine = (str.match(/ ?\n/g) || []).filter(v => v).length > 1;

      let arr = [];
      // if (hasLine) {
      //   arr = str.match(
      //     /[\u4E00-\u9FA5\w]+[ ]*[、，, :\-]?[ ]*[\u4E00-\u9FA5\w]+/g
      //   );
      // } else 
      if (/yyyy-mm-dd/.test(str.toLocaleLowerCase())) {
        arr = [];
      } else {
        let arr0 =
          str.match(
            /[\u4E00-\u9FA5\w]+[ ]*[、，, :\-]?[ ]*[\u4E00-\u9FA5\w]+/g
          ) || [];
        let arr1 = (
          str.match(
            /[\u4E00-\u9FA5\w]+[ ]*[、，、,:：\-]?[ ]*[\u4E00-\u9FA5\w]+/g
          ) || []
        ).filter(v => v);
        let arr2 = (
          str.match(/[\u4E00-\u9FA5\w]+[、，、,:：\-]?[\u4E00-\u9FA5\w]+/g) ||
          []
        ).filter(v => v);
        let arr0Length = this.getZyEnumLength(arr0);

        let arr1Length = this.getZyEnumLength(arr1);
        let arr2Length = this.getZyEnumLength(arr2);
        let matchSort = [
          { length: arr0Length, value: arr0 },
          { length: arr1Length, value: arr1 },
          { length: arr2Length, value: arr2 }
        ].sort((a, b) => {
          if (a.length == b.length) {
            return b.value.length - a.value.length;
          }
          return b.length - a.length;
        });
        arr = matchSort[0].value
        // console.log(matchSort,arr0,arr1,arr2)
      }
      // console.log(arr, str);

      // 根据类型切分成数组
      let arrs = this.splitEnum(arr, types);

      // 找到不同类型对应的index和count记录特征
      types = types.map(v => {
        let index = this.getCol(arrs, [v.reg]);
        let count = 0;
        if (index > -1) {
          count = arrs.reduce((a, b) => {
            return a + Number(v.reg.test(b[index]));
          }, count);
        }
        return {
          ...v,
          index: index,
          count: count
        };
      });

      let codeIndex = "",
        descIndex = "",
        typeJson = {};
      types.forEach(v => {
        typeJson[v.type] = v;
      });

      if (typeJson.china.index > -1) {
        // 1：带汉字的列为desc项，其他列为code
        descIndex = typeJson.china.index;
      } else if (typeJson.en.count == typeJson.number.count) {
        // 3：数据相同时，数字为code，英文为desc
        descIndex = typeJson.en.index;
      } else {
        descIndex =
          typeJson.en.count > typeJson.number.count
            ? typeJson.en.index
            : typeJson.number.index;
        // 2：数字和英文多的一列为code列，少的一列为desc，因为多的一列规律单一为code列
      }
      codeIndex = Math.abs(~-descIndex);

      return arrs.map(v => {
        let code =  v[codeIndex]
        if(['int','number','integer','float','double'].includes(json.valueType.toLocaleLowerCase&&json.valueType.toLocaleLowerCase())){
          code = Number(code)
        }
        return {
          code: code,
          desc: v[descIndex]
        };
      });
    },
    splitEnum(arr, types) {
      return arr
        .map(v => {
          //
          if (!this.getZyEnumLength([v])) {
            return "";
          }
          let hasFG = /[、:： \-;；]+/g;
          if (hasFG.test(v)) {
            let list = v.split(hasFG).filter(v => v.trim());
            if (list.length > 1) {
              return list;
            }
          } else {
            let index = v.split("").findIndex((j, i) => {
              if (i > 0) {
                let nowType = (types.find(f => f.reg.test(j)) || {}).type;
                let oldType = (types.find(f => f.reg.test(v[i - 1])) || {})
                  .type;
                return nowType != oldType;
              }
            });
            let valueList = [v.substring(0, index), v.substr(index, v.length)];
            if (
              index > -1 &&
              !(
                /[\u4E00-\u9FA5\(\（\)\）]/.test(valueList[0]) &&
                /[\u4E00-\u9FA5\(\（\)\）]/.test(valueList[1])
              )
            ) {
              return valueList;
            }
          }
        })
        .filter(v => v);
    },
    getZyEnumLength(enumArrayString) {
      // ['number','en'],['number','en','china'],['en','en'],['number','number]
      return (enumArrayString || []).reduce((a, b) => {
        return (
          a +
          [
            /(?=[^_]*[a-zA-Z])(?=[^_]*\d)/g,
            /(?=.*[\u4E00-\u9FA5])(?=.*\w)/g,
            /\w+[^\w]+[\w]/g,
            /\d+[^\d]*\d+/g
          ].some(k => {
            return k.test(b);
          })
        );
      }, 0);
    },
    // 获取类型的行
    getTypeIndex(list) {
      return this.getCol(list, ["string", "int", "integer"]);
    },
    // 必填项的行
    getMustIndex(list) {
      return this.getCol(list, ["是", "否", "y", "n", "yes", "no", "optional"]);
    },
    // 获取长度的列的项
    getLengthIndex(list) {
      return this.getCol(list, [/^[0-9]+$/]);
    },
    // 获取key的列
    getKeyIndex(list, exclude) {
      // 单词、数字、-_
      return this.getCol(list, [/^[\w\-]+$/], {
        exclude
      });
    },
    // 获取名称的列
    getNameIndex(list, exclude) {
      return this.getCol(
        list,
        [/^[\p{Unified_Ideograph}]+.*[\p{Unified_Ideograph}]$/u],
        {
          exclude
        }
      );
    },
    // 获取枚举的列
    getDescIndex(list, exclude) {
      return this.getCol(
        list,
        [
          /[\p{Unified_Ideograph}]+[-:：,，;； ]*\w+/u,
          /\w+[-:：,，;； ]*[\p{Unified_Ideograph}]+/u
        ],
        {
          exclude
        }
      );
    },
    getCol(
      list,
      rules,
      config = {
        exclude: [] // 排除的列
      }
    ) {
      let typeIndexList = [];
      list.forEach(item => {
        // 正反的去查找对应的下标
        ["findIndex", "findLastIndex"].forEach(key => {
          let i = item[key]((v, index) =>
            rules.some(k => {
              if (config.exclude && config.exclude.includes(index)) {
                return false;
              }
              if (typeof k == "function") {
                return k(v, item);
              }
              // 如果是字符串，那么做等于匹配
              let rule = typeof k == "string" ? new RegExp(`^${k}$`) : k;
              // 如果是正则，做正则test
              return rule.test(v.toLowerCase().replace(/' '/gim, ""));
            })
          );
          i > -1 ? typeIndexList.push(i) : "";
        });
      });
      return this.getIndex(typeIndexList);
    },
    // 获取数组中-重复最多的数
    getIndex(list) {
      let json = {};
      list.forEach(v => {
        json[v] = json[v] || 0;
        json[v]++;
      });
      let num = Number(
        Object.keys(json).find(k => json[k] == Math.max(...Object.values(json)))
      );
      return isNaN(num) ? -1 : num;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.content {
  padding: 0 20px;
  margin-bottom: 40px;
  font: 13px/21px Arial, sans-serif;
  color: #333;
}
pre {
  background: #cccccc40;
  padding: 10px;
}
</style>

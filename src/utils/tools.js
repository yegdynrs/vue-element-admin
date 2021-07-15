/**
 * 获取数组中 渲染到列表中的最大宽度
 *
 */
export const getStrWidth = (arr, minwidth) => {
  const arrLen = []
  const min = minwidth || 80
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i]
    if (str) {
      const char = str.match(/[\u2E80-\u9FFF]/g) // 中文
      const charLen = char ? char.length : 0
      const num = str.match(/\d|\./g) // 数字
      const numLen = num ? num.length : 0
      const otherLen = str.length - charLen - numLen // 其它
      const width = Math.ceil(charLen * 1 + numLen * 0.5 + otherLen * 0.5) * 14 + 20
      arrLen.push(width)
    }
  }
  const maxWidth = arrLen.length > 0 ? Math.max(...arrLen) : 0
  return maxWidth > min ? (maxWidth > 400 ? 400 : maxWidth) : minwidth
}

// 动态设置表格列宽监听函数
export const createColumnWidthWatchFn = (tableWidth, isTree = false, childKey = 'children') => {
  const width = JSON.parse(JSON.stringify(tableWidth))
  return function(val) {
    function expandTree(val) {
      const res = []
      let arr = JSON.parse(JSON.stringify(val))
      while (arr.length > 0) {
        const item = arr.pop()
        res.push(item)
        if (item && Array.isArray(item[childKey])) {
          arr = arr.concat(item[childKey])
        }
      }
      return res
    }
    const temp = {}
    for (const key in width) {
      temp[key] = []
    }
    const list = isTree ? expandTree(val) : val
    list.forEach(v => {
      for (const key in temp) {
        temp[key].push(String(v[key]))
      }
    })
    for (const key in temp) {
      const w = getStrWidth(temp[key], width[key])
      tableWidth[key] = w > tableWidth[key] ? w : tableWidth[key]
    }
  }
}

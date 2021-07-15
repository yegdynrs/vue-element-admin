import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { Message } from 'element-ui'
// 导出一般文件
export function exportFile(text, name) {
  saveAs(new Blob([text]), `${name || 'demo.txt'}`)
}
// 导出压缩文件
export function exportFileZip(text, name) {
  const zip = new JSZip()
  if (Object.prototype.toString.call(text) === '[object Array]') {
    text.forEach((item) => {
      zip.file(`${item.name || 'demo.txt'}`, item.value)
    })
    zip.generateAsync({
      type: 'blob'
    }).then((blob) => {
      saveAs(blob, `${name || 'demo.zip'}`)
    }, () => {
      Message({
        showClose: true,
        message: '导出错误',
        type: 'error'
      })
    })
  }
}
export default function(text, name, type = 'single') {
  switch (type) {
    case 'single':
      exportFile(text, name)
      break
    case 'zip':
      exportFileZip(text, name)
      break
    default:
      exportFile(text, name)
      break
  }
}

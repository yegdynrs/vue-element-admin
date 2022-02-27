import Layout from '@/layout'

export default {
  path: '/tool',
  component: Layout,
  redirect: '/tool/htmlPage',
  name: 'Tool',
  meta: {
    title: '工具',
    icon: 'component'
  },
  children: [
    {
      path: 'htmlPage',
      component: () => import('@/views/tool/htmlPage'),
      name: 'toolHtmlPage',
      meta: { title: 'html页面自动生成' }
    },
    {
      path: 'htmlPageJSON',
      component: () => import('@/views/tool/htmlJSON'),
      name: 'toolHtmlJSON',
      meta: { title: 'JSON页面自动生成' }
    },
    // {
    //   path: 'newHtml',
    //   component: () => import('@/views/tool/newHtml'),
    //   name: 'ToolHtml',
    //   meta: { title: '新html页面自动生成' }
    // },
    {
      path: 'htmlFormPage',
      component: () => import('@/views/tool/formPage'),
      name: 'toolHtmlFormPage',
      meta: { title: '表单自动生成' }
    }
  ]
}

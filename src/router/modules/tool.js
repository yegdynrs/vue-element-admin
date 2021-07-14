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
    }
  ]
}

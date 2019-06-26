import TodoList from './TodoList'

const plugin = {
  install (Vue) {
    Vue.component('TodoList', TodoList)
  }
}

export default plugin

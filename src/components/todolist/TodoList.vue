<template>
  <div class="container">
    <transition name="fade">
      <div class="todolist" v-show="showTasks">
        <!-- 头部 -->
        <header><b>{{title}}</b></header>
        <!-- 任务列表 -->
        <section>
          <input type="text" v-model="taskDesc" placeholder="请输入任务" @keyup.enter="add">
          <ol>
            <li v-for="item in filterTaskList" :key="item.id">
              <span class="desc" :title="item.desc">{{item.desc}}</span>
              <img src="./img/close.png" alt="cancel"  title="取消任务" @click="cancel(item.id)">
              <button v-show="filter === 'undo'" style="color:red;" @click="finish(item.id)">未完成</button>
              <button v-show="filter === 'done'" style="color:green" @click="finish(item.id)">已完成</button>
            </li>
          </ol>
        </section>
        <!-- 底部 -->
        <footer>
          <button :class="{undo: filter === 'undo'}" @click="toggleFilter('undo')">未完成：{{undo}}</button>
          <button :class="{done: filter === 'done'}" @click="toggleFilter('done')">已完成：{{done}}</button>
          <button class="clearAll" @click="clearAll">全部清除</button>
        </footer>
      </div>
    </transition>
    <div class="dropBtn" @click="showTasks = ! showTasks"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '任务清单'
    }
  },
  data () {
    return {
      tasksId: 0,
      taskDesc: '',
      showTasks: false,
      tasks: [],
      filter: 'undo' // 过滤规则，默认为undo，显示未完成的任务
    }
  },
  computed: {
    filterTaskList () {
      var result
      if (this.filter === 'all') {
        result = this.tasks
      } else if (this.filter === 'undo') {
        result = this.tasks.filter((item) => {
          return item.completed === false
        })
      } else if (this.filter === 'done') {
        result = this.tasks.filter((item) => {
          return item.completed === true
        })
      }
      return result
    },
    all () {
      return this.tasks.length
    },
    done () {
      return this.tasks.filter((item) => {
        return item.completed === true
      }).length
    },
    undo () {
      return this.tasks.filter((item) => {
        return item.completed === false
      }).length
    }
  },
  methods: {
    add () {
      this.tasks.unshift({id: ++this.tasksId, desc: this.taskDesc.trim(), completed: false})
      this.taskDesc = ''
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      localStorage.setItem('tasksId', JSON.stringify(this.tasksId))
    },
    finish (id) {
      this.tasks.filter((item) => item.id === id)[0].completed = true
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },
    toggleFilter (state) {
      this.filter = state
    },
    cancel (id) {
      var flag = window.confirm('确定要取消该任务么？')
      if (flag) {
        this.tasks.splice(this.tasks.findIndex((item) => item.id === id), 1)
      }
    },
    clearAll () {
      var flag = window.confirm('确定删除所有任务？')
      if (flag) {
        this.tasks = []
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
      }
    }
  },
  mounted () {
    // 从localStorage获取task
    if (window.localStorage) {
      let tasksId = localStorage.getItem('tasksId')
      let tasks = localStorage.getItem('tasks')
      if (tasks && tasksId) {
        this.tasks = JSON.parse(tasks)
        this.tasksId = JSON.parse(tasksId)
      } else {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
        localStorage.setItem('tasksId', JSON.stringify(this.tasksId))
      }
    } else {
      console.log('您的电脑不支持localStorage!')
    }
  }
}
</script>

<style scoped>
.container {
  position:fixed;
  right: 0;
  width: 20rem;
  max-width: 900px;
}
.todolist {
  /* display: flex; */
  /* flex-direction: column; */
  position: relative;
  padding: 1rem;
  /* border-radius: 5px; */
  border: 1px solid #eee;
}
header {
  color: #42b883;
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
input {
  display: block;
  width: 93%;
  height: 1rem;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
section {
  max-height: 20rem;
  padding: 5px 0;
  padding-right: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}
section ol {
  margin: 5px 0;
  padding-left: 1.5rem;
}
section li {
  position: relative;
  padding: 3px 0;
}
section .desc {
  display: inline-block;
  width: 70%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
section li button {
  position: absolute;
  right: 0;
  cursor: pointer;
  outline: none;
  border-width: 1px;
  background-color: #fff;
}
section li img {
  position: absolute;
  top: 5px;
  right: 3.5rem;
  width: 20px;
  cursor: pointer;
}
.dropBtn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  cursor: pointer;
  background: url('./img/vue.png');
  background-size: 100%;
}
/* .dropBtn:hover {
  color: #fff;
  background-color: #337ab7;
} */
footer {
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}
footer button {
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  border: 0;
  outline: none;
  background-color: #fff;
}
.undo {
  color: #fff;
  background-color: #f0ad4e;
}
.done {
  color: #fff;
  background-color: #5cb85c;
}
.all {
  color: #fff;
  background-color: #5bc0de;
}
.clearAll {
  border: 1px solid #000;
}
</style>

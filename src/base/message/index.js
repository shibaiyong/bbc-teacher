import Vue from 'vue'
import Message from './message.vue'

let MessageConstructor = Vue.extend(Message)
let instance

function showMessage(type, content, duration) {
  instance = new MessageConstructor({
    data: {
      type: type,
      content: content,
      duration: duration || 2500,
    }
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
}

Vue.prototype.$VMessage = showMessage

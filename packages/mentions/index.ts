import type { App } from 'vue'
import mentions from './Mentions.vue'

// 定义 install 方法， App 作为参数
mentions.install = (app: App): void => {
    app.component(mentions.name, mentions)
}

export default mentions
import type { App } from 'vue'
import Mentions from './Mentions.vue'

// 按需导入用
export {
	Mentions 
}
// 全局导入用
export default {
    install: (app: App) => {
        app.component(Mentions.name, Mentions)
    }
}
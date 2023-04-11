<script setup lang="ts">
import { ref } from 'vue'
import { Mentions } from '@/mentions/index'

const list = ref<any>([])
const mentionsRef = ref()
const loading = ref(false)
const value = ref(
  '<span class="at-span" data-person="0&amp;王某0" contenteditable="false">@王某0</span>​<span class="at-span" data-person="1&amp;王某1" contenteditable="false">@王某1</span>​'
)
const disabled = ref(false)
const onBlur = (e: String) => {
  console.log('onBlur', e)
}
const success = (e: Object) => {
  console.log('success', e)
}
const click = (e: Object) => {
  console.log('click', e)
}
const search = (e: String) => {
  console.log('search', e)
  loading.value = true
  list.value = []
  setTimeout(() => {
    let arr: any = []
    for (let i = 0; i < 20; i++) {
      arr.push({
        id: i,
        name: `王某${i}`,
        avatar: ''
      })
    }
    list.value = arr
    loading.value = false
  }, 1000)
}
const change = () => {
  console.log('change', value.value)
}
</script>

<template>
  <Mentions
    ref="mentionsRef"
    type="input"
    :person-list="list"
    v-model="value"
    @blur="onBlur"
    @change="change"
    :disabled="disabled"
    placeholder="请输入"
    @success="success"
    :highlightId="1"
    @click="click"
    @search="search"
    :loading="loading"
    position="bottom-right"
    loading-bg="#0089ff"
  >
    <template #empty>空状态插槽</template>
  </Mentions>
</template>

<style scoped lang="less">
:root {
  --active-bg-color: #ecf5ff; // 弹窗选中人员列表项背景色
  --hover-bg-color: #ecf5ff;  // 弹窗人员列表项hover背景色
  --hover-text-color: #409eff;  // 弹窗选中人员列表项hover字体色
  --label-text-color: #0089ff;  // 标签默认字体色
  --label-ht-bg-color: #0089ff; // 标签高亮背景色
  --label-ht-text-color: #fff;  // 标签高亮字体色
  --label-ht-text-hover-color:#fff; // 高亮标签hover字体色
  --label-ht-bg-hover-color: #0089ff; // 高亮标签hover背景色
  --label-bg-hover-color: rgba(126, 134, 142, 0.12);  // 默认标签hover背景色
  --label-text-hover-color: #0089ff;  // 默认标签hover字体色
  --loading-bg: rgba(255, 255, 255, .9);  // loading遮罩背景色
  --empty-color: #909399; // 无数据字体色
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { Mentions } from '@/mentions/index'

const list: any = ref([])
const mentionsRef = ref()
const loading = ref(false)
const value = ref(
  '<span class="at-span" data-person="0&amp;王某0" contenteditable="false">@王某0</span>​<span class="at-span" data-person="1&amp;王某1" contenteditable="false">@王某1</span>​'
)
const disabled = ref(false)
const onBlur = (e: any) => {
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
    let arr:any = []
    for (let i = 0; i < 0; i++) {
      arr.push({
        id: i,
        name: `王某${i}`,
        avatar: ''
      })
    }
    list.value = arr
    loading.value = false
  }, 1000);
}
const change = () => {
  console.log('change', value.value)
}
</script>

<template>
  <Mentions ref="mentionsRef" type="input" :person-list="list" v-model="value" @blur="onBlur" @change="change"
    :disabled="disabled" placeholder="请输入" @success="success" :highlightId="1" @click="click" @search="search"
    :loading="loading">
    <template #empty>空状态插槽</template>
  </Mentions>
</template>

<style scoped lang="less">
:root{
  --active-bg-color: #000;
  --hover-bg-color: #000;
  --hover-text-color: #fff;
  --label-text-color: #000;
  --label-ht-bg-color: #000;
  --label-ht-text-color: #000;
  --label-ht-text-color: #000;
  --label-ht-text-hover-color:#000;
  --label-ht-bg-hover-color: #000;
  --label-bg-hover-color: rgba(126, 134, 142, 0.12);
  --label-text-hover-color: #000;
}
</style>

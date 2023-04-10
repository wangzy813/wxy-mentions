<script setup lang="ts">
import { ref } from 'vue'
import { Mentions } from '@/mentions/index'

const list: any = []
for (let i = 0; i < 20; i++) {
  list.push({
    id: i,
    name: `王某${i}`,
    avatar: ''
  })
}
const mentionsRef = ref()
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
}
const change = (e: String) => {
  console.log('change', e)
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
  />
</template>

<style scoped lang="less">
</style>

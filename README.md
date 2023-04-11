## 介绍

wxy-mentions可@mention提及某人的输入框

## 安装

```
npm install wxy-mentions
```

## 使用

main.ts

```
...
import Mentions from 'wxy-mentions'
import 'wxy-mentions/dist/style.css'

createApp(App).use(Mentions).mount('#app')
```

App.vue

```
<script setup lang="ts">
  import { ref } from "vue";

  const list: any = ref([]);
  const mentionsRef = ref();
  const loading = ref(false);
  const value = ref();
  const disabled = ref(false);
  const onBlur = (e: any) => {
    console.log("onBlur", e);
  };
  const success = (e: Object) => {
    console.log("success", e);
  };
  const click = (e: Object) => {
    console.log("click", e);
  };
  const search = (e: String) => {
    console.log("search", e);
    loading.value = true;
    list.value = [];
    setTimeout(() => {
      let arr: any = [];
      for (let i = 0; i < 20; i++) {
        arr.push({
          id: i,
          name: `某某${i+1}`,
          avatar: "",
        });
      }
      list.value = arr;
      loading.value = false;
    }, 1000);
  };
  const change = () => {
    console.log("change", value.value);
  };
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
 :root{
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
```

## API

| 参数          | 说明                                                     | 类型                 | 默认值            |
| ----------- | ------------------------------------------------------ | ------------------ | -------------- |
| type        | 类型input、textarea、O、KR                                  | `string`           | `input`        |
| modelValue  | v-model绑定值                                             | `string`           |                |
| disabled    | 是否禁用                                                   | `boolean`          | `false`        |
| placeholder | 提示文本                                                   | `string`           |                |
| position    | 位置`bottom-right`、`bottom-left` 、`top-right`、`top-left` | `string`           | `bottom-right` |
| highlightId | 高亮Id                                                   | `string | number` |                |
| personList  | 人员列表                                                   | `personType[]`     | `[]`           |
| loading     | 加载loading                                              | `boolean`          | `false`        |
| loadingBg   | 加载loading的颜色                                           | `string`           | `#0089ff`      |

### person

| 参数     | 说明   | 类型                 |
| ------ | ---- | ------------------ |
| id     | 人员id | `number | string` |
| name   | 人员姓名 | `string`           |
| avatar | 人员头像 | `string`           |

## 事件

| 事件名称    | 说明                 | 回调参数                       |
| ------- | ------------------ | -------------------------- |
| change  | `modelValue`变化时的对调 | `function(value: string)`  |
| blur    | 失去焦点时的回调           | `function(value: string)`  |
| focus   | 获取焦点时的回调           | `function(value: string)`  |
| success | @mention成功时的回调     | `function(person: object)` |
| click   | 点击人员标签时的回调         | `function(person: object)` |
| search  | 选人弹窗触发后输入值变化时回调    | `function(value: string)`  |

## Mentions 方法

| 名称        | 说明    |
| --------- | ----- |
| onFocus() | 获取焦点  |
| onBlur()  | 失去焦点  |
| reset()   | 清空内容  |
| Editor    | 输入框实例 |

## 插槽

| 名称    | 说明    |
| ----- | ----- |
| empty | 空状态插槽
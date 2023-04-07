<template>
  <div class="mention-modal" :style="{ top: top, left: left }">
    <div ref="listRef" class="list" @mouseout="onMouseout" @mouseover="onMouserOver(-1)">
      <div class="not-data" v-show="personList.length == 0">暂无数据</div>
      <List ref="listItemRef" v-for="item, index in personList" :class="{ 'is-active': index === activeIndex }"
        :key="item.id" @click="insertMentionHandler(item)">
        <div class="content">
          <img class="avatar" width="26"
            :src="item.avatar || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" />
          <div class="content-name">{{ item.name }}</div>
        </div>
      </List>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount, watch } from 'vue'
import List from './List.vue'
import { debounce } from '../utils'
import type { personListType } from "../types";


const isMouserOver = ref(false)
const listItemRef = ref()
const listRef = ref()
const props = defineProps({
  type: String,
  modelValue: String,
  top: String,
  left: String,
  personList: {
    type: Array as personListType,
    default: [],
    required: true
  },
})
const activeIndex = ref(0)
const emit = defineEmits(['hideMentionModal', 'insertMention', 'Backspace', 'hiden'])
const insertMentionHandler = (item: Object) => {
  emit('insertMention', item)
  emit('hideMentionModal') // 隐藏 modal
}
const onInput = debounce(() => {
  if (listRef.value) listRef.value.scrollTop = 0
  activeIndex.value = 0
}, 300)
onBeforeMount(() => {
})
onMounted(() => {

})
watch(() => props.modelValue, () => {
  onInput()
})
const upward = () => {
  if (isMouserOver.value || props.personList.length === 0) return
  if (activeIndex.value === 0) {
    activeIndex.value = props.personList.length - 1
  } else if (activeIndex.value === -1) {
    activeIndex.value = 0
  } else {
    activeIndex.value -= 1
  }
  handleScroll(activeIndex.value)
}
const downward = () => {
  if (isMouserOver.value || props.personList.length === 0) return
  if (activeIndex.value === props.personList.length - 1) {
    activeIndex.value = 0
  } else if (activeIndex.value === -1) {
    activeIndex.value = props.personList.length - 1
  } else {
    activeIndex.value += 1
  }
  handleScroll(activeIndex.value)
}
const handleScroll = (i: number) => {
  const parentScrollTop = listItemRef.value[i].$el.parentElement.scrollTop // 父节点滚动条位置
  const parentScrollHeight = listItemRef.value[i].$el.parentElement.scrollHeight // 父节点滚动条高度
  const itemOffsetTop = listItemRef.value[i].$el.offsetTop // 子节点距离父节点顶部距离
  // 处理临界值
  if (activeIndex.value === 0) {
    listItemRef.value[i].$el.parentElement.scrollTop = 0
  } else if (activeIndex.value === props.personList.length - 1) {
    listItemRef.value[i].$el.parentElement.scrollTop = parentScrollHeight
  } else {
    // 正常情况
    if (itemOffsetTop - parentScrollTop > 216) {
      listItemRef.value[i].$el.parentElement.scrollTop = itemOffsetTop - 216
    }
    if (itemOffsetTop - parentScrollTop < 0) {
      listItemRef.value[i].$el.parentElement.scrollTop = itemOffsetTop - 6
    }
  }
}
const select = () => {
  emit('insertMention', props.personList[activeIndex.value])
  emit('hideMentionModal')
}
const onMouserOver = (index: number) => {
  isMouserOver.value = true
  activeIndex.value = index
}
const onMouseout = () => {
  isMouserOver.value = false
}
defineExpose({
  upward,
  downward,
  select
})
</script>

<style scoped lang="less">
@import '../style.less';
.mention-modal {
  position: fixed;
  z-index: 9999;
  box-sizing: border-box;
  background-color: #fff;

  &:hover {
    ::-webkit-scrollbar-thumb {
      background: #ccc;
    }
  }
}

.list::-webkit-scrollbar {
  width: 6px;
}

.list::-webkit-scrollbar-thumb {
  background-color: transparent;
  opacity: 0;
  border-radius: 5px;
}

.list {
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 20%) 0px 10px 20px 0px;
  height: 264px;
  overflow-y: auto;
  width: 200px;
  padding: 6px;

  .not-data {
    text-align: center;
  }

  .avatar {}

  .content {
    width: 100%;
    display: flex;
    align-items: center;
    // padding: 8px 6px;
    pointer-events: none;

    &-name {
      padding-left: 10px;
      flex: 1;
    }
  }
}

.is-active {
  background-color: var(--hover-bg-color);

  .content-name {
    color: var(--hover-text-color);
  }
}
</style>

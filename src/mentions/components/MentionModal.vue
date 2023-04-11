<template>
  <div class="wxy-mention-modal" :style="{ top: top, left: left }">
    <div ref="listRef" class="list">
      <div class="status">
        <div class="not-data" v-show="personList.length == 0 && !loading">
          <slot name="empty">
            <span>暂无数据</span>
          </slot>
        </div>
        <div v-show="loading" class="loading-mask">
          <div class="loading-spinner">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px"
              viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
              <path opacity="0.2" :fill="loadingBg"
                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path>
              <path :fill="loadingBg" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                        C22.32,8.481,24.301,9.057,26.013,10.047z" transform="rotate(42.1171 20 20)">
                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20"
                  to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform>
              </path>
            </svg>
          </div>
        </div>
      </div>
      <List v-show="!loading" ref="listItemRef" v-for="item, index in personList" :class="{ 'is-active': index === activeIndex }"
        :key="item.id" @click="insertMentionHandler(item)" @mouseout="onMouseout" @mouseover="onMouserOver(index)">
        <div class="content">
          <img class="avatar" width="26" :src="item.avatar || avatar" />
          <div class="content-name">{{ item.name }}</div>
        </div>
      </List>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount, watch } from 'vue'
import List from './List.vue'
import type { personListType } from "../types";
import avatar from "@/assets/avatar.png";

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
  loading: {
    type: Boolean,
    default: false,
  },
  loadingBg: {
    type: String,
    default: '#0089ff',
  }
})
const activeIndex = ref(0)
const emit = defineEmits(['hideMentionModal', 'insertMention'])
const insertMentionHandler = (item: Object) => {
  emit('insertMention', item)
  emit('hideMentionModal') // 隐藏 modal
}
const onInput = () => {
  if (listRef.value) listRef.value.scrollTop = 0
  activeIndex.value = 0
}
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
  if (!props.personList.length) return
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

<style lang="less">
.wxy-mention-modal {
  position: fixed;
  z-index: 9999;
  box-sizing: border-box;
  background-color: #fff;

  &:hover {
    .list::-webkit-scrollbar-thumb {
      background: #0003;
    }
  }

  .list {
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: rgb(0 0 0 / 20%) 0px 10px 20px 0px;
    height: 264px;
    overflow-y: auto;
    width: 200px;
    padding: 6px;

    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      opacity: 0;
      border-radius: 5px;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    .status {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      .not-data {
        color: var(--empty-color);
      }

      .loading-mask {
        position: absolute;
        z-index: 2000;
        background-color: var(--loading-bg);
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity 0.1s;

        .loading-spinner {
          top: 50%;
          width: 100%;
          margin-top: -20px;
          text-align: center;
          position: absolute;
        }
      }
    }

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

    .is-active {
      background-color: var(--hover-bg-color);

      .content-name {
        color: var(--hover-text-color);
      }
    }
  }
}
</style>

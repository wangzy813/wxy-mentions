<template>
  <div ref="" :class="`at__${type}`">
    <div class="at-editor at-editor-placeholder" :placeholder="placeholder" ref="Editor" tabindex="0"
      :contenteditable="!disabled" @focus="focus" @blur="blur" @click="click" @input="input" @keydown="keydown"
      @paste="doOnPaste" v-html="innerText"></div>
    <div ref="Mention" @mouseover="mouseover" @mouseout="mouseout">
      <MentionModal ref="mentionModalRef" v-if="isShowModel" v-model="searchValue" :personList="personList" :type="type"
        @insertMention="insertMention" :style="[atDialogPos, { visibility: isShowModel ? 'visible' : 'hidden' }]"
        :top="top" :left="left" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import MentionModal from './components/MentionModal.vue'
import type { personListType } from "./types"

const props = defineProps({
  // 类型目前为 O、KR 样式有差别
  type: String,
  modelValue: String,
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
    required: false
  },
  // 提示内容
  placeholder: {
    type: String,
    default: '',
    required: false
  },
  // 弹窗位置
  position: {
    type: String,
    default: 'bottom-right'
  },
  highlightId: {
    type: Number,
    default: ''
  },
  personList: {
    type: Array as personListType,
    default: () => {
      return []
    }
  }
})
const innerText = ref<any>(props.modelValue)
const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'success', 'click', 'search'])
const searchValue = ref('')
const Editor = ref()
const top = ref()
const left = ref()
const isChange = ref(true)
const Mention = ref()
const editorRange = ref()
const mentionModalRef = ref()
const focus = (e: any) => {
  if (props.disabled) return
  isChange.value = false
  emit('focus', e)
}
const blur = (e: any) => {
  if (props.disabled) return
  getEditorRange()
  isChange.value = true
  e.target.innerHTML.replace(/is-myselfe/g, '')
  if (!isShowModel.value) emit('blur', e.target.innerHTML)
  if (isFoucs.value) isShowModel.value = false
}
const input = (e: any) => {
  if (props.disabled) return
  emit('update:modelValue', e.target.innerHTML)
  if (isShowModel.value) {
    doToggleDialog()
    emit('search', searchValue.value)
  }
}
const click = (e: any) => {
  if (e.target.className.includes('at-span')) {
    const personStr = e.target.dataset.person
    const person = {
      id: personStr.split('&')[0],
      name: personStr.split('&')[1]
    }
    emit('click', person)
  }
}
const keydown = (e: any) => {
  if (props.disabled) return
  if (isShowModel.value) {
    switch (e.keyCode) {
      case 37:
        e.preventDefault()
        mentionModalRef.value.upward()
        break
      case 38:
        e.preventDefault()
        mentionModalRef.value.upward()
        break
      case 39:
        e.preventDefault()
        mentionModalRef.value.downward()
        break
      case 40:
        e.preventDefault()
        mentionModalRef.value.downward()
        break
      case 13:
        e.preventDefault()
        mentionModalRef.value.select()
        break
      default:
        break
    }
  }
  const isCode = ((e.keyCode === 229 && e.key === '@') || (e.keyCode === 229 && e.code === 'Digit2') || e.keyCode === 50) && e.shiftKey
  if (isCode) {
    isShowModel.value = true
  }
}
const isShowModel = ref(false)
const insertMention = (item: Object) => {
  isShowModel.value = false
  selectPerson(item)
}
const getEditorRange = () => {
  let range = null
  let selection = null
  if (window.getSelection) {
    selection = window.getSelection()
    if (selection?.getRangeAt && selection?.rangeCount) {
      range = selection?.getRangeAt(0)
      editorRange.value = {
        range,
        selection,
      }
      return {
        range,
        selection,
      }
    }
  }
  return null
}
const doToggleDialog = () => {
  const rangeInfo = getEditorRange()
  if (!rangeInfo || !rangeInfo.range || !rangeInfo.selection) return
  const curNode = rangeInfo.range.endContainer
  if (!curNode || curNode.nodeName !== '#text') isShowModel.value = false
  const searchStr: any = curNode?.textContent?.slice(0, rangeInfo.selection.focusOffset)
  const keywords = (/@([^@]*)$/).exec(searchStr)
  if (keywords) {
    // 展示搜索选人
    const keyWords = keywords[1]
    isShowModel.value = true
    searchValue.value = keyWords
    // 重点：记下弹窗前光标位置range
    editorRange.value = rangeInfo
    if (!keyWords) {
      setPosition(editorRange.value.range.getBoundingClientRect())
    }
  } else {
    // 关掉选人
    isShowModel.value = false
  }
}
// 弹窗位置
const setPosition = (rect: any) => {
  if (props.position === 'bottom-right') {
    top.value = `${rect.top + 20}px`
    left.value = `${rect.left}px`
  } else if (props.position === 'top-left') {
    top.value = `${rect.top - 270}px`
    left.value = `${rect.left - 200}px`
  } else if (props.position === 'bottom-left') {
    top.value = `${rect.top + 20}px`
    left.value = `${rect.left - 200}px`
  }
}
// @选人
const selectPerson = async (person: any) => {
  isShowModel.value = false
  editorRange.value.selection.collapseToEnd()
  if (Editor.value) {
    Editor.value.focus()
    // 删掉草稿start
    const editorRangeA = editorRange.value.range
    if (!editorRangeA) return
    const textNode = editorRangeA.endContainer // 拿到末尾文本节点
    const endOffset = editorRangeA.endOffset // 光标位置
    // 找出光标前的at符号位置
    const textNodeValue = textNode.nodeValue
    const expRes = (/@([^@]*)$/).exec(textNodeValue)
    if (expRes && expRes.length > 1) {
      editorRangeA.setStart(textNode, expRes.index)
      editorRangeA.setEnd(textNode, endOffset)
      editorRangeA.deleteContents() // 删除草稿end
      const span = document.createElement('span')
      span.className = 'at-span'
      span.dataset.person = `${person.id}&${person.name}`
      span.textContent = `@${person.name}`
      span.contentEditable = 'false'
      const bSpaceNode = document.createTextNode('\u200b') // 不可见字符，为了放光标方便
      insertHtmlAtCaret([span, bSpaceNode], editorRange.value.selection, editorRange.value.range, 1)
    }
  }
  emit('update:modelValue', Editor.value.innerHTML)
  emit('success', person)
}
// 文本替换
const insertHtmlAtCaret = (html: any, selection: any, range: any, offset: any) => {
  if (range && selection) {
    const el = document.createElement('div')
    if (typeof html === 'string') {
      el.innerHTML = html
    } else if (Array.isArray(html)) {
      html.forEach((item) => {
        el.appendChild(item)
      })
    } else {
      el.appendChild(html)
    }
    const frag = document.createDocumentFragment()
    let node
    let lastNode
    while (node = el.firstChild) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)
    if (lastNode) {
      selection.extend(lastNode, offset)
      selection.collapseToEnd()
    }
  }
}
const isFoucs = ref(true)
// 判断鼠标是否在弹窗内
const mouseout = (e: any) => {
  if (e.target.className === 'list-item') {
    isFoucs.value = true
  }
}
const mouseover = (e: any) => {
  if (e.target.className === 'list-item') {
    isFoucs.value = false
  }
}
watch(() => props.modelValue, (newVal) => {
  if (isChange.value) {
    innerText.value = newVal
  }
})
const atDialogPos = ref()
const onFocus = () => {
  Editor.value.focus()
}
const reset = () => {
  innerText.value = ''
}
// 粘贴事件
const doOnPaste = (e: any) => {
  let pastedText
  if (e.clipboardData && e.clipboardData.getData) {
    pastedText = e.clipboardData.getData('text/plain')
  }
  // 放到光标位置
  const rangeInfo = getEditorRange()
  if (rangeInfo && pastedText) {
    rangeInfo.range.deleteContents()
    const newTextNode = document.createTextNode(pastedText)
    insertHtmlAtCaret(newTextNode, rangeInfo.selection, rangeInfo.range, pastedText.length)
  }
  e.preventDefault()
  return false
}
// 替换标签自己高亮
const replaceContent = () => {
  const spanList = Editor.value.querySelectorAll('.at-span')
  console.log(spanList)
  if (spanList.length === 0) return
  spanList.forEach((item: any) => {
    const id = item.dataset.person.split('&')[0]
    if (id === props.highlightId || Number(id) === props.highlightId) {
      item.className = 'at-span is-myselfe'
    }
  })
}
onMounted(() => {
  replaceContent()
})
defineExpose({
  onFocus,
  reset,
  editorRange,
  Editor,
  replaceContent,
})

</script>

<script lang="ts">
export default {
  name:'Mentions'
}
</script>

<style lang="less">
.at-editor {
  word-break: break-all;
  user-select: text;
  color: #000;
  cursor: text;
  min-height: 30px;
  outline: none;
}

.at-span {
  background-color: transparent;
  color: #0089ff;
  border-radius: 3px;
  padding: 0px 2px;
  margin: 0 3px;
  font-size: 16px;
  display: inline-block;
  line-height: 1.3;

  &:hover {
    background-color: rgba(126, 134, 142, 0.12);
    cursor: pointer;
  }
}

.at__O {
  .at-editor {
    padding: 4px;
    // height: 30px;
    line-height: 1.5;
    font-size: 16px;
  }

  .at-span {
    font-size: 15px;
  }
}

.at__KR {
  .at-editor {
    padding: 5px;
    // height: 30px;
    line-height: 1.5;
    font-size: 14px;
  }

  .at-span {
    font-size: 14px;
  }
}

.at__comment {
  .at-editor {
    padding: 5px;
    // height: 30px;
    line-height: 1.7;
    font-size: 15px;
    min-height: 70px;
  }

  .at-span {
    font-size: 14px;
    line-height: 1.5;
  }
}

.at__progress {
  .at-editor {
    padding: 5px;
    // height: 30px;
    line-height: 1.7;
    font-size: 14px;
    min-height: 80px;
  }

  .at-span {
    font-size: 14px;
    line-height: 1.5;
  }
}

.at-editor-placeholder:empty:before {
  // content: '填写内容，输入@以选择某人';
  content: attr(placeholder);
  color: gray;
  cursor: text;
  pointer-events: none;
}

// .empty:focus:before {
//   content: none;
// }

.active {
  background-color: rgba(126, 134, 142, 0.12);
}

.is-myselfe {
  background-color: #0089ff;
  color: #fff;

  &:hover {
    background-color: #0089ff;
  }
}
</style>

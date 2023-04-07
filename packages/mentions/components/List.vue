<template>
  <div class="list-item">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="less">
@import '../style.less';
.el-popover.el-popper {
  padding: 6px;
}
.list-item {
  box-sizing: border-box;
  cursor: pointer;
  padding: 8px 6px;
  border-radius: 5px;
  font-size: 14px;
  letter-spacing: 0.8;
  width: 100%;
  display: flex;
  align-items: center;
  &:hover {
    background-color: var(--hover-bg-color);
    color: var(--hover-text-color);
  }
}
</style>

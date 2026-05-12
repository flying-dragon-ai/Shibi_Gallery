<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <view class="empty card">
    <text class="empty-title">{{ title }}</text>
    <text v-if="subtitle" class="muted">{{ subtitle }}</text>
  </view>
</template>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  align-items: center;
  justify-content: center;
  min-height: 220rpx;
}
.empty-title {
  font-size: 30rpx;
  font-weight: 700;
}
</style>

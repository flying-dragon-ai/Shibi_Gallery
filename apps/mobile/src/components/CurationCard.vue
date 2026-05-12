<script setup lang="ts">
import type { Curation } from '@shibi/shared';

const props = defineProps<{ curation: Curation }>();

function openDetail() {
  uni.navigateTo({ url: `/pages/curations/detail?id=${props.curation.id}` });
}
</script>

<template>
  <view class="curation-card card" @tap="openDetail">
    <image v-if="curation.coverUrl" class="cover" mode="aspectFill" :src="curation.coverUrl" />
    <view class="body">
      <text class="title">{{ curation.title }}</text>
      <text class="muted">{{ curation.description }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.curation-card {
  padding: 0;
  overflow: hidden;
}
.cover {
  width: 100%;
  height: 280rpx;
}
.body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 24rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 800;
}
</style>

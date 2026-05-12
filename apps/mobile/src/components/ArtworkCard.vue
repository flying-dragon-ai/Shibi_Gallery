<script setup lang="ts">
import type { Artwork } from '@shibi/shared';

const props = defineProps<{ artwork: Artwork }>();

function openDetail() {
  uni.navigateTo({ url: `/pages/artworks/detail?id=${props.artwork.id}` });
}
</script>

<template>
  <view class="artwork-card card" @tap="openDetail">
    <image v-if="artwork.images[0]" class="cover" mode="aspectFill" :src="artwork.images[0].url" />
    <view class="content">
      <text class="title">{{ artwork.title }}</text>
      <text class="muted">{{ artwork.artistName }} · {{ artwork.medium }} · {{ artwork.year }}</text>
      <text class="price">¥{{ (artwork.priceCents / 100).toLocaleString() }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.artwork-card {
  overflow: hidden;
  padding: 0;
}
.cover {
  width: 100%;
  height: 360rpx;
  background: #eadfce;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 24rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 700;
}
.price {
  color: #7a3f1d;
  font-size: 34rpx;
  font-weight: 800;
}
</style>

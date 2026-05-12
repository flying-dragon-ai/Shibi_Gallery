<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Curation } from '@shibi/shared';
import ArtworkCard from '../../components/ArtworkCard.vue';
import CurationCard from '../../components/CurationCard.vue';
import EmptyState from '../../components/EmptyState.vue';
import { listCurations } from '../../api/curations';
import { useArtworkStore } from '../../stores/artworks';

const artworkStore = useArtworkStore();
const curations = ref<Curation[]>([]);

onLoad(async () => {
  await Promise.all([
    artworkStore.fetchList(),
    listCurations().then((items) => {
      curations.value = items;
    })
  ]);
});
</script>

<template>
  <view class="container">
    <view class="hero card">
      <text class="eyebrow">严选 · 鉴证 · 明码标价</text>
      <text class="hero-title">青年艺术家的第一面墙</text>
      <text class="muted">为初次收藏者精选可负担、可讲述、可持续追踪的原作。</text>
    </view>

    <text class="section-title">当前策展</text>
    <CurationCard v-if="curations[0]" :curation="curations[0]" />
    <EmptyState v-else title="暂无策展" subtitle="运营发布后会展示在这里" />

    <text class="section-title">精选作品</text>
    <view class="grid" v-if="artworkStore.artworks.length">
      <ArtworkCard v-for="item in artworkStore.artworks" :key="item.id" :artwork="item" />
    </view>
    <EmptyState v-else title="暂无作品" subtitle="请先执行 seed 或在后台新增作品" />
  </view>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 40rpx 32rpx;
}
.eyebrow {
  color: #7a3f1d;
  font-size: 24rpx;
  letter-spacing: 4rpx;
}
.hero-title {
  font-size: 48rpx;
  font-weight: 900;
  line-height: 1.2;
}
.grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Curation } from '@shibi/shared';
import ArtworkCard from '../../components/ArtworkCard.vue';
import EmptyState from '../../components/EmptyState.vue';
import { getCuration } from '../../api/curations';

const curation = ref<Curation | null>(null);

onLoad(async (query) => {
  if (query?.id) curation.value = await getCuration(String(query.id));
});
</script>

<template>
  <view class="container" v-if="curation">
    <image v-if="curation.coverUrl" class="cover" mode="aspectFill" :src="curation.coverUrl" />
    <view class="card intro">
      <text class="title">{{ curation.title }}</text>
      <text class="muted">{{ curation.description }}</text>
    </view>
    <text class="section-title">策展作品</text>
    <view class="list" v-if="curation.artworks?.length">
      <ArtworkCard v-for="item in curation.artworks" :key="item.id" :artwork="item" />
    </view>
    <EmptyState v-else title="暂无作品" />
  </view>
</template>

<style scoped lang="scss">
.cover {
  width: 100%;
  height: 360rpx;
  border-radius: 28rpx;
}
.intro {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.title {
  font-size: 42rpx;
  font-weight: 900;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>

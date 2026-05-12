<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Curation } from '@shibi/shared';
import CurationCard from '../../components/CurationCard.vue';
import EmptyState from '../../components/EmptyState.vue';
import { listCurations } from '../../api/curations';

const curations = ref<Curation[]>([]);

onLoad(async () => {
  curations.value = await listCurations();
});
</script>

<template>
  <view class="container">
    <text class="section-title">线上策展</text>
    <view class="list" v-if="curations.length">
      <CurationCard v-for="item in curations" :key="item.id" :curation="item" />
    </view>
    <EmptyState v-else title="暂无策展" subtitle="请在后台发布策展专题" />
  </view>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Artist, Artwork } from '@shibi/shared';
import ArtworkCard from '../../components/ArtworkCard.vue';
import { getArtist } from '../../api/artists';
import { listArtworks } from '../../api/artworks';

const artist = ref<Artist | null>(null);
const artworks = ref<Artwork[]>([]);

onLoad(async (query) => {
  if (!query?.id) return;
  artist.value = await getArtist(String(query.id));
  artworks.value = (await listArtworks()).filter((item) => item.artistId === query.id);
});
</script>

<template>
  <view class="container" v-if="artist">
    <view class="card profile">
      <text class="name">{{ artist.name }}</text>
      <text class="muted">{{ artist.education }}</text>
      <text class="bio">{{ artist.bio }}</text>
      <text class="muted">{{ artist.exhibitions }}</text>
    </view>
    <text class="section-title">作品</text>
    <view class="list">
      <ArtworkCard v-for="item in artworks" :key="item.id" :artwork="item" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.name {
  font-size: 44rpx;
  font-weight: 900;
}
.bio {
  font-size: 28rpx;
  line-height: 1.8;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>

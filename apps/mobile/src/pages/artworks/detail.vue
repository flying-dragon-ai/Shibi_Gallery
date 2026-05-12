<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Artwork } from '@shibi/shared';
import { getArtwork } from '../../api/artworks';
import { useAuthStore } from '../../stores/auth';
import { useFavoriteStore } from '../../stores/favorites';

const artwork = ref<Artwork | null>(null);
const auth = useAuthStore();
const favorites = useFavoriteStore();

onLoad(async (query) => {
  if (query?.id) artwork.value = await getArtwork(String(query.id));
});

async function addToFavorite() {
  if (!auth.isLoggedIn) await auth.login();
  if (artwork.value) {
    await favorites.add(artwork.value.id);
    uni.showToast({ title: '已收藏' });
  }
}

function buyNow() {
  if (!artwork.value) return;
  uni.navigateTo({ url: `/pages/orders/create?artworkId=${artwork.value.id}` });
}
</script>

<template>
  <view class="container" v-if="artwork">
    <swiper class="swiper" circular indicator-dots>
      <swiper-item v-for="image in artwork.images" :key="image.id">
        <image class="image" mode="aspectFill" :src="image.url" />
      </swiper-item>
    </swiper>

    <view class="card detail">
      <text class="title">{{ artwork.title }}</text>
      <text class="muted">{{ artwork.artistName }} · {{ artwork.medium }} · {{ artwork.size }} · {{ artwork.year }}</text>
      <text class="price">¥{{ (artwork.priceCents / 100).toLocaleString() }}</text>
      <text class="desc">{{ artwork.description }}</text>
      <view class="cert">平台鉴证 · 明码标价 · 版权状态：{{ artwork.copyrightStatus }}</view>
    </view>

    <view class="actions">
      <button class="secondary" @tap="addToFavorite">收藏</button>
      <button class="primary-button" :disabled="artwork.saleStatus !== 'available'" @tap="buyNow">立即购买</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.swiper, .image {
  width: 100%;
  height: 620rpx;
  border-radius: 28rpx;
}
.detail {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.title {
  font-size: 44rpx;
  font-weight: 900;
}
.price {
  color: #7a3f1d;
  font-size: 42rpx;
  font-weight: 900;
}
.desc {
  font-size: 28rpx;
  line-height: 1.8;
}
.cert {
  padding: 18rpx;
  border-radius: 18rpx;
  background: #f4eadb;
  color: #7a3f1d;
  font-size: 26rpx;
}
.actions {
  position: sticky;
  bottom: 24rpx;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 18rpx;
  margin-top: 28rpx;
}
.secondary {
  border-radius: 999rpx;
  background: #fffaf2;
  color: #7a3f1d;
}
</style>

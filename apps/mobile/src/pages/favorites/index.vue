<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import ArtworkCard from '../../components/ArtworkCard.vue';
import EmptyState from '../../components/EmptyState.vue';
import { useAuthStore } from '../../stores/auth';
import { useFavoriteStore } from '../../stores/favorites';

const auth = useAuthStore();
const favorites = useFavoriteStore();

onShow(async () => {
  if (!auth.isLoggedIn) return;
  await favorites.fetchFavorites();
});

async function login() {
  await auth.login();
  await favorites.fetchFavorites();
}
</script>

<template>
  <view class="container">
    <template v-if="auth.isLoggedIn">
      <text class="section-title">我的收藏</text>
      <view class="list" v-if="favorites.items.length">
        <ArtworkCard v-for="item in favorites.items" :key="item.id" :artwork="item" />
      </view>
      <EmptyState v-else title="还没有收藏" subtitle="遇到喜欢的原作就先收藏起来" />
    </template>
    <view v-else class="card login-card">
      <text class="title">登录后查看收藏</text>
      <button class="primary-button" @tap="login">微信登录</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.login-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: center;
}
.title {
  font-size: 34rpx;
  font-weight: 800;
}
</style>

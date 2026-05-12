<script setup lang="ts">
import { ref } from 'vue';
import { request } from '../../api/request';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const stats = ref<null | {
  artworkCount: number;
  orderCount: number;
  revenueCents: number;
  favoriteCount: number;
}>(null);

async function loadStats() {
  if (!auth.isLoggedIn) await auth.login();
  stats.value = await request('/admin/analytics/dashboard');
}

function openArtworkAdmin() {
  uni.navigateTo({ url: '/pages/admin/artworks/list' });
}

function showComingSoon(title: string) {
  uni.showToast({ title: `${title}即将开放`, icon: 'none' });
}
</script>

<template>
  <view class="container">
    <view class="card admin">
      <text class="eyebrow">GALLERY OPS</text>
      <text class="title">运营后台</text>
      <text class="muted">管理作品上架、订单状态和策展内容，让小程序从展示走向运营闭环。</text>
      <button class="primary-button" @tap="loadStats">刷新数据</button>
    </view>

    <view v-if="stats" class="grid">
      <view class="card stat"><text>作品数</text><text class="value">{{ stats.artworkCount }}</text></view>
      <view class="card stat"><text>订单数</text><text class="value">{{ stats.orderCount }}</text></view>
      <view class="card stat"><text>收藏数</text><text class="value">{{ stats.favoriteCount }}</text></view>
      <view class="card stat"><text>GMV</text><text class="value">¥{{ (stats.revenueCents / 100).toLocaleString() }}</text></view>
    </view>

    <text class="section-title">运营动作</text>
    <view class="actions">
      <view class="card action-card primary-action" @tap="openArtworkAdmin">
        <text class="action-title">作品管理</text>
        <text class="muted">新增、编辑作品资料与图片 URL</text>
        <text class="action-link">进入 →</text>
      </view>
      <view class="card action-card" @tap="showComingSoon('艺术家管理')">
        <text class="action-title">艺术家管理</text>
        <text class="muted">后续支持入驻资料维护</text>
      </view>
      <view class="card action-card" @tap="showComingSoon('策展管理')">
        <text class="action-title">策展管理</text>
        <text class="muted">后续支持专题组稿与排序</text>
      </view>
      <view class="card action-card" @tap="showComingSoon('订单处理')">
        <text class="action-title">订单处理</text>
        <text class="muted">后续支持发货与成交状态流转</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.admin {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}
.eyebrow {
  color: #7a3f1d;
  font-size: 22rpx;
  letter-spacing: 4rpx;
}
.title {
  font-size: 44rpx;
  font-weight: 900;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  margin-top: 24rpx;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.value {
  color: #7a3f1d;
  font-size: 38rpx;
  font-weight: 900;
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
}
.action-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  min-height: 168rpx;
}
.primary-action {
  grid-column: 1 / -1;
  border: 2rpx solid rgba(122, 63, 29, 0.18);
}
.action-title {
  font-size: 32rpx;
  font-weight: 900;
}
.action-link {
  color: #7a3f1d;
  font-size: 26rpx;
  font-weight: 800;
}
</style>

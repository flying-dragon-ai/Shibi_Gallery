<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import type { Artwork, ArtworkSaleStatus } from '@shibi/shared';
import EmptyState from '../../../components/EmptyState.vue';
import { listArtworks } from '../../../api/artworks';
import { useAuthStore } from '../../../stores/auth';

const statusText: Record<ArtworkSaleStatus, string> = {
  available: '可售',
  reserved: '已锁定',
  sold: '已售',
  hidden: '隐藏'
};

const auth = useAuthStore();
const artworks = ref<Artwork[]>([]);
const loading = ref(false);
const error = ref('');
const canRender = ref(false);

const availableCount = computed(() => artworks.value.filter((item) => item.saleStatus === 'available').length);
const soldCount = computed(() => artworks.value.filter((item) => item.saleStatus === 'sold').length);

onShow(async () => {
  const allowed = await ensureAdmin();
  canRender.value = allowed;
  if (allowed) await fetchArtworks();
});

async function ensureAdmin() {
  if (!auth.isLoggedIn) await auth.login();
  if (!auth.isAdmin) {
    uni.showToast({ title: '无后台权限', icon: 'none' });
    setTimeout(() => uni.switchTab({ url: '/pages/user/index' }), 600);
    return false;
  }
  return true;
}

async function fetchArtworks() {
  loading.value = true;
  error.value = '';
  try {
    artworks.value = await listArtworks();
  } catch (err) {
    error.value = err instanceof Error ? err.message : '作品加载失败';
  } finally {
    loading.value = false;
  }
}

function createArtwork() {
  uni.navigateTo({ url: '/pages/admin/artworks/edit' });
}

function editArtwork(id: string) {
  uni.navigateTo({ url: `/pages/admin/artworks/edit?id=${id}` });
}
</script>

<template>
  <view v-if="canRender" class="container">
    <view class="card header">
      <view>
        <text class="eyebrow">ADMIN / ARTWORKS</text>
        <text class="title">作品仓库</text>
        <text class="muted">维护原作信息、价格、状态和图片 URL。</text>
      </view>
      <button class="primary-button add-button" @tap="createArtwork">新增作品</button>
    </view>

    <view class="summary">
      <view class="card summary-card"><text class="label">全部</text><text class="value">{{ artworks.length }}</text></view>
      <view class="card summary-card"><text class="label">可售</text><text class="value">{{ availableCount }}</text></view>
      <view class="card summary-card"><text class="label">已售</text><text class="value">{{ soldCount }}</text></view>
    </view>

    <EmptyState v-if="error" title="加载失败" :subtitle="error" />
    <EmptyState v-else-if="loading" title="正在加载作品" subtitle="请稍候" />
    <EmptyState v-else-if="artworks.length === 0" title="暂无作品" subtitle="点击新增作品录入第一件原作" />

    <view v-else class="list">
      <view v-for="item in artworks" :key="item.id" class="card artwork-row" @tap="editArtwork(item.id)">
        <image v-if="item.images[0]" class="thumb" mode="aspectFill" :src="item.images[0].url" />
        <view v-else class="thumb placeholder">无图</view>
        <view class="info">
          <text class="name">{{ item.title }}</text>
          <text class="muted">{{ item.artistName || item.artistId }} · {{ item.medium }} · {{ item.year }}</text>
          <view class="meta">
            <text class="price">¥{{ (item.priceCents / 100).toLocaleString() }}</text>
            <text class="status">{{ statusText[item.saleStatus] }}</text>
          </view>
        </view>
        <button class="edit-button" size="mini" @tap.stop="editArtwork(item.id)">编辑</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.eyebrow {
  color: #7a3f1d;
  font-size: 22rpx;
  letter-spacing: 4rpx;
}
.title {
  display: block;
  margin: 10rpx 0;
  font-size: 44rpx;
  font-weight: 900;
}
.add-button {
  width: 100%;
}
.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin: 24rpx 0;
}
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
  padding: 22rpx 12rpx;
}
.label {
  color: #8b8178;
  font-size: 24rpx;
}
.value {
  color: #7a3f1d;
  font-size: 36rpx;
  font-weight: 900;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.artwork-row {
  display: grid;
  grid-template-columns: 144rpx 1fr auto;
  gap: 20rpx;
  align-items: center;
}
.thumb {
  width: 144rpx;
  height: 144rpx;
  border-radius: 20rpx;
  background: #eadfce;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8178;
  font-size: 24rpx;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  min-width: 0;
}
.name {
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  display: flex;
  gap: 16rpx;
  align-items: center;
}
.price {
  color: #7a3f1d;
  font-size: 30rpx;
  font-weight: 900;
}
.status {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #f4eadb;
  color: #7a3f1d;
  font-size: 22rpx;
}
.edit-button {
  margin: 0;
  border-radius: 999rpx;
  color: #7a3f1d;
  font-size: 24rpx;
}
</style>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Artwork } from '@shibi/shared';
import { getArtwork } from '../../api/artworks';
import { useAuthStore } from '../../stores/auth';
import { useOrderStore } from '../../stores/orders';

const artwork = ref<Artwork | null>(null);
const artworkId = ref('');
const form = ref({ receiverName: '', receiverPhone: '', address: '' });
const auth = useAuthStore();
const orders = useOrderStore();

onLoad(async (query) => {
  artworkId.value = String(query?.artworkId || '');
  if (artworkId.value) artwork.value = await getArtwork(artworkId.value);
});

async function submit() {
  if (!auth.isLoggedIn) await auth.login();
  const order = await orders.create({ artworkId: artworkId.value, ...form.value });
  uni.redirectTo({ url: `/pages/orders/detail?id=${order.id}` });
}
</script>

<template>
  <view class="container">
    <view class="card" v-if="artwork">
      <text class="title">{{ artwork.title }}</text>
      <text class="muted">¥{{ (artwork.priceCents / 100).toLocaleString() }}</text>
    </view>
    <view class="card form">
      <input v-model="form.receiverName" placeholder="收件人" />
      <input v-model="form.receiverPhone" placeholder="联系电话" />
      <textarea v-model="form.address" placeholder="收件地址" />
      <button class="primary-button" @tap="submit">提交订单</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.title {
  font-size: 34rpx;
  font-weight: 800;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  margin-top: 24rpx;
}
input, textarea {
  padding: 22rpx;
  border-radius: 18rpx;
  background: #f4eadb;
  font-size: 28rpx;
}
textarea {
  width: 100%;
  box-sizing: border-box;
}
</style>

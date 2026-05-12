<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { useOrderStore } from '../../stores/orders';

const orders = useOrderStore();

onLoad(async (query) => {
  if (query?.id) await orders.fetchDetail(String(query.id));
});
</script>

<template>
  <view class="container" v-if="orders.current">
    <view class="card detail">
      <text class="title">订单 {{ orders.current.id.slice(0, 8) }}</text>
      <text class="muted">状态：{{ orders.current.status }}</text>
      <text>收件人：{{ orders.current.receiverName }}</text>
      <text>电话：{{ orders.current.receiverPhone }}</text>
      <text>地址：{{ orders.current.address }}</text>
      <text class="price">¥{{ (orders.current.totalCents / 100).toLocaleString() }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.title {
  font-size: 38rpx;
  font-weight: 900;
}
.price {
  color: #7a3f1d;
  font-size: 42rpx;
  font-weight: 900;
}
</style>

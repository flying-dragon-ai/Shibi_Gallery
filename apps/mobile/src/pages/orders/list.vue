<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { useAuthStore } from '../../stores/auth';
import { useOrderStore } from '../../stores/orders';

const auth = useAuthStore();
const orders = useOrderStore();

onShow(async () => {
  if (auth.isLoggedIn) await orders.fetchMine();
});

function openOrder(id: string) {
  uni.navigateTo({ url: `/pages/orders/detail?id=${id}` });
}
</script>

<template>
  <view class="container">
    <text class="section-title">我的订单</text>
    <view class="list">
      <view v-for="order in orders.orders" :key="order.id" class="card order" @tap="openOrder(order.id)">
        <text class="id">订单 {{ order.id.slice(0, 8) }}</text>
        <text class="muted">状态：{{ order.status }}</text>
        <text class="price">¥{{ (order.totalCents / 100).toLocaleString() }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.list, .order {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.id {
  font-weight: 700;
}
.price {
  color: #7a3f1d;
  font-size: 34rpx;
  font-weight: 900;
}
</style>

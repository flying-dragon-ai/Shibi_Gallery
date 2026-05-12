<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();

async function login() {
  await auth.login();
  uni.showToast({ title: '登录成功' });
}

function openOrders() {
  uni.navigateTo({ url: '/pages/orders/list' });
}

function openAdmin() {
  uni.navigateTo({ url: '/pages/admin/index' });
}
</script>

<template>
  <view class="container">
    <view class="card profile">
      <template v-if="auth.isLoggedIn && auth.user">
        <text class="name">{{ auth.user.nickname || '微信用户' }}</text>
        <text class="muted">角色：{{ auth.user.role }}</text>
        <button @tap="openOrders">我的订单</button>
        <button v-if="auth.isAdmin" @tap="openAdmin">运营后台</button>
        <button @tap="auth.logout">退出登录</button>
      </template>
      <template v-else>
        <text class="name">欢迎来到师比画廊</text>
        <text class="muted">登录后可收藏作品、创建订单、查看购买记录。</text>
        <button class="primary-button" @tap="login">微信登录</button>
      </template>
    </view>
  </view>
</template>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: stretch;
}
.name {
  font-size: 40rpx;
  font-weight: 900;
}
button {
  border-radius: 999rpx;
}
</style>

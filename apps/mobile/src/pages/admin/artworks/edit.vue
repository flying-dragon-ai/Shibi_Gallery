<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { computed, reactive, ref } from 'vue';
import type { ArtworkSaleStatus, CopyrightStatus } from '@shibi/shared';
import { createAdminArtwork, updateAdminArtwork, type AdminArtworkPayload } from '../../../api/admin';
import { getArtwork } from '../../../api/artworks';
import { useAuthStore } from '../../../stores/auth';

const saleStatuses: ArtworkSaleStatus[] = ['available', 'reserved', 'sold', 'hidden'];
const saleStatusLabels: Record<ArtworkSaleStatus, string> = {
  available: '可售',
  reserved: '已锁定',
  sold: '已售',
  hidden: '隐藏'
};
const copyrightStatuses: CopyrightStatus[] = ['none', 'available', 'licensed'];
const copyrightStatusLabels: Record<CopyrightStatus, string> = {
  none: '无授权',
  available: '可授权',
  licensed: '已授权'
};

const auth = useAuthStore();
const artworkId = ref('');
const saving = ref(false);
const imageText = ref('');
const canRender = ref(false);

const form = reactive({
  artistId: '',
  title: '',
  description: '',
  category: '油画',
  size: '',
  medium: '',
  year: new Date().getFullYear(),
  priceYuan: '',
  saleStatusIndex: 0,
  copyrightStatusIndex: 1
});

const pageTitle = computed(() => (artworkId.value ? '编辑作品' : '新增作品'));
const imageUrls = computed(() =>
  imageText.value
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
);
const coverPreview = computed(() => imageUrls.value[0] || '');

onLoad(async (query) => {
  const allowed = await ensureAdmin();
  canRender.value = allowed;
  if (!allowed) return;

  artworkId.value = String(query?.id || '');
  if (artworkId.value) await loadArtwork(artworkId.value);
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

async function loadArtwork(id: string) {
  const artwork = await getArtwork(id);
  form.artistId = artwork.artistId;
  form.title = artwork.title;
  form.description = artwork.description;
  form.category = artwork.category;
  form.size = artwork.size;
  form.medium = artwork.medium;
  form.year = artwork.year;
  form.priceYuan = String(artwork.priceCents / 100);
  form.saleStatusIndex = Math.max(0, saleStatuses.indexOf(artwork.saleStatus));
  form.copyrightStatusIndex = Math.max(0, copyrightStatuses.indexOf(artwork.copyrightStatus));
  imageText.value = artwork.images.map((image) => image.url).join('\n');
}

function onSaleStatusChange(event: { detail: { value: number } }) {
  form.saleStatusIndex = Number(event.detail.value);
}

function onCopyrightStatusChange(event: { detail: { value: number } }) {
  form.copyrightStatusIndex = Number(event.detail.value);
}

function buildPayload(): AdminArtworkPayload {
  const price = Number(form.priceYuan);
  const year = Number(form.year);
  if (!form.artistId || !form.title || !form.description || !form.size || !form.medium) {
    throw new Error('请补全艺术家、标题、描述、尺寸和介质');
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('价格必须大于 0');
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error('年份需在 1900-2100 之间');
  }

  return {
    artistId: form.artistId,
    title: form.title,
    description: form.description,
    category: form.category,
    size: form.size,
    medium: form.medium,
    year,
    priceCents: Math.round(price * 100),
    saleStatus: saleStatuses[form.saleStatusIndex],
    copyrightStatus: copyrightStatuses[form.copyrightStatusIndex],
    imageUrls: imageUrls.value
  };
}

async function submit() {
  try {
    saving.value = true;
    const payload = buildPayload();
    if (artworkId.value) {
      await updateAdminArtwork(artworkId.value, payload);
    } else {
      await createAdminArtwork(payload);
    }
    uni.showToast({ title: '已保存' });
    setTimeout(() => uni.navigateBack(), 500);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '保存失败', icon: 'none' });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <view v-if="canRender" class="container">
    <view class="card header">
      <text class="eyebrow">ADMIN / ARTWORK FORM</text>
      <text class="title">{{ pageTitle }}</text>
      <text class="muted">价格以元录入，提交时自动转换为后端使用的分。</text>
    </view>

    <view class="card form-card">
      <label class="field"><text>艺术家 ID</text><input v-model="form.artistId" placeholder="请输入 artistId UUID" /></label>
      <label class="field"><text>作品标题</text><input v-model="form.title" placeholder="例如：午后蓝房间" /></label>
      <label class="field"><text>作品描述</text><textarea v-model="form.description" placeholder="作品故事、陈设建议、鉴证说明" /></label>
      <label class="field"><text>分类</text><input v-model="form.category" placeholder="油画 / 纸本 / 综合材料" /></label>
      <label class="field"><text>尺寸</text><input v-model="form.size" placeholder="60 x 80 cm" /></label>
      <label class="field"><text>介质</text><input v-model="form.medium" placeholder="布面油画" /></label>
      <label class="field"><text>年份</text><input v-model.number="form.year" type="number" /></label>
      <label class="field"><text>价格（元）</text><input v-model="form.priceYuan" type="digit" placeholder="12800" /></label>

      <view class="field">
        <text>销售状态</text>
        <picker :range="saleStatuses.map((status) => saleStatusLabels[status])" :value="form.saleStatusIndex" @change="onSaleStatusChange">
          <view class="picker-value">{{ saleStatusLabels[saleStatuses[form.saleStatusIndex]] }}</view>
        </picker>
      </view>

      <view class="field">
        <text>版权状态</text>
        <picker :range="copyrightStatuses.map((status) => copyrightStatusLabels[status])" :value="form.copyrightStatusIndex" @change="onCopyrightStatusChange">
          <view class="picker-value">{{ copyrightStatusLabels[copyrightStatuses[form.copyrightStatusIndex]] }}</view>
        </picker>
      </view>

      <label class="field">
        <text>图片 URL 列表</text>
        <textarea v-model="imageText" class="image-textarea" placeholder="每行一个图片 URL，首行作为封面" />
      </label>

      <view v-if="coverPreview" class="preview">
        <text class="preview-title">封面预览</text>
        <image class="preview-image" mode="aspectFill" :src="coverPreview" />
        <text class="muted">共 {{ imageUrls.length }} 张图片</text>
      </view>
    </view>

    <button class="primary-button save-button" :loading="saving" :disabled="saving" @tap="submit">保存作品</button>
  </view>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
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
.form-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 24rpx;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  color: #2d261f;
  font-size: 28rpx;
  font-weight: 700;
}
input,
textarea,
.picker-value {
  width: 100%;
  box-sizing: border-box;
  border-radius: 18rpx;
  background: #f4eadb;
  color: #2d261f;
  font-size: 28rpx;
  font-weight: 400;
}
input,
.picker-value {
  min-height: 84rpx;
  padding: 0 22rpx;
  line-height: 84rpx;
}
textarea {
  min-height: 180rpx;
  padding: 22rpx;
}
.image-textarea {
  min-height: 240rpx;
}
.preview {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.preview-title {
  font-size: 28rpx;
  font-weight: 800;
}
.preview-image {
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  background: #eadfce;
}
.save-button {
  position: sticky;
  bottom: 24rpx;
  margin-top: 28rpx;
}
</style>

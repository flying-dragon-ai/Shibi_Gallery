<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useAuthStore } from './stores/auth';

onLaunch(() => {
  useAuthStore().restore();
});
</script>

<style lang="scss">
@use './styles/theme.scss';

page {
  min-height: 100%;
  background: #f7f1e8;
  color: #2d261f;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}
</style>

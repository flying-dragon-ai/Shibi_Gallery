import { defineConfig } from 'vite';
import uniPlugin from '@dcloudio/vite-plugin-uni';

type UniPluginFactory = () => unknown;

const uni = (uniPlugin as unknown as { default?: UniPluginFactory }).default ?? (uniPlugin as unknown as UniPluginFactory);

export default defineConfig({
  plugins: [uni()]
});

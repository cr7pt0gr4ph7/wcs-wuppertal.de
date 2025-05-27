import icon from 'astro-icon';
import mailObfuscation from 'astro-mail-obfuscation';
import { defineConfig } from 'astro/config';
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';

// https://astro.build/config
export default defineConfig({
  site: "https://wcs-wuppertal.de",
  integrations: [mailObfuscation(), icon()],
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkExtendedTable],
    remarkRehype: {
      handlers: extendedTableHandlers
    },
  },
  experimental: {
    responsiveImages: true
  },
  image: {
    experimentalLayout: 'full-width'
  }
});

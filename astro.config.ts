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
  },
  redirects: {
    "/kurse": {
      status: 302,
      destination: "/#kurse"
    },
    "/kurse/": {
      status: 302,
      destination: "/#kurse"
    },
    "/events": {
      status: 302,
      destination: "/#events"
    },
    "/events/": {
      status: 302,
      destination: "/#events"
    },
    "/events/wcs-rally-training-2025": {
      status: 302,
      destination: "/events/wcs-rally-2025/"
    },
    "/events/wcs-rally-training-2025/": {
      status: 302,
      destination: "/events/wcs-rally-2025/"
    },
  }
});

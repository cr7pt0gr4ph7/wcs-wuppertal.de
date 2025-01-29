import icon from 'astro-icon';
import mailObfuscation from 'astro-mail-obfuscation';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://wcs-wuppertal.de",
  integrations: [mailObfuscation(), icon()],
  experimental: {
    responsiveImages: true
  },
  image: {
    experimentalLayout: 'full-width'
  }
});

import mailObfuscation from 'astro-mail-obfuscation';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [mailObfuscation()]
});

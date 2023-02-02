import Dotenv from 'dotenv-esbuild';
import ESBuild from 'esbuild';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const cleanPlugin: ESBuild.Plugin = {
  name: 'CleanPlugin',
  setup(build) {
    build.onStart(async () => {
      try {
        const outdir = build.initialOptions.outdir;
        if (outdir) {
          await rm(outdir, { recursive: true });
        }
      } catch (error) {
        console.log(error);
      }
    });
  },
};

const mode = process.env.NODE_ENV || 'development';

const isDev = mode === 'development';

ESBuild.build({
  entryPoints: [path.resolve(__dirname, 'src', 'index.ts')],
  outdir: path.resolve(__dirname, 'dist'),
  entryNames: 'app.bundle',
  bundle: true,
  target: 'node16',
  sourcemap: isDev,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  platform: 'node',
  plugins: [cleanPlugin, new Dotenv()],
}).catch((error) => {
  console.log(error);
});

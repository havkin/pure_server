import ESBuild from 'esbuild';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const CleanPlugin: ESBuild.Plugin = {
  name: 'CleanPlugin',
  setup(build) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
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
const isProd = mode === 'production';

ESBuild.build({
  entryPoints: [path.resolve(__dirname, 'src', 'index.ts')],
  outdir: path.resolve(__dirname, 'dist'),
  entryNames: 'app.bundle',
  bundle: true,
  target: 'node16',
  minify: isProd,
  sourcemap: isDev,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  platform: 'node',
  plugins: [CleanPlugin],
}).catch((error) => {
  console.log(error);
});

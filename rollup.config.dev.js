import _package from './package.json';
import { plugins, mainPackage, modulePackage } from './rollup.config.elements';

export default {
  input: 'src/index.ts',
  output: [mainPackage, modulePackage],
  watch: {
    include: 'src/**',
  },
  external: [
    ...Object.keys(_package.dependencies || {}),
    ...Object.keys(_package.peerDependencies || {}),
  ],
  plugins,
};

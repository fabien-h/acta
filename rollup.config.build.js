import _package from './package.json';
import { plugins, mainPackage, modulePackage } from './rollup.config.elements';

export default {
  input: 'src/index.ts',
  output: [
    mainPackage,
    {
      ...modulePackage,
      globals: {
        'react-dom': 'ReactDOM',
        react: 'React',
      },
    },
  ],
  external: [
    ...Object.keys(_package.dependencies || {}),
    ...Object.keys(_package.devDependencies || {}),
    ...Object.keys(_package.peerDependencies || {}),
  ],
  plugins,
};

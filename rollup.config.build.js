import _package from './package.json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: _package.main,
      format: 'umd',
      name: 'Router',
      sourcemap: true,
      globals: {
        'react-dom': 'ReactDOM',
        react: 'React',
      },
      exports: 'named',
    },
    {
      file: _package.module,
      format: 'es',
      name: 'Router',
      sourcemap: true,
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
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs(),
    typescript({
      typescript: require('typescript'),
      useTsconfigDeclarationDir: true,
      objectHashIgnoreUnknownHack: true,
    }),
    sourceMaps(),
    terser(),
  ],
};

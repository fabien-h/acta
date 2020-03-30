import _package from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export const mainPackage = {
  file: _package.main,
  format: 'umd',
  name: 'Acta',
  sourcemap: true,
  globals: {
    'react-dom': 'ReactDOM',
    react: 'React',
  },
  exports: 'named',
};

export const modulePackage = {
  file: _package.module,
  format: 'es',
  name: 'Acta',
  sourcemap: true,
};

export const plugins = [
  resolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules',
    },
  }),
  commonjs(),
  typescript({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true,
  }),
  sourceMaps(),
];

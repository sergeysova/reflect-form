import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const resolverPlugin = resolve({
  extensions: ['.ts', '.js'],
});

const babelPlugin = babel({
  babelHelpers: 'bundled',
  sourceMaps: true,
  extensions: ['.ts', '.js'],
});

const terserPlugin = terser();

const input = 'src/lib/index.ts';
const external = ['effector', 'patronum', '@effector/reflect', 'effector-react'];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input,
    external,
    output: {
      name: 'reflectForm',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      globals: {
        effector: 'effector',
        react: 'react',
        '@effector/reflect': 'effectorReflect',
      },
    },
    plugins: [babelPlugin, resolverPlugin, commonjs(), terserPlugin],
  },
  {
    input,
    external,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [babelPlugin, resolverPlugin, commonjs(), terserPlugin],
  },
  {
    input,
    external,
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [resolverPlugin, dts()],
  },
];

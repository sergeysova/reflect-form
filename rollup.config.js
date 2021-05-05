import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const resolver = resolve({
  extensions: ['.ts', '.js'],
});

const babelPlugin = babel({ babelHelpers: 'bundled', extensions: ['.ts', '.js'] });

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input: 'src/lib/index.ts',
    output: {
      name: 'reflectForm',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [babelPlugin, resolver, commonjs()],
  },
  {
    input: 'src/lib/index.ts',
    external: ['effector', 'patronum', '@effector/reflect', 'effector-react'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [babelPlugin, resolver, commonjs()],
  },
];

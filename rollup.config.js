import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: !production
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: !production
      }
    ],
    plugins: [
      production && cleaner({
        targets: ["./dist/"]
      }),
      replace({
        __DEV__: process.env.NODE_ENV !== "production",
        preventAssignment: true
      }),
      typescript({
        tsconfig: 'tsconfig.json'
      }),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ]
  },
  {
    input: './dist/esm/index.d.ts',
    output: [
      {
        file: `dist/dynamic-redux-tools.d.ts`,
        format: 'es'
      }
    ],
    plugins: [dts(), !production && sourceMaps()]
  }
]
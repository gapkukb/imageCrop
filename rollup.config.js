import rpt from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
const isProd = process.env.NODE_ENV === 'prod'
const plugins = [rpt()].concat(isProd ? uglify() : [serve(), livereload()])
const factory = file => ({
    input: 'src/' + file,
    output: {
        name: 'Crop',
        file: 'dist/' + file.substring(0, file.lastIndexOf(".")) + (isProd ? '.min.' : '.') + 'js',
        format: 'umd'
    },
    plugins,
    watch: {
        exclude: "node_modules",
    }
})
export default [
    factory('base.ts'),
    factory('crop.preview.ts'),
];
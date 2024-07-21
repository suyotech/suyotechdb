import esbuild from 'esbuild'

const buildOptions = [
    {
        format : 'cjs',
        outdir : 'dist/cjs'
    },
    {
        format : 'esm',
        outdir : 'dist/esm'
    }
]

buildOptions.forEach(({format,outdir})=>{
    esbuild.buildSync({
        entryPoints : ['src/index.mjs'],
        bundle : true,
        minify : true,
        sourcemap : true,
        format : format,
        outdir : outdir,
    })
})
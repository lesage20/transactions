module.exports = {
    pluginOptions : {
        electronBuilder : {
            nodeIntegration: true,
            preload: 'src/preload.js',
        }
    },
    pages: {
        index: {
        entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Gestionnaire de transaction',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    printer: {
      entry: "src/printer.js",
      template: 'public/printer.html',
      filename: 'printer.html',
      title: "Page d'impression",
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
   },
    
}


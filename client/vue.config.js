module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '\n  @import "@/styles/_variables.scss"\n',
      },
      scss: {
        prependData: '\n  @import "@/styles/_variables.scss";\n',
      },
    },
  },
  transpileDependencies: ["vuetify"],
};

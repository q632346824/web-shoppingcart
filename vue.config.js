// module.exports = {
//     // ...
//     devServer: {
//         proxy: {
//         // proxy all requests starting with /api to jsonplaceholder
//         '/api': {
//           target: 'http://localhost:9090/',
//           changeOrigin: true,
//           pathRewrite: {
//             '^/api': ''
//           }
//         }
//       }
//     }
//   }
module.exports = {
    chainWebpack: config => {
      const svgRule = config.module.rule('svg')
    
      // clear all existing loaders.
      // if you don't do this, the loader below will be appended to
      // existing loaders of the rule.
      svgRule.uses.clear()
    
      // add replacement loader(s)
      svgRule
        .use('vue-svg-loader')
          .loader('vue-svg-loader')
    },
    devServer:{
      host: 'localhost',
      hot:true,
      port: 8080,  
      open: 'Chrome',
      proxy: { 
        '/api/goods':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/addCart':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/users':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/users/login':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/users/logout':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/checkLogin':{ //everything from root
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/cartList':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/deleteItem':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/data':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/cartEdit':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/editCheckAll':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/addressList':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/setDefaultAddress':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/delAddress':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/payment':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/orderDetail':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
        '/showOrderList':{ 
          target: 'http://localhost:9090',
          secure: false,
          ws: false,
        },
      }
    }
  }
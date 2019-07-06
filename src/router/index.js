
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import orderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

export default new Router({
  routes: [
    {
      path: '/',name: 'GoodsList',component:GoodsList
    },
    {
      path: '/cart',name: 'Cart',component:Cart
    },
    {
      path: '/address',name: 'Address',component:Address
    },
    {
      path: '/orderConfirm',name: 'orderConfirm',component:orderConfirm
    },
    {
      path: '/OrderSuccess',name: ' OrderSuccess',component: OrderSuccess
    },   

  ]
})

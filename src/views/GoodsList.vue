<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
        <span slot="bread">Goods</span>
    </nav-bread>

    <div class="accessory-result-page accessory-page">
    <div class="container">
        <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default" @click="sortByDefault()" v-bind:class="{'cur':sortModel=='Default'}">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGoods()" v-bind:class="{'cur':sortModel=='Price'}">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter">
            <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceLevel=='all'}">All</a></dd>
            <dd v-for="(item,index) in priceFilter" :key=item.startPrice>
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceLevel==index}">{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
            </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
            <ul>
                <li v-for="item in goodsList" :key="item._id">
                <div class="pic">
                    <a href="#"><img v-lazy="getImgUrl(item.productImage)" alt=""></a>
                </div>
                <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                </div>
                </li>
            </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                <img svg-inline class="icon" v-bind:src="getImgUrl('loading-svg/loading-bubbles.svg')" v-show="loading"/>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
            Please Login First
        </p>
        <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
    <p slot="message">
        <span>add to cart successfully</span>
    </p>
    <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">continue shopping</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">Go to Cart</router-link>
    </div>
    </modal>

    <nav-footer></nav-footer>
</div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'

export default {
  data(){
      return {
          goodsList:[],
          priceChecked:0,
          sortFlag:true,
          sortModel:'Default',
          pageSize:8,
          page:1,
          priceLevel:'all',
          busy:true,
          loading:false,
          mdShow:false,
          mdShowCart:false,
          priceFilter:[
                {   startPrice:'0.00',endPrice:'100.00'     },
                {   startPrice:'100.00',endPrice:'500.00'   },
                {   startPrice:'500.00',endPrice:'1000.00'  },
                {   startPrice:'1000.00',endPrice:'5000.00' }       
             ]

      }
  },
  components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
      },
  mounted(){
    this.sortByDefault()
  },
  methods:{
      getGoodsList(flag){
        
        var param={
            page:this.page,
            pageSize:this.pageSize,
            priceLevel:this.priceLevel
        }

        if(this.sortModel=='Price') param.sort=this.sortFlag
        this.loading = true;
        axios.get('/api/goods',{params:param}).then(res => {
            this.loading = false
            if(res.data.status===0){
                if(flag){
                    this.goodsList=this.goodsList.concat(res.data.result.list)

                    res.data.result.count<this.pageSize?this.busy=true:this.busy=false
                    
                }else{
                    this.goodsList=res.data.result.list
                    this.busy = false
                }
                
               }
           })        
       },
      sortGoods(){
        this.sortModel='Price'
        this.sortFlag=!this.sortFlag
        this.page=1
        this.getGoodsList()        
      },
      sortByDefault(){
        this.page=1
        this.sortModel='Default'
        this.getGoodsList()
      },
      addCart(id){
         axios.post("/addCart",{productId:id}).then(res=>{

                    if(res.data.status==0){
                        this.mdShowCart=true
                    }else if(res.data.status==2){
                        this.mdShow=true
                    }
                });
      },
      closeModal(){
        this.mdShow=false
        this.mdShowCart=false
      },
      loadMore(){
          
          this.busy=true
          setTimeout(() => {
              this.page++
              this.getGoodsList(true)
          }, 500);
      },
      getImgUrl(picName){
        return require("@/assets/img/"+picName);
      },
      setPriceFilter(index){

        this.priceLevel=index
        this.page=1
        this.getGoodsList()
       }
  },


}
</script>


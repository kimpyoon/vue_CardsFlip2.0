<template>
  <div id="app">
    <notice :iconCls="'icon-bd_laba ico_laba'" :swiperOption="swiperOption" :notices="notices"></notice>
    <div class="content">
      <ul v-show="isShowDown" class="down">
        <li @click="showMyFlip">历史翻牌</li>
        <li>娱乐大厅</li>
      </ul>
      <div class="lottery">
        <div class="myCoin"><img class="jinbi" src="static/images/Cards_coin.png"><span v-model="totalMoney" class="num">{{totalMoney}}</span><img class="add" src="static/images/cardsAdd.png"></div>
        <img v-touch:tap="showDown" class="myOption" src="static/images/Cards_sel.png">
      </div>
      <img class="Cards_lottery" src="static/images/Cards_lottery.png">
      <div class="cardsContainer">
        <tag @avatar="avatar" @createEmoji="createEmoji" @goldAnimate="goldAnimate" @showNotEnoughModal="showNotEnoughModal" @increaseMoney="increaseMoney" @showPrize="showPrize" @showRole="showRole" @calMoney="calTotalMoney" :totalMoney="totalMoney" ref="myCards" :tagOption="tagOption" :optionsData="cardOptions"></tag>
      </div>
      <div v-show="isShowRole" class="roleModal animated fadeIn">
        <h3 class="title">翻牌游戏规则</h3>
        <img class="lineTop" src="static/images/Cards_line.png">
        <p class="text">
          <ul class="roleContainer">
            <li>1.游戏所获奖励的金币会即可返还给用户。</li>
            <li>2.每次参与金额分别是100金币，1000金币或者10000金币中的一个。</li>
            <li>3.活动期间如有发现客户恶意刷单，作弊领取或损害其他用户公平参加活动的行为，平台将取消该用户因参加活动享有的利益。</li>
            <li>4.本游戏的期望值为 98%。</li>
            <li>5.本活动最终解释权归开发者本人。</li>
          </ul>
        </p>
        <img class="lineBottom" src="static/images/Cards_line.png">
        <div v-touch:tap.prevent.stop="closeRole" class="close">关闭</div>
      </div>
      <div v-show="isShowPize" class="roleModal animated bounceIn">
        <h3 v-show="price>0" class="title">恭喜您</h3><h3 v-show="price===0" class="title">很遗憾</h3>
        <p class="text">
          <span>获得{{price}}金币</span>
          <img class="prize" :src="prize">
        </p>
        <div class="close"><img v-touch:tap.prevent.stop="restart" src="static/images/Cards_btn_restart.png"></div>
      </div>
      <div v-show="isShowHistory" class="historyModal">
        <img class="titleLeft_bg" src="static/images/Cards_left_bg.png">
        <img class="titleRight_bg" src="static/images/Cards_right_bg.png">
        <h3 class="title">我的翻牌</h3>
        <img class="lineTop" src="static/images/Cards_line.png">
        <p class="second_title">
          <span class="text_left">翻牌消耗：{{TotalConsume}}<img src="static/images/Cards_coin.png"></span>
          <span class="text_right">翻牌获得：{{TotalGain}}<img src="static/images/Cards_coin.png"></span>
        </p>
        <img class="lineSecond" src="static/images/Cards_line.png">
        <p class="tb_head">
          <span>消耗</span><span>获得</span><span>时间</span>
        </p>
        <div class="dePrizeContainer">
          <ul>
            <li :class="{'itemBg':index%2===0}" v-for="(item,index) in ArrDetPrize"><span>{{ item.consume }}</span><span>{{ item.gain }}</span><span>{{ item.time }}</span></li>
          </ul>
        </div>
        <div v-touch:tap.prevent.stop="closeMyFlip" class="close">关闭</div>
      </div>
      <div v-show="isShowRecharge" class="NotEnoughModal">
        <h3 class="title">您的金币余额不足</h3>
        <p class="container">
          <img src="static/images/Cards_emptyBox.png">
        </p>
        <div class="footer">
          <img v-touch:tap.prevent.stop="cancel" class="cancel" src="static/images/Cards_btn_cancel.png">
          <img v-touch:tap.prevent.stop="recharge" class="recharge" src="static/images/Cards_btn_recharge.png">
        </div>
      </div>
      <div class="AvatarFooter">
        <div ref="mine" v-for="(item,index) in UserData">
          <img :src="item.avatarUrl">
          <span>{{item.userName}}</span>
        </div>
    </div>
    <div style="clear: both;"></div>
    </div>

    <div v-touch:tap.prevent.stop="closeModal" v-show="isShowModal" class="modal"></div>

  </div>
</template>

<script>

import {swiper,swiperSlide} from 'vue-awesome-swiper'
import Notice from '@/components/common/Notice.vue'
import Tag from '@/components/common/Tag.vue'
export default {
  data () {
    return {
      swiperOption: {
        direction : 'vertical',
        loop: true,
        autoplay: 2000,
        height:50,
        speed: 600,
        onlyExternal: true,
        simulateTouch: false,
        allowTouchMove: false,
        touchMoveStopPropagation: false
      },
      tagOption: {
        notNextTick: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        observer:true,
        observeParents:true,
        allowTouchMove: false,
        onlyExternal: false,
        touchMoveStopPropagation: false,
        paginationBulletRender: function (swiper, index, className) {
          className = 'my-pagination-bullet';
          var money = 0;
          switch(index){
            case 0:
              money = 100;
              break;
            case 1:
              money = 1000;
              break;
            case 2:
              money = 10000;
              break;
            default:
              money = 0;
              break;
          }
          return '<span class="swiper-pagination-bullet ' + className + '">' + money + '金币</span>';
      }
      },
      notices: [],
      cardOptions: [],
      defaultMoney: 6666,
      isShowRole: false,
      isShowDown: false,
      isShowModal: false,
      isShowPize: false,
      isShowRecharge: false,
      prize: '',
      price: 0,
      isShowHistory: false,
      TotalConsume: 0,
      TotalGain: 0,
      ArrDetPrize: [],
      money: 0,
      UserData: [],
      interval1: {},
      interval2: {},
      interval3: {},
      interval4: {}
    }
  },
  created(){
    this.axios.get('./static/mock/notice.json').then(res => {
      if (res.data.code == 200) {
        res.data.data.forEach(function(value,index,arr){
          res.data.data[index] = '恭喜'+value['name'] + '5分钟前获得' + value['prize'] + value['prizeCount']
        })
        this.notices = res.data.data
      }else{

      }
    }).catch(err => {
      console.log(err)
    })
    this.axios.get('./static/mock/CardsOptions.json').then( res => {
      if (res.data.code == 200) {
        this.cardOptions = res.data.options
        // console.log(this.cardOptions)
      }else{

      }
    }).catch(err => {
      console.log(err)
    })
    this.axios.get('./static/mock/CardsUsers.json').then( res => {
      if (res.data.code == 200) {
        this.UserData = res.data.data
      }else{

      }
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    totalMoney() {
      return this.defaultMoney
    }
  },
  updated() {
    this.$nextTick(()=>{
      if(this.$refs.mine!=undefined){
        this.$refs.mine[2].className = "mine"
      }
      
    })
  },
  mounted() {

  },
  methods:{
    goldAnimate() {
      clearInterval(this.interval1)
      clearInterval(this.interval2)
      clearInterval(this.interval3)
      clearInterval(this.interval4)
      this.interval1 = setInterval(()=>{
        this.loadAvatarAction(0)
      },Math.floor(Math.random()*6+2)*1000)
      this.interval2 = setInterval(()=>{
        this.loadAvatarAction(1)
      },Math.floor(Math.random()*3+2)*1000)
      this.interval3 = setInterval(()=>{
        this.loadAvatarAction(3)
      },Math.floor(Math.random()*4+2)*1000)
      this.interval4 = setInterval(()=>{
        this.loadAvatarAction(4)
      },Math.floor(Math.random()*5+2)*1000)
      // console.log(t)
    },
    loadAvatarAction(n) {
      let random = Math.floor(Math.random()*10+1)
      if(random === 3 || random === 2){
        this.avatar(n)
        this.createEmoji(n,'static/images/Cards_laugh_emoji.png')
      }
      if(random === 7 || random === 9){
        this.createEmoji(n,'static/images/Cards_cry_emoji.png')
      }
    },
    avatar(n) {
      let rect = this.$refs.mine[n].getBoundingClientRect()
      let left = rect.left+rect.width/2-11.25*rect.width/75
      let oApp = document.getElementById('app')
      let ball = document.createElement('img')
      ball.src = 'static/images/Cards_gold.png'
      ball.style.position = "fixed"
      ball.style.left = `${left}px`
      ball.style.width = "6%"
      ball.style.zIndex = 70
      ball.className = "jump"
      oApp.appendChild(ball)
      setTimeout(()=>{ball.remove()},2000)

    },
    createEmoji(n,src) {
      let rect = this.$refs.mine[n].getBoundingClientRect()
      let left = rect.left+rect.width/2-11.25*rect.width/75
      let oApp = document.getElementById('app')
      let eSmile = document.createElement('img')
      eSmile.src = src
      eSmile.style.position = "fixed"
      eSmile.style.left = `${left}px`
      eSmile.style.width = "6%"
      eSmile.style.zIndex = 100
      eSmile.className = "emoji"
      oApp.appendChild(eSmile)
      setTimeout(()=>{eSmile.remove()},2000)
    },
    cancel() {
      this.isShowRecharge = false
      this.isShowModal = false
    },
    recharge() {
      this.cancel()
      alert("跳转充值弹层")
    },
    showNotEnoughModal() {
      this.isShowRecharge = true
      this.isShowModal = true
    },
    showMyFlip() {
      this.isShowHistory = true
      this.isShowDown = false
    },
    closeMyFlip() {
      this.isShowHistory = false
      this.isShowModal = false
    },
    showDown(event, start, end){
      this.isShowDown = !this.isShowDown
      this.isShowModal = !this.isShowModal
    },
    calTotalMoney(money) {
      this.defaultMoney -= money
      this.tagOption.allowSwipeToNext = false
      this.tagOption.allowSwipeToPrev = false
      this.TotalConsume += money
      this.money = money
    },
    increaseMoney(current) {
      setTimeout(()=>{
        this.defaultMoney += this.price
        this.TotalGain += this.price
        let ObjDetPrize = {}
        ObjDetPrize.consume = this.money
        ObjDetPrize.gain = this.price
        ObjDetPrize.time = current
        this.ArrDetPrize.unshift(ObjDetPrize)
      },2000)
    },
    showRole() {
      this.isShowRole = !this.isShowRole
      this.isShowModal = true
    },
    closeRole(event, start, end) {
      this.isShowRole = false
      this.isShowModal = false
    },
    closeModal(event, start, end) {
      if(this.isShowDown===true) {
        this.isShowModal = false
        this.isShowDown = false
      }
      else{
        return ''
      }
    },
    showPrize(prize) {
      this.prize = prize
      this.isShowPize = true
      this.isShowModal = true
      const index = prize.lastIndexOf("\_")
      this.price = prize.substring(index+1,prize.length-4)-0
      this.tagOption.allowSwipeToNext = true
      this.tagOption.allowSwipeToPrev = true
    },
    restart(event, start, end) {
      this.isShowPize = false
      this.isShowModal = false
      this.$children[1].resetGame()
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.$refs.myCards.showCards
    })
  },
  components: {
    swiper,
    swiperSlide,
    Notice,
    Tag
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .AvatarFooter {
    position: fixed;
    bottom: 0;
    z-index: 70;
    width: 100%;
    left: 0;
    overflow: hidden;
  }
  .AvatarFooter .mine img {
    margin-top: 0;
    width: 50%;
  }
  .AvatarFooter div{
    width: 20%;
    float: left;
    font-size: 0;
  }
  .AvatarFooter div img {
    margin-top: 8%;
    display: inline-block;
    width: 40%;
    overflow: hidden;
    transform: translateZ(400px);
  }
  .AvatarFooter div span{
    display: block;
    font-size: 12px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .NotEnoughModal {
    margin: -150px auto;
    position: absolute;
    top: 52%;
    left: 0;
    right: 0;
    width: 288px;
    border-radius: 18px;
    z-index: 500;
    box-shadow: 0 0 7px #2054ff;  
    background: #0b1c55;
  }
  .NotEnoughModal .title {
    font-size: 18px;
    letter-spacing: 1px;
    line-height: 60px;
  }
  .NotEnoughModal .container img {
    width: 46%;
  }
  .NotEnoughModal .footer {
    height: 72px;
  }
  .NotEnoughModal .footer img {
    margin-top: 20px;
    width: 36%;
  }
  .NotEnoughModal .footer .cancel{
    margin-right: 20px;
  }
  .NotEnoughModal .footer .recharge{
    margin-left: 20px;
  }
  .historyModal{
    margin: -150px auto;
    position: absolute;
    top: 46%;
    left: 0;
    right: 0;
    width: 288px;
    border-radius: 18px;
    z-index: 500;
    box-shadow: 0 0 7px #2054ff;  
    background: #0b1c55;
    font-size: 14px;
  }
  .historyModal .titleLeft_bg,.historyModal .titleRight_bg {
    margin-top: 10px;
    width: 20%;
  }
  .historyModal .titleLeft_bg {
    float: left;
  }
  .historyModal .titleRight_bg {
    float: right;
  }
  .historyModal .title{
    font-size: 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 56px;
    color: #ffffff;
    letter-spacing: 1px;
    line-height: 56px;
    border-bottom: 1px solid #002088;
  }
  .historyModal .lineTop{
    width: 100%;
    position: relative;
    bottom: 12px;
  }
  .historyModal .second_title .text_left{
    text-align: left;
    display: inline-block;
    width: 50%;
    font-size: 14px;
    float: left;
  }
  .historyModal .second_title .text_right {
    text-align: right;
    display: inline-block;
    width: 50%;
    font-size: 12px;
    float: right;
  }
  .historyModal .second_title {
    width: 100%;
    font-size: 0;
    letter-spacing: 0;
    height: 33px;
    border-bottom: 1px solid #002088;
  }
  .historyModal .second_title img{
    position: relative;
    top: 2px;
    width: 12%;
  }
  .historyModal .lineSecond {
    width: 100%;
    position: relative;
    bottom: 12px;
  }
  .historyModal .tb_head {
    width: 100%;
  }
  .historyModal .tb_head span {
    display: inline-block;
    width: 33.3%;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    font-size: 14px;
  }
  .historyModal .dePrizeContainer ul li {
    font-size: 0;
    line-height: 40px;
  }
  .historyModal .dePrizeContainer ul li span {
    display: inline-block;
    width: 33.3%;
    color: #ffffff;
    font-size: 14px;
    vertical-align: middle;
  }
  .historyModal .dePrizeContainer ul li span:last-child{
    line-height: 14px;
  }
  .itemBg {
    background: #091368;
  }
  .historyModal .dePrizeContainer {
    height: 134px;
    overflow: scroll;
  }
  .historyModal .close {
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    background: #0b1c55;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top: 1px solid #002088;
  }
  .roleModal .text img,{
    width: 40%
  }
  .roleModal .text span {
    margin: 10px auto;
    display: block;
    font-size: 20px;
    font-weight: bold;
    color: #e8410e;
  }
  .roleModal .prize {
    width: 44%;
  }
  .roleModal .close img {
    width: 30%;
    margin-top: 12px;
  }
  .down {
      margin: 0;
      padding:20px 0;
      width: 36%;
      text-align: center;
      color: #fefefe;
      font-weight: bold;
      border-radius: 10px;
      position: absolute;
      right: 0;
      top: 34px;
      background: #6d7fcc;
      list-style: none;
      z-index: 600;
      box-shadow: 0 0 12px #338da8;
  }
  .down li:first-child {
    padding-bottom: 20px;
  }
  .modal {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background: #171355;
      z-index: 400;
      opacity: 0.4;
      overflow: hidden;
      transform: translateZ(100px);
  }
  .roleModal{
    margin: -150px auto;
    position: absolute;
    top: 46%;
    left: 0;
    right: 0;
    width: 288px;
    border-radius: 18px;
    background: #0b1c55;
    z-index: 500;
    letter-spacing: 2px;
    box-shadow: 0 0 7px #2054ff;   
  }
  .roleContainer{
    text-align: left;
  }
  .roleModal .title{
    font-size: 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #0b1750;
    height: 56px;
    color: #e8410e;
    letter-spacing: 1px;
    line-height: 56px;
  }
  .roleModal .lineTop{
    width: 100%;
    position: relative;
    bottom: 12px;
  }
  .roleModal .lineBottom {
    width: 100%;
    position: relative;
    top: 3px;
  }
  .roleModal .text {
    padding: 0 10px;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: 22px;
    color: #b8c5c6;
  }

  .roleModal .close{
    font-size: 20px;
    height: 56px;
    line-height: 56px;
    font-weight: bold;
    background: #0b1750;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    max-width: 720px;
    margin: 0 auto;
    background: #012e3b;
    background: url('/static/images/Cards_bg.png')top no-repeat;
    background-size: 110%;
    min-height: 100%;
    overflow: hidden;
  }
  .myCoin{
    float: left;
    line-height: 18px;
    padding-top: 10px;
    color: #c9cbcf;
    font-size: 0;
  }
  .content {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    position: relative;
  }
  .lottery{
    width: 100%;
    height: 100%;
  }
  .jinbi{
    width: 24px;
    height: 24px;
    float: left;
    position: relative;
    z-index: 2;
  }
  .add{
    width: 24px;
    height: 24px;
    float: right;
    position: relative;
    right: 18px;
  }
  .num {
    line-height: 20px;
    color: #f2a507;
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(255, 248, 165, 1)), to(rgba(242, 165, 7, 1)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    position: relative;
    top: 1px;
    display: inline-block;
    padding: 0 1em;
    font-size: 14px;
    border-style: solid;
    border-width: 1px 0;
    border-color: #f2a10a;
    left: -12px;
  }
  .num::after,.num::before{
    display: block;
    position: absolute;
    height: 1px;
    width: ;
  }
  .myOption {
    margin-top: 10px;
    float: right;
    width: 24px;
    height: 24px;
  }
  .Cards_lottery{
    width: 92%;
    position: relative;
    z-index: 1;
  }
  .cardsContainer {
    position: relative;
    bottom: 19px;
    width: 100%;
    padding-bottom: 44px;
  }

</style>

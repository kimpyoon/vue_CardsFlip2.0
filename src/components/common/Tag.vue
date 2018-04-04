<template>
	<swiper ref="mySwiper" class="myContainer" :options="tagOption">
		<div class="swiper-pagination my-pagination-box" slot="pagination"></div>
			<swiper-slide ref="myslide" v-for="(slide,index) in optionsData" :key="index"><img @click.prevent.stop="flipCard(index,slide.id,slide.title,slide.cardsUrl)" ref="cards" class="cardsImg" v-for="(item,index) in slide.cardsUrl" :src="item" :key="index">
			<div class="roleBox">
				<span v-touch:tap.prevent.stop="gameRole" class="gameRole">游戏规则</span>
			</div>
			</swiper-slide>
	</swiper>
</template>
<script type="text/javascript">
require('swiper/dist/css/swiper.css')
import {swiper,swiperSlide} from 'vue-awesome-swiper'
	export default({
		props : ['tagOption','optionsData','totalMoney'],
		data() {
			return{
				flag: false,
				prize: '',
				cardsUrl: [],
				currentPageIndex: 0,
				isFliping : false
			}
		},
		components:{
			swiper,
			swiperSlide
		},
		created() {
			this.$emit('goldAnimate')
		},
		updated() {
			this.getImgEl()
		},
		methods: {
			resetGame(){
				this.isFliping = false;
				let index = this.currentPageIndex
				let currentPageImgArr = this.$refs.myslide[index].$el['children']
				for(let i = 0;i<this.cardsUrl.length;i++){
					currentPageImgArr[i].src = this.cardsUrl[i]
					let end = currentPageImgArr[i].className.indexOf(' myrotate')
					if(currentPageImgArr[i].className.indexOf(' myrotate')>-1){
						currentPageImgArr[i].className = currentPageImgArr[i].className.substring(0,end)
					}
				}
				
			},
			gameRole(event, start, end) {
				this.$emit('showRole')	
			},
			getImgEl() {
				this.$nextTick(()=>{
					let cLength = this.$refs.cards.length/3;
					for(let i=1;i<=cLength;i++){
						let n = 3*i-2;
						if(this.$refs.cards[n].className.indexOf('middle')>-1){
							break
						}
						this.$refs.cards[n].className += ' middle'
						if(this.$refs.cards[n].src.indexOf("btn")>-1){
							this.$refs.cards[n].id = 'CardBtn'
						}
					}
				})
			},
			flipCard(index,id,money,imgUrl) {
				this.cardsUrl = imgUrl
				this.currentPageIndex = id
				const currentPageImgArr = this.$refs.myslide[id].$el['children']
				// console.log(this.$refs.myslide[id])
				if(index===4){
					if (!this.isFliping) {
						if(this.totalMoney>=money){
							this.isFliping = true;
							this.getImgEl()
							setTimeout(()=>{
								currentPageImgArr[index].className = 'cardsImg'
							},300)
							currentPageImgArr[index].className += ' card-btn'
							if(this.totalMoney>=money){
								currentPageImgArr[index].src = 'static/images/Cards_btn_grey.png'
							}
							// console.log(currentPageImgArr[index].click)
							for(let i = 0; i<currentPageImgArr.length;i++){
								if(i!==4 && this.totalMoney>=money){
									if(currentPageImgArr[i].className.indexOf('myrotate')>-1){
										break
									}
									currentPageImgArr[i].className += ' myrotate'
									setTimeout(()=>{
										currentPageImgArr[i].src = this.optionsData[0].CardsBgUrl
									},100)
								}
							}
							this.$emit('calMoney',money)
							setTimeout(()=>{
								this.flag = true
							},1800)
						}
						else{
							this.$emit("showNotEnoughModal")
						}

					}
					else{
						return false;
					}	
				}
				else{
					
					if (this.flag) {
						let random = Math.floor(Math.random()*8)
						currentPageImgArr[index].className += ' myback'
						if(random===4){
							random = Math.floor(Math.random()*8)
						}
						else{
							setTimeout(()=>{
								this.$nextTick(()=>{
									currentPageImgArr[index].src = imgUrl[random]
								})
							},500)
							this.prize = imgUrl[random]
						}
						this.flag = false
						if(this.prize === ''){this.prize = 'static/images/Cards_0.png'}
						setTimeout(()=>{
							this.$emit('showPrize',this.prize)
							currentPageImgArr[4].src = imgUrl[4]
						},1400)
						let current = this.CurentTime()
						this.$emit('increaseMoney',current)

				      	if(random === 8 || this.prize === 'static/images/Cards_0.png'){
				      		this.$emit('createEmoji',2,'static/images/Cards_cry_emoji.png')
				      	}else{
				      		setTimeout(()=>{
					      		this.$emit('avatar',2)
					      		this.$emit('createEmoji',2,'static/images/Cards_laugh_emoji.png')	
				      		},1000)
				      		
				      	}

					}
				}
			},
			CurentTime(){
		        let now = new Date()
		        let year = now.getFullYear() 
		        let month = now.getMonth() + 1
		        let day = now.getDate()
		        let hh = now.getHours() 
		        let mm = now.getMinutes() 
		        let ss = now.getSeconds()
		        let clock = year + "-"
		        if(month < 10)  
		            clock += "0"
			        clock += month + "-"
		        if(day < 10)
		            clock += "0"  
		        	clock += day + " " 
		        if(hh < 10)
		            clock += "0"      
		        	clock += hh + ":"
		        if (mm < 10) clock += '0'
		        	clock += mm + ":"
		        if (ss < 10) clock += '0'
		        	clock += ss
		        return(clock)
			}
		}
	})
</script>
<style>
	.jump {
		animation: myJump 2s;
	}
	@keyframes myJump{
		0% {
			transform: rotateY(0deg);
			bottom: 10%;
			opacity: 1;
		}
		50% {
			transform: rotateY(360deg);
			bottom: 3%;
			opacity: .5;
		}
		100% {
			transform: rotateY(720deg);
			bottom: 0;
			opacity: 0;
		}
	}
	.emoji {
		animation: myEmoji 2s cubic-bezier(0.49, -0.29, 0.75, 0.41);
	}
	@keyframes myEmoji{
		0% {
			transform: scale(.9, .9);
			bottom: 0;
			opacity: 0;
		}
		50% {
			transform: scale(1.6, 1.6);
			bottom: 2%;
			opacity: 1;
		}
		100% {
			transform: scale(.9, .9);
			bottom: 2%;
			opacity: 0;
		}
	}
	#CardBtn{
		max-width: 26%;
		padding: 0 16px 0;
	}
	.middle{
		padding: 0 10px;
	}
	.roleBox {
		height: 30px;
		line-height: 30px;
		color: #0d538e;
		width: 100px;
		margin: 0 auto;
	}
	.gameRole{
		border-bottom: 1px solid;
	}
	.myContainer {
		top: 10px;
		border: 1px solid #45dee0;
		border-radius: 10px;
		box-shadow: 0 0 16px #45dee0;
	}
	.swiper-slide {
		padding-top: 60px;
	}
	.card-btn {
		animation: clickbtn 0.2s;
	}
	.myrotate{
		animation: myrotate 2s;
	}
	.myback{
		animation: myback 1s;
	}
	@keyframes clickbtn{
		0%{
			-webkit-transform: scale(.9, .9);
			transform: scale(.9, .9);
		}
		100%{
			-webkit-transform: scale(1, 1);
			transform: scale(1, 1);
		}
	}
	@-webkit-keyframes clickbtn{
		0%{
			-webkit-transform: scale(.9, .9);
			transform: scale(.9, .9);
		}
		100%{
			-webkit-transform: scale(1, 1);
			transform: scale(1, 1);
		}
	}
	@keyframes myrotate{
	  from {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	    opacity: 0;
	  }

	  40% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	  }

	  60% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
	    opacity: 1;
	  }

	  80% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
	  }

	  to {
	    -webkit-transform: perspective(400px);
	    transform: perspective(400px);
	  }
	}
	@-webkit-keyframes myrotate {
	  from {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	    opacity: 0;
	  }

	  40% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
	    -webkit-animation-timing-function: ease-in;
	    animation-timing-function: ease-in;
	  }

	  60% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
	    opacity: 1;
	  }

	  80% {
	    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
	    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
	  }

	  to {
	    -webkit-transform: perspective(400px);
	    transform: perspective(400px);
	  }
	}
	@-webkit-keyframes myback{
		0%{
			-webkit-transform: rotateY(0deg);
			transform: rotateY(0deg);
		}
		100%{
			-webkit-transform: rotateY(720deg);
			transform: rotateY(720deg);
		}
	}
	@keyframes myback{
		0%{
			-webkit-transform: rotateY(0deg);
			transform: rotateY(0deg);
		}
		100%{
			-webkit-transform: rotateY(720deg);
			transform: rotateY(720deg);
		}
	}
	.cardsImg {
		margin-bottom: 10px;
		position: relative;
		max-width: 30%;
	}
	.swiper-pagination {
		width: 90%;
		margin: 0 auto;
		top: 10px;
		left: 5.3%;
	}
	.swiper-pagination-bullet-active {
		border-bottom: 4px solid #7804fb !important;
		text-shadow: -1px 0 #7804fb,0 1px #7804fb,1px 0 #7804fb,0 -1px #7804fb;
		
	}
	.my-pagination {
		position: absolute;
		top: 16px;
		bottom: 100%
	}
	.my-pagination-bullet{
		margin: 0 !important;
		display: inline-block;
		height: 40px;
		line-height: 40px;
		cursor: default !important;
		font-size: 18px;
		font-weight: lighter;
		width: 33.3%;
		border-radius: 0;
		background: none;
		border-bottom: 4px double #ffffff;
		opacity: 1;
	}
	.my-pagination-bullet .pagBtn{
		width: 95px;
		height: 44px;
	}
	#app .cardsContainer .my-pagination-box{
		bottom: auto;
	}
</style>
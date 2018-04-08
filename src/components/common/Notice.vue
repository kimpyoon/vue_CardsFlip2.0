<template>
	<div class="note_list">
	<i class="iconfont" :class="iconCls"></i>
		<swiper :options="swiperOption">
		  <swiper-slide v-for="(slide,index) in notices" :key="index">{{slide}}</swiper-slide>
		</swiper>
	</div>
</template>
<script type="text/javascript">
require('swiper/dist/css/swiper.css')
import {swiper,swiperSlide} from 'vue-awesome-swiper'
	export default({
		props : ['iconCls','notices','swiperOption'],
		components:{
			swiper,
			swiperSlide
		}
	})
</script>
<style scoped>

.note_list {
    width: 100%;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    padding: 0 5% 0 5%;
    color: #ffffff;
    background: rgba(19, 27, 96, .6);
    overflow: hidden;
    box-sizing: border-box;
    text-align: left;
}
.swiper-slide {
	padding-top: 0;
}
.ico_laba {
	margin-right: 10px;
	float: left;
    color: #05dfef;
}
</style>
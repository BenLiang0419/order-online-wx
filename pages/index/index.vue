<template>
	<view class="container">
		<view class="banner">
			<swiper class="bg" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item>
					<image src="https://img-shop.qmimg.cn/s23107/2020/04/26/3eb7808bf105262604.jpg" mode="" class="bg"></image>
				</swiper-item>
				<swiper-item>
					<image src="https://img-shop.qmimg.cn/s23107/2020/04/26/3eb7808bf105262604.jpg" mode="" class="bg"></image>
				</swiper-item>
			</swiper>
			<view class="intro">
				<view class="greet">您好，{{ isLogin ? member.nickname : '游客' }}</view>
				<view class="note">领鲜“食”界，健康“味”来，快乐生活，常来做客</view>
			</view>
		</view>
		<view class="content">
			<view class="entrance">
				<view class="item" @tap="takein">
					<image src="/static/images/index/zq.png" class="icon"></image>
					<view class="title">自取</view>
				</view>
				<view class="item">
					<image src="/static/images/index/wm.png" class="icon"></image>
					<view class="title">外卖</view>
				</view>
			</view>
			<view class="info">
				<view class="integral_section" @tap="integrals">
					<view class="top">
						<text class="title">我的积分</text>
						<text class="value">587</text>
					</view>
					<view class="bottom">
						进入积分商城优惠券
						<view class="iconfont iconarrow-right"></view>
					</view>
				</view>
			</view>
			<view class="navigators">
				<view class="left">
					<view class="grid flex-column just-content-center">
						<view class="d-flex align-items-center">
							<image src="/static/images/index/csc.png" class="mark-img"></image>
							<view class="font-size-sm text-color-base">全新单品</view>
						</view>
						<view class="text-color-assist" style="margin-left: 40rpx; font-size: 20rpx;">鸭屎香水果茶</view>
					</view>
					<view class="grid justify-content-end align-items-end">
						<image src="/static/images/index/yzclh.png" class="yzclh-img" mode="heightFix"></image>
					</view>
				</view>
				<view class="right">
					<view class="tea-activity">
						<image src="/static/images/index/mcsb.png" class="mark-img"></image>
						<view>霸气榴莲王</view>
						<view class="right-img">
							<image src="/static/images/index/mcsb_bg.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="member-gifts">
						<image src="/static/images/index/hyjb.png" class="mark-img"></image>
						<view>原味薯条</view>
						<view class="right-img">
							<image src="/static/images/index/hyjb_bg.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="member-news">
				<view class="header">
					<view class="title">会员新鲜事</view>
					<view class="iconfont iconRightbutton"></view>
				</view>
				<view class="list">
					<view class="item">
						<image src="https://img-shop.qmimg.cn/s23107/2020/04/27/0039bf41c9ebd50a2c.jpg"></image>
						<view class="title">领鲜“食”界，健康“味”来</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters} from 'vuex'
	
	export default {
		data() {
			return {
			}
		},
		computed: {
			...mapState(['member']),
			...mapGetters(['isLogin'])
		},
		methods: {
			takein() {
				this.$store.commit('SET_ORDER_TYPE', 'takein')
				uni.switchTab({
					url: '/pages/menu/menu'
				})
			},
			integrals() {
				if(!this.isLogin) {
					uni.navigateTo({url: '/pages/login/login'})
					return
				}
				uni.navigateTo({
					url: '/pages/integrals/integrals'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
page {
	height: auto;
	min-height: 100%;
}
/* #endif */

.banner {
	position: relative;
	width: 100%;
	height: 600rpx;
	
	.bg {
		width: 100%;
		height: 600rpx;
	}
	
	.intro {
		position: absolute;
		top: calc(50rpx + var(--status-bar-height));
		left: 40rpx;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		
		.greet {
			font-size: $font-size-lg;
			margin-bottom: 10rpx;
		}
		
		.note {
			font-size: $font-size-sm;
		}
	}
}

.content {
	padding: 0 30rpx;
}

.entrance {
	position: relative;
	margin-top: 20rpx;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
	background-color: #ffffff;
	box-shadow: $box-shadow;
	padding: 30rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		
		&:nth-child(1):after {
			content: '';
			position: absolute;
			width: 1rpx;
			background-color: #ddd;
			right: 0;
			height: 100%;
			transform: scaleX(0.5) scaleY(0.8);
		}
		
		.icon {
			width: 84rpx;
			height: 84rpx;
			margin: 20rpx;
		}
		
		.title {
			font-size: 30rpx;
			color: $text-color-base;
			font-weight: 600;
		}
	}
}

.info {
	position: relative;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
	background-color: #ffffff;
	box-shadow: $box-shadow;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.integral_section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		
		.top {
			display: flex;
			align-items: center;
			
			.title {
				color: $text-color-base;
				font-size: $font-size-base;
				margin-right: 10rpx;
			}
			.value {
				font-size: 44rpx;
				font-weight: bold;
			}
		}
		
		.bottom {
			font-size: $font-size-sm;
			color: $text-color-assist;
			display: flex;
			align-items: center;
		}
	}
}

.navigators {
	width: 100%;
	margin-bottom: 20rpx;	
	border-radius: 10rpx;
	background-color: #ffffff;
	box-shadow: $box-shadow;
	padding: 20rpx;
	display: flex;
	align-items: stretch;
	
	.left {
		width: 340rpx;
		margin-right: 20rpx;
		display: flex;
		padding: 0 20rpx;
		flex-direction: column;
		font-size: $font-size-sm;
		color: $text-color-base;
		background-color: #F2F2E6;
		
		.grid {
			height: 50%;
			display: flex;
		}
	}
	
	.right {
		width: 290rpx;
		display: flex;
		flex-direction: column;
		
		.tea-activity, .member-gifts {
			width: 100%;
			display: flex;
			padding: 20rpx;
			font-size: $font-size-sm;
			color: $text-color-base;
			align-items: center;
			position: relative;
		}
		
		.tea-activity {
			background-color: #FDF3F2;
			margin-bottom: 20rpx;
		}
		
		.member-gifts {
			background-color: #FCF6D4;
		}
		
		.right-img {
			flex: 1;
			position: relative;
			margin-left: 20rpx;
			margin-right: -20rpx;
			margin-bottom: -20rpx;
			display: flex;
			align-items: flex-end;
			
			image {
				width: 100%;
			}
		}
	}
	
	.mark-img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	
	.yzclh-img {
		height: 122.96rpx;
		width: 214.86rpx;
	}
}

.member-news {
	width: 100%;
	margin-bottom: 30rpx;
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		
		.title {
			font-size: $font-size-lg;
			font-weight: bold;
		}
		
		.iconfont {
			font-size: 52rpx;
			color: $text-color-assist;
		}
	}
	
	.list {
		width: 100%;
		display: flex;
		flex-direction: column;
		
		.item {
			width: 100%;
			height: 240rpx;
			position: relative;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
			}
			
			.title {
				position: relative;
				font-size: 32rpx;
				font-weight: 500;
				width: 100%;
				top: -70rpx;
				left: 16rpx;
				color: #ffffff;
			}
		}
	}
}
</style>

<template>
	<view class="container">
		<van-tabs :active="active" bind:change="onChange">
			<van-tab title="当前订单">
				<view v-if="!Object.keys(order).length" class="d-flex w-100 h-100 flex-column just-content-center align-items-center pt-50p">
					<view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
						<view>最近没有点单记录哟 ~ </view>
					</view>
					<button type="primary" class="drink-btn" size="default" @tap="menu">去点餐</button>
				</view>
				<view v-else class="order-box">
					<view class="bg-white">
						<view class="section">
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="d-flex align-items-center just-content-center">
										<view class="sort-num">{{ order.sort_num }}</view>
									</view>
									<!-- steps begin -->
									<view class="d-flex just-content-center">
										<view class="steps d-flex flex-column w-80">
											<view class="steps__img-column">
												<view class="steps__img-column-item">
													<image src="/static/images/order/ordered_selected.png" v-if="order.status >= 1"></image>
													<image src="/static/images/order/ordered_selected.png" v-else></image>
												</view>
												<view class="steps__img-column-item" :class="{active: order.status >= 2}">
													<image src="/static/images/order/production_selected.png" v-if="order.status >= 2"></image>
													<image src="/static/images/order/production.png" v-else></image>
												</view>
												<view class="steps__img-column-item" :class="{active: order.status >= 4}">
													<image src="/static/images/order/delivered_selected.png" v-if="order.status >= 4"></image>
													<image src="/static/images/order/delivered.png" v-else></image>
												</view>
											</view>
											<view class="steps__text-column">
												<view class="steps__text-column-item" :class="{active: order.status >= 1}">
													<view class="steps__column-item-line bg-transparent"></view>
													<view class="steps__text-column-item-text">已下单</view>
													<view class="steps__column-item-line"></view>
												</view>
												<view class="steps__text-column-item" :class="{active: order.status >= 2}">
													<view class="steps__column-item-line"></view>
													<view class="steps__text-column-item-text">制作中</view>
													<view class="steps__column-item-line"></view>
												</view>
												<view class="steps__text-column-item" :class="{active: order.status >= 4}">
													<view class="steps__column-item-line"></view>
													<view class="steps__text-column-item-text">请取餐</view>
													<view class="steps__column-item-line bg-transparent"></view>
												</view>
											</view>
										</view>
									</view>
									<!-- steps end -->
									<view v-if="order.status<=1" class="d-flex just-content-center align-items-center font-size-base text-color-assist mb-40">
										您前面还有 <text class="text-color-primary mr-10 ml-10">4</text> 单待制作
									</view>
									<!-- goods begin -->
									<view class="w-100 d-flex flex-column position-relative mt-30" style="margin-bottom: -40rpx;">
										<view class="w-100 d-flex align-items-center mb-40" v-for="(good, index) in order.goods" :key="index">
											<view class="d-flex flex-column w-60 overflow-hidden">
												<view class="font-size-lg text-color-base mb-10 text-truncate">{{ good.name }}</view>
												<view class="font-size-sm text-color-assist text-truncate">{{ good.property }}</view>
											</view>
											<view class="d-flex w-40 align-items-center justify-content-between pl-30">
												<view class="font-size-base text-color-base">x{{ good.number }}</view>
												<view class="font-size-base text-color-base font-weight-bold">￥{{ good.price }}</view>
											</view>
										</view>
									</view>
									<!-- goods end -->
								</view>
							</list-cell>
						</view>
						<view class="section">
							<!-- payment and amount begin -->
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="pay-cell">
										<view>支付方式</view>
										<view class="font-weight-bold">{{ order.pay_mode }}</view>
									</view>
									<view class="pay-cell">
										<view>金额总计</view>
										<view class="font-weight-bold">￥{{ order.amount }}</view>
									</view>
								</view>
							</list-cell>
							<!-- payment and amount end -->
						</view>
						<view class="section">
							<!-- order info begin -->
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="pay-cell">
										<view>下单时间</view>
										<view class="font-weight-bold">{{ $util.formatDateTime(order.created_at) }}</view>
									</view>
									<view class="pay-cell">
										<view>下单门店</view>
										<view class="font-weight-bold">{{ order.store.name }}</view>
									</view>
									<view class="pay-cell">
										<view>订单号</view>
										<view class="font-weight-bold">{{ order.order_no }}</view>
									</view>
								</view>
							</list-cell>
							<!-- order info end -->
						</view>
						<!-- order other info begin -->
						<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
							<view class="w-100 d-flex flex-column">
								<view class="pay-cell">
									<view>取单号</view>
									<view class="font-weight-bold">{{ order.sort_num }}</view>
								</view>
								<view class="pay-cell">
									<view>享用方式</view>
									<view class="font-weight-bold">自取</view>
								</view>
								<view class="pay-cell">
									<view>取餐时间</view>
									<view class="font-weight-bold">立即取餐</view>
								</view>
								<view class="pay-cell">
									<view>完成制作时间</view>
									<view class="font-weight-bold">{{ order.productioned_time }}</view>
								</view>
								<view class="pay-cell">
									<view>备注</view>
									<view class="font-weight-bold">{{ order.postscript }}</view>
								</view>
							</view>
						</list-cell>
						<!-- order other info end -->
					</view>
				</view>
			</van-tab>
			<van-tab title="历史订单">
				<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
					<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;">
						<list-cell :hover="false">
							<view class="w-100 d-flex align-items-center">
								<view class="flex-fill d-flex flex-column">
									<view class="font-size-sm text-color-assist">订单编号：{{ item.order_no }}</view>
								</view>
								<view class="font-size-lg text-color-primary">
									{{ item.status_text }}
								</view>
							</view>
						</list-cell>
						<list-cell :hover="false" last>
							<view class="w-100 d-flex flex-column">
								<view class="w-100 text-truncate font-size-lg text-color-base" style="margin-bottom: 20rpx;">
									{{ orderGoodsName(item.goods) }}
								</view>
								<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
									<view class="font-size-sm text-color-assist">
										{{ $util.formatDateTime(item.created_at) }}
									</view>
									<view class="d-flex font-size-sm text-color-base align-items-center">
										<view style="margin-right: 10rpx;">共{{ item.goods_num }}件商品，实付</view>
										<view class="font-size-lg">￥{{ item.amount }}</view>
									</view>
								</view>
								<view class="d-flex align-items-center justify-content-end">
									<view style="margin-right: 10rpx;">
										<button type="primary" plain size="mini" @tap="detail(item.id)">查看订单</button>
									</view>
								</view>
							</view>
						</list-cell>
					</view>
				</view>
			</van-tab>
		</van-tabs>
		
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	import {mapState} from 'vuex'
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				page: 1,
				pageSize: 5,
				orders: [],
				active: 0
			}
		},
		computed: {
			...mapState(['order']),
			orderGoodsName() {
				return (goods) => {
					let arr = []
					goods.forEach(good => arr.push(good.name + '*' + good.number))
					return arr.join('，')
				}
			}
		},
		async onLoad() {
			if(!this.$store.getters.isLogin) {
				uni.navigateTo({url: '/pages/login/login'})
			}
			await this.getOrders(false)
		},
		async onReachBottom() {
			await this.getOrders(false)
		},
		methods: {
			async getOrders(isRefresh = false) {
				uni.showLoading({
					title: '加载中'
				})
				
				let orders = await this.$api('orders')
				if(isRefresh) {
					this.orders = []
					this.page = 1
				}
				orders = orders.slice(this.pageSize * (this.page - 1), this.pageSize * this.page)
				if(orders.length) {
					this.orders = this.orders.concat(orders)
					this.page += 1
				}
				
				uni.hideLoading()
			},
			detail(id) {
				uni.navigateTo({
					url: '/pages/orders/detail?id=' + id
				})
			},
			menu() {
				uni.switchTab({
					url: '/pages/menu/menu'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/wxcomponents/vant-weapp/common/index.wxss';
	
	.order-box {
		padding: 20rpx;
		/* #ifdef H5 */
		margin-bottom: 100rpx;
		/* #endif */
	}
	
	.drinks-img {
		width: 260rpx;
		height: 260rpx;
	}
	
	.tips {
		margin: 60rpx 0 80rpx;
		line-height: 48rpx;
	}
	
	.drink-btn {
		width: 320rpx;
		border-radius: 50rem !important;
		margin-bottom: 40rpx;
		font-size: $font-size-base;
		line-height: 3.0;
	}
	
	@mixin arch {
		content: "";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: -15rpx;
		z-index: 10;
		border-radius: 100%;
	}
	
	.section {
		position: relative;
		
		&::before {
			@include arch;
			left: -15rpx;
		}
		
		&::after {
			@include arch;
			right: -15rpx;
		}
	}
	
	.pay-cell {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: $font-size-base;
		color: $text-color-base;
		margin-bottom: 40rpx;
	
		&:nth-last-child(1) {
			margin-bottom: 0;
		}
	}
	
	.sort-num {
		font-size: 64rpx;
		font-weight: bold;
		color: $text-color-base;
		line-height: 2;
	}
	
	.steps__img-column {
		display: flex;
		margin: 30rpx 0;
		
		.steps__img-column-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			
			image {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}
	
	.steps__text-column {
		display: flex;
		margin-bottom: 40rpx;
		
		.steps__text-column-item {
			flex: 1;
			display: inline-flex;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-base;
			color: $text-color-assist;
			
			&.active {
				color: $text-color-base;
				font-weight: bold;
				
				.steps__column-item-line {
					background-color: $text-color-base;
				}
			}
			
			.steps__column-item-line{
				flex: 1;
				height: 2rpx;
				background-color: #919293;
				transform: scaleY(0.5);
			}
			
			.steps__text-column-item-text {
				margin: 0 8px;
			}
		}
	}
	
</style>

<template>
	<view class="container position-relative">
		<view style="margin-bottom: 130rpx;">
			<view class="section-1">
				<list-cell class="location">
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<uni-icons type="location-filled" size="25"></uni-icons>
						<view class="store-name flex-fill">
							{{ store.name }}
						</view>
					</view>
				</list-cell>
				<list-cell arrow class="meal-time">
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<view class="title">取餐时间</view>
						<view class="time">立即用餐</view>
					</view>
				</list-cell>
				<list-cell class="contact" last :hover="false">
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<view class="title flex-fill">联系电话</view>
						<view class="time">
							<input class="text-right" placeholder="请输入手机号码" value="18666600000"/>
						</view>
						<view class="contact-tip font-size-sm">自动填写</view>
					</view>
				</list-cell>
			</view>
			<!-- 购物车列表 begin -->
			<view class="section-2">
				<view class="cart d-flex flex-column">
					<list-cell last v-for="(item, index) in cart" :key="index">
						<view class="w-100 d-flex flex-column">
							<view class="d-flex align-items-center mb-10">
								<view>
									<image :src="item.image" class="icon"></image>
								</view>
								<view class="d-flex flex-column w-75">
									<view class="name-and-props overflow-hidden">
										<view class="text-color-base font-size-lg">
											{{ item.name }}
										</view>
									</view>
									<view class="d-flex flex-fill justify-content-between align-items-center text-color-base font-size-lg">
										<view>x{{ item.number }}</view>
										<view>￥{{ item.price }}</view>
									</view>
									<view class="text-truncate font-size-base text-color-assist" v-if="item.props_text">
										{{ item.props_text }}
									</view>
								</view>
							</view>
						</view>
					</list-cell>
				</view>
				<list-cell last>
					<view class="flex-fill d-flex justify-content-end align-items-center">
						<view>总计￥{{ total }},实付</view>
						<view class="font-size-extra-lg font-weight-bold">￥{{ total }}</view>
					</view>
				</list-cell>
			</view>
			<!-- 购物车列表 end -->
			<view class="d-flex align-items-center justify-content-start font-size-sm text-color-warning" 
				style="padding: 20rpx 0;">
				<view class="iconfont iconhelp line-height-100"></view>
				<view>优惠券不与满赠、满减活动共享</view>
			</view>
			<!-- 支付方式 begin -->
			<view class="payment">
				<list-cell last :hover="false">
					<text>支付方式</text>
				</list-cell>
				<list-cell>
					<view class="d-flex align-items-center justify-content-between w-100 disabled">
						<view class="iconfont iconbalance line-height-100 payment-icon"></view>
						<view class="flex-fill">余额支付（余额￥0）</view>
						<view class="font-size-sm">余额不足</view>
						<view class="iconfont iconradio-button-off line-height-100 checkbox"></view>
					</view>
				</list-cell>
				<list-cell last>
					<view class="d-flex align-items-center justify-content-between w-100">
						<view class="iconfont iconwxpay line-height-100 payment-icon" style="color: #7EB73A;"></view>
						<view class="flex-fill">微信支付</view>
						<view class="iconfont iconradio-button-on line-height-100 checkbox checked"></view>
					</view>
				</list-cell>
			</view>
			<!-- 支付方式 end -->
			<!-- 备注 begin -->
			<list-cell arrow last @click="goToRemark">
				<view class="d-flex flex-fill align-items-center justify-content-between overflow-hidden">
					<view class="flex-shrink-0 mr-20">备注</view>
					<view class="text-color-primary flex-fill text-truncate text-right">{{ form.remark || '点击填写备注' }}</view>
				</view>
			</list-cell>
			<!-- 备注 end -->
		</view>
		<!-- 付款栏 begin -->
		<view class="w-100 pay-box position-fixed fixed-bottom d-flex align-items-center justify-content-between bg-white">
			<view class="font-size-sm" style="margin-left: 20rpx;">合计：</view>
			<view class="font-size-lg flex-fill">￥{{ total }}</view>
			<view class="bg-primary h-100 d-flex align-items-center just-content-center text-color-white font-size-base"
				style="padding: 0 60rpx;" @tap="submit">
				付款
			</view>
		</view>
		<!-- 付款栏 end -->
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import listCell from '@/components/list-cell/list-cell'
	import orders from '@/api/orders'
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				cart: [],
				form: {
					remark: ''
				}
			}
		},
		computed: {
			...mapState(['orderType', 'address', 'store']),
			total() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			}
		},
		onLoad(option) {
			const {remark} = option
			this.cart = uni.getStorageSync('cart')
			remark && this.$set(this.form, 'remark', remark)
		},
		methods: {
			...mapMutations(['SET_ORDER']),
			goToRemark() {
				uni.navigateTo({
					url: '/pages/remark/remark?remark=' + this.form.remark
				})
			},
			submit() {
				uni.showLoading({title: '加载中'})
				//测试订单
				let order = {
				    "pay_mode": "微信支付",
				    "goods_num": 2,
				    "completed_at": 1588937139,
				    "created_at": 1588936782,
				    "status_text": "已完成",
				    "remark": "",
				    "store": {
				        "name": this.store.name
				    },
				    "status": 1,
				    "amount": this.total,
				    "productioned_time": "2020-05-08 19:24:37",
				    "postscript": "堂食",
				    "sort_num": "8093",
				    "order_no": "ABCDEFGHIJKLMN0001",
				    "id": 1,
				    "goods": this.cart
				}
				this.SET_ORDER(order)
				uni.removeStorageSync('cart')
				uni.reLaunch({
					url: '/pages/take-foods/take-foods'
				})
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 30rpx;
	}
	
	.arrow {
		width: 50rpx; 
		height: 50rpx;
		position: relative;
		margin-right: -10rpx;
	}
	
	.icon {
		width: 138rpx;
		height: 138rpx;
	}
	
	.location {
		.store-name {
			font-size: $font-size-lg;
		}
		
		.iconfont {
			font-size: 50rpx;
			line-height: 100%;
			color: $color-primary;
		}
	}
	
	.section-1 {
		margin-bottom: 30rpx;
		.contact {
			.contact-tip {
				margin-left: 10rpx;
				border: 2rpx solid $color-primary;
				padding: 6rpx 10rpx;
				color: $color-primary;
			}
		}
	}
	
	.section-2 {
		.name-and-props {
			width: 65%;
		}
	}
	
	.payment {
		margin-bottom: 30rpx;
		
		.disabled {
			color: $text-color-grey;
		}
		
		.payment-icon {
			font-size: 44rpx; 
			margin-right: 10rpx;
		}
		
		.checkbox {
			font-size: 36rpx;
			margin-left: 10rpx;
		}
		
		.checked {
			color: $color-primary;
		}
	}
	
	.pay-box {
		box-shadow: 0 0 20rpx rgba(0, 0, 0, .1);
		height: 100rpx;
	}
	
	.modal-content {
		.change-address-btn {
			line-height: 2;
			padding: 0 1em;
		}
		.pay_btn {
			width: 100%;
			border-radius: 50rem !important;
			line-height: 3;
		}
	}
</style>

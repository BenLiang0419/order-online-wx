<template>
	<div>
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template slot="content">
				<view class="top">
					<uni-icons type="trash" size="20" style="padding-right: 2rpx;"></uni-icons>
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
	</div>
</template>

<script>

import popupLayer from '@/components/popup-layer/popup-layer'
	
export default {
	components: {
		popupLayer
	},
	props: {
		cart: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			cartPopupVisible: false
		}
	},
	methods: {
		//打开/关闭购物车列表popup
		openCartPopup() {
			this.cartPopupVisible = !this.cartPopupVisible
		},
		//清空购物车
		handleCartClear() {
			uni.showModal({
				title: '提示',
				content: '确定清空购物车么',
				success: ({confirm}) =>  {
					if(confirm) {
						this.$emit('update:cart', [])
						this.cartPopupVisible = false
					}
				}
			})
		},
		handleCartItemReduce(index) {
			if(this.cart[index].number === 1) {
				this.cart.splice(index, 1)
			} else {
				this.cart[index].number -= 1
			}
			this.$emit('update:cart', this.cart)
			if(!this.cart.length) {
				this.cartPopupVisible = false
			}
		},
		handleCartItemAdd(index) {
			this.cart[index].number += 1
			this.$emit('update:cart', this.cart)
		},
	}
}

</script>

<style lang="scss" scoped>
	@import '~@/pages/menu/menu.scss';
</style>
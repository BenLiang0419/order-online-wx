<template>
	<view class="container" v-if="!loading">
		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="header">
					<view class="left">
						<view class="store-name">
							<text>{{ store.name }}</text>
							<view class="iconfont iconarrow-right"></view>
						</view>
					</view>
					<view class="right">
						<view class="dinein" :class="{active: orderType == 'takein'}">
							<text>自取</text>
						</view>
						<view class="takeout">
							<text>外卖</text>
						</view>
					</view>
				</view>
				<view>
					<van-notice-bar
					  left-icon="volume-o"
					  scrollable
					  text="给你家一样的感觉，体会家里的味道。"
					/>
				</view>
				<view>
					<van-search placeholder="请输入搜索关键词" shape="round" @search="searchGoods" @clear="clearGoods"></van-search>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view class="menu" :id="`menu-${item.id}`" :class="{'current': item.id === currentCateId}" v-for="(item, index) in goods" 
						:key="index" @tap="handleMenuTap(item.id)">
							<text>{{ item.name }}</text>
							<view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view>
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
					<view class="wrapper">
						<swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper>
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
									<image :src="item.icon" class="icon"></image>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.goods_list" :key="key">
										<image :src="good.images" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.name }}</text>
											<text class="tips">{{ good.content }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.use_property">
													<button type="primary" class="btn property_btn" hover-class="none"
													 size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(good.id)" plain class="btn reduce_btn"
													 size="mini" hover-class="none" @tap="handleReduceFromCart(item, good)">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
													<button type="primary" class="btn add_btn" size="min" hover-class="none" 
														@tap="handleAddToCart(item, good, 1)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<!-- content end -->
			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="primary" class="pay-btn" @tap="toPay">去结算</button>
			</view>
			<!-- 购物车栏 end -->
		</view>
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" 
				width="90%" custom padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.images" :src="good.images" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.content }}</view>
					</view>
					<view class="properties" v-if="good.use_property">
						<view class="property" v-for="(item, index) in good.property" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.values" :key="key" 
								:class="{'default': value.is_default}" 
								@tap="changePropertyDefault(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ good.price }}</view>
					<view class="props" v-if="getGoodSelectedProps(good)">
						{{ getGoodSelectedProps(good) }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" 
						@tap="handlePropertyReduce">
						<view class="iconfont iconsami-select"></view>
					</button>
					<view class="number">{{ good.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" 
						@tap="handlePropertyAdd">
						<view class="iconfont iconadd-select"></view>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<!-- 商品详情模态框 end -->
		<!-- 购物车详情popup -->
		<cart :cart.sync="cart" ref="cartRef"></cart>
		<!-- 购物车详情popup -->
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script>
import modal from '@/components/modal/modal'
import cart from './cart.vue'
import popupLayer from '@/components/popup-layer/popup-layer'
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

export default {
	components: {
		modal,
		popupLayer,
		cart
	},
	data() {
		return {
			initGoods: [], //所有商品
			ads: [
				{image: 'https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600'},
				{image: 'https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600'},
				{image: 'https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600'},
				{image: 'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600'},
				{image: 'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600'}
			],
			loading: true,
			currentCateId: 6905,//默认分类
			cateScrollTop: 0,
			menuScrollIntoView: '',
			cart: [], //购物车
			goodDetailModalVisible: false, //是否饮品详情模态框
			good: {}, //当前饮品
			category: {}, //当前饮品所在分类
			sizeCalcState: false,
			searchKeyWord: ''
		}
	},
	async onLoad() {
		await this.init()
	},
	computed: {
		...mapState(['orderType', 'store']),
		...mapGetters(['isLogin']),
		//计算单个商品添加到购物车的数量
		goodCartNum() {	
			return (id) => this.cart.reduce((acc, cur) => {
					if(cur.id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
		},
		// 计算菜单里面点击了多少个商品
		menuCartNum() {
			return (id) => this.cart.reduce((acc, cur) => {
					if(cur.cate_id === id) {
						return acc += cur.number
					}
					return acc
			}, 0)
		},
		//计算购物车总数
		getCartGoodsNumber() { 
			return this.cart.reduce((acc, cur) => acc + cur.number, 0)
		},
		//计算购物车总价
		getCartGoodsPrice() {	
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
		},
		goods() {
			if (this.searchKeyWord !== '') {
				const list = JSON.parse(JSON.stringify(this.initGoods))
				list.forEach(item => {
					item.goods_list = item.goods_list.filter((goodItem) => goodItem.name.includes(this.searchKeyWord))
					return item
				})
				return list.filter((item) => item.goods_list.length != 0)
			}
			return this.initGoods
		}
	},
	methods: {
		...mapMutations(['SET_ORDER_TYPE']),
		...mapActions(['getStore']),
		async init() {	//页面初始化
			this.loading = true
			await this.getStore()
			this.initGoods = await this.$api('goods')
			this.loading = false
			this.cart = uni.getStorageSync('cart') || []
		},
		searchGoods(val) {
			this.searchKeyWord = val.detail
		},
		clearGoods() {
			this.searchKeyWord = ''
		},
		//点击菜单项事件
		handleMenuTap(id) {	
			if(!this.sizeCalcState) {
				this.calcSize()
			}
			this.currentCateId = id
			this.$nextTick(() => this.cateScrollTop = this.goods.find(item => item.id == id).top)
		},
		//商品列表滚动事件
		handleGoodsScroll({detail}) {
			if(!this.sizeCalcState) {
				this.calcSize()
			}
			const {scrollTop} = detail
			let tabs = this.goods.filter(item=> item.top <= scrollTop).reverse()
			if(tabs.length > 0){
				this.currentCateId = tabs[0].id
			}
		},
		calcSize() {
			let h = 10
			
			let view = uni.createSelectorQuery().select('#ads')
			view.fields({
				size: true
			}, data => {
				h += Math.floor(data.height)
			}).exec()
			
			this.goods.forEach(item => {
				let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
				view.fields({
					size: true
				}, data => {
					item.top = h
					h += data.height
					item.bottom = h
				}).exec()
			})
			this.sizeCalcState = true
		},
		//添加到购物车
		handleAddToCart(cate, good, num) {
			const index = this.cart.findIndex(item => {
				if(good.use_property) {
					return (item.id === good.id) && (item.props_text === good.props_text)
				} else {
					return item.id === good.id
				}
			})
			if(index > -1) {
				this.cart[index].number += num
			} else {
				this.cart.push({
					id: good.id,
					cate_id: cate.id,
					name: good.name,
					price: good.price,
					number: num,
					image: good.images,
					use_property: good.use_property,
					props_text: good.props_text,
					props: good.props
				})
			}
		},
		handleReduceFromCart(item, good) {
			const index = this.cart.findIndex(item => item.id === good.id)
			this.cart[index].number -= 1
			if(this.cart[index].number <= 0) {
				this.cart.splice(index, 1)
			}
		},
		showGoodDetailModal(item, good) {
			this.good = JSON.parse(JSON.stringify({...good, number: 1}))
			this.category = JSON.parse(JSON.stringify(item))
			this.goodDetailModalVisible = true
		},
		//关闭模态框
		closeGoodDetailModal() {
			this.goodDetailModalVisible = false
			this.category = {}
			this.good = {}
		},
		//改变默认属性值
		changePropertyDefault(index, key) {
			this.good.property[index].values.forEach(value => this.$set(value, 'is_default', 0))
			this.good.property[index].values[key].is_default = 1
			this.good.number = 1
		},
		//计算当前所选属性
		getGoodSelectedProps(good, type = 'text') {	
			if(good.use_property) {
				let props = []
				good.property.forEach(({values}) => {
					values.forEach(value => {
						if(value.is_default) {
							props.push(type === 'text' ? value.value : value.id)
						}
					})
				})
				return type === 'text' ? props.join('，') : props
			}
			return ''
		},
		handlePropertyAdd() {
			this.good.number += 1
		},
		handlePropertyReduce() {
			if(this.good.number === 1) return
			this.good.number -= 1
		},
		handleAddToCartInModal() {
			const product = Object.assign({}, this.good, {props_text: this.getGoodSelectedProps(this.good), props: this.getGoodSelectedProps(this.good, 'id')})
			this.handleAddToCart(this.category, product, this.good.number)
			this.closeGoodDetailModal()
		},
		//打开/关闭购物车列表popup
		openCartPopup() {
			this.$refs.cartRef.openCartPopup()
		},
		// 支付
		toPay() {
			if(!this.isLogin) {
				uni.navigateTo({url: '/pages/login/login'})
				return
			}
			
			uni.showLoading({title: '加载中'})
			uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))
			
			uni.navigateTo({
				url: '/pages/pay/pay'
			})
			uni.hideLoading()
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~@/pages/menu/menu.scss';
</style>

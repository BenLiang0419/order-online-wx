import store from './store'
import goods from './goods'
import member from './member'
import rechargeCards from './rechargeCards'
import attendance from './attendance'
import customPoints from './custom-points'
import pointsMall from './points-mall'
import orders from './orders'
import customerCoupons from './customer-coupons'

const json = {
	store,
	goods,
	member,
	rechargeCards,
	attendance,
	customPoints,
	pointsMall,
	orders,
	customerCoupons
}

export default (name) => new Promise(resolve => resolve(json[name]), 500)
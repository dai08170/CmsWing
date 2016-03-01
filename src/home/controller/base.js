'use strict';

export default class extends think.controller.base {
  init(http) {
    super.init(http);
  }

  async __before() {
      //网站配置
      this.setup = await this.model("setup").getset();
      //当前登录状态
      this.is_login = await this.islogin();
      //获取当前分类信息
      //console.log(action);
      // this.meta_title = cate.meta_title?cate.meta_title:cate.title;
      //购物车
      let cartdata = this.cookie("cart_goods_item");
      console.log(cartdata);
      let cartinfo;
      if(think.isEmpty(cartdata)){
           cartinfo = {
          total:0,
          num:0,
          data:[]
         }
          
      }else{
          cartdata = JSON.parse(cartdata);
          let total = [];
          let num = [];
          for(let val of cartdata){
              total.push(val.price);
              num.push(val.qty); 
          }
         cartinfo = {
          total:eval(total.join('+')),
          num:eval(num.join('+')),
          data:cartdata
         }
      }
      this.cart = cartinfo;
      
    }
    /**
     * 判断是否登录
     * @returns {boolean}
     */
    async islogin() {
        //判断是否登录
        //let user = await this.session('userInfo');
        //let res = think.isEmpty(user) ? false : user.uid;
        return false;

    }
    
    //获取分类信息
  async category(id, field) {
    id = id || 0;
    field = field || "";
    console.log(id);
    if (think.isEmpty(id)) {
      this.fail('没有指定数据分类！');
    }
    let cate = await this.model("category").info(id, field);

    if (cate && 1 == cate.status) {

      switch (cate.display) {
        case 0:
          this.fail('该分类禁止显示')
          break;
          //TODO:更多分类显示状态判断
        default:

          return cate;
      }

    } else {
      this.fail("分类不存在或者被禁用！");
    }
  }
}

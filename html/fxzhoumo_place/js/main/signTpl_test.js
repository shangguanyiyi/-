define(function(){


	var signTpl='<div class="m-course mt10">'+
					'<div class="m-cImg">'+
						'<img src="<%=config.imgBaseURL%><%=course_photo%>" alt="">'+
					'</div>'+
					'<div class="m-uInfo">'+
						'<div class="m-cTitle"><%=course_title%></div>'+
						'<div class="u-address">'+
							'<div><%=course_datetime_str%></div>'+
							'<div class="to i-address">'+
								'<span><%=course_site%></span>'+
							'</div>'+
							'<div><%=course_distance%></div>'+
						'</div>'+
					'</div>'+
					'<div class="m-price"><%=course_price%>元</div>'+
				'</div>'+
				'<h1>预订信息</h1>'+
				'<div class="g-orderInfo ovh">'+
					'<div class="m-orderInfoItem bbc">'+
						'<div class="fr u-rightTime" id="timeToggleBtn">'+
							'<span style="color:#979797">时间选择(可多选)</span>'+
							'<span class="icon">&#xe618;</span>'+
						'</div>'+
						'<div class="m-timeTitle ovh">时间</div>'+
					'</div>'+
					'<ul class="m-centerInfo  bbc dn" id="timeSelectItem">'+
						'<%var i,len;%>'+
						'<%for(i=0,len=course_syllabus_arr.length;i<len;i++){%>'+
							'<%'+
								'var elem=course_syllabus_arr[i];'+
								'var date=elem.course_syllabus_datetime_str;'+
							'%>'+
							'<li limit="<%=course_limitbuycount%>" syllabusId="<%=elem.course_syllabus_id%>" price="<%=course_price%>">'+
								'<div class="m-cLeft">'+
									'<p><%=date%></p>'+
									'<p>'+
										'<span>(剩余<span class="remains"><%=elem.course_syllabus_havcount-elem.course_syllabus_reserve_count%></span>份)</span>'+
									'</p>'+
								'</div>'+
								'<div class="m-cRight">'+
									'<div>'+
										'<span class="subBox">'+
											'<span class="sub"></span>'+
										'</span>'+
										'<input type="text" value="<%=elem.course_syllabus_reserve_count%>"  readonly="readonly" class="courseNum" >'+
										'<span class="addBox">'+
											'<span class="add"></span>'+
										'</span>'+
									'</div>'+
								'</div>'+
							'</li>'+
						'<%}%>'+
					'</ul>'+
					'<div class="m-orderInfoItem">'+
						'<div class="fr ptb10">￥<span id="price"><%=oldAmount%></span></div>'+
						'<div class="ptb10 ovh">价格</div>'+
					'</div>'+
				'</div>'+
				'<h1>预订人</h1>'+
				'<div class="g-mobile mt5">'+
					'<div class="fl m-mobTitle">预订手机号</div>'+
					'<div class="m-mobile">'+
						'<input type="tel" placeholder="请填写手机号" style="font-size:0.6rem" value="<%=user_mobile%>"  id="reservedMobile" oldMobile="<%=user_mobile%>">'+
					'</div>'+
				'</div>'+
				'<div class="g-voucher mt10">'+
					'<div class="m-v1" id="selectVoucher">'+
						'<span>使用优惠券</span>'+
							'<%if(user_mobile==""){%>'+
							'<a class="fr" id="toLogin" href="http://a.app.qq.com/o/simple.jsp?pkgname=sm.xue" style="font-size:0.6rem;color:#979797">下载“发现周末”App可享优惠</a>'+
							'<%}else{%>'+
								'<span class="fr" id="voucherMoney" currentId="<%=voucherid%>"><%=voucherid==0?"":"抵扣"+(voucher_money>=oldAmount?oldAmount:voucher_money)+"元"%></span>'+
							'<%}%>'+
						'<div class="icon to">&#xe620;</div>'+
					'</div>'+
					'<div class="m-v2">'+
						'<span>还需支付</span>'+
						'<span class="fr">'+
							'￥<span id="remainPrice"><%=remainAmount%></span>'+
						'</span>'+
					'</div>'+
				'</div>'+
				'<h1>支付方式</h1>'+
				'<div class="g-pay mt5">'+
					'<div id="aliPay" class="rel">'+
						'<div class="i-zLogo">'+
							'<img src="/images/zhifu.jpg" alt="">'+
						'</div>'+
						'<div class="dib">支付宝支付</div>'+
						'<div class="icon dib cc i-isSelect <%=sourceofpayment==1?"":"dn"%>">&#xe613;</div>'+
					'</div>'+
					'<div id="wxPay" class="rel">'+
						'<div class="i-zLogo">'+
							'<img src="/images/weichat.jpg" alt="">'+
						'</div>'+
						'<div class="dib">微信支付</div>'+
						'<div class="icon dib i-isSelect <%=sourceofpayment==2?"":"dn"%>">&#xe613;</div>'+
					'</div>'+
				'</div>'+
				'<div class="u-payBtn" id="toPay">去支付</div>';

	var voucherTpl='<div class="m-voucherContainer">'+
						'<%var i,len;%>'+
						'<%for(i=0,len=voucher_arr.length;i<len;i++){%>'+
							'<%var e=voucher_arr[i];%>'+
							'<div class="m-voucher mt10" isSelect=<%=e.voucher_isselect%> voucherId="<%=e.voucher_id%>" voucherLimit="<%=e.voucher_condition_price%>" voucherPrice="<%=e.voucher_price%>">'+
							'<div class="i-round"></div>'+
							'<div class="u-vLeft red">'+
								'<div>'+
									'<span ><%=e.voucher_price%></span>'+
									'<span class="i-minMoney">元</span>'+
								'</div>'+
								'<div class="mt10 fwb">'+
									'优惠券'+
								'</div>'+
							'</div>'+
							'<div class="u-vRight green">'+
								'<div class="icon green <%=e.voucher_isselect==0?"dn":""%>">'+
									'&#xe613;'+
								'</div>'+
								'<span class="<%=e.voucher_isselect==0?"":"dn"%>">可选择</span>'+
							'</div>'+
							'<div class="u-vCenter">'+
								'<p class="f20 fwb"><%=e.voucher_name%></p>'+
								'<p class="mt5 f16 c6">有效期至<%=We.date(new Date(e.voucher_endtime),"YYYY-MM-DD")%></p>'+
								'<p class="mt5 f16 c6">满<%=e.voucher_condition_price%>元可用</p>'+
							'</div>'+
						'</div>'+
						'<%}%>'+
					'</div>';


	var msgTpl='<div class="pop-container">'+
					'<div class="pop-title tc">确定手机号</div>'+
			'<div class="pop-content ovh tc">'+
				'确定为<span><%=mob%></span>购买吗？'+
			'</div>'+
			'<div class="pop-btn">'+
				'<div class="pop-sureBtn">确定</div>'+
				'<div class="pop-cancelBtn">取消</div>'+
			'</div>'+
		'</div>';

/*
	var msgTpl='<div class="pop-container">'
			+'<div class="pop-title tc">'
				 +'支付验证码'
			+'</div>'
			+'<div class="pop-content ovh">'
				+'<div class="pop-send fr">发送验证码</div>'
				+'<div class="pop-input ovh">'
					+'<input type="tel" id="payCode">'
				+'</div>'
			+'</div>'
			+'<div class="pop-btn">'
				+'<div class="pop-sureBtn">提交</div>'
			+'</div>'
		+'</div>';
*/



	return {
		signTpl:signTpl,
		msgTpl:msgTpl,
		voucherTpl:voucherTpl
	}
})
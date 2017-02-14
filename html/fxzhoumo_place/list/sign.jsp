<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>支付页面</title>
    <meta charset="UTF-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
	<meta name="apple-touch-fullscreen" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="format-detection" content="telephone=no" />	
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/css/reset.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/css/base.css">
	<link rel="stylesheet" href="<%=basePath %>/css/dialog.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/css/common.css">
	<link rel="stylesheet" href="<%=basePath %>/css/sign.css">
	<link rel="stylesheet" href="<%=basePath %>/css/pop.css">
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<script type="text/javascript" src="<%=basePath %>/js/lib/require.min.js" data-main="<%=basePath %>/js/main/sign"></script>
  </head>
  
  <body>
   <div id="g-screen">
	<div class="g-head">
		<div class="u-back">
			<div class="icon">&#xe605;</div><div>返回</div>
		</div>
		<div class="u-title">
			立即报名
		</div>
	</div>
	<div class="g-main" id="container">
	
	</div>
</div>
<div id="g-screen2">
	<div class="g-head bb1">
		<div id="back">
			<div class="icon">&#xe605;</div><div>返回</div>
		</div>
		<div class="u-title">
			优惠券选择
		</div>
	</div>
	<div class="g-main" id="container2">

			 	<div class="m-voucherContainer">
					<div class="m-voucher mt10">
							<div class="i-round"></div>
							<div class="u-vLeft red">
								<div>
									<span class="f12">10</span>
									<span>元</span>
								</div>
								<div class="mt10  f12 fwb">
									优惠券
								</div>
							</div>
							<div class="u-vRight green">
								<div class="icon green dn">
									&#xe613;
								</div>
								<span>可选择</span>
							</div>
							<div class="u-vCenter">
								<p class="f20 fwb">注册就送10元优惠券</p>
								<p class="mt5 f16 c6">有效期至2015-06-08</p>
								<p class="mt5 f16 c6">满30元可用</p>
							</div>
					</div>
					<div class="m-voucher mt10">
							<div class="i-round"></div>
							<div class="u-vLeft cc">
								<div>
									<span class="f12">10</span>
									<span>元</span>
								</div>
								<div class="mt10  f12 fwb">
									优惠券
								</div>
							</div>
							<div class="u-vRight red">
								<span>已过期</span>
							</div>
							<div class="u-vCenter">
								<p class="f20 fwb cc">注册就送10元优惠券</p>
								<p class="mt5 f16 cc">有效期至2015-06-08</p>
								<p class="mt5 f16 cc">满30元可用</p>
							</div>
					</div>
				</div> 
	</div>

</div>	
	
	<script type="text/template" id="sendCode">
		<div class="pop-container">
			<div class="pop-title tc">
				 支付验证码
			</div>
			<div class="pop-content ovh">
				<div class="pop-send fr">发送验证码</div>
				<div class="pop-input ovh">
					<input type="tel" id="payCode">
				</div>
			</div>
			<div class="pop-btn">
				<div class="pop-sureBtn">提交</div>
			</div>
		</div>
	</script>

	<div id="nativePayContainer" class="dn">
		
		<h1>微信扫码支付</h1>
		
		<p>遇到不允许跨号支付?</p>

		<img id="nativeImg" src="" alt="">

		<p>长按图片[识别二维码]付款</p>

	</div>
  </body>
</html>

 <%
/* *
 功能：支付宝页面跳转同步通知页面
 版本：3.2
 日期：2011-03-17
 说明：
 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。

 //***********页面功能说明***********
 该页面可在本机电脑测试
 可放入HTML等美化页面的代码、商户业务逻辑程序代码
 TRADE_FINISHED(表示交易已经成功结束，并不能再对该交易做后续操作);
 TRADE_SUCCESS(表示交易已经成功结束，可以对该交易做后续操作，如：分润、退款等);
 //********************************
 * */
%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.alipay.util.*"%>
<%@ page import="com.alipay.config.*"%>
<!DOCTYPE html>
<html>
  <head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>支付同步通知页面</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
		<meta name="apple-touch-fullscreen" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<meta name="format-detection" content="telephone=no" />	
		<link rel="stylesheet" type="text/css" href="../css/reset.css">
		<link rel="stylesheet" type="text/css" href="../css/base.css">
		<link rel="stylesheet" href="../css/dialog.css">
		<link rel="stylesheet" type="text/css" href="../css/common.css">
		<link rel="stylesheet" href="../css/sign.css">
		<link rel="stylesheet" href="../css/pop.css">
		<link rel="stylesheet" href="../css/signSuccess.css">
		<script type="text/javascript" src="../js/lib/require.min.js" data-main="../js/main/signSuccess"></script>
  </head>
  <body>
<%
	//获取支付宝GET过来反馈信息
	Map<String,String> params = new HashMap<String,String>();
	Map requestParams = request.getParameterMap();
	for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
		String name = (String) iter.next();
		String[] values = (String[]) requestParams.get(name);
		String valueStr = "";
		for (int i = 0; i < values.length; i++) {
			valueStr = (i == values.length - 1) ? valueStr + values[i]
					: valueStr + values[i] + ",";
		}
		//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
		valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
		params.put(name, valueStr);
	}

	String out_trade_no=null;
	String trade_no=null;
	String result=null;
	if(request.getParameter("out_trade_no")!=null){
		out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");
	}else{
		out_trade_no=(String)request.getParameter("orderid");
	}
	if(request.getParameter("trade_no")!=null){
		trade_no =  new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");
	}
	
	if(request.getParameter("result")!=null){
		result = new String(request.getParameter("result").getBytes("ISO-8859-1"),"UTF-8");
	}
	
	 
//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
	//商户订单号

	//String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");
	//支付宝交易号

	//String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");

	//交易状态
	//String result = new String(request.getParameter("result").getBytes("ISO-8859-1"),"UTF-8");

	//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
	
	//计算得出通知验证结果
	//boolean verify_result = AlipayNotify.verifyReturn(params);
	
	//if(verify_result){//验证成功
		//////////////////////////////////////////////////////////////////////////////////////////
		//请在这里加上商户的业务逻辑程序代码

		//——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
		
			//判断该笔订单是否在商户网站中已经做过处理
				//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
				//如果有做过处理，不执行商户的业务程序

		
		//该页面可做页面美工编辑
		//out.println("验证成功<br />");
		//——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

		//////////////////////////////////////////////////////////////////////////////////////////
	//}else{
		//该页面可做页面美工编辑
		//out.println("验证失败");
	//}
%>



	<div id="g-screen">
	
		<div id="g-payResult">
			
			<div id="loader" ontouchmove="return false" class="loader">
		        <div class="loader-graph"></div>
		        <div id="progress" class="loader-progress">20</div>
		        <div class="loader-text">确认支付中...</div>
    		</div>

			<div class="m-success dn" id="paySuccess">
				
				<div class="m-voucher">
					<h1>恭喜您报名成功</h1>
					<a href="../center/join.html" class="u-goOrderDetail" id="u-goOrderDetail">查看订单详情>></a>
					<div class="u-share">
						<div class="u-logoImg">
							<img src="../images/img_circle_icon.png" alt="">
						</div>
						<div class="u-shareTxt">
							<p>与好友分享您参与的活动即可</p>
							<p>获得发现周末同享</p>
							<p>优惠券</p>
						</div>
						<div class="u-shareMoney">
							<span>最高￥</span><span id="vCount"></span>
						</div>
					</div>
					<h2 id="shareTxt">赶紧向朋友们炫耀吧</h2>
					<a href="../index.html" class="u-goIndex">返回首页</a>
				</div>
				
			</div>

			<div class="m-fail dn" id="payFail">

					<h1>报名不成功</h1>
					<p>请联系客服,客服电话010-57403049</p>
			</div>

			<div class="m-setPwd dn" id="setPwdPop">
				<h1>设置密码</h1>
				<p class="c6 tl mt10">
					为了保障您的账号安全
				</p>
				<p class="c6 tl">
					请为您的账户<span id="i-account"></span>设置密码
				</p>
				<form  id="ff">
					<div>
						<label for="setPwd">密码</label>
						<input type="password" id="setPwd" placeholder="请输入密码">
					</div>
					<div class="mt10">
						<label for="surePwd">确认密码</label>
						<input type="password" id="surePwd" placeholder="确认密码">
					</div>
					<div class="u-submit">
						<input type="submit" value="提交" id="u-submitBtn">
					</div>
					
				</form>
				<div id="i-closePwd" class="c6">暂不设置>></div>
			</div>


		</div>
	<input type="hidden" value="<%=out_trade_no%>" id="nowOrderId">
	</div>
  </body>
</html>
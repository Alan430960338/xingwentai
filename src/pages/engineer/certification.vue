<template>
	<view class="page-wrap">
		<AppHeader title="认证资料" content="工程师认证":back="true" ></AppHeader>
		<!-- 顶部提示栏 -->
		<view class="tip-box">
			<text class="tip-text">建议上传身份证、技能证书和近照，审核通过后优先展示高价工单。</text>
		</view>

		<!-- 基础信息表单 -->
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in baseInfo" :key="index">
				<text class="label">{{ item.label }}</text>
				<text class="value">{{ item.value }}</text>
			</view>

			<!-- 证书上传区域 -->
			<view class="upload-wrap">
				<text class="label">证书资料</text>
				<text class="value">已上传 3 张</text>
				<view class="upload-row">
					<view class="upload-card">
						<text class="upload-card-text">证件照</text>
					</view>
					<view class="upload-card">
						<text class="upload-card-text">技能证书</text>
					</view>
					<view class="upload-add">
						<text class="add-icon">+</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agree-row">
			<checkbox checked color="#007aff" />
			<text class="agree-text">我已阅读《平台交易规则与协议》</text>
		</view>

		<!-- 提交按钮 -->
		<btnBtn style="position: absolute;left: 30rpx;right: 30rpx;" text="提交" type="primary">立即提交</btnBtn>
	</view>
</template>

<script setup>
	
	
	// 清空默认数据
	// 文本可输入，可上传图片，
	
	// 点击提交调用接口worker/master_auth,传递请求体参数:
	// ame	string	是	师傅姓名
	// mobile	string	是	联系电话
	// job_ids	string	是	擅长工种ID，逗号分隔
	// job_name	string	是	擅长工种名称，逗号分隔
	// service_area	string	是	服务区域
	// images	string	是	资质图片

	
	
	
	
	import AppHeader from '@/components/header.vue'
	import btnBtn from '@/components/button/btmBtn.vue'
	// 模拟基础信息数据
	const baseInfo = [{
			label: '姓名',
			value: '李建国'
		},
		{
			label: '手机号',
			value: '137****9048'
		},
		{
			label: '工种',
			value: '空调维修 / 机房巡检'
		},
		{
			label: '服务区域',
			value: '杭州 / 绍兴 / Jiaxing'
		},
	]
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		padding: 0 0rpx 120rpx;
		box-sizing: border-box;
	}

	/* 顶部提示框 */
	.tip-box {
		background-color: #fff8ed;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 0 30rpx 30rpx; 
		border: 1rpx solid #ffd49a;
	}

	.tip-text {
		font-size: 26rpx;
		color: #945c00;
		line-height: 48rpx;
	}

	/* 表单列表 */
	.form-list {
		margin: 0 30rpx;
		width: 100%;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.label {
		font-size: 28rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 30rpx;
		color: #111;
		font-weight: 500;
	}

	/* 证书上传模块 */
	.upload-wrap {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 36rpx 32rpx;
		margin-bottom: 24rpx;
	}

	.upload-row {
		display: flex;
		margin-top: 30rpx;
	}

	.upload-card {
		width: 160rpx;
		height: 160rpx;
		background: #d8e3f2;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.upload-card-text {
		font-size: 36rpx;
		color: #fff;
	}

	.upload-add {
		width: 160rpx;
		height: 160rpx;
		border: 2rpx dashed #94c0ff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-icon {
		font-size: 60rpx;
		color: #007aff;
	}

	/* 协议勾选 */
	.agree-row {
		display: flex;
		align-items: center;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		justify-content: center;
	}

	.agree-text {
		font-size: 28rpx;
		color: #444;
		margin-left: 16rpx;
	}

	.submit-btn {
		background: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		/* 文字垂直居中 */
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
# Hmz
## 一、设计目标

当前业务的 H5 页面类型包含 **产品页** 和 **活动页**。

新品产品页后续可统一至 i18n-m 框架中，其他类型产品页，可复用产品整体框架与代码规范。
活动页按类型又可以分为三类：

* 展示类。表现形式通常为多页切换轮播，无需通过用户行为操作与后台进行接口交互。例如，邀请函、招聘；
* 小游戏类。这一类通常表现为基于 CSS3、Canvas 的小游戏类型，有 2-3 个场景的切换，后台会提供接口支持。例如，五指山、砍价；
* 复杂游戏类。复杂玩法的游戏类，通常需要使用业界成熟的游戏框架来实现。例如，含有物理碰撞效果的小游戏；

H5 活动页框架设计目标需满足：
1. 上述「展示类」场景的全部需求和「小游戏类」除复杂 Canvas 动画外的其他全部需求。「复杂游戏类」需求不使用该框架实现。
2. 后期实现在线 H5 页面编辑后台时，该框架能不做修改进行复用。


## 二、框架组件细分

1. **预加载组件。**
用于预加载页面所需图片资源，能基于该组件渲染 loading 进度条；
2. **场景切换组件与转场动画。**
能进行上下、左右、跳转等场景切换，提供多套转场动画预设至框架样式文件中；
3. **音乐播放组件。**
能支持全局背景音乐的图标渲染、播放/暂停（静音） 等交互效果，也能用于实例化控制逐帧场景中的音效播放；
4. **元素入场动画。**
包含文字上下左右淡入、缩放等效果以及部分如心跳动画等关键帧效果，预设进框架样式文件中；
5. **分享浮层组件。**
用于分享提示浮层的显示、隐藏控制。
6. **微信 JS 配置。**
将配置参数同时复用至 WeixinJSBridge 配置。
7. **插件类。**
视频播放组件与 Canvas 画图组件可作为该框架的插件类来实现。

## 三、框架函数划分示例（仅供参考）

* Hmz.$ ：选择器
* Hmz.classList ：ClassName 相关操作，请参考 W3C ClassList 规范实现
* HmzLoader ：预加载组件（注：不在 Hmz 命名空间下，方便作为独立 loader 复用于其他场景）
* Hmz.page ：场景切换组件
* Hmz.music ：音乐播放组件
* Hmz.share ：分享浮层组件
* Hmz.weixin ：微信 JS 配置

如果有兼容性需要，框架可引入部分 ES5/ES6 Shim。

## 四、布局、定位与结构设计

页面主体部分结构层级设计示意如下：

* body > div#container >
  * div#loading > div#progress
  * div#pages > 
    * div.page.page-1
    * div.page.page-2
    * div.page.page-n > div.stage >
      * div.element-1
      * div.element-2
      * div.element-n
  * audio#music
  * div#share

其中，元素定位默认使用绝对定位实现居中：

```css
div.element-n {
  display: block;
  position: absolute;
  left: 50%;
  transform: translate(-50%,0);
}
```

布局自适应方案，可以参考场景 zoom 方案，即通过将 deviceWidth / pageWidth 比值设置到 .stage zoom 值当中。

## 五、参考资料
* http://wqs.jd.com/promote/CH46/2015/overseas/index.html
* https://github.com/AlloyTeam/AlloyGameEngine
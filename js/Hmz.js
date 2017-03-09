
var Hmz = function(warp ,opt){
  this.warp = warp;
  this.options = this.extend({
    type: 'swipe', // swipe: 滑屏切换，默认， cover: 卡牌切换
    derection: 'Y', // Y为垂直方向滑动， X为水平方向滑动
    currentIndex: 0,
    currentElem: null,
    transitionDurationTime: '.8s'
  }, opt);
  
  this.init();
}
Hmz.prototype = {
  $: function (el, all) {
    return typeof el == 'string' ? 
      ( all ? document.querySelectorAll(el) : document.querySelector(el) ) : el;
  },
  hasClass: function (el, className){
    return el.classList.contains(className);
  },
  addClass: function (el, className){
    return el.classList.add(className);
  },
  removeClass: function (el, className){
    return el.classList.remove(className);
  },
  toggleClass: function (el, className){
    el.classList.toggle(className);
  },
  extend: function(destination, source) {
    for (var property in source) {
      destination[property] = source[property]
    }
    return destination;
  },
  elemHeight: function(elem){
    return elem ? this.$(elem).offsetHeight : this.$('#pages').offsetHeight;
  },
  elemWidth: function(elem){
    return elem ? this.$(elem).offsetWidth : this.$('#pages').offsetWidth;
  },
  init: function(elem){
    var _self = this, 
    opt = _self.options,
    pageObj = _self.$(_self.warp + '>.page', 1), 
    pageNum = pageObj.length;
    opt.currentElem = pageObj[opt.currentIndex];
    for(i=0; i<pageNum; i++){
        _self.addClass(pageObj[i], opt.type + '-' + opt.derection.toLowerCase());
        if(opt.type === 'cover'){
          pageObj[i].style.zIndex = pageNum - i;
        }
    }
    // setTimeout(function(){
        _self.addClass(pageObj[0], 'current');
    // },20)
    
    _self.page();
  },
  page: (function(){
    var _self = this, 
      opt = _self.options,
      currentElem, 
      nextElem, 
      prevElem,
      slideDistance = 0,
    _slideAngle = function(dX,dY){
      return Math.atan2(dX, dY) * 180 / Math.PI;
    },
    _slideDerection = function(startX, startY, endX, endY){
      var dx = endX - startX;
      var dy = startY - endY;
      var slideDerect = 0;
      var angle = _slideAngle(dx, dy);
   
      //如果滑动距离太短
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          return slideDerect;
      }
      if (angle >= -45 && angle < 45) {
          slideDerect = 1; //up
      }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          slideDerect = 2; // down
      } else if (angle >= 45 && angle < 135) {
          slideDerect = 3; //right
      } else if (angle >= -135 && angle < -45) {
          slideDerect = 4; //left
      } 
      return slideDerect;
    },
    _slide = function(){
      var startX, startY, moveX, moveY, endX, endY;
      var wrap = _self.$(_self.warp);
      wrap.addEventListener('touchstart', function (e) {
        // e.stopPropagation();
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY; 
        currentElem = opt.currentElem;
        nextElem = currentElem.nextElementSibling;
        prevElem = currentElem.previousElementSibling;
      }, false);
      // wrap.addEventListener('touchmove', function (e) {
      //     moveX = e.changedTouches[0].pageX;
      //     moveY = e.changedTouches[0].pageY;
      //     // if(!window.canSlide || moveX-startX > 0) return;
      //     slideDistance = (moveY-startY)+'px' //*100/$(_self.elem).width() - (date23?9:2) ;
          
      //     // _self.currentElem.removeClass('card');
      //     currentElem.style.webkitTransform = 'translate3d(0,' + slideDistance + ',0)';
      //     currentElem.style.transform = 'translate3d(0,' + slideDistance + ',0)'
      //     currentElem.style.webkitTransitionDuration = '0ms';
      //     currentElem.style.transitionDuration = '0ms'
      // }, false);
      wrap.addEventListener('touchend', function (e) {
        // e.stopPropagation();
        endX = e.changedTouches[0].pageX;
        endY = e.changedTouches[0].pageY;
        var d = _slideDerection(startX, startY, endX, endY);
        if(opt.type === 'swipe'){
          switch(d){
            case 2: opt.derection == 'Y' && _prev(); break;
            case 3: opt.derection == 'X' && _prev(); break;
            case 1: opt.derection == 'Y' && _next(); break;
            case 4: opt.derection == 'X' && _next(); break;
            default:break;
          }
        }
        if(opt.type === 'cover'){
          switch(d){
            case 1: ;
            case 2: opt.derection == 'Y' && _next(); break;
            case 3: ;
            case 4: opt.derection == 'X' && _next(); break;
            default:break;
          }
        }
      },false);
    },
    _prev = function(){
      if(prevElem){
          setTimeout(function(){
              _self.removeClass(currentElem, 'current');
              _self.removeClass(prevElem, opt.type + '-prev-'+_self.options.derection.toLowerCase());
              // _self.removeClass(prevElem, 'page-y');
              _self.addClass(currentElem, opt.type + '-next-'+_self.options.derection.toLowerCase());
              _self.addClass(prevElem, 'current');
              opt.currentElem = prevElem;
          }, 10)
          
      }
    },
    _next = function(){
        if(nextElem){
            setTimeout(function(){
                _self.removeClass(currentElem, 'current');
                _self.addClass(currentElem, opt.type + '-prev-'+_self.options.derection.toLowerCase());
                _self.removeClass(nextElem, opt.type + '-next-'+_self.options.derection.toLowerCase());
                // _self.removeClass(nextElem, 'page-y');
                _self.addClass(nextElem, 'current');
                opt.currentElem = nextElem;
            },10)
        }
    };
    _slide();

  }),
  music: function(oThis){
    var _self = oThis, 
    instance,
    musicDiv,
    musicPic,
    musicOpt = {
      musicCtrl: false,       //是否可控
      musicIcon: null,        //音乐图标容器 开关
      musicCtrlClass: null,   //图标动画开关
      musicPlayPic: null,     //播放态图标地址
      musicPausePic: null,    //暂停态图标地址
      autoPlay: false,        //自动播放
      callback: null
    },
    _audioPlayer = function(opt){
      instance = new Audio();
      instance.src = opt.url;
      instance.loop = opt.loop;
      musicOpt = opt;
      //创建音乐图标
      if(musicOpt.musicIcon){
        _creatMusicIcon();
      }
      //控制暂停/播放
      if(musicOpt.musicCtrl){
        _audioToggle();
      }
      //初始化完成即开始播放
      if(musicOpt.autoPlay){
        _audioPlay();
      }
      if(musicOpt.callback && (typeof musicOpt.callback === 'function')){
        musicOpt.callback();
      }
    },
    _creatMusicIcon = function(){
        musicDiv = document.createElement('div'),
        musicPic = document.createElement('img'),
        musicDiv.className = musicOpt.musicIcon;
        musicPic.src = musicOpt.musicPausePic;
        _self.$('body').appendChild(musicDiv);
        _self.$(musicDiv).appendChild(musicPic);
        if(musicOpt.autoPlay){
          musicPic.src = musicOpt.musicPlayPic;
          musicOpt.musicCtrlClass && _self.addClass(musicDiv, musicOpt.musicCtrlClass);
        }
    },
    _audioPlay = function(){
      instance.play();
      if(musicOpt.musicIcon){
        musicPic.src = musicOpt.musicPlayPic;
        musicOpt.musicCtrlClass && _self.addClass(musicDiv, musicOpt.musicCtrlClass);
      }
    },
    _audioSetLoop = function(loop){
      instance.loop = loop;
    },
    _audioSetSrc = function(url){
      instance.src = url;
    },
    _audioPause = function() {
      instance.pause();
      if(musicOpt.musicIcon){
        musicPic.src = musicOpt.musicPausePic;
        musicOpt.musicCtrlClass && _self.removeClass(musicDiv, musicOpt.musicCtrlClass);
      }
    },
    _audioDestroy = function(){
      instance.src = '';
      instance.load();
      instance = null;
    },
    _audioToggle = function(){
      musicDiv && musicDiv.addEventListener('touchstart', function(){
        if(instance.paused) {
          _audioPlay();
        } else {
          _audioPause();
        }
      }, false)
    }
    return {
      mediaInit: function(opt){
        _audioPlayer(opt);
      },
      play: function(){
        _audioPlay();
      },
      setLoop: function(loop){
        _audioSetLoop(loop);
      },
      setSrc: function(src){
        _audioSetSrc(src);
      },
      pause: function(){
        _audioPause();
      },
      destroy: function(){
        _audioDestroy();
      },
      toggle: function(){
        _audioToggle();
      }
    }
  },
  
  wxshare: function(obj){
      var shareObj = obj || {};
      function loadConfig() {
          var b, a;
          a = document.createElement("script");
          a.setAttribute("src", "http://ml.weixin.meizu.com/wechat_api/get_js_ticket?callback=setConfigData&url=" + encodeURIComponent(location.href.split("#")[0]));
          document.getElementsByTagName("head")[0].appendChild(a);
          a.onerror = function() {
              alert("加载微信配置失败")
          }
      }
      loadConfig();
      window.setConfigData = function(a) {
          wx.config({
              debug: false,
              appId: "wx1863f4586dc72d16",
              nonceStr: a.data.nonceStr,
              timestamp: a.data.timestamp,
              signature: a.data.signature,
              jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"]
          });
          wx.ready(function() {
              var b = {
                  "imgUrl": shareObj.mz_imgUrl,
                  "link": shareObj.mz_link,
                  "timeline": shareObj.mz_timeline,
                  "title": shareObj.mz_title,
                  "desc": shareObj.mz_desc
              };
              wx.checkJsApi({
                  jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"],
                  success: function(c) {}
              });
              wx.onMenuShareAppMessage(b);
              wx.onMenuShareTimeline({
                  "imgUrl": shareObj.mz_imgUrl,
                  "link": shareObj.mz_link,
                  "timeline": shareObj.mz_timeline,
                  "title": shareObj.mz_timeline,
                  "desc": shareObj.mz_timeline,
                  "success": function() {
                      close_dialog()
                  }
              });
              wx.onMenuShareQQ(b);
              wx.onMenuShareWeibo(b)
          });
          document.addEventListener("WeixinJSBridgeReady", function() {
              document.getElementsByTagName("audio")[0].play()
          },
          false);
          wx.error(function(b) {
              alert(b.errMsg)
          })
      };
  }
}

var preLoad = (function(){
    var 
    source,
    count,
    total,
    onload,
    prefix,
    _preLoad = function(a,b){
      var c = b || {};
      source = a;
      count = 0;
      total = a.length;
      onload = c.onload;
      prefix = c.prefix || "";
      _init();
    },
    _init = function() {
      source.forEach(function(b) {
        var c = b.replace(/[#\?].*$/, '').substr(b.lastIndexOf(".") + 1).toLowerCase(),
          d = prefix + b;
        switch (c) {
          case "js":
              _script.call(source, d);
              break;
          case "css":
              _stylesheet.call(source, d);
              break;
              
          case "svg":
          case "jpg":
          case "gif":
          case "png":
          case "jpeg":
              _image(d);
              break;
          case 'mp3': 
              _audio(d); break;
        }
      })
    }
    _getProgress = function() {
      return Math.round(count / total * 100);
    },
    _image = function(a) {
      var b = document.createElement("img");
      _load(b, a);
      b.src = a;
    },
    _stylesheet = function(a) {
      var b = document.createElement("link");
          _load(b, a);
      b.rel = "stylesheet",
      b.type = "text/css",
      b.href = a,
      document.head.appendChild(b)
    },
    _script = function(a) {
      var b = document.createElement("script");
      _load(b, a),
      b.type = "text/javascript",
      b.src = a,
      document.head.appendChild(b)
    },
    _audio = function(a){
      var b = new Audio();
      _load(b, a);
      b.src = a;
    },
    _load = function(a, b) {
      a.onload = a.onerror = a.onabort = function(a) {
        onload && onload({
          count: ++count,
          total: total,
          item: b,
          type: a.type
        })
      }
    }

    return { 
      load: function(a,b){
        _preLoad(a,b);
      },
      getProgress: _getProgress
    }
})
document.addEventListener('touchmove', function (e) { 
  e.preventDefault(); 
}, false);



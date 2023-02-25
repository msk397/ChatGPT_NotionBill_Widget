// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;
// 
// 开发框架「小件件」
// 作者：马赛克
// 日期：2023-02-24
// 版本：1.0.1
// 说明：Notion记账显示，显示今日消费及本月消费
// 

// 组件基础类
const RUNTIME_VERSION = 20201209

class Base {
  constructor (arg="") {
    this.arg = arg
    this._actions = {}
    this.init()
  }

  init (widgetFamily = config.widgetFamily) {
    // 组件大小：small,medium,large
    this.widgetFamily = widgetFamily
    // 系统设置的key，这里分为三个类型：
    // 1. 全局
    // 2. 不同尺寸的小组件
    // 3. 不同尺寸+小组件自定义的参数
    // 当没有key2时，获取key1，没有key1获取全局key的设置
    // this.SETTING_KEY = this.md5(Script.name()+'@'+this.widgetFamily+"@"+this.arg)
    // this.SETTING_KEY1 = this.md5(Script.name()+'@'+this.widgetFamily)
    this.SETTING_KEY = this.md5(Script.name())
    // 文件管理器
    // 提示：缓存数据不要用这个操作，这个是操作源码目录的，缓存建议存放在local temp目录中
    this.FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    // 本地，用于存储图片等
    this.FILE_MGR_LOCAL = FileManager.local()
    this.BACKGROUND_KEY = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY}.jpg`)
    // this.BACKGROUND_KEY1 = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY1}.jpg`)
    // this.BACKGROUND_KEY2 = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY2}.jpg`)
    // // 插件设置
    this.settings = this.getSettings()
  }

  /**
   * 注册点击操作菜单
   * @param {string} name 操作函数名
   * @param {func} func 点击后执行的函数
   */
  registerAction (name, func) {
    this._actions[name] = func.bind(this)
  }

  /**
   * 生成操作回调URL，点击后执行本脚本，并触发相应操作
   * @param {string} name 操作的名称
   * @param {string} data 传递的数据
   */
  actionUrl (name = '', data = '') {
    let u = URLScheme.forRunningScript()
    let q = `act=${encodeURIComponent(name)}&data=${encodeURIComponent(data)}&__arg=${encodeURIComponent(this.arg)}&__size=${this.widgetFamily}`
    let result = ''
    if (u.includes('run?')) {
      result = `${u}&${q}`
    } else {
      result = `${u}?${q}`
    }
    return result
  }

  /**
   * base64 编码字符串
   * @param {string} str 要编码的字符串
   */
  base64Encode (str) {
    const data = Data.fromString(str)
    return data.toBase64String()
  }

  /**
   * base64解码数据 返回字符串
   * @param {string} b64 base64编码的数据
   */
  base64Decode (b64) {
    const data = Data.fromBase64String(b64)
    return data.toRawString()
  }

  /**
   * md5 加密字符串
   * @param {string} str 要加密成md5的数据
   */
  md5 (str) {
    function d(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function f(n,t,r,e,o,u){return d((c=d(d(t,n),d(e,u)))<<(f=o)|c>>>32-f,r);var c,f}function l(n,t,r,e,o,u,c){return f(t&r|~t&e,n,t,o,u,c)}function v(n,t,r,e,o,u,c){return f(t&e|r&~e,n,t,o,u,c)}function g(n,t,r,e,o,u,c){return f(t^r^e,n,t,o,u,c)}function m(n,t,r,e,o,u,c){return f(r^(t|~e),n,t,o,u,c)}function i(n,t){var r,e,o,u;n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;for(var c=1732584193,f=-271733879,i=-1732584194,a=271733878,h=0;h<n.length;h+=16)c=l(r=c,e=f,o=i,u=a,n[h],7,-680876936),a=l(a,c,f,i,n[h+1],12,-389564586),i=l(i,a,c,f,n[h+2],17,606105819),f=l(f,i,a,c,n[h+3],22,-1044525330),c=l(c,f,i,a,n[h+4],7,-176418897),a=l(a,c,f,i,n[h+5],12,1200080426),i=l(i,a,c,f,n[h+6],17,-1473231341),f=l(f,i,a,c,n[h+7],22,-45705983),c=l(c,f,i,a,n[h+8],7,1770035416),a=l(a,c,f,i,n[h+9],12,-1958414417),i=l(i,a,c,f,n[h+10],17,-42063),f=l(f,i,a,c,n[h+11],22,-1990404162),c=l(c,f,i,a,n[h+12],7,1804603682),a=l(a,c,f,i,n[h+13],12,-40341101),i=l(i,a,c,f,n[h+14],17,-1502002290),c=v(c,f=l(f,i,a,c,n[h+15],22,1236535329),i,a,n[h+1],5,-165796510),a=v(a,c,f,i,n[h+6],9,-1069501632),i=v(i,a,c,f,n[h+11],14,643717713),f=v(f,i,a,c,n[h],20,-373897302),c=v(c,f,i,a,n[h+5],5,-701558691),a=v(a,c,f,i,n[h+10],9,38016083),i=v(i,a,c,f,n[h+15],14,-660478335),f=v(f,i,a,c,n[h+4],20,-405537848),c=v(c,f,i,a,n[h+9],5,568446438),a=v(a,c,f,i,n[h+14],9,-1019803690),i=v(i,a,c,f,n[h+3],14,-187363961),f=v(f,i,a,c,n[h+8],20,1163531501),c=v(c,f,i,a,n[h+13],5,-1444681467),a=v(a,c,f,i,n[h+2],9,-51403784),i=v(i,a,c,f,n[h+7],14,1735328473),c=g(c,f=v(f,i,a,c,n[h+12],20,-1926607734),i,a,n[h+5],4,-378558),a=g(a,c,f,i,n[h+8],11,-2022574463),i=g(i,a,c,f,n[h+11],16,1839030562),f=g(f,i,a,c,n[h+14],23,-35309556),c=g(c,f,i,a,n[h+1],4,-1530992060),a=g(a,c,f,i,n[h+4],11,1272893353),i=g(i,a,c,f,n[h+7],16,-155497632),f=g(f,i,a,c,n[h+10],23,-1094730640),c=g(c,f,i,a,n[h+13],4,681279174),a=g(a,c,f,i,n[h],11,-358537222),i=g(i,a,c,f,n[h+3],16,-722521979),f=g(f,i,a,c,n[h+6],23,76029189),c=g(c,f,i,a,n[h+9],4,-640364487),a=g(a,c,f,i,n[h+12],11,-421815835),i=g(i,a,c,f,n[h+15],16,530742520),c=m(c,f=g(f,i,a,c,n[h+2],23,-995338651),i,a,n[h],6,-198630844),a=m(a,c,f,i,n[h+7],10,1126891415),i=m(i,a,c,f,n[h+14],15,-1416354905),f=m(f,i,a,c,n[h+5],21,-57434055),c=m(c,f,i,a,n[h+12],6,1700485571),a=m(a,c,f,i,n[h+3],10,-1894986606),i=m(i,a,c,f,n[h+10],15,-1051523),f=m(f,i,a,c,n[h+1],21,-2054922799),c=m(c,f,i,a,n[h+8],6,1873313359),a=m(a,c,f,i,n[h+15],10,-30611744),i=m(i,a,c,f,n[h+6],15,-1560198380),f=m(f,i,a,c,n[h+13],21,1309151649),c=m(c,f,i,a,n[h+4],6,-145523070),a=m(a,c,f,i,n[h+11],10,-1120210379),i=m(i,a,c,f,n[h+2],15,718787259),f=m(f,i,a,c,n[h+9],21,-343485551),c=d(c,r),f=d(f,e),i=d(i,o),a=d(a,u);return[c,f,i,a]}function a(n){for(var t="",r=32*n.length,e=0;e<r;e+=8)t+=String.fromCharCode(n[e>>5]>>>e%32&255);return t}function h(n){var t=[];for(t[(n.length>>2)-1]=void 0,e=0;e<t.length;e+=1)t[e]=0;for(var r=8*n.length,e=0;e<r;e+=8)t[e>>5]|=(255&n.charCodeAt(e/8))<<e%32;return t}function e(n){for(var t,r="0123456789abcdef",e="",o=0;o<n.length;o+=1)t=n.charCodeAt(o),e+=r.charAt(t>>>4&15)+r.charAt(15&t);return e}function r(n){return unescape(encodeURIComponent(n))}function o(n){return a(i(h(t=r(n)),8*t.length));var t}function u(n,t){return function(n,t){var r,e,o=h(n),u=[],c=[];for(u[15]=c[15]=void 0,16<o.length&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}(r(n),r(t))}function t(n,t,r){return t?r?u(t,n):e(u(t,n)):r?o(n):e(o(n))}
    return t(str)
  }


  /**
   * HTTP 请求接口
   * @param {string} url 请求的url
   * @param {bool} json 返回数据是否为 json，默认 true
   * @param {bool} useCache 是否采用离线缓存（请求失败后获取上一次结果），
   * @return {string | json | null}
   */
  async httpGet (url, json = true, useCache = false) {
    let data = null
    const cacheKey = this.md5(url)
    if (useCache && Keychain.contains(cacheKey)) {
      let cache = Keychain.get(cacheKey)
      return json ? JSON.parse(cache) : cache
    }
    try {
      let req = new Request(url)
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data && Keychain.contains(cacheKey)) {
      // 判断是否有缓存
      let cache = Keychain.get(cacheKey)
      return json ? JSON.parse(cache) : cache
    }
    // 存储缓存
    Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
    return data
  }

  async httpPost (url, data) {}

  /**
   * 获取远程图片内容
   * @param {string} url 图片地址
   * @param {bool} useCache 是否使用缓存（请求失败时获取本地缓存）
   */
  async getImageByUrl (url, useCache = true) {
    const cacheKey = this.md5(url)
    const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey)
    // 判断是否有缓存
    if (useCache && FileManager.local().fileExists(cacheFile)) {
      return Image.fromFile(cacheFile)
    }
    try {
      const req = new Request(url)
      const img = await req.loadImage()
      // 存储到缓存
      FileManager.local().writeImage(cacheFile, img)
      return img
    } catch (e) {
      // 没有缓存+失败情况下，返回自定义的绘制图片（红色背景）
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.red())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      return await ctx.getImage()
    }
  }

  /**
   * 渲染标题内容
   * @param {object} widget 组件对象
   * @param {string} icon 图标地址
   * @param {string} title 标题内容
   * @param {bool|color} color 字体的颜色（自定义背景时使用，默认系统）
   */
  async renderHeader (widget, icon, title, color = false) {

    widget.addSpacer(10)
    let header = widget.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImageByUrl(icon))
    _icon.imageSize = new Size(14, 14)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(title)
    header.addSpacer()
    if (color) _title.textColor = color
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(12)
    widget.addSpacer(10)
    return widget
  }

  /**
   * 获取截图中的组件剪裁图
   * 可用作透明背景
   * 返回图片image对象
   * 代码改自：https://gist.github.com/mzeryck/3a97ccd1e059b3afa3c6666d27a496c9
   * @param {string} title 开始处理前提示用户截图的信息，可选（适合用在组件自定义透明背景时提示）
   */
  async getWidgetScreenShot (title = null) {
    // Generate an alert with the provided array of options.
    async function generateAlert(message,options) {
      
      let alert = new Alert()
      alert.message = message
      
      for (const option of options) {
        alert.addAction(option)
      }
      
      let response = await alert.presentAlert()
      return response
    }

    // Crop an image into the specified rect.
    function cropImage(img,rect) {
      
      let draw = new DrawContext()
      draw.size = new Size(rect.width, rect.height)
      
      draw.drawImageAtPoint(img,new Point(-rect.x, -rect.y))  
      return draw.getImage()
    }

    async function blurImage(img,style) {
      const blur = 150
      const js = `
var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];var shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function stackBlurCanvasRGB(id,top_x,top_y,width,height,radius){if(isNaN(radius)||radius<1)return;radius|=0;var canvas=document.getElementById(id);var context=canvas.getContext("2d");var imageData;try{try{imageData=context.getImageData(top_x,top_y,width,height)}catch(e){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");imageData=context.getImageData(top_x,top_y,width,height)}catch(e){alert("Cannot access local image");throw new Error("unable to access local image data: "+e);return}}}catch(e){alert("Cannot access image");throw new Error("unable to access image data: "+e);}var pixels=imageData.data;var x,y,i,p,yp,yi,yw,r_sum,g_sum,b_sum,r_out_sum,g_out_sum,b_out_sum,r_in_sum,g_in_sum,b_in_sum,pr,pg,pb,rbs;var div=radius+radius+1;var w4=width<<2;var widthMinus1=width-1;var heightMinus1=height-1;var radiusPlus1=radius+1;var sumFactor=radiusPlus1*(radiusPlus1+1)/2;var stackStart=new BlurStack();var stack=stackStart;for(i=1;i<div;i++){stack=stack.next=new BlurStack();if(i==radiusPlus1)var stackEnd=stack}stack.next=stackStart;var stackIn=null;var stackOut=null;yw=yi=0;var mul_sum=mul_table[radius];var shg_sum=shg_table[radius];for(y=0;y<height;y++){r_in_sum=g_in_sum=b_in_sum=r_sum=g_sum=b_sum=0;r_out_sum=radiusPlus1*(pr=pixels[yi]);g_out_sum=radiusPlus1*(pg=pixels[yi+1]);b_out_sum=radiusPlus1*(pb=pixels[yi+2]);r_sum+=sumFactor*pr;g_sum+=sumFactor*pg;b_sum+=sumFactor*pb;stack=stackStart;for(i=0;i<radiusPlus1;i++){stack.r=pr;stack.g=pg;stack.b=pb;stack=stack.next}for(i=1;i<radiusPlus1;i++){p=yi+((widthMinus1<i?widthMinus1:i)<<2);r_sum+=(stack.r=(pr=pixels[p]))*(rbs=radiusPlus1-i);g_sum+=(stack.g=(pg=pixels[p+1]))*rbs;b_sum+=(stack.b=(pb=pixels[p+2]))*rbs;r_in_sum+=pr;g_in_sum+=pg;b_in_sum+=pb;stack=stack.next}stackIn=stackStart;stackOut=stackEnd;for(x=0;x<width;x++){pixels[yi]=(r_sum*mul_sum)>>shg_sum;pixels[yi+1]=(g_sum*mul_sum)>>shg_sum;pixels[yi+2]=(b_sum*mul_sum)>>shg_sum;r_sum-=r_out_sum;g_sum-=g_out_sum;b_sum-=b_out_sum;r_out_sum-=stackIn.r;g_out_sum-=stackIn.g;b_out_sum-=stackIn.b;p=(yw+((p=x+radius+1)<widthMinus1?p:widthMinus1))<<2;r_in_sum+=(stackIn.r=pixels[p]);g_in_sum+=(stackIn.g=pixels[p+1]);b_in_sum+=(stackIn.b=pixels[p+2]);r_sum+=r_in_sum;g_sum+=g_in_sum;b_sum+=b_in_sum;stackIn=stackIn.next;r_out_sum+=(pr=stackOut.r);g_out_sum+=(pg=stackOut.g);b_out_sum+=(pb=stackOut.b);r_in_sum-=pr;g_in_sum-=pg;b_in_sum-=pb;stackOut=stackOut.next;yi+=4}yw+=width}for(x=0;x<width;x++){g_in_sum=b_in_sum=r_in_sum=g_sum=b_sum=r_sum=0;yi=x<<2;r_out_sum=radiusPlus1*(pr=pixels[yi]);g_out_sum=radiusPlus1*(pg=pixels[yi+1]);b_out_sum=radiusPlus1*(pb=pixels[yi+2]);r_sum+=sumFactor*pr;g_sum+=sumFactor*pg;b_sum+=sumFactor*pb;stack=stackStart;for(i=0;i<radiusPlus1;i++){stack.r=pr;stack.g=pg;stack.b=pb;stack=stack.next}yp=width;for(i=1;i<=radius;i++){yi=(yp+x)<<2;r_sum+=(stack.r=(pr=pixels[yi]))*(rbs=radiusPlus1-i);g_sum+=(stack.g=(pg=pixels[yi+1]))*rbs;b_sum+=(stack.b=(pb=pixels[yi+2]))*rbs;r_in_sum+=pr;g_in_sum+=pg;b_in_sum+=pb;stack=stack.next;if(i<heightMinus1){yp+=width}}yi=x;stackIn=stackStart;stackOut=stackEnd;for(y=0;y<height;y++){p=yi<<2;pixels[p]=(r_sum*mul_sum)>>shg_sum;pixels[p+1]=(g_sum*mul_sum)>>shg_sum;pixels[p+2]=(b_sum*mul_sum)>>shg_sum;r_sum-=r_out_sum;g_sum-=g_out_sum;b_sum-=b_out_sum;r_out_sum-=stackIn.r;g_out_sum-=stackIn.g;b_out_sum-=stackIn.b;p=(x+(((p=y+radiusPlus1)<heightMinus1?p:heightMinus1)*width))<<2;r_sum+=(r_in_sum+=(stackIn.r=pixels[p]));g_sum+=(g_in_sum+=(stackIn.g=pixels[p+1]));b_sum+=(b_in_sum+=(stackIn.b=pixels[p+2]));stackIn=stackIn.next;r_out_sum+=(pr=stackOut.r);g_out_sum+=(pg=stackOut.g);b_out_sum+=(pb=stackOut.b);r_in_sum-=pr;g_in_sum-=pg;b_in_sum-=pb;stackOut=stackOut.next;yi+=width}}context.putImageData(imageData,top_x,top_y)}function BlurStack(){this.r=0;this.g=0;this.b=0;this.a=0;this.next=null}
      // https://gist.github.com/mjackson/5311256
    
      function rgbToHsl(r, g, b){
          r /= 255, g /= 255, b /= 255;
          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          var h, s, l = (max + min) / 2;
    
          if(max == min){
              h = s = 0; // achromatic
          }else{
              var d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch(max){
                  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                  case g: h = (b - r) / d + 2; break;
                  case b: h = (r - g) / d + 4; break;
              }
              h /= 6;
          }
    
          return [h, s, l];
      }
    
      function hslToRgb(h, s, l){
          var r, g, b;
    
          if(s == 0){
              r = g = b = l; // achromatic
          }else{
              var hue2rgb = function hue2rgb(p, q, t){
                  if(t < 0) t += 1;
                  if(t > 1) t -= 1;
                  if(t < 1/6) return p + (q - p) * 6 * t;
                  if(t < 1/2) return q;
                  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                  return p;
              }
    
              var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
              var p = 2 * l - q;
              r = hue2rgb(p, q, h + 1/3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1/3);
          }
    
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
      
      function lightBlur(hsl) {
      
        // Adjust the luminance.
        let lumCalc = 0.35 + (0.3 / hsl[2]);
        if (lumCalc < 1) { lumCalc = 1; }
        else if (lumCalc > 3.3) { lumCalc = 3.3; }
        const l = hsl[2] * lumCalc;
        
        // Adjust the saturation. 
        const colorful = 2 * hsl[1] * l;
        const s = hsl[1] * colorful * 1.5;
        
        return [hsl[0],s,l];
        
      }
      
      function darkBlur(hsl) {
    
        // Adjust the saturation. 
        const colorful = 2 * hsl[1] * hsl[2];
        const s = hsl[1] * (1 - hsl[2]) * 3;
        
        return [hsl[0],s,hsl[2]];
        
      }
    
      // Set up the canvas.
      const img = document.getElementById("blurImg");
      const canvas = document.getElementById("mainCanvas");
    
      const w = img.naturalWidth;
      const h = img.naturalHeight;
    
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w;
      canvas.height = h;
    
      const context = canvas.getContext("2d");
      context.clearRect( 0, 0, w, h );
      context.drawImage( img, 0, 0 );
      
      // Get the image data from the context.
      var imageData = context.getImageData(0,0,w,h);
      var pix = imageData.data;
      
      var isDark = "${style}" == "dark";
      var imageFunc = isDark ? darkBlur : lightBlur;
    
      for (let i=0; i < pix.length; i+=4) {
    
        // Convert to HSL.
        let hsl = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
        
        // Apply the image function.
        hsl = imageFunc(hsl);
      
        // Convert back to RGB.
        const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      
        // Put the values back into the data.
        pix[i] = rgb[0];
        pix[i+1] = rgb[1];
        pix[i+2] = rgb[2];
    
      }
    
      // Draw over the old image.
      context.putImageData(imageData,0,0);
    
      // Blur the image.
      stackBlurCanvasRGB("mainCanvas", 0, 0, w, h, ${blur});
      
      // Perform the additional processing for dark images.
      if (isDark) {
      
        // Draw the hard light box over it.
        context.globalCompositeOperation = "hard-light";
        context.fillStyle = "rgba(55,55,55,0.2)";
        context.fillRect(0, 0, w, h);
    
        // Draw the soft light box over it.
        context.globalCompositeOperation = "soft-light";
        context.fillStyle = "rgba(55,55,55,1)";
        context.fillRect(0, 0, w, h);
    
        // Draw the regular box over it.
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(55,55,55,0.4)";
        context.fillRect(0, 0, w, h);
      
      // Otherwise process light images.
      } else {
        context.fillStyle = "rgba(255,255,255,0.4)";
        context.fillRect(0, 0, w, h);
      }
    
      // Return a base64 representation.
      canvas.toDataURL(); 
      `
      
      // Convert the images and create the HTML.
      let blurImgData = Data.fromPNG(img).toBase64String()
      let html = `
      <img id="blurImg" src="data:image/png;base64,${blurImgData}" />
      <canvas id="mainCanvas" />
      `
      
      // Make the web view and get its return value.
      let view = new WebView()
      await view.loadHTML(html)
      let returnValue = await view.evaluateJavaScript(js)
      
      // Remove the data type from the string and convert to data.
      let imageDataString = returnValue.slice(22)
      let imageData = Data.fromBase64String(imageDataString)
      
      // Convert to image and crop before returning.
      let imageFromData = Image.fromData(imageData)
      // return cropImage(imageFromData)
      return imageFromData
    }


    // Pixel sizes and positions for widgets on all supported phones.
    function phoneSizes() {
      let phones = {
        // 12 and 12 Pro
        "2532": {
          small:  474,
          medium: 1014,
          large:  1062,
          left:  78,
          right: 618,
          top:    231,
          middle: 819,
          bottom: 1407
        },
      
        // 11 Pro Max, XS Max
        "2688": {
          small:  507,
          medium: 1080,
          large:  1137,
          left:  81,
          right: 654,
          top:    228,
          middle: 858,
          bottom: 1488
        },
      
        // 11, XR
        "1792": {
          small:  338,
          medium: 720,
          large:  758,
          left:  54,
          right: 436,
          top:    160,
          middle: 580,
          bottom: 1000
        },
        
        
        // 11 Pro, XS, X
        "2436": {
          small:  465,
          medium: 987,
          large:  1035,
          left:  69,
          right: 591,
          top:    213,
          middle: 783,
          bottom: 1353
        },
      
        // Plus phones
        "2208": {
          small:  471,
          medium: 1044,
          large:  1071,
          left:  99,
          right: 672,
          top:    114,
          middle: 696,
          bottom: 1278
        },
        
        // SE2 and 6/6S/7/8
        "1334": {
          small:  296,
          medium: 642,
          large:  648,
          left:  54,
          right: 400,
          top:    60,
          middle: 412,
          bottom: 764
        },
        
        
        // SE1
        "1136": {
          small:  282,
          medium: 584,
          large:  622,
          left: 30,
          right: 332,
          top:  59,
          middle: 399,
          bottom: 399
        },
        
        // 11 and XR in Display Zoom mode
        "1624": {
          small: 310,
          medium: 658,
          large: 690,
          left: 46,
          right: 394,
          top: 142,
          middle: 522,
          bottom: 902 
        },
        
        // Plus in Display Zoom mode
        "2001" : {
          small: 444,
          medium: 963,
          large: 972,
          left: 81,
          right: 600,
          top: 90,
          middle: 618,
          bottom: 1146
        }
      }
      return phones
    }

    var message
    message = title || "开始之前，请先前往桌面,截取空白界面的截图。然后回来继续"
    let exitOptions = ["我已截图","前去截图 >"]
    let shouldExit = await generateAlert(message,exitOptions)
    if (shouldExit) return

    // Get screenshot and determine phone size.
    let img = await Photos.fromLibrary()
    let height = img.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
      message = "好像您选择的照片不是正确的截图，或者您的机型我们暂时不支持。点击确定前往社区讨论"
      let _id = await generateAlert(message,["帮助", "取消"])
      if (_id===0) Safari.openInApp('https://support.qq.com/products/287371', false)
      return
    }

    // Prompt for widget size and position.
    message = "截图中要设置透明背景组件的尺寸类型是？"
    let sizes = ["小尺寸","中尺寸","大尺寸"]
    let size = await generateAlert(message,sizes)
    let widgetSize = sizes[size]

    message = "要设置透明背景的小组件在哪个位置？"
    message += (height == 1136 ? " （备注：当前设备只支持两行小组件，所以下边选项中的「中间」和「底部」的选项是一致的）" : "")

    // Determine image crop based on phone size.
    let crop = { w: "", h: "", x: "", y: "" }
    if (widgetSize == "小尺寸") {
      crop.w = phone.small
      crop.h = phone.small
      let positions = ["左上角","右上角","中间左","中间右","左下角","右下角"]
      let _posotions = ["Top left","Top right","Middle left","Middle right","Bottom left","Bottom right"]
      let position = await generateAlert(message,positions)
      
      // Convert the two words into two keys for the phone size dictionary.
      let keys = _posotions[position].toLowerCase().split(' ')
      crop.y = phone[keys[0]]
      crop.x = phone[keys[1]]
      
    } else if (widgetSize == "中尺寸") {
      crop.w = phone.medium
      crop.h = phone.small
      
      // Medium and large widgets have a fixed x-value.
      crop.x = phone.left
      let positions = ["顶部","中间","底部"]
      let _positions = ["Top","Middle","Bottom"]
      let position = await generateAlert(message,positions)
      let key = _positions[position].toLowerCase()
      crop.y = phone[key]
      
    } else if(widgetSize == "大尺寸") {
      crop.w = phone.medium
      crop.h = phone.large
      crop.x = phone.left
      let positions = ["顶部","底部"]
      let position = await generateAlert(message,positions)
      
      // Large widgets at the bottom have the "middle" y-value.
      crop.y = position ? phone.middle : phone.top
    }

    // 透明/模糊选项
    message = "需要给背景图片加什么显示效果？"
    let blurOptions = ["透明", "白色 模糊", "黑色 模糊"]
    let blurred = await generateAlert(message, blurOptions)

    // Crop image and finalize the widget.
    if (blurred) {
      const style = (blurred === 1) ? 'light' : 'dark'
      img = await blurImage(img, style)
    }
    let imgCrop = cropImage(img, new Rect(crop.x,crop.y,crop.w,crop.h))


    return imgCrop

  }

  /**
   * 弹出一个通知
   * @param {string} title 通知标题
   * @param {string} body 通知内容
   * @param {string} url 点击后打开的URL
   */
  async notify (title, body, url, opts = {}) {
    let n = new Notification()
    n = Object.assign(n, opts);
    n.title = title
    n.body = body
    if (url) n.openURL = url
    return await n.schedule()
  }


  /**
   * 给图片加一层半透明遮罩
   * @param {Image} img 要处理的图片
   * @param {string} color 遮罩背景颜色
   * @param {float} opacity 透明度
   */
  async shadowImage (img, color = '#000000', opacity = 0.7) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size
    
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color(color, opacity))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    
    let res = await ctx.getImage()
    return res
  }
  
  /**
   * 获取当前插件的设置
   * @param {boolean} json 是否为json格式
   */
  getSettings(json=true){
    let res=json?{}:""
    let cache=""
    // if (global && Keychain.contains(this.SETTING_KEY2)) {
    //   cache = Keychain.get(this.SETTING_KEY2)
    // } else if (Keychain.contains(this.SETTING_KEY)) {
    //   cache = Keychain.get(this.SETTING_KEY)
    // } else if (Keychain.contains(this.SETTING_KEY1)) {
    //   cache = Keychain.get(this.SETTING_KEY1)
    // } else if (Keychain.contains(this.SETTING_KEY2)){
    if (Keychain.contains(this.SETTING_KEY)) {
      cache= Keychain.get(this.SETTING_KEY)
    }
      if (json){
        try {
          res=JSON.parse(cache)
        } catch (e) {}
      }else{
        res=cache
      }
    
    return res
  }

  /**
   * 存储当前设置
   * @param {bool} notify 是否通知提示
   */
  saveSettings(notify=true){
    let res= (typeof this.settings==="object")?JSON.stringify(this.settings):String(this.settings)
    Keychain.set(this.SETTING_KEY, res)
    if (notify) this.notify("设置成功","桌面组件稍后将自动刷新")
  }

  /**
   * 获取当前插件是否有自定义背景图片
   * @reutrn img | false
   */
  getBackgroundImage () {
    // 如果有KEY则优先加载，key>key1>key2
    // key2是全局
    let result = null
    if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY)) {
      result = Image.fromFile(this.BACKGROUND_KEY)
    // } else if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY1)) {
    //   result = Image.fromFile(this.BACKGROUND_KEY1)
    // } else if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY2)) {
    //   result = Image.fromFile(this.BACKGROUND_KEY2)
    }
    return result
  }

  /**
   * 设置当前组件的背景图片
   * @param {image} img 
   */
  setBackgroundImage (img, notify = true) {
    if (!img) {
      // 移除背景
      if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY)) {
        this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY)
      // } else if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY1)) {
      //   this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY1)
      // } else if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY2)) {
      //   this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY2)
      }
      if (notify) this.notify("移除成功", "小组件背景图片已移除，稍后刷新生效")
    } else {
      // 设置背景
      // 全部设置一遍，
      this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY, img)
      // this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY1, img)
      // this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY2, img)
      if (notify) this.notify("设置成功", "小组件背景图片已设置！稍后刷新生效")
    }
  }
  
}
// @base.end
// 运行环境
// @running.start
const Running = async (Widget, default_args = "") => {
  let M = null
  // 判断hash是否和当前设备匹配
  if (config.runsInWidget) {
    M = new Widget(args.widgetParameter || '')
    const W = await M.render()
    Script.setWidget(W)
    Script.complete()
  } else {
    let { act, data, __arg, __size } = args.queryParameters
    M = new Widget(__arg || default_args || '')
    if (__size) M.init(__size)
    if (!act || !M['_actions']) {
      // 弹出选择菜单
      const actions = M['_actions']
      const _actions = [
        async () => {
          Safari.openInApp("https://support.qq.com/products/287371", false)
        }
      ]
      const alert = new Alert()
      alert.title = M.name
      alert.message = M.desc
      alert.addAction("反馈交流")
      for (let _ in actions) {
        alert.addAction(_)
        _actions.push(actions[_])
      }
      alert.addCancelAction("取消操作")
      const idx = await alert.presentSheet()
      if (_actions[idx]) {
        const func = _actions[idx]
        await func()
      }
      return
    }
    let _tmp = act.split('-').map(_ => _[0].toUpperCase() + _.substr(1)).join('')
    let _act = `action${_tmp}`
    if (M[_act] && typeof M[_act] === 'function') {
      const func = M[_act].bind(M)
      await func(data)
    }
  }
}


class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = '「Notion · 账单」'
    this.desc = 'Notion记账'
    //获取设备信息 
    this.dark = Device.isUsingDarkAppearance()
    this.databaseId = "your_database_id"
    this.NotionKey = "your_notion_key"
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    let month = new Date().getMonth() + 1;
      //测试用
    // if(Keychain.contains("lastId")){
    //   Keychain.remove("lastId");
    // }
    // Keychain.set("monthCost", "0");
    // Keychain.set("dayCost", "0");
    if(!Keychain.contains("month")||Keychain.get("month")!=month.toString()){
      Keychain.set("month", month.toString());
      Keychain.set("monthCost", "0");
    }
    let day = new Date().getDate();
    if(!Keychain.contains("day")||Keychain.get("day")!=day.toString()){
      Keychain.set("day", day.toString());
      Keychain.set("dayCost", "0");
    }
    const data = await this.getData()
    let w = new ListWidget()
    w.addSpacer(10)
    
    let header = w.addStack()
    header.setPadding(0, 100, 0, 0)
    let _title = header.addText("🔴 "+this.name)
    header.addSpacer()
    _title.textColor = Color.red()
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(12)
    w.addSpacer(10)
    //显示今日消费及本月消费
    let dayCost = Keychain.get("dayCost")
    let monthCost = Keychain.get("monthCost")
    let content = w.addStack()
    let todayText = content.addText("👀今日消费\n"+dayCost+"元");
    content.setPadding(20, 30, 0, 30)
    todayText.font = Font.lightSystemFont(16)
    content.addSpacer()
    let monthText =  content.addText("🛬本月消费\n"+monthCost+"元");
    monthText.font = Font.lightSystemFont(16)
    w.addSpacer()
    if(this.dark){
      monthText.textColor = Color.white()
      todayText.textColor = Color.white()
      w.backgroundImage = await this.getImageByBase64('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gAUU29mdHdhcmU6IFNuaXBhc3Rl/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgDDASSAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/KyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooIzRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABQeKKD0oATdRupKKAF3UbqSigBd1G6kooAXdRupKKAF3UbqSigBd1G6kooAXdRupKKAF3UbqSigBd1G6kooAXdRupKKAF3UbqSigBd1G6kooAXdRupKKAF3UbqSigBwOaKRelLQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFB6UUHpQA2iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAVelLSL0paACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoPSig9KAG0UUUAFFFFABRRRQAUUUUAFFe6+APAGkfDL4RR/GDxrZDUpdVnudM8E+HpowY728iUCTUrhZEZJbS2dlHk4YTTYRwI1kDereKfDdz+2x+zNf8AxTtmtLn4w/DcPF4z2wCGfXdII3Wl7+7RIvMt40kiIwXaOAsz5WJGAPjSiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAFXpS0i9KWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKD0ooPSgBtFFFABRRRQAUUUUAFetfs8/B2y+JOq634g8U3VxpXw28HWqar4m1K3jJlMJkCR2cBPyfabhz5cQcgZ3NyEIPnXhPwtqnjnxVo3hzRLb7brWsXsOn2Nt5ix+dPK4jjTc5CrlmAyxAGeSBXvP7UOtaR8LfD+l/s/8AhN4p7Twvd/bPF+qoGb+1vEgQxT+W7qrfZ7YF4I1CR5/eMwYsHIB5l8d/jLqPx0+It34kvLVNK0+OKOw0fQ7dy1tpGnQjbb2cAwAqIv8AdVQzF22gsa639jX9oy5/Zd+Pmg+MwJJdFfOn63bRKGaewlK+aFB6shVJVGRlolBOCa8RooA+4v8Agov+xK3wl12X4s/Dm3ttT+EPiNkvVk0dVa30iSbBVRsyv2WUsDFIuEG8R4H7syfDtfr/AP8ABLH46aT+0L8EfEHwD+IMEWvyaJZH7Lb6hvlF5pDuF8tiScfZ5HRFIK7UeEIB5ZNfGH7eH7C2v/sq+N7nU9Is7rVPhjqMhfTdWUNKbMnbm2umCgRuGYhCeJFAIJYOqgHyfRRXa/CH4eJ8RvFptb67bS/Dum2sura5qipu+x2EI3SsvYyOdsUSsQHmmhTI35oA4qivv/8AYE8A/Bj9ri48e/C/xt4St9E1Mzz674WvtMvJkv7G2kKpLZxzuW85IAImjSYSffmcg/MaZ8Yf+CNnxc8GSSz+BNV0j4iWG5FjgEg02/OQdzGOZvJCqeM+cWOQdo5wAfAdFdR8R/hd4u+EHiWXw/418Oaj4Z1hAXFrqVu0RkQOyeZGTxJGWRwJEJVtpwTXL0AFFFFABRRRQAUUUUAFFFFABRRRQAq9KWkXpS0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABQelFB6UANooooAKKKKACiivZv2Rf2b9T/am+OGi+CrJjb6YP8ATtavVkCNa6fG6CZ0JVsyHeqINpG+RN2F3EAHr37Omnv+yj8A9Y/aL1P7LH4u8QxT+HvhtbmaKWZJmLxXuptEyttWFVaNCcgszK6BZY2Px2ea+if24/2ibL4+fFxLbwt/onw08JWq6F4U06HekCWkQCmdYm+6ZSqn7qt5aQqwylfO1ABRRRQB1Xwq8a+Jvh18SPDfiTwbNcReKNOvopdPFqrM8su7Ai2ry6yAlGT+NXKnIOK/pl8XeEdG8e+F9T8O+IdOg1fRNSga3u7K5XcksbDkH09QRyCAQQRX4F/8E3vhLN8XP2wPAkGy4Gn+H7n/AISS9mtmUGFbQiSEtuzlWuPs8bADOJDjHUfdH/BVr9t7VPhctl8Jvh5rlxpHii4SO+1zV9KuxHcWEB5itlZDvjlkwJG5VhH5eNyy8AHlf7UP/BISbwxrOqeKvh7438OaB4EMvnzWnjK+ezXR42ZF2i6KuJYlLOcybXChVzK/zN8dfErxd4c+HngKX4WeANWk1yG7uI7rxb4ojVoYdXuoWcRWtqu7LWMO4OrSKGllPmFVCRKvi7yvLje7PjpuOabQB1vwl+J+t/Bf4leHPHHh2bytY0O8S7hDM6pKAcPFJsZWMciFo3AIyrsM81/SX8IPinoXxt+GXhzxz4bmaXRtbtFuoRJt8yI8q8Um0kB43V0YAkBkYZNfzD1+63/BKjwVqHws/ZT0C38S6hHbX3jDUbnXtI0y5l2zLaNFEqhEY/MGWLz/AJeNs4J5JoA7r9vv9k2D9q34KXFhYRKvjbQvM1Dw/cYQF5tvz2rM2NqTBVUncoDrExyEIP8APpd2k+n3c1rdQyW1zA7RywzIUeNwcMrKeQQQQQa/qjr8iv8Agrf+xlH4V1OT44+D7KC30fUJkh8TWNtCymK8kc7b44yoWViqP9394Ub52mYqAfmZRRRQAUUUUAFFFFABRRRQAUUUUAKvSlpyRkx7uxJFG2qewDaKdto21IDaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKD0ooPSgBtFFFABRRRQAV953zR/sTfsGw2SNDH8WvjfB507qqmbTfD5QYQglxmRHPO2Ns3TjO62Brw79g74AN+0b+0z4V8O3Fulx4f0+T+2tcWVA6GygZS0bKXUkSu0UHy5K+duwQpqH9ub4+v+0d+0r4r8TwT+doNpL/AGTooWQSILKAsqOp2jiVjJNg5wZiMkAGgDwOiiigAooooA/R7/gmDe6J+z58DPjd+0V4jtUuLfSYo9D07a7iSWX5JHtvlDbRNLNYIHKkLgkkKGr4G+JfxF134t+Pte8Y+Jbx77XNau3u7mVmYgFjwibiSqIu1EXOFVVUcAV9A/tafERfB3wy+HP7OWkGWO08CQfbfE/mtDJ53iGcPJcxCSPIZLVppYFYHklwd2xXPyzQAUUUUAaHh99Ki1q0k1uK7n0pH33EFhIsc8yDny0dgwjLY27yr7M7tj42nrrv47+Obv4l6N49OvTQ+JNEkhbSZYURINOjhbMNvbwAeXFAnIWFVEYBI24JB4GigD+lz9nL49eH/wBpP4RaF468PSRrHexBLywWbzH0+7UDzraQ4U7kJ4JVdylHA2sK7/WdGsfEWkX2lapZwahpl9A9tdWd1GJIp4nUq8bqeGVlJBB4IJr8S/8AgkX8bfFHg39pnTfh5Z3ay+FPGEdz9vsZxuWOa3tJp454j1R/3RQ9mV/mBKoV/cGgD+fv9vn9jLVf2U/ijcz6faPP8OdbnebQ76MOyWwYlvsUrMSRJGAcEsfMQBs7t6p8t1/T58U/hb4a+M/gTVvB/i7TI9V0LU4vLmgfgqQcq6MOVdSAysOQQK/BH9tT9i/xJ+yN48NvL5+r+CNRkJ0fXjHgSDr5E2OFmUZ44DAblxyqgHzjRRRQAUUUUAFFFFABRRRQBYiP+jMcdGqNjtqW3UG3f/eA/Q/4UwnNbSSsvQm5HRRRWJQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUHpRQelADaKKKACiiigD9Af2UbK3+AH/BPn45/GO8EUGv+LV/4RLQTNsin8th5TyW0ud7HfPK7Rr/AM+Abnbkfn9X6Sft5Wll8G/+CfH7NvwsGl6hpWq3/l67c21ypBgnS1aS9jl3NuVzcalkJtwNrD5doB/NugAooooAK2PB+tQ+G/Ethq0sfnNYObqCMxRyo06AtCJEcFXj8wJvUjlNw71j0UAWtV1W913VLzUtSvJ9Q1G8me4ubu6laWWeV2LO7uxJZmYkkk5JJJqrRRQAUUUUAFFFFAH6G/8ABG34BTeMvjPqvxSvPtEGm+DYWtrEqrKlze3MUkbDcVKsI4GkLKCGBmhPQ4P7N14T+xJ8AH/Zr/Zu8KeDr6K3TxAY31DWZIIkQteTNvdXZWYSGJSkAkydywKRgYAxf27Pjx8TP2dPhDF4x+HPhPS/E4trsLq0mpCeYWNttJ87yYihZMjDOZF2ZX5WDFkAPpCvkT/gq1qumad+xD42t7+5t4Lq/udOttPjmYBppxewylI89W8qKZuOdqt2Bry/9hv/AIKmxfHnxmfAvxRstI8LeJ9RnC6Ff6WskVjeMQB9lcSyOUnLAlDu2ybtgCuEEvxJ/wAFS/jnrnxZ/ai1rw/fWd7pOieC2bSNO0+9iaJ2PDTXWwsQRM21kcYDwrAcZzQB8e0UUUAFFFFABRRRQAUUUUAWrb/j3b/fH8jUZ6mprbAs5cjPzj+RqE9TXTLaPoSupHRRRXM9ygooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoPSig9KAG0UUUAFanhTw7e+L/FGj6DpttJe6jql5DY21tDjfLLI4REXPcswA+tZdeq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HVrqK2Jt9R07zWRL6zfAlhYg9eA6k5CyJGxDbcEA/pQr50/bf/ZA0z9r/wCFsWjG8j0fxVo8r3miarJGGRJWTa8Ep2lhDJhN2zkNHG2G2bG9k+GfxI8PfF7wJovjDwrqMeqaDq1uLi2uY/TJDIw/hdWDKynlWUg8iunoA/l28e+AvEPwv8Y6t4V8VaVcaJ4g0qc293Y3IG+NsAgggkMrAhldSVZWVlJBBOBX7p/8FFf2CI/2ovDcfizwalvZ/E3R4WWKN9kcetQDn7NJIcbZFx+6djtBJR8KweP8NtW0m+0DVbzTNTsrjTtSspntrqzu4mimglRirxujAFWVgQVIBBBBoA+mf2Xv2oPD+j+Err4LfGuym8SfBTWZ/MjkTc154ZuySReWjAFgm5iXjUH7zMobdLHNwX7Un7M2s/s0+Obewmuo9f8ACOtQf2h4a8U2RD2er2TAMrxupK7wHTcoJxuVhlHRm8Zr6m/Za/aH0G78Ky/AX4zLJq3wg1+6U2N8ZEW58KX7Mdt7bSPxHHudjIvTDSMAQ8qTAHyzRXrv7TP7Mni39l34gP4e8SRC60+5DTaRrlsp+y6nb5GJIzyAwBXcmSVJHUFWbyKgB6dKdTU6U6rvZCGUUUVAwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqWIRGC48xiH2jywO7bh19sbvxxUVB6UANrY1/wfrHhi20y61GxkhsdUtxdafegbre7i6FopB8r7WyjgHKOrI4V1ZRj19U/sVftI+FfBF1c/C74waDaeLvg94nuUE8eogyHQrpkkiF9b5YeV8sxEjx7ZVUB0bKbHAPlaivu39r7/AIJe6x8FfCF18RPhprb+Pfh7DCt3PGQr39nald32jdGPLuIQMM0iBSqsGKbFdx8JUAS2l3PYXUN1azSW1zC6yRTQuVeNwchlI5BBAIIr9aPBf7QR/wCCgvxy/Zp8NxG6/s7wpYnxt4yigCRINVtiYogUIceWJ0QgA5MV9g7WB2/klX2L/wAEsPj3ZfBT9p6y03VwF0fxlANAe4JI+zXLyI1tIQFYsDIoiIyoHnbycJggH1l/wW/8VXdn8Ofhf4aSSIWGo6reajLGQPMaS3hSOMg9cAXcmfqvpX5EV+yv/BZj4IeI/iD8KfCPjvRIDe2PguW8/tS2iGZEt7ryB9oHPKo0ChgASBJuOFRiPxqoAKKKKACt/wAE+C77x7rNzpmnSQR3EGm6hqrG4Yqpis7Oa7lAIB+YxwOFHQsQCQMkYFfS/wAALQfDD9mb40/Fe7t1Nzq1snw58PtcQLNDJcXymTUCMHfHJHZRna/C/vyPm5WgD520DQtQ8Ua7p2jaTaS6hquo3MdnaWkC7pJ5pGCIijuWZgAPU1/Sb+zV8GrT9n/4F+DfAdtFbpPpOnxpfSWru8c96w33Mqs/zEPM0jAHGAQAAAAPyQ/4JC/AYfEz9om48a6lZC40PwRa/a0aQRvG2oTZS2VkcEnaonlDLyjwxnIyM/t5QB5H+1N+0Tov7L3wZ1rxzrCC6mhxbabpwcI19euD5UIJPThnYjJCI7AMRg/zk+LfFWqeOvFWs+JNcuvt2taxezahfXPlrH5s8rl5H2qAq5ZicKABnAAFfYf/AAVa/aWk+NH7QNx4N02XPhfwHJNpkeMjz7/IF5IwZFI2ughA+YfuWdTiSviagAooooAKKKKAPp/9hv8Abj8Q/sheM2gnFxrfw61WdW1jQVcbo2wF+12u4gLOqgAgkLKqhGIIjeP96Ph/8QPD3xT8GaT4s8Katb654e1WET2l9bE7ZFyQQQQCrKwZWRgGVlZWAIIH8vFfXX7BP7eOtfsreLIdE1ye41T4ZalMBfafku2nux5ubcdiOrIOHH+0AaAP3ur82f8Agp1/wT6f4h21/wDGD4b2QPia0g8zXdAtoQP7TiXJN1CFGTcKD86nPmKoK4ddsv6N6Rq9jr+lWWqaZeW+o6bewpc2t5aSrLDPE6hkkR1JDKykEMCQQQRVojNAH8rFSWtrNfXMNvbQyXFxM4jjiiUs7sTgKoHJJPGBX68ftYf8EhofiT8RE8TfCXVNH8I22pzmTVtH1LzUtoGJy0tqI0bGck+Sdqg/dZQQo+l/2Sf2Cvh5+ydppubCIeKPGcxDT+J9Uto/Pj/d7GjtVAP2eI7nJUMzNvw7uFQKAfI37IX7KPjL9pD9mXxR8NPjv4V1fw3aeH5o38Ca/rVhJDqmmPKri4jjWUqzWymK3PlEKrb2Ab5YzF+a3xg+FHiD4HfEzxB4F8UQxQ65otx5E/kOXikBUPHLGSASjoyOuQDhhkA5A/p27V/OF+2h8YtL+Pn7T/j/AMcaHGV0XULyOGxkJY+fBbwR20c+GRWXzFhEmxlBXftOSMkA8YTpSUqdKSqEFFFFSMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKD0ooPSgBtFFFAH6kf8ErP277iC+0/4J/ETWPOtJdlv4T1O9cAwEAgWEkrNypwqwDGQT5YJBiVeT/bt/Yn8Gfs4fE6y8er4Uv734I+IXWz1eHRL4R33h68eQt5torDYEKqNiSiRDmaMmEtA6/nGCQQQcEd6/aT9gX9rvw/+2F8JdQ+C/xUKX/iyPTHsJ0vJmH/AAkGn+XsaQSbt/2hVz5mCG6Sqc7/ACwD88Pj5+wr4w+Efg3T/iF4ZvoviV8KdTtory08V6PbPE0cUibg11atl7foQSdyqdqsyudg+aq/XXwF4o8Q/wDBLX4223w08U3U/iH9n3xjfefoniG4ASXRJ3O1hM+Ap24TzVBClds0YVjJC3of7Un/AASa+Hfxet7rWvhwtt8N/FpUuLa2h/4lF2wTCo8C/wDHvkhBvhGANxMbsaAPQP2BP2j9L/a6/ZvXTfEaxav4k0a1XQ/E9hqKLMt6jRlEnkVifMS4jVt24AF1mXG0An8p/wBv/wDZAvP2Ufi/KtjEjeA/EUs154flid2+zxhgXs5N5Lb4d6AMWbehRs7i6r3/AMBrj4j/APBMb9qnSY/iXYXejeC9blfTdUu7ctNp2oWgbC3cLKrbzCzJ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/wCzF/0U3/ygap/8jUAfVVFfKv8Aw9H/AGYv+im/+UDVP/kaj/h6P+zF/wBFN/8AKBqn/wAjUAfVVFfKv/D0f9mL/opv/lA1T/5Go/4ej/sxf9FN/wDKBqn/AMjUAfVVFfKv/D0f9mL/AKKb/wCUDVP/AJGo/wCHo/7MX/RTf/KBqn/yNQB9VUV8q/8AD0f9mL/opv8A5QNU/wDkaj/h6P8Asxf9FN/8oGqf/I1AH1VRXyr/AMPR/wBmL/opv/lA1T/5Go/4ej/sxf8ARTf/ACgap/8AI1AH1VRXyr/w9H/Zi/6Kb/5QNU/+RqP+Ho/7MX/RTf8Aygap/wDI1AH1VRX52fEv/gtR8M/DskkHgvwfrvjGdCP395ImmWzghT8rESScZYHdGvK8ZBzXyn8U/wDgsN8b/Gsk0PhWLQ/h/Y/aWlgewsxeXnk4IEUstxvjbqCWSKMkqMYGQQD9v68F+IX7eHwA+F8sEWu/FLQnmlkki8nR5H1SSJ0wGWVbRZTEcnHzhc4OM4OPwH+I/wAb/iD8X7qSfxr401zxPvna5EOpX0ksEUhLHMcROyMDewCooCgkAAcVxNAH67/EP/gt34RsooV8C/DfW9Zkkjk82XxDdw6eIH48sqkPn+aOuQWjIwACc5Hyj8T/APgrJ8f/AIhCeDTdZ0zwNp80L27QeHrBfMZW3Dd505kkSQBgN8bJgqCADzXxtRQB1Xjz4seNvinPazeM/F+u+LJLXeLZta1Ga78gOQXEfmMdgO1chcD5R6CuVoooAVelLSL0paACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoPSiigBtFOxRigBtFOxRigBtFOxRigBtFPUD0pcD0FAEdFSYHoKMD0FMBIIJLqeOGGNpZpGCJGilmZicAADqSa/WD9h7/glDpg8Njxh8ddMku7/AFGBlsfCBlaJbSGSMqZLplw4nO7KojDysAklzti/LTwz4n1nwXrlrrXh7Vr7QdYtSxt9Q0y5e3uISVKkpIhDLlWIOD0JHevQf+Gr/jd/0WPx/wD+FRff/HaLAfumv7BX7PaKFHwm8OEAY5tyT+eawte/4Jsfs2eI7xLm7+F1lFIkYjC2GoXlmmASeUhmRSeT8xGegzgCvxJ/4av+N3/RY/H/AP4VF9/8dp//AA1f8bv+ix+P/wDwqL7/AOO07CP2x1j/AIJp/s1a5JA9z8LrONoYhCos9SvbUFRnBYRTqGbn7zZY9zxVjw//AME4/wBm/wAMfaPsnws02bz9u/8AtC7ur3G3ONvnyvt6nO3GeM5wMfiH/wANX/G7/osfj/8A8Ki+/wDjtYHjX42/EX4laVFpni7x94n8VabFMLmOz1vWbm8hSUKyiQJI7AMFdhuxnDEdzRygfst8UvAv7C/wXF0ni/TPh9pl5ayLFPpsP+l30bN03WsBeYDvnZgZ5Ir5L+KH7Wn7F/htp7fwR+zvD41uobryvtF5Cul2U0OGzLG5MkuchcI8KHBJJBGD+c+B6Uu0DsKOUD0b4kfFfwz4w1DUZ/D/AMJ/CvgpZ7t7i3l0+41G4mhQyh1QrNdPA2ANpxAqkM2EX5QvmlP49BRx6CiwxlFSYHoKMD0FICOipMD0FGB6CkBHRTsUYoAbRTsUYoARelLRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAPoplFNAPoooouAyiiiqAfRSbqN1QA2iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKCcUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRSfdoAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==')
    }else{
      //图片来源：https://unsplash.com/photos/-yWZ9cI4XX0
      monthText.textColor = Color.black()
      todayText.textColor = Color.black()
      w.backgroundImage = await this.getImageByBase64('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gAUU29mdHdhcmU6IFNuaXBhc3Rl/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgBVgJNAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9ejigm3yANJbyDqqhCfzNSNd2EJw1xJbTAdZ3KsefUDFbTW73LRRtEixrhszRx4OPQhjVqe+E12kMLiBsgHy5Bn8tuPyr13I8NR0Oca1kvN8lvcwzH7pQSbivHXcMY/HNLa6fLNEzXdlFGm7G5W3jOe3PArqP7Lsp7iVi83mqdu77U8Zb64bB/KhdP0lZihuLgyKMbQzS5OO+RS5x8pz7aXC0yqYo3jRcnywxbr24p3k7laBLCURFh806scD1xwa2W0CyuFZlafa/DNJGqAfjgVDcQRPbqtlcQu6HEYXDDcD655o5rhymDc6dE0mwaaJJJBkts2oAB1Oam+yBYwIXt0jH8McQJH61ovbqyxi8Fr52RlcBC/1wTj86JtPsIVmK2UBk4VjGA+eP71VzC5TOW1mFuzRWgiYsNzSoMEeoG6qv9n3csgWSdQG5MsUHy9ehHr9DXQQww3kbC0u2s5EXG1bYf8AswIqePRZTGkdzqrO+furFEAcjjIpc9g5TJXSwUYARxtnk7Nmf1NV7mzgxgxebNnJCShW4GOOa2U8Ppp+4tNtXPEzSiNemTkA81AftazJLDPbXEJOECEsfrwMY/GjmDlsZttpYjZXFq0bEbvnlJP5bsUmobrfmRYFBwTuVmfPsqmr19DqEcOyRITM5J83IGB7AnJpsNjqrRIRdP5SrgpCuN/pk81VybFTZcS7gqFk4IbJUn/gJH9aX7D+5cvF5rEnjzMdPX5T/OriWErK+YYUO0EsUUlT353A0xoXt0VraKVx5m4tE4Cn1yN5NFw5SlCIpgii1jMi9m6rx7inMI1eONwpZuAuQAOe/Nak1vIxUvbXRiOeVu2xjr0qKP7AW8t7UmTr86knp680XHYpyKLUtstvtO7/AJ5bW/qMVHNH5qo8TpbNnmOQ/wCFa8cBWby4bIRoqcMGBXB9fmBFPt9LDzb2ML5X5VyzFefXOKXMHKZ0MbTWpbzEZujMZDj8siqt1cW3Uy7R0VVdkGe/et678O+ZuMlvFyNpYRsc++QeKrWuj+R8kDxqI8ElvnAyOwIouFmU/sqrEH+0QyxSDOGy5z+dFjJtUeZIsYHGI5Ch+mBVyPTJLwb1v9qdP3VvGn8xmrf9mSMwyZxtYcoVJJ9TxS5tB8plyR28QwZW8tm7P909e+DULTTNJutlwg+YPKS+TjpgNWxJZ3NvNI32oXETHCrIPw/u9ahutLmWVTuWFcfdALA8dflT+tCkgcStZ/aPLZi0eWIJ3oUA9cde9SNbkSqxudwckAlgAOPpWjb6SPs7CSaHbjG4Rvjn2POaeNBjhjWNGaJQcKy4J/UcVPMg5WZcVjJbxu9xdSBGACpsVwx9M4qtNCkMrbJZUX+PYFAGegOeldA3htJYpcTRiM8O0hb+f+FRR+HpFX91dRFejLESQV9B8vNCmh8rMr+zxCpkinmc/wAfCBCf6/hVfUtTs7JY084xyY+6T1rpIND3vGZGPlgfLujfI7fSrv8AY1lH8klzMzsckeYRt/AYo50PlZyljqNvdHdbyySvIf4peOPbHFW2jKxlhagyl+oZiT+IFdGtraqrFJ53OepYggAe+aqXlro955KyX9zHJnd5azFC3PsRS5w5Wc3NbLLMVlgkYjlU3uAP1q39hjXDrYq79CFRcge+a25JNL80rFJNNKBgKzdeehODzVee7toSSul3Hmng5J/nt5p8zDlRQ/sYCPP2WVlY5IWIH+XFRwWkjNKF0u7j4+SRIQM/5Naba2YfLRbG5y442Rbtv1yKkSa9haMqyGF+SzxHdn0xwBS5mFkZa6bdNslbS5pZF42ShAfrzx+lMh8Ny3dwC+mRxgcj90q45wRwcVqfbLm5DLlY+q4cIMmmrapcNguZGGMhUI7c98UXYcqIJ/D/AJLYt3jgUdFoXRDdXABnVWVMfLOwA/AGp10k/aMIoQr2XPGfTJqNrEWO9TEuOuScZ/Gi/mFvIsr4Zhh3f6dtXrtaVyCfp0p0nhuyuoA0k8QHbblj+oqBdOPlAR3k6xt8xVXDAEjoOKba6O3UzTNGBjbIWB6+xxSv5lWXYVdL02xyRdzORj5FRWX+VLv063maQuu/GCrQ7Sf05p7afBash/fSe0Z460PZxOpBSQhjnmMsw+hxQHyG7tLimH7uVCeuVwPw4pzSaX5JVoJNufmABwfrikuLPcqmL7QHHT5Hwee420+CC4jYrucHPLLxj6gjNAuoLcafJuRLSSQ7eN3Ab2ztFOjurOSEj+zY0fBxvY/0qSSGERuHlaJ/+mrkKPeoVt7VgW84BscsGb6cVN0VqK8kSqDBbQxkgbiqFu3Y1ajvjEwRIoTjr+7b+jUkIRQwS6VxjB3N0/SmCN2mQK/nLnB8twDS0KVyRtWmZMBYFLHjyo8nrzkcmkbxE0gdPtDlegWOJ1z6DPFWf7P3RgMkoGeu4Z/TFRQWsqTbY4l2j7/mW5JxnjDZqdC9Su1008w3y3BQ8Y82TcPphqghhheR2dPMRmxtluHcj8zWvJGzMnyxgZxkRrn86WGxfcUM6464MafNz7ClcdjOms45NxRNxxggT/l/F6VEtmHszEFFnIOwAYnHvgitb+z7VJT86/N/DyoP4Ypk1ojfKhRHx8rGUqP5UlIOUxIoVupmjnRmZVzveP5R6AfLjNWYdLOmo3JfJBWMqqqfocVZW4FmWa9uY0QE7VWd3Bx6jGPyNWLWSz1Rc+fbO2QSFLBh+ZpuQ1FFKS2W4X512FDjaJD39CMVXaEW7IEQ4c4M6sScAe9dC1qAp2cAHOQB/PFNjZJFJNxznGzZU8w+Uxg0VxMgMrrOOV/eHnH+z2qVrW5kkZgVZQMg7A2far8lqjMXlmdVDZ+4o7euM1G1nbGMSC8mctwBvAHr6elHMJRKLQzqyOwCpnhfKwB+Gak2zecQSVVjt5I6fQCpf9EaRZHSQNjAkZj26e1PVoLo5iHmbj8x3qccfWncEiuq3FuGaS3wM42xgDj171HNFJBGDMQysckMuP6VqSafBPEIphI8ZGNvmEZH51C2l2Xk/Ir5XgDzcilzD5TNW1ZoWdWgjjByRwSfQ9sU5rWQxxt9p82N/vjeFGf51d8lDuiM8agjBjZl4/SlgtpFUhnSZeg3D8uigfrTuKxnXkSxx/Pc+XFjadsxOMH2FZ/9n2k/3b5rn/t4P9QK6DaFUs3kq2MNubbz9ajhnmDcCMRk8OLjOfyFUpMXKZEOnxIpB+1pnpumLDjuPapn0lrk7hFLL2zuGPwzmtRW88NJKVmK8DODn27U3zH3FV2Qov3VeMn+TUuZi5UQto2pSTyMr2LRAcLLDLu3Y9c4/SqV5oeu36osl3pflqNmIoZBjuMnfXSx6OjXIuF1K4l9I2u12/kGH8q1PsUUcD/6tc9QZAf61PtLD9nc4aHwv5YyyWryn77+Y67z9OcVPa6NNa5Rra3RGb+AvJu9s4B/WuxgsbdY8w7m3fxJJRJYxMzCQO2RjLOTU+1H7M4m68NTTN5U6RGJX3KsbuWX2ZSSKdaQ29mr2sVvFnrt8srkk9gOBXTSaFaqxuIbeMydAy5XP161Q/sexhZ5J4rWNyOVkdv51oqlyPZtGf8A2PNGu8W0Kbjlg8O8/qeKI7h1XbDaIgJ52qMH3GD/AEqzBYacuBFb2CsSflaWRwc1NDockYX7JDZWoJxmOBiuPwYUcyFyvoZ9sst4r4mmfcSNqICR+G2pLWya2hw1tPI+epjUf0q5caBqT7VLwtg53FZY/wD0GQU+Pw20Ue+4eMjru8yQD8yxp83mCi+w0xzbctbKilcbZBuP5Vm30SeSoW2hhmJ2p/o4/oM4/GtZYnXiNIymMgi5z+uKZ/ZTg+YsYWY87mct+tJMbTZj26zQRosaK0y5P3SB74zyKgVdSXzZCFU8bUaYj9MV0ot5Nw3CHjruOCfpzUKt+8k3QxhgOCZTVKRPKZP2a5baROIufmED8H86VbYsp33xU4KjzGUEfQgc1dkhLLxBDvzk8t/Ommzk37lgtsH++3/1qfMLlM17NXVFa8aY9Nzt/wDWojjSHiNI5yDjPngfpitIQzKMMlm6+q7jiq8kaxYbyrZTnj59v6YpqQrEc8zxFSXVIx/elyT7cLVW4ae6XCytsByCkjZ/9F/1rQe8vISCI7JkB6LMR2/3SKI9XjuDseSJSTjaoZ/1wBRcEijcaXbXh/0zzkGOGSaUH9AKbb6XYW8mIbuZcD+N5ccD6iughUbVDBAAP4V/+vRIyLHuBjBHQlcH+VLmK5TGzpjRhWnYBOTIQzfrnmqya9oOn72XU8bTht+V6+x71s/bYXys1xBtxxuxT2jsJow7G1Zc5yVBoJsZFv4u0WZdsVzGyg7sRDecZ69Dzmnt4o0VppfvJKvDMYnQ/quK0JotNtVIja3jJ7LEGHr0rPh1G0UMkkyuSTkJYj+eKegaiW3iLSJN7pqEY7bWJ4ptx4h01siLVwjbgVCY649SP51Yj/s5sr5Yb/etQD+GBToktYyf3B5PYBT+I4o0DUr/ANpSXGUa+uvmGR8qhj+IWn28ckMbhbi4VMcs82CO/Sp1t7e5ufns2bjAZlB/rQ+m2zME+w5xycDH6BqQrMq3GkWd0xL3U5ZgODM5PH41LNptndw+V5skTg8MWYVP5MMciyPCYlUctIcVNttpl3I6vz2Y/wAyaOYLIxV8D6ZPI0xnuJXXqzXTAflkVOnh6zspc/u1JUAtNiRseuea0o3srgsiNv5+bEwx/Oi4tbNXRnuGRR93MuAPyxmnzN9QUUjPu9P0lgQYo5D94LC6gtj09/zqr/oNuqvG8yg87ZrqPHuBkZqO48H6XJfNdRpCzMciTIJGeuDnPNaK+HtHWHyzDbsEwQFQAD9aq6S3FZtiWcNpeW6v5LPFnj5wT+GDj8qsQ6TGsR2QsjN3LsOO3O49qhXw7p8T5hs7clh95UC9+gqxDpdrtLESMqnGUbGKm47EtlpcMKPsiAJPP70v+pokiSSYq8cgYjs6j+uaU2Fo+MKzO3B/e4NV5NLkjkxCWCY++XQn9eaWhRYTyrYIyxHZjBXdkj9aRtNWbDbJGVejB+Oeen41FDpUqzRySXUpjAwQpj2t/wDXq1/Z3kqvlzSRLnP3xg/pQLURLVlTaJA3P3twB+mMUskaFcyvhwepOc/lSNbzFjuj+XHdFfP47aIZFjjI2NCF/wCmfH4YFBQwWMseHUL5fX5d2SKXyZNoMjxqD90qxBH1zUzIysZYnaMsOSIsk/gf8Kjjsr26dczxqino1vjP60rgVLjSrO6cmeJZ2zlSZPT8KswrxsEQhU8fJyCfToMU86Texr888RJPDKhH6ZqRdPnZGxJ52OcBGyPrzTAgktxhwrMo/j3AMMdx1oV3UqFTfHj5dvy8duuaP7JiWRmmWEbh82YVJ/On/wBmiWYOlvbEryCYgv8ATP60rgPVYXAaQiId1dwf5ClkMMSKWlRBnhlUE/ypkcV79o2y2tmE/hbac/zqbZMzbZJIW3HjCjj9akpB5iSMo8xpA3zbtoGKbdW9tfJzdzIVH8EpUjB9MVPbTcKzeS+PkLYU8gc87uKcodiGMUJDKCrZIB6+mfSo1LM6a6sUYLK11Ozrj93CzD65C1DZ/ZLFhsRtmSdsttyPqTg1tLfqrbZo1UoP+WaFj+eKgOtWbrkRm4foB5JJ/HjFO/kHzEW8jmVXSXIX5cIoAH4VJLPBI3DK0ijnfkEfhmi31N4wQbddp58sKqj88Vaa7tvMV3iiYMMkIpbHHTIqfkWjPbymbJkti7Hp5Yz+tTpLBbriWSCKfou1Rn8cCmx61YtLIoiklK4GBbE7Sfw6fjU0d5BJtJgljfJA3RqOntnNDbErXGrNAzBHuFc985H9KYGtmmaMTAMDwqRlv1qdtUhaRo+SQMEgAk0vmLMyo0UqqvTJx/I0ityO4s1dWBmPI7jH9DVZtNt3hUSsdw4GG3gHp0IxWnHeWcSssZkBHVSTkGo18qSQnNzj+ECfA/LNHMwsVI9FgEXlu/ngHPzqij9AKdb6ZawklYbcyA4Gzb0/AVek8qSPBbLdxIAxIqsyx22Aiw7f7m3H8jU8zY7IfLb/AChUiVMfxAiqUmg6ZIzP9ig81uTJtViT+VSbouXjt1L9AvzAn86RI4V3OYvKkx8245A/I0INCH+z7W3j2NaxyH2XaP5Y/WnfZ5o48rD8p42kgAc/j/Op5GgVR5j+duAAWNGb+Rqu0lrChCxXOM/88Zc/Tk1aE7EW3yrgiSJivUeXIgHT35qVdq42wSnsGdlbNMg1C3uMN9muPlOwr5S/1bNTtfKu6NbeaPt8yp/LNIV0QzRv5gYLGEz8ysV64rLu47BZ285bJX95Ez+NbQtbdYyHBZuyuo59+lJHaRMCVMcY/uhP8VqkBsr9rVfLNymQfurEufxBbipY2uE6W7c9cBB/WpNqqpAMrYPRJduP1qXzkPBaRT/tyf1rmbNUiBmkBysbBz13MKgmWdhuSIh+/wC8H68GrMlqXPErn0G5eP0qi1jdSRBBPHkNkMxB2/pj9KcWhNMjsV1BogbmzjWTJyY38wYycc7B2xT7izvXACXLQjBHyRA/zBqNtP1AKSmpIn1QN+oxVO6sdRuIvmvnZun7lAv881qt9zN+hdhhureII9z5rf3po1B/8dxUzXEzNhJlB74XP9awIdJ1GMtvubnDdWynH0+WnW+iXkMxddRuXDdQ6p/RRVWXci77HQK8xjJafn12DFV3uJ1YqryY9PKXDfpWRJoJ5Mn749g1Ng028jkDCCJiBgeZjj9KOVDcmazK24MNzHHTKjn2zUf2m58t1NoU9GklU/oKoCzu8/PBagls52lv61PK95BGCG2KP+ecSkfkadibjZEunbIt4d2M7vMXJ/Q0pkuoY/mtoNvX95cKAPxxRHqyu20Xj7x1QwYz+lNu74Nw+xx2EkfFNAyNdSl6i3i29vIm80/kKtpeSNg5CL6suP61RXUJYVJjijU+scZJ/RRUf9q3rNwlwS3RWtP6k1Vieaxde4jRiZJ49p6hVI/XNMeaykyuEnHZd67h+dR2+pX0m5ZbEtzjDRqKmmW6ZV8i0WP13Iv/AMUKVgBNjLgWiog6ZC/zpQ0YX/VeUMcFcevsKnFpcFRlYQ390gf0JpJLeULysSv3weKLlke+RhtSR9p/iKZH86f9nm2ZW4Rs+sfP86jW3n3AmKNz/eMn9Kl+zBePlDegI/rSAadNdmXeY5F65aJc/wAqRbIwqcxxuOwCL/hT4ZDb7mlDEdOHWnNIjkAQMxIz8zLildhoZ0lzPHJgQzKF6MsUZqeGR5F3S+YPUOij9BT3t5JHDRQ2ZTplskipDbzcZe3H+4hH86q4rEZmgXBwxUeuQKrSXUSsS0hVD0BI4/HdV6TTzdLgyKPUCFSP1rPm8ILIWPm/MedyQxK357KpNdyXfsRyy2bklblScfdEvP8A6F/SnRtC7b/NaMgY4kJ/TNWbfQktME26SP8A89ZUQt/6DU/kSK3yxxkf9clpNoViGNYm+9L5mR/EmRRItlHHslZQp5wqEZ+uK0UjbcMxqPoMVIYC3CoPfOaVx2MmOODaBG+9egUg8VWhuoriR45bNUCOV/ex9R/eHtWtJYlsqECAjH3R/Mg0g09m+8hOOnGRSuBRfTYJxyuAemwhR+Qp8djBH8jFyOgJJ4q2NJLOGYgqvUeUc/zqvc6GQxaExgdSWgLH+dPm8wt5EM9hbzZEqyPg8Ef/AK6jj0myjY7bSQEnJJY8/hmpY/Dd4rsTfLtPTNmeP/HqtR6LqCqd+ob0HQRwY/8AZqq/mK3kULjT7FlCvaygjkMqtkfjUsNpAi4ihbp1bINXI9HuPM+e6nkIOe6irX2F1yd2Se7ZNTcOUypLA9olCg55cioJ9NV2J23TnH3Efcv8xWrLp85UZO4/7OcfzpjWl6cFWZQBjrgUcwWM62sI2Zd9qw2/dEgKk/juNW5LWPoYYw3puFCWF07BykbMvfeKSW01TeNltbkeplAP8qq/mPUTyZmmxgBlHy/vB/hVrZL/ABIj4/2qrR2es+cAI40TqWS6Qn8tn9afNZTqxIuWRj1Kkf8AxNTp3Hd9g+xQCTe1vGrn+IgmppLMzRgLNIo/6Z5UUW9m3yh53lbuWJH8hT2tW5LfN2A3HP1pFDDaOse1pWYAcbyMfoKrnT027pVWZuzRqeP1q0sL4+4yAHqAWzRIJVkwgYg9tjUkwIjFHGOjIT2wOP1pjxWskLK6iVP4lbnH4Uuy8mAXycDOMjcP61djtWhXb5ZLfnTBHI6j4S8NX8YVtG0+dNxb57fuevGP51Ja/D/RbEO0OlafHAQNsdvZYbHOecjuTXXrb5xtxGc8jeQf5VKVWFcu2T6gkn+VRzFKJmWtjZRhGWzmUquF2h14+mcU5YY0mfFrLEv3i+xc/mTk1YuFhVgBNOB1zj/FTUkNvBMpLXWR0B3KG/RRUuRaRXlsgmJPKlw38OVH45AJqOGyKoS5njLd/Nyf/QRWiIUjz5bu+euZM/1pjeZuBj3BfRpABU8xXKVlsxApaM3DMfWTIqu1lL/CZIxuyVaQ4/LHFX5BcuhKRozZwF83j9AabHb3YYmXyIvZZSf54/lTuKxSh02OEsFB3tycqrD8DipI8yOTHHuZTjgrxVyS3G7dvjjfGDgbqdHZ7Y/lXB9UGM0rhyleO3m8t43kRC2eVUbqgj0ycdZ5CuMZMa5/lV6S1jVQH8xvXdwRVT+zbdGZ0Mhc/wDTfH6bqVwsOjtzEcEq4wMuQBz78VYjTbINrIg+hx+FMNmSCxd3TGNmcqPxBpPIdlKrKMdlAyR+tBRK0p5BK9c/dyD+tQXNsJf9ZGJSw6Ku0YpjaQGbc7zozfxKF/rTv7LdGI+2XDnGPmZcD8qencjXsRS2sEaqPs6x4weGHb8Ki8m1kRxJECuc/vMMB+lWmsmyoeeIxqPutyf505rOOFCWnhRDz1Gf507ruOzM9bXTI2/0dLVGJ5/djrj8KJ7eFrch3t2XGfmQ/wBDRc2rTKv2a6gKZyC3J/lVdrW7YNF/a/lr6CJG/pV/Ml+hWm0C0uIx5lvbyxdQpTP9aqN4d0+M4XT7TH+3DzWwum3Cx/8AISnmI/uoifnwacJPIUJI8jsO+T/7KuKrm8yLd0Xrm4tox5cokidv4g4H65qlDe2sJKRamsfPJdvNP5VqLN5nyxyKHH/TIY/lTJ7xoVwu4kH7yQs38lrO5QiXly2fJv0AA6m2IzUUn2tlJGrOhJB2rGuP1qOZ9QmYiOSA5H3WtXY/qRT4YbpowDt3jr/ogUH82osK7I5JJ7Zgj3nnOf43VR/IVC2sxhWR9QtlI+8WPP8AKr2JmzmLJ9SFH6Ux1G4LHFb475Kg/qtNWDUzY9QsrjIj1VN+edhz+mKmW6t4WZpNTeQL3Vcf41fENwqjyhBt7qGH+AqvMswXLrCFzyobr9arQnUT+1rZVDG7jAbp5j8/lSf2lHKw8u7hb/Z3c/zqKSd5GXbbQuvbLNgfhtqRZn2ktZRhh0K96LILsT7cyOdtyoAGPlZT/M1F9rMjfIzXA9DKo/kKrXF9P8wXRmcqedrpn9WFM/tBokBbT/JY9mAJ/TI/Wq5SeY0lnuG2n7KxU9NjliP6UNeT8iOzmb13ACqieY37xLKLf7H5qRZJHUiSzz7b2B/nRYLl5ZLrn9wET/akAxTWcyL882V7ASKf6VSLRlRutAP95yartMitlLe3GO7bj+lOwrmptSPAVWAP8SruH86ZHb3GTtu2Uf3fJqvHqEqINogjJ6fKf8ambULkdQHA/ucf1pWY9C2tq/aaRh6bMUNbMuMiRvwBqh9ql3DOASM4ZiP609ri48s8xqcf89h/hRYd0X5AVjyFmfb2RR/jVG61QowH2fVDjj5YyAfxxioI9U8tvL863Y9x5wz+lNk1S6VlEVpbTv3/AH5Uj35FCixORfiUyDLxXQDf89nH9BUu1IWLYust0IUkD6YFU49UvMgSWkZHr9oz/Spjql0q/LaREn/p4/8AsDS1BWEmL2siyE3swb+DywQP/Hc/rVhb1sj9zMB6eUd38qZHf7jukigjHceczEf+OipzcRt/q5FxjvnH8qkodHeEsMxSD/eTB/KmXF9cKMxQrJnjDNt/pUT3DKvLqQf7rH/Cq0l7HHgSSYHcM/SmkJssLqF/uw1jAR6i6B/9lqZbiWQ5MUX1BLf0rOt9RRmysDCLPDocg1b/ALSjcEo8e70Lc1Qrlr7QI8B15/2VNRs0c0nKsPoxFQf2hggnb/33kGiXWIYtpMeW/wCug/rSsO5K3kRqd3mDH+0SP51Ab6GFSQtzKq9cA1YXVoGwGiyD75qQ3kGQvlED1B6VJJVj1GB22o8kffBVqkW5kz8twV9gDj+VWJNQjhA2pu+nA/nTDraHjy2J9F5oLEa5k3AtImD3alW5bdjfFz120yTVLXOJISD/ALSk1CNVtmzgCP6xn/CgDRScr1IPuGqQ3R2g5Vh61QS8jkxtIbP8SrgfrVmN1XHzbfYgUWFcnS6jZgpbn2zTn3lfkGD6kVWe7tQ37y4VG9PMApF1CzXlZ43X3kzU2GP8iZfmLIfXC81GJHt2Ll1Pswpf7U08Njz4cj+HzOf501r6xYFjNCB/tHNUAk3iBLdf3kyonsp/kBTrPWor5C0N2CFPQRuD+tPj1TT1XCzxgeq54ok1KKQARzvvH8WwsP50WXYPmTpfBiN1xv4/usP6077UWXKsxU+qk/1rNlXUJdrQ6jDGP7r2hOf/AB6rsX7tQLm43N6hCo/KlYpMd9qKkgSMh/GnPehVCl2JznrTI47SRSQ4b3yanEVmq5JXnoWP/wBap1GOtdsi5LODnPDHFWWMXVnUEDucVAtvDtYqwYdsNinLbRqxYwSMcf31P9KyNEMmlsonBNwoYryok6VFDe21w3yzvgdo3NWljimYZsMdiXCf40N9jiY7rZYwvrKij9DRfQdtSTz40UHzWY++SKdJHazRgyRI/wDwGmLdWqqdhgzjIH2kH/2aka4VkyFQjHB80Y/rU6m2g3baxvxbRhe2BUpitJP+WaqfaoUkj+XegJbsrggVL5lqwwcBvY5paiGXMKeXiGEMR/tqoP5iqE0dxIqoLCHd/t3Q/kFq9J5TLtQB/YqTioJLfLjNukgA/hwv/wBeqRLFhtLzcw+zW8cW3+CfPP8A3xUyaa3/AC2GxT0KyNg0JbxqBstFbnJw7GrKRyrjFuET1ZmP9altlJIrNpOFwSxH1Lfzp/8AZMa4AC/Qr0qRlnXP+jkDqGWQnP60eZcfebbH7M+6p98ehXk02dVOyT5T0UR/4mmJpc6qN0jRnuo2j+lWZNRZeGVWHuG/oKjbUoGbaFUsOo2tQuYfulV9Hlk4SVY2zyWVW/pVeXQL7cFj1YpjnBgT/CtFtRhj5aONSeBuBH6mmnUUZuUiOB1VSavmkibRMeTQdWSRX/t0Qpj7i2sZ/mKnt1uYyUfU5ZeMfLag5/IcVpf2kDj9yrBfWImpE1EZG2CQD/ZiwKOeXYSjEoTGf+EO46fNHVV7OSRv9WWz1yBkfpW0uqTN0tpcdB8tMkv5l4aKZOP4Tg/yoU5dg5V3MWTT7tYzxj221Iq3EahWE7Ef88k4/nWwt9Fuw7MAO8jf/WofUrRTjzIge+T/APWp87vsLkXcoMpU7iGz9cCmsVJ42A+gYZ/HJpiCDy/kgmYem0/409bNZORA4B9UT+taGWo2ZrhlOBGP+BLn+RqrItxuUoiuAM8SIBn/AL5q6tvEq43XCgdvlC/oKZJb24Xb5mF9zQmFiNJHMe54kz/suCB+QpGmcgHbEMeqk/4VXhs9PTe8ARZO7KCSfzpzRrIpAldM/wCfSnoTqEt+UXcTAv8AtMpFEeofKWWSAgf3Qcfnim/ZHwQLrZnvj/GoFsLiMZ/tRj7FRj+VXoTdll9QnZdzLA4z/ExOf0qNdQ3AqI0HptHFN+yXzYYaihGf4Yf65p8ltPx/pW49csAP6UaC1ElnMa7xDKcejjFV5tSuPJ/cafJce3nIh/Wp3tZduHu42HptziopopTgefuXvtyP5GqVhO5CuoXMkJ3afNC391Zo3P48/wBaSO5ZutpdRL/tsnP5NTntv3wYyurdvmfH86RVnkbIkjYf75B/lV6EkazMrE+S6p6tMp/SoJJoBMd0FyxPO5MsP54qZrO+HzK0OPRmJ/WmGz1PcSfJIP8AdOaNCXcCwyreRI56fwgj8zTGaffn98BnJ2mOkbT71gAI7Uv6uopkelamrhnltEH9xIQRj65p/Mn5DZLWK4k3S3V3AR/CJkXP5VLDa2c0hVbyUFRgr5xb+tKNPukm4lDBu7BQB+lPhs75eFkyO+2YD9MU7+Y/kOWC1hG1J2z28w8VL9hjkw8bxMw6/KWzUM1jds+2OWED1Y5P8qkhtbwfIzqUxy6vj+QqfmNehItjJCuQsGfZZB/U1EFjRmXfbxyZ+baXz+tLLp93Jkx3UkZ7fOCP1XNV5dP1U2+1LoSEc5edk/8AQRS07j26F8InVZv/AB5v8KiljjDZabbng7ixP86qWFnqMYzcMu7Pa5kk4/FR/OrR+0RFvMnhx/uHP8zQA42ls7AiSTI7mQ4qRVh6FsoPcn+tVvtDN8qTjd2ZY/51UuI7qSTCai6eqi3Bx+lAGwY7YuGBHTPf/GmTeWR0jAP+xzWNJYXjKf8AiaXQ4/hijH6GmJaajkf6ddMvvHGP61XL5k38jbjjjOdgUv8A7v8A9apfs0irkqwHfaP/AK1ZkMNztzJLdOw7Aqo/Q06O3nVy6wzkn+9MT+mamxWppNAVUbnk+hUY/lTNsXB83a3sD/hVN4bll+aOTJ/2zn9KgexnzlVuFb1E8gH/AKFTsK5ot9mbOTuP+7/iKjhCNkLbKEX+MsvP4YrPki1eOPdDIiH+9MXY/wDoVVIrfxO0hZr7T5VbgDY2Rx7mny+ZPNrsb7SRfeVJGI/55qBT1uiwxsuc+hyf6Vh+X4pEHF7p+71aEn/2ap4X1gRH7TfWat2ZQEH6tRyhzF6ZlY/Nazvn/YbH86I7dZMMLKcA/wCwf8apw3V6q4+22sgznJmPPPtQdSvIWZZLyzQ+9wcj9KOVhdGpHajap+zMuOzIf8aVbVI23fZvMJ/2BWJDqgOUk1i2VieguQMfTIqdbqMsETXERvqGP6HmlysOZGx5MbPn7OkZ7/u6j8kSt8scJHfchzWbb3d2rOkmqqY/4D9mdT+JyRU8Fx5khUarGXXqqxmlZoq6ZfW3yu1lgGeypU8cYX5dw3H0BFVI5PlJa5aVlPUKVBq2t2FztaRj127WP9KgtE8bSQgASfgwzSNIY1yZ1Qn1XNQNfSHBWB8995x/Oq91qNxGwb7M7J/szKB/KlZlXLxumUrgxv8A7QTGaf554Mke0j06VmrqE4AdUUZ6hrj/AOxp0eqPv245/wBmTP8ANaLAmXpWEibliWQn2P8AjSx3LYwoUfWM8frVT7VcMT+5LL2JYCmG+kXkwqoAydzHn9amxVzYiuMKN+PwBH9asi4gfJK4OP8APesW3unkVWaPCt0KuuP51YWY8qWjAHcyJms3E0UjSjMbLuxCMDkyZH65qFpIyMeZbDnI2sTVaO8t4W4vLdZP7rzIP6VJJciRC3n2+Pd14/JamxoncZLMkxZI5VQn+JFGf1FRf2Ww5N5K+e6qg/pUkkn7vMM0Mrf7LgZ/SoJWuJwowY4x12TjP6CnqTYlXS+q/wBoTIM5PIH8qjk8NxzNkajfAk5xHcYH+NZ9xDMsoKyakg/6Y3BAP4U9ZZ7bndqkrD+/McfyqrS7kXj1RZh8LfZ5CxurwA/9NmNWF0Nl5WW5l9i7fT1qjHqWrsxC26BP701ywb8thqRdT1FlCmNg7ckgsw/PZR73ca5OxNJ4XtZlUSWlwcH/AJ7OO/s1Tx6HHb7hFbsv+87n+tU49W1c5WW3hHP3lkk/+JxV+O4nWNSVOT1+fpU+8i04Eb6IkikOkmf9nd/8VVX/AIRu2zk28rE9WYkf+zVLcalqO793bSOvr5gA/lVeXUL1iQ1pMpA6rdrz+gprmE3Esw6ClruEReMN15B/mTVtbOZsASsV9MgfyrHjuZ942wXLt3DXWcfpVg30yqdyMh7APn+lL3u4Jx7GhNpkgUBGw3dmnZab9guIcEuhP/XRj/WqUV/KWwVlY9/lJFSNqVxGV2wHB65ByP1qbSKvEfdadcToP9M8sg5+RzVBtFPmea+qzBs9POGP5VZmvLx8A7F/vblpm6XcCwDjPZRV6kXXYeun20R3G7lmbr13D+YqREY5xLJ/wCDj9WqDc44WNVPrgU9GlC8uuO3b+lPUWhzsdn4+UtjULAZ/uws39QKgu7fx2sYdL2R5E6KlpEFb/vp8128dwjHDNJn1208zA5Hn/gU6VTq/3UQqK7s8/bWvH4tlWPw+t3cH+K5kigT/AMd3VmrrHxYkfcdJ0K0VeAjSySt/31hRXqLFRwH3cYxtpm4s2CP++ulUqy/lRDpN/aZ53BqHxIRCZbfTZj/dij2j8yxp6a1493DzdKs8984/+KrvS56fID3Ix/hUM0q8ggA+o/8ArU1VT+yhexcfts5i31Dxc/8ArNMs+nA83H+NWobrxEy5ubOxjOPuqzv/ACFarXkNuMvNgA/3jk1E92jR+ZufYvP7tiSfwxT5r9EHLbqzKkvtVhRjLaQE9cQrIx/lVWTxcbcfNp188n/PNLN/8K2JtStpI2b/AE7H/TON8/yqBbxJSNh1Nyv8LFl/QimrdUTZ9GYj/EKWOTZ/wjGtHPSRbT5f1Ipk/wARLmNQYvC2sTyZxtWFE/HLPXSC4bP/AB63X1aRefzNODSPy9tNj1yMfo1WnD+Um0v5ji7b4nalNMwuPCeo2Ma5w0lxC56+itUsnxUtIX3XFpeWyqOd0AI/MGuy2r94QKP+AgVEVRusC575AI/lT5odURyz6SPOtR/aB8L2KES6g8Lf3fsxJ/Dmstf2lvC07KFn1VmJxtj0wnP616beaVa3GA9nbSD1MKt/MVBFoVvDJmG0hiP95bZRWsXRt8JlKNe+kkclZfGbStQm8qK111Txhm0ptpz75rqbXWkulBX7Ym45Cz2+z+lXHsbokYuGjyOixpisy60e6u7gEatKgH3o0hgIP13AmofJ0VjSKmt3c0ftDMCV87d/dZMD+VSecsiDc8y/7oA/wqCGxaOMLJOX29GZEBH/AHyKSSzt5FAkdpOfQf4VGhtqWlvFRRzOP9plzn8qcZxJk+Y5Hpnb/OqDWNrb4MdssjHuxz/WhVT7xWOE553KD/WkTdlyW5ghkUO2D04mH8qk+0QH5d4YjsXBrPWxSaTzAYZGHQiAfzNMKyxyYRVAPU7VH9KLBzM1FmhkBwOnsP8AGhpYQv8ACo/2mwP51klpEO1riGMtwA23NV32mY+Y1vMv+0iH9cU1EXMbBkj2EosRB6newoju43Xb8gHtITWFNfW9q3ytZJ6BlVcfkKDrw4UTWrk+kwx+iVXILnR0u2Pb82MEfwniot0cfSNjj+6mawY/EsMWVeeJfRV3t/7JQfGFrGpzNuPtBID+ZAH60uRi5l3NwzIy58qbH/XAf404GRk+SSWE/wDXAf41iweIWn5SHcmOGJA/T/69M/4SExyEERknryc/lRysfOjoIVlVP3s0kp9fL2/1prYXjDtn+It/9esePWnbDJBI/OCVYc/geajvPEl7ZqwTQb+8GP8AljtXP6ijldxe0S3N7y0bGQR64J5/WnwwwxschvY8/wCNclZeMr+6mZH8KarCR3lkT/Gr66/eyY26Dd9cMGlXim4SBVIm8LG0kJ3JIV9mqrLoOkXUhMtisrZ+9IDmqY1RpDvk0+VADwXkAH6VI3iARqWMKlR1KuSR+lKzDmTJv+EX0jzN/wDZlqN38TQqTx71b/s+yhQL9ngjUdAFWs2HxJFcMR5EiDOA2C2f/HambVIl/wCWUjjtuQAfyo1C6JZtMsZ8+ZZ2bp2aSNDVT+wrDcCgsYcf3LZCR+OKsR6jEynfafMfof8A2WrMN+NuBbKB9P8A61K7CyGW9jBbruMscikcMIlH9Kn32wXrGB74/wAKDqCrx9lkPH8EZYfyqJ7yMnb9kdif+ekeP6Ui9iWKa25EcsLHvlhmo5TbpucsUH3SyzED9DUJjtjIN2mISeuCM1LHHb7iBpgVPXdkH8M0CEWey3AI8x9/Pcg/rRLqlpEwBZx6nf8A4tmpmMKIC0UUaqe+B/WnwahYNIAhhDH0lxSuVqVf7es16Ts49M//AFzSR+KbA/KsuG/utn+ZrTju4ZFOI4wQcDa+403ezYP3h784o0DUrx6oJGyp3Dsy7T+dWU1aAupLqO3DoM/Wjb1PkoS38RRf8KXyBtG2O3RuvCYP6VGheoz+2NODEtKilTwTKp/mam/tjTI1RZJEO/8A21IqHZJGxdlhI7nBGfzpf3fmYLQ9c/MwyPpxUNIpNj4dU0kNhWhBxkDYCf5VcXVkkk/cXSKP7otgR/OqYaFZFLuit0BUKT/KnokcTblm3ZPHyoP6UrI0TZYm1SeLgzx/8Bsv/r0fbZT8zXqKvZfsLA/zpGkk5XeD9ZAD/Ko8leWlcf8Abapsi7skk1aBWCSXhJI/htGpY9Ss5FwGeQ990RA/lTVvm6eY2Og/ef8A16JrghfnlwD0Oc5/WiyHdjzcQ4OEYj0EWf6VBJdIVIWKU7f9jAP6U3zponIE8Kp/d+cH892KmjmHALiRm67XI/nSsTe5VZt67v7KWQeu1Af1qaNmK86RsB7BUP8AWkbUvspw7RoB/wA9Jz+vBoj1bzpM/ao1wOPJm3fj92nbTYE/MmVCxx9kKL6CBT+oNTLCP7jL2x5ZGP1qs2pRksG1DDdT8w5+lJ5zyNlLqV8j1A/WlysrmRoJar5e4uw+o5pn2VWwRMwqot5tAV55B/wNDT21C2YbvtPPuB/jU8sh80WPaEZKm5I/Hn+VUpN0chRYpZB/f84DP4GrA1KOFgTdRkYyAUI/XNQjxBFJICl5HLjqFUnH5VS5hOwR28c2MlwR2MgP9KelmQPm+YZx97FV5tciRgsl95bsfu/Z2/8Aiah/tyGKRUkvUZs5CmNsn9OKq0idC/8AZwzEBEVc8bWNRGxUHmaRD6Bv/rVHJ4kgj3M0q5X/AGCPxpo8VhhmO4gC+6N/jS5ZBeJfSO5Zd+1iT6j/AOvR5Vz8w3NGPoK018v+GSNm7qan2hk6j8BWfPYrkv1MWOO5VcGdye/y5xVeSO6jHF2C3o0RP9a32ji2Nzhu+DiqzwwN8xO3/gVCn3DkMbdcLkG5XI9I8f1pshu2X5J8H18sH+ta3k2rZXzXI/2XIqtNZ2rfKXmx6eYa0U0ZuDMpf7Qhk3SXUsif3FgA/Wp2muVyUjZzjoZSpqSbS7IsGzKuP9tjn9aj/siybq07j0JNacyM+VlY313Gf+PQt7rLmmT6ldQqGaMImOc3K/1qZ9D0xmIeKVz3UuR/Wqd14K0G6wZdPEg/us7f0NUnHqS1LoNbxAnlg/6OfY3KD+lQr4ijlZiBZ4H3tt2hI/SiPwXoFp/qtOt4/dlLfzNP/sPSlyqiOJsY/dxhf5Vr7hn75Kt+sqBjsP8AspIrUovPmAVZtmOigY/lVf8AsvSsFPNmYdMCQiqc3g/Qp5Gdkn3HqftMg/QNSXKGpoyajGuVaOUnP8I5/QVF9ssrziSKT0+cMKqQ+D9Et5FK2Zkx0Z5Gf+ZNTx+HtPXhFxznlR8v0wKPdI94b9t0yAk4RGHXerZ/rUkep6fJh45IlHrsIP8AKl/s6FWJaeVQTjhQBTW05NpWO5kT/gQP8warQr3ix9sj6q8ZHrg8/rTjdRbRlFPPJxVNdNkP3rxpB6Ptx+i1L9nk2hVaMkflU6Bdjm1CDdkKuP8AcJpn9pwAlvlHb/VmkWzu0LEGEZ6Lk4/nTmS73ZAjB9Mn/GnoPUbJqVu0e95k49Q1LJqVmqp+9hIYdfKJqCaHWmb9zNborD/VyQ7v1zVX7L4mHIu7Df2CxY/rVadyed9jSa4smVWYoy44+QgUwxaY2G2xsx6/KR/WsmW18YyFgLuyU5yMQbv/AGcVE1n4uVcPcwE9sWy5/Eb6OXzJv5G9HZ2JU7Lbt1X/AOuac2l2cqgPbBhjg7d1ck+k+OLhi39pWMQzgKLIg49/nNWI9F8XKVU6lZ/KeW+x5Y/m1PlX8wub+6dBJodlIqobZBjv9mTNSwadDbthIxEOyCOPH8qxjo2vfMsurWsm7v8AYgGH4ikm0vWFwx10KV6J5Cgf+g0fML+R0H2eJTgopPvgUrW46CLH+0rgVzi2Ouszf8T2EDsptwcfyqc6ZqO0b/EOD6R2yZ/XNK3mNPyNmSzdVAVSR6PKfWoZLWbzNvlDbnHFy3+FZTaXfNH83iOZj6/Zkz+gqxb2MkTbJNZnn75Zdv8AIUvmG/QtpYlsiSFwe22Yk/8AoNOXS41XP2fzCDnMkh3VGunlWyb+4JHTEvH8qhkWK1RnbV7oAdlcMc/TaTRr3HZdjTSAKnEaxjrjrS7um1mUn+6v+RWVBqEMwymp3bnH3WgP9QKZNJJIqldSuIT6/ZFP880WA2f3jZ5B/AUbmxyjE98KTn6EVjQRiA+dNrjMM8+ZaxJ/JaureW0i71vkmT+8Cv8AQ0rDTRb+ylVLKCrerbqb5jo4BG4n+4r/AOFQrHEzbo3Ab12k5qQyE/e3swOBtUkfoaYaEzLLImCzq3uDn+VPjhm8sgTBse5FZ90omUZN0uOCELoPyqJbeJWAC3p3f7x/UmgZpLaS+Zk7h7iVsflThHLH90ojdi+4g/rWfFawljiK6JH9/dUlwkQjH7mZyBwFL5/nUgXTJc9WiDE/xRxnH86mVmf/AJZkMMY+X2+tc3Jrb28hzo2sS8YIhQMP1YVWk8TXkYTy/C2uOPTMYP4/NT5X0FzJHVAyPuBGefpTZFuY1xG0K5/56OR/IVzsev3TLvbRNTgY9mC5H1xmpl1e4baXstQJPTaMj8qXKyuZG3b/ANqbsFrBkPpI5P8A6DV9bedf9YU5/wCebmuZg1i5yxbSdQVc43SqAv8A6FViS8vTjy7eIA9FlYr+ualxZcZI6AwzxklRuHo0h/wqXyZMKzxKwPpgkfjiuYjutWXcx0yFAP4vtCtn8xU8esXzbVleK2Y+pB/lis3FlqSOh+yh9r+SBz3C/wCFS+Uu4jcyEc4EakfniubkvtSicY1LTo16kSRZOMdQd+KoLf6vcTL5fibTSG6qlmGP4fPU8j7l88ex2cy+Yu0XFyjZ6rGgx/47QY5Gx+/kyAMhwn/xNchGuuRu8s/iSGSLsq6acj9asQ6tdrMwbW7cL0CyWDLg4z60OLXUamux00ivJgCRVIOMlh/QVBJpcszEtPBtb/ZBP5msyzuLyRWYazFNv+6sMAA/U1N9p1BlwlwZCDg/6MpY/ju/pU2ZV49UTy+H5mkVvtEI5+U7Af0xVRtCXzAZ75HOTkCMqf0x/KnySX7ZYXMg2n7ptEz/AOhVagluY0CySszsNw/0VR/7Mad5E2iymNF0xW+aVQSeQ0xA/Imnf2Hp7Tb40sGGcH5yTj3rSXUpFba4O72RR/Wo5NX+znlJmDHOVhDfyFLmkPliVJPDtrKy7Y7PYP4RCGP4ZFVv+EEtSrtIU3M2crEqn6dK0ZPEJRgVsZnHYxxZ/rTP+EinY5Ol3WP9qEc/+PUXmHLTKUfgvTYXyB17+YtTf8IzZRMrBI92ezZqZdU3cvpc2D3FuP8A4qmTeIIrfP8AxKr1wvJMVsMf+hU71AtTQkuluFZUnhXsAV3VXXQ7zy2A1PKY5VYIx/SobjxxaWykvpOqgDnizJGPwNUJPiNoE0ypLpuqbjxltPk/wqlz9iLwvuba2M6qFkkXAGcsigfzphtdqjBUMeuAhH+P61RXxdo7ttS2uto7SWrD+lW4dWsplLiyZk7ExY/Qii8uqD3ejENkpkLNLA3G0qYVJ/E1IlsAo4jb2SPAFTC/tI/uwIhxnBCjH15qGTWrfedpIHtG5/8AQQRSvLsVZdzIs5PHsbFpf7EdcZAEr7h7ZI5rUtNQ8W5bzRpMaY/g8yQ/piq0msapDCU+zSXMi8N5eQBz2J2g1zF9488T2AuPP8L6lPDH/q3tXDPLz0CrJ/MitOVy6Ix5ox6s9AW91ZcedPa5I/5ZwMOfxJok1DV1YfNavu/h8l/5gYrnvDfxCu9QhRpdG1mxTdho7yIh1OOgGDn861pvGq28yrcafeRg5JeVOMe/HFZOLT2NlJNfEWFvtUOT5mmRn/ajlz+PHFWRfTCIGRoN/fZkj9cVW/4SyyeMb0ZI25+4w/pTz4isWXzC3ydMiFm/pSs7/CVp3I21KRmIAhz6tmqdxdagrcWtlLxw0kjAt/47VuTxPpkSkm4VDkfKUw34Dr+gqKTxNpcY3vKR2BETn9ADVr0Idv5ilHd6qkuH0/T0B6BJXZv/AEAD9aste6kqqXsIOeu24C4H41LD4i026lWOKeQk9M28q/zUVb+0RDcvmAZ6/If8Kd/Ijl8zHk1G4P3dOVueWaeMf1Oaf9r3YLwxr77v/sa1JLy3hXcbmNB/tYH86rSa5pyt819CFx94yjBp38ibeZmT6taxggxhyO0cTt/IVTXWInIVLVyx6AQS/wAyta0mqWLL8t5uJ6GEsR+hqq2radFIyPqUYburk/1NaL0IfqRnUgygKjJjruhYD9SKBqEe0fvY8nr8jA0n/CQaP9wahCT/AHQCaG1PSeMzqRjoqP8A0FO3kRfzCW+gVl3NAV6/NnNOj1CJt5V7faOrbsAfpWc+uaCCS1xBjv5kb5H6Vn3GteEb47Zhbzq39+KTb+i4qlHyE5W6m7/b1krZF5alM4P75eP1qT+27Rlz59uo/vCQEVzvneFI4dsVhFsz0jsWI/lSwXfhaQMy2qiQdmsCtVyLsSpvub8euafuw1/b7u3zgVK2u2JyDcxsfTcvH61z8lx4XkjG6aG29d0Kr+pU/wA6jTS/DV1HvS6eSPs0chUf+OilyofO/I6T+2bVmCx3CEdc4BH50f23axAh7uAE+61x95o/gy5zbXNyZXbja0su4fXmqqfDb4dMflsrN5Ac75JGZj9STmnyw63Fzz6WOzl8SWCna+pWkbejSgEfhmmjxBawqXbVLYx/7OD+ua5dfhz4JhxI1taJjkFnA/rVv/hE/Csaq0bWqp9Y/wCdPlh5i5p9bG63iuxZTjUICMddpqEeJbbedt3bsMZG1WrIl0jwxb8G8s41PTDx5/WpBpfho4f7bbkY27hMg+nQUcsV0Dnk+xvx6tDJhRNGG7cMP6VM1weA1xGo9pP/AK1c8ul+H5G3G5jLL/emz/WntHolvwNStUC/wySJxU2RakzpdvmJ/rpCP9k//WpFuoo2wJRx3NYX2XTLjaPtsLH+Ex3H9AatwRQRZjivIy6jjcQf65qbFKRom+hXJB5zjODzQ19GxwcEj+F2x/SqTxNIvz3FtK45J2DipVWJ1AJiIx1U4/pRYdyXzYmzlYQx6jcT+tAMe0hYIsKc4V8f1qt5aLkCEv6cjmopFeT5TpLOM9PMUGkhXLryxbRuSMJ3LS8fzqP/AEBh5eyBsdlkH+NZglZnKy+GyAB3ljIP51J8uR5mhJt7bShI/KqsRc0fstn0+xRMSOM7T/Mmm/ZoY0CtYQ4J5ARf5VSmhinQN/ZDOFOQD8v9aXesbbhp7KByNr//AF6Vh3NMLbKuPs8SDocquP5Uq2tjGQ0cduh65Vgv9Kz1uoF+Z7JhnqzNnFIt7aTs4EKtt/h2mpsVc1TGuzfG7SE/wrMMfzp/l55dZFYjgeZnH5GsRptITDyWhy3HywuTn8qvQmwZQY7SYH6Mv5CmC1Le0HkB14x95uf1oECbu5A6ZL/40iSxc7YJlA/P8iakWZGUsI5h65Gc/TFQWiRfu87gex3Hj9aZvG4DzSpU5znn+VSRsG+6ZMf3WU/4U4Ou0sqMx+oFSURNdHBUO3HUqwH9KEueCQZHJGD/APrC1ZjY7dxiaP1+YGnO0W4YA5Gd3T+lK47FZLtIlPmmROeAzkj+lTNewnb+9GOwLVIIorjG6KNgB/G4NLJYQSAuLW0JHXcFJ/lU3Q9RnnQ/89pOeik06O4hTCPJJIfRgCP5VKLMLyttHwONrAD8qctmjgZCeZ1+8T+maltGqTIFmtS23aqj0OBTGurKMkC4eM+m7P5cVd/s6HcC6w/ipz/Oj7EF+61qg9kOf50cyK5WZgvLctgX84H1HNINSgXP/EyZW7/J/wDXrXFqu3/WxqR/dXFQT6bazDLXkyk9dsjAVKmgcGVYZIpo95v5pMnIPljH51JHCGBCXbMvU74lK/rTJPD+mSf6y5nbjHzSHB/SoD4N0DzN/l4bGdzOeafNHuHLLsBs1Yn/AImCZzxiCIAfhUrR20cZJu9u0g5jVV/xAFRN4T0NtrmNWfs2c4q0mi6fCu2LylH05/Si8e4lGXYgWW0Zj/pqgkcfvuKmW8to/v3EanH3t45/M1J/Y9ngstxt+hNMbQ9PZWL3L4/2ZWH9aLx7jtLsMW5tGY4u4nf0XAoa4tvMCmWIP1IaVc4qWPRbBVyJnI93JpZNL01tquxYe8mP0pc0Q94oyLpeAzrbhWb73mLk/rTWg0g52Qx9P+fjAP5NUsvhnRJZFdrO3dl6MSCf5UHwnopyV0m2kJ6ttUZ/SqvELS7Ihkgs4Y1ZbFSB08u6/wAWqWOVTtxEEf8Au/aV/X5qafCmlR426PaxnuVPNOh0a03FV09Qqng54p80SeVkEt/JHICLOQktjCXCn/2pUc11dSkD+zpJQx6mVf8A4o1ak0exDFvsEO/PXaKiOm2i5aGzk9D5ZI/rQmhcsiDyZ95L6dbMp64I3L9etIEvSi/6EBx/yzijI/Ug1MtnHBkiKdD3wSc/Xmlkt1kcs1tcsT3TIH6GmKzPEU+IPwu1S6E6+NNFjOArGbyI3bA6k/Kcn6CtK31b4QW9+Lt9U0y/m2bgRfeYhGcklVbB/nxW/qHwZ8O3kaiXSbaJ3PVNqn69DXM6n+y54Q1B2+0aas7Mc5cEEHGOcYOMYrt/cy05mcH7+OvKj0bTfir4Xk0uKTSNU0uW0UYRY7xY8du5yK2YvGVqI18t7Ziwyq/akZWz7jrzXhmm/sl+E9NYvb2Xkuc/8s87xnjINSt+zdHa30V3plxJpkifKIo1+U85yQ2R+WKXsqXSRoq1e3vQPbbzxpYabbhr547aTaWKs5YDHp/+qobLxFDrNwVF5YT2rA4W3hkeQ/iDx+VeMX3wr8bszNH4gAILEMttArKPTcUORxXPX3gX4qxsxe4tb6EtlljjMW4E55ZSDQqEHqpCliJreB9Era6X8yqupoxUj92syjr2wK0v7NsrpULrcbVHQ3EgP5AjmvnOzm+Jfh+8Uf2PC9uwBbyr1gxxwAPl/mam/wCGgvGGlN9mufAOuT3ELbmW0lhVWX3LHJ/IVDw8/ssccRD7UbH0NJ4fsPmK/acds3k38t9Eej2ES/KHJ9XkZv5mvCof2lNba18+4+G+tWyEZG6VJGOT6LWppv7ScE0mLnwV4jteOXWxLj9Dn9Kn2NVItYiieutpcDHOVA9PKDfzpG0m1fJeGNweMmBR/SuL0341aJqAMj2+qWi5xtudLlQ10EfxA0CYA/2tbov+2Sn86jlqRNFKlI0W0Wz3DCEDGMKAo/ICq03hbTpV2ujOP9p+BTY/GugTNhdbsDj/AKeE/wAakXXtOueYdRt3X1hkDU/fC0CtJ4R0p1GYBkd1J/xqH/hEdMViUt/mP3uf8TU02uWcec6tbx8/8tHQY/xqrJrVntV5NYt1Rum4Jj8Ktc5k1Asf8I3p6cLCue/Cc/pTW0CyHD20Uin+EqP6VVj1qDaG/tS1kjJOMqqj880o16wYgC/sWk9FkyP0NP3xe4Sw6HZWrkw2ECE/xfIv/wBepP7JgLbvsSSN0z5in+dSQ3lvITtuLYtjJ2yYp80vmKClzAwJ6mXj+dL3xWiVR4dtd277Aqt6qq07+wbWT5vLYFTz8xqR4pWkQrf2+09fnOT+pp32e5Rwwu7cjpySafvdx+72Kj+GbOZjlbhiDkf6QV/QUxvB1i24+VMSf+mwzWksdwBlriMN0woB/U0G1u1BcXm5fQRrijml3FyR7GG/gm02ldlwA3VmlVv5io/+FdaRKpE1sZi3XcwI/LpW+be4VjunU46EqMUjW9yVwJImb1K8fzo5p9xezj2Oaf4XaB8u2zhTHbyVq0ngfS7VT5MEcY4yPJU/pjFbItbkKP8Aj2V++Qef/HqmWzO0kqn4Nj+tPnl3D2cexkx+GLOFcsFIPPKIB/6DSv4dsJFw9rbFM/xbP/ia1BZd1cL7HmiS2SP76xDtlgaXMx8q7GS3h/TVXmG0PoeM/pimjQLQfKos9h/h+Y/zNa7WNqSGaKLB7gUjWNlIw2yMuB0EpH9afMLlRnxeH7WNf3MNvH7pEP1q5FpYgjAcsWX/AJ5LwfwzUkdjbqeCpBPO6Un+tWBGIQfKMIGO7E/1qGykiEWcfOPPT/eAz/Kq8sEcecvJIq8428/+g1eVZWU7XhH5n+tNZH3Jue2PoGJz+FCY2Z3mGSP93uBHdY2/qKoXV1dxSfJc33Ixtjtoyo/Eiug8l1YktAP91SD/ADqWMs38WP8AdzmnzE8pzDaxqSwDZHNOOxKJn9DiqjeIdYjyRpVzI2OoWMD8ctxXa7QG5lYe20f4UiszFhuDem7iq9ouwuXzOAfxFr82wfY7i0/iLoYnXr3yP61J/a2u3ETBb6+XI4aK1i3D8QcV3kPn7X3MgQn+KSlWN5Dwqkf9dD/jT9ouxHs33OBhuPEkbFGudYuAw+8tvDxxxkZqzHaa7JGGkvNWR8DB2oMfhiu1+zuFfMahc8ZkOPyqFtPmbpDbuD3M7j+lHtPIapnMf2Pq8kisdX1WQj+FtufwAUZ/OpF0XxIMga3csMnAa2GR7Ehga6RtNuMYaK2wBwvzNj/gWKiGjjH7xIFl6nbupe0K5DJt4fEFuy+ff3LjoFW2IP5lmzVuRtUjQFZ7iYE8qtuoP45Iq/HbRw8iVVPfEZP86kMbzDKzKfUtDnPtUcxSiyjHd36gH7LPjGWEkK/phqcbi+kjLf2eCD/yzlQHNW44WXapOB32QH/GmvDCdylrgeuIn/pU3RdmZjXV2qlP7Ctocf8APRgufwAJpg1S/ZQp0i2jXofLnIx+G0VrWihlYxSTnB4LRyDP5g1ae1lmUBbpkGO+cj86Lx7DSl3MFtc1GNgsGl8Afc8zcT/hQ2vakrpu0OYk9fLwQPqa1P8AhHrr5f8AiZSEHn5gMfoBVabwbBJIxkeGVj/GseGo5qY7VB9rq7MrObaQP3zuAFTN4mt8HckjMvXap/qKqx+BFXIhuCo/4F/UGlXwTJgn+0bpx2VFXj9P6VFqZf7zsPHjCORgY7GaWLp5isvP4GrFx4knjKLFol7Mh/jV4gF/NqqzeC0kjKTJd3IPVmcgn8QRUcXg1LPPlW91ET03SMw/HL07UxXqGhH4ilMf77R7+J/7pCHH5NVhtct/LDvZXgcjAXZ/+sVmtotzbwssc7Qsf+egJ/k1QCz2t5Z1Kcv6qrr2+pFRyw6Fc0upuLd28m0tBMCf7+Af5VJ9ogfKpFMPdCB/SsFbhbZgrXMmR0Pls5/E05tWCDat60jt91Wt3AH1wP60uQrn8jf8+NQxxKw9GYZ/lTxcwKpGyRgTg8A/0rm0urlmIe9iG4ZGyKQfmT/hVuFbhlGbstkY+UZX9VpOFupSn5Gy1xGpx5TEY/uc0n26zX/WRYf0MZrNFtLCwbz3bsWLDP8AMU9PkJ33bBh/fYf0NRyormLo1CzZiI4dzDrtUf1pftVrNJta3lyf4inH6Gs9/NkVil+OvG0gj8t1KqzyKA8shI/jbaB+ho5fMFJl83NpBn902OxVSTSLeWjYAeUDk8oRVJWkK7RIQf8AZY4/macfNVQ3njd7Hp+ho5Q5i4skTKGTzF44xj+tMMiyMMhyR1ywAP6VR+ffh7wbgR/BnjH0pu9GDFroOM8gRtmnyhzF6RsKxaFsdiJf/rUiSFlG2NiB/tVQXypmI8ycD/YQj+dP+zKfuvdAfUf4VVkLmMq301PJBiDkOclXmLg/TrUzW06qStvtTOMmQqT796ryaWiurLNqcf8ACqCUeX+VJLpr7d0dzdQEf3FA/MgDNbMw1JitxGI3+WKRicB5Cwxntiq817c7mEcHmHP+sZiy/guc0p0W8Xy5VvXZ1BIFw2DntzjioPJ8QLHvOp22N2CGjLY/HihWFqXLTULiWNVns5oi3fbjd9PakkV5Jg/lTNxtIjPQe+DWVMuuIojt7mNbrG1ZfJYpj1IyP51Ctrrqkw3E++XH+ss4ngX6nLMPyqrC5mbbTXW0rHYzOQesk2B+BJNZ9vqVzOsm+wuLeVWx+8jV8jPIxnkUln4Vvsh7rVLgyFT+8MgKj0yNvNalnZyLhBeByOuIlH45xRewWbMj7WqzFJJHiX7uGjUYH+6oyasvp+mSxiQTSwq33njVo2b+ordW2WPrMdvuoz+FDWEcjKz/ADH/AGQeanmY+RdijY6fp1vGwWZpXb+OVi7fmanOjWUqgNDby9wGiB/XGanGmwKuNjLnsSQKX7KsODCoJHZnpczfUrlXVFKTw7YSK220iRu+2PH8qrf8IraxgkNsz2EO7P17/rWm0UhbIBOO2/hagmjnZgRJuXPzYYirUn3M3FdjEuPDN40oaG/VQudo+ynA/DNVW8M6huzLewPjoRa/MT+JNdE1nc7t4k2x9evNIiXO0qCxGc7vMA/pWvNLuZckTmn8HyzMftE4lzzhoI8fyqH/AIQNGV48eXGOnkkRkfkK6RkulP8Ax7bs/wB2Qf1FMa4u14Ng+3+95i8fhRzyJ9nDsctN8L4Lr5pJrp1xjBuT/hVNfg7psc3mJGuf70jlj/PH6V2vmThslnjz/sZ/WnsbiTOJfrvjzT9o+4vZQ7HFx/C6KLJMkL8/Kzbcj8AtXI/BN7ageTqpjXH3ViQj8yua6pftCLlpMp/spgCnbmPIkLfpS55D9lE5GbwvrUY+TxGYx/uKD/6DVePwz4kRt0Xiyb6FIyPyIFdwWldRsliQ91bnH60yT7eVISa1YfwgxNgfX5qFUYvZx8zl49M8XRhQms290c/MZrYdPbDYphbxbbzFms1uU6D98i7vwxxXVbr/AO6Esm/vYJH+NKq3TcNHb49s0+fyFyebOMm1rxgVZW8LKzk4/wBepA+uMVXm1Tx4kUfl+E9JkZmwS19IBjHfAODXayW96rHYlt/49mmLb6oGJYW5ZuhRiP501NdkHI31ZxdvfePJMed4a0OP/cv58j8CnNb1nNr+I1u9Eh5+8be8JUf99YrW+waiOPMTb1Kl8j88U06XeTAhzCv+4GB/MGhyT6ISg11bCO6nKBpLOVD23upH6Gp0VJAXeyQgjlsH/Dmqk2i3sm1QVwP4i7g/+hZqvH4XvIpC8Fy+8nDeZcyEEfTdS07l3fY2VjVSALRFUeoIp/nJH96FFB7YPP05rFbRdWh3LFLEe+DK/H4k00J4hWbiTTn9VKOWH45xS5V3HzPsbkcqNyIto9iMfzpXe2dgXWMsBwCgJH5mseSfWrddx0m2uMn/AJZuBgevNSY1ORfksIM9dryqf/ZanlHzGwlxbR7QEXHfaAMfhmopNa0+N2UzAMPYj+lZUcOqxuWksbVD2xMqj/0A/wA6Dqt4WaNvsUIUc/vw/wCQwKOVC5mbcWpWcwXZcK30bmpPtEeT87Y9A1YcOoDaGlvdOjOcFmCipV1S3Llftlo7f9M3X/GlyjUi75kDbg4c45wTn+lG2zbkGVCe4bH9KqSXimUOsuCB/DIcH8qjk1hI8CS9jU56bzu/kaLD5kWksYsnbcXTc8AsNv8AKrmwRYO1mB6HJ/xrLj1WVlZ4nWb+6WmAB/8AHaa2rajx/oMLju/2sf4UWYro2V8yPkBT/vA/405r2aLAILc9PLI/rWMuvzrjzIljUdd1yhH6rVZvEyGUhbmMseFiWcE/+gY/WlysfOjpPtr87UdfYpx/OiTVvIxvjkb/AHImP8qwn8XQWaA4kll/uoof88UsXjxFYB7W4RcZLs6hR+HWlyPsUqi7m+NaLqCsch5/ukH9RSx6vJIxJgkGO/QVlQ+MraaMu0UiDruY/L+YqODxpp80pUS2Z9hdAH8QRU8r7Fc67m5HqyOxLJHu78g5/SoLjXLayKh2t4Yz1MjEVnt4u0aNWZnhQ92V1Ip9r440K8kMcdxb3EgH3VkBI/D/AOtU8vkWpruadv4q0+5+SG4tZWXjCTCnSeIEX5Rp8879jG0fr/vVVk17RPlaURM2ehXkVIutaS+5ltw79AfLUZ/Oo5fItT/vEn9vSSXAjOhXm3tI5TH6NVttWZV+XS5eTg5Yf41UGp6c7Ddpzj32ofxqaO+sPvNbSwjsSqjP65qXH+6Wpf3iX+0LeZgsmnMWPfGf1pFuoT/qtPbC/wAJT+VNbU9NON0jIx6AygH/AOtUF1daMrKtxcsoYZAaYf0qeXyK5vNGlHfbQGltY7VuyyOoNJ/bURJHmWgIPI+0LkfhWXHqXh5lLfafufdZ2b+oNSm78PhQz3sJD8hTKPm+gx/Sjk8mHP5o0k1S1Zj++tRnusynH4Yp7ajark+bAo/vMw5/OsoWvh8uxCW6yt16AsPwqKTSPD8ilXMIPo78D8DRyLzDmfSxtfa7UoG3Lt7MvA/Q1Wm1CwWPdJLGFXk7psY/Osy30HQmUi3miUZ5CMv6VbXwrY5z5ki5HYD+go5YruPml5E4utPkj3RFJE/6ZyBhQbiAf8uzbf8AZK1APCdizHHnjP3tuefzFJ/witmFKqnnL/00iLmn7vcWvYcb2yWY5s7gMOjeXuH4ECopNb0wKuRcruOMCMn+lSDwraRkGKKOJx/EtvtP6mpxpLx4Ac4z2hGPzovALS6FM3mlbvMkdYyRj99IEz+BqNdQ0ONivnxKMf8APz/SrjaLDu6byepwP60j6PbxAY2BhznAJ/LFO8e4rS7FdLzRXU+VcKTjJKzn/GpftGlyAMs6jj/nq3+NH9kgp/x8bec/KgGfyqFtLhGczMx7hEH9Qafu9yfe7Fhbuw2/JKpz0O8mqVxd2KyEmUDPrclf0xRJpcez5ZpU9xEDUC6YxHy3kmPe3x/I00o9xNy7HPal4kTR98wu47pFZVlRFLsD9BzWhp+qNrtqZorSYxEhVD7kJz3wcUyPTdI0+dTHawxTg7izHZ+g4qa3Sxu3kxIpmUfdSYsAfXgVq7GSTvuNWz86Ro3ku4QucOWGz+ZzUP8AZtlcMv8AxMGLg5bdvGSK2Y7XA3FpQW5PlRg/qeaseWDkj5f7xkjOf51HMzTlMyDTYF/eG4aXnG5WPT060/8AseBJNxWUAc7vOkJP4Zqb+x4nYysIN5Od24hj+uKX7GFfcC5x0Ikx/Si4AzA25Cwy3CNx8zhOP+BUyGHdEAYjEF6BXVv5UrecsilYpJRjBJmAP/oNP+0kkqyXCH/rqWH6Uw1IzCI90jCdyewIP5cVFFMzNzJdIOwdP8KtNcHZvb7VuBxxgn8jSLcSOMyLMFHRptq5/AGi5JE0wjjfN1LuP8LoTj6DFMjvkwoa5wTwN8WPzFTtPDJ96NT7mP8AxpzyIke4o23/AKZxZH6UAVLibCON0MhPRfOKfmADTIVkSFSwhx/sSs38wDUq3kdxgxpJGMf8tI2UGopLpIyqi5tEOeh3fpVkEcl5kkBXX8wP5UNebV+eTyh2wSc/pTri+jhKg6laoxONrOTx+dWPO+UOJIpO27G4GrIKqyLIA6yK5H8RcY/nUqvKqjy5gynujcUwq0mdywFAf7mKbI0qyxpELZUPXI5/IUAP8u7dvkuyF7gAE/zqLydV2lVuVH+20XH86kOFLL5cRJ64OKVWZiAIYyO+1j/jS1FYg261Gxze2bL/AHREwz9Tmhv7YbaTJbMCcYxkfyqy0axtzHgnuHOaarLxtdjg85Yn+tVcdiIf2hGrAxW7/wDXNef1FK11eLkG3mX2G3FSebKjMwLlew5x/OiOeYpuzu/2dmcfjSD5iLdXO35xtA/hY4x+VN/tLY2GkQbf+mhOf0qRbiXax8suf7oWla7lG0+SUz2MRP8AI1AEH9qFmBRlOfc5p63QXcHbH1OKkNzIzEeVk9i0ZA/nUfnTquFghY99wJqwG/a0ZSqzoq9gH5/nSeevRZ5GP+zg/rmpV80YLW9uD7EinHzNpIt7c5/2h/WgkqyXXlNsMs5yMZHln+Zp3nbhuM0inp86gD9Dip/mXrp8Z91KEfzqVmlWMkWIP+z8v+JoK1Kv2hUjybrcB6OKP7VjRQTMPm6bWP8ASpY7iZW505Ez3WVQfyxU0dw+1i1oQ2e7D+dBJHFeeYoBOM/jmnfaJI2x8oH0xU8dwZFXdF5f/AlJ/lUhY7Rhsj/eFBRXF/IoAMi59yf8KcWlbkBX/wB0A/0qVY2K5ZyV/A0mzcSN5Uey5NTcRWmaJ1QT2m4Z4Bt9wP6UKsUfH2JkGeR9mUf0FTGPn/Xspz/d/wAaa0d0cmK72g8AFM4/WqAeFVekJX/gIH6U9lAwfK8wjphATVFbfVF66ipHoLVj+u6phHeYG+eFiD1a3Kn88mgCZZXPH2JwcdWjGP50ww+YxMlrAN3fZzSxtIpO6W2VunG7mlkuGXrJGD/tTYH8qgZG9lEwAe0tWX/dGf1FOWzjZdv2e2RfQxKR/wCg1JBcTzNiM28o/i2z5I/SntJceYudnPXaTmgCFbGxjXBt7UL/AHfIAH6CljtbCHlIrKI/7KEVbjkuGjz5e8np89L5kg62/PuQam7KSKht7S4JPmWbSdPukn+dSpp8bDbJLHjoNkWMVOmWZiYlVu3A/wAKd5Jb5ssnvu4pczHyoqf2TCvCyyDns5X9BUn9mxsowpkyOehz+dWUik4KTnHdmwT/ACqSOGdcZm35/vKP8KTk+5SguxRk0a3ZN32KSRh3QJTf7BtrhdkllcANyVZ8D8ga0ljkKkBo93cEVJGsmANqA+hIwfpxUOb7miguxkSeGbCRlD2UjAd9xz9OtRt4X0osc2cq++9f/ZjW6qI/LBFbvgt/SniGBsbXwR2/eY/LNHtH3K9mn0OaTwzpHzK1m2T1P7vP5hqf/YGjNtR4d6p91jEeP+BbjXSiGJn2thz6DI/Wj7DAuQ1sPxcn+dT7R9w9kuxxepeAfCmof66C4YHqtvPIM/gG4qo3wd8Gx5PkzKeoLzMxH4k13kmj6fJjfp8R9yMikj0mzhjCwxLCuMYjVQP5Vftn3ZP1ePVI4gfCnwnNGqi3mfHSQ3Dj8sNU0Pwp8P24xb2Ek5PZ7iU/zNdi2lxsuUfp2CoP120yTTLaTAcuD3AuCv8ALFHtX3GqMeiOaX4Y6UAMaQEK8jEsn9DVtvBbrGqwxvEV4A3yED/x6rqeF9PSRnjS4ZiecX0n+NJeeEbG5Ubre42/3ft0g/8AZqXtO7D2aWyMafwfqBVmL5OMjaXb+bVSTwbqBcO0l9E/oJGRfyDV0EXhLT4SojtWwgwM3rn9DmrS6JEmWjtyoHHM9Vzoj2ZzsPhXWI8hNRvFAHMcUxz+bE0yPQPEcO4x6zNBk52yr5hH47q6aSGWDaE8vrwGbOP0qNFvM5DRs2eoiz+uf6Ue0YezS7mNDY62CftOuq+eF2q0ePryf5VPGtxH8randykjklCy59spWp9ovpFYRxlcHnKlF/AkGl82+MgxHJt9I3GPyK1PMy+VFCK+ZVIa5mO3r/orZ/PFTLq5HH2hm7Y8llP/AKDVjz7tnwyXQ9/lAH5VHL9pkYs1zKmPRj/LNG4XYC+Z8nLFOwKkf0p0V26LhAQPZSf6VW23iqqrfOy9D5sbk/8AoVVBYa0GYi5tmBPBJkT9NxquVEc1iK1+x3kxlgnU7xgCJUOefUDNSyW995m23jXbn5go2uPrkZrwi3/aU0/VLqPHh7UpN0ny7LOMyFf72zzN+Prj8a7zw38XtC8SARW9pqSKCQDJp9xCODg859c1vKlNdDCNWnJ7noyeepHnQsYsgbtrZ6euaUJZ/wATLtJ+5vPr7isO38SaSZ3ha4NvMF3BZJpFGP8AgS1q2+tRXExjhMbRrj94JVfqM9MVg4y6nSpRNDbapt2KF29G3D/61J5KyMSjyNnvnNVJrqdbhtkbyqcYOxMfqc09b8Q26tPGzM3UKoOPwX/Gps+hV4liS2IYqJZFyMEMRUH2WSNW2O20ccDJpi31iQ0kkfl7epcMKkGo2W3cJlUEdFJNCbJ0GfZJmt8M8mCc9TmmTwyRR7kkjHOCZlLE/SpEvop4y0d0wX/e25/A05d/8MykMP4vm/WqTZNkUmj1Bg5SWJx7J/LNRltS+UiJHPozqp/StFfNZs/uzjvgCo5JJEbaWUhv4iVq7ktFFZtQX53s5fQsJ1IH5n+lU5tQnXOY4ZGzwBKmR9a2SzMx3KMYwfmU5qvI0ca7VixnnKooH51SZLXmUo7ieSPLWkCt6GQZH5CnmaXbmSOPjssn9TTpZLaYMrNFKccqxUkfrTf7NsgpYW8Q4Bwqgfyq7ojUikuEnjAZFTJ6+YDj9aEn3n5Jd23jKlak/s+ydwRAVCjGUfmmrY2fzbVnP0kP+NK6ArzZuJdn2gFRyV8pv0O6ns023AnjQLxtA5/HmrK6bbyKD5Mzn/bf/wCuKj/smCOQmO2WGTPLcn/2aquKzKca3kRLmeBh2AibP57qke4vY8DYCy/MQkIx+ZatKOy29WV+O6Y/xpk1q8hCoQc9f3YPFTzILMz5L64RQTB83XcwGB+vFV11qSJfn8pS392LNbS6bOowoY46bkUD9BSNYyqANmFX/aFO6FyvuYc3iZrdcON3bEdu5qP/AISaFDvDzRjGWaRTGP1rde1uIWPlr5gP95l4/rTRp8xjAa3hkGc5LnNVeIuWXcwofFFtcTALexOp/uyFiD/KrJ1yMZ/02CJPVpNv/wBar9xo4kyDbwkHgqZSP5EVVbwfprEebpNm/u5DN+JOaq8BWmVJPECBtseoWjsembhf5bqcuupJuD3VoxXkqrgt/I/zq3H4N0pW3LptnF6NGgJ/Onnwhpsi5a3wf9k7T+hovAi0zKbUxJJlfIlXGfuNn/0GmN4iKKGYeSg67baRvyA/wrWHgfTlyVe4QnrtnNC+FNOjAy8zAfwtK5z+tHNAP3hjW/jI3TMIp2XbyQdNlJ+ucj+VQP4wulkCMXZc8M1hNjp3bGB+dbjeCdLkjADS7ByE82Xb/wChU2TwfoaphZPI7sBIOfrmnzUxctQy4/Ed00aslynPG02hH9an/wCEtkghPmzq0oOD5do+fyzzS/8ACA6FdPui1CYSDjdbzhsfTr/KprT4eRQyh01rVJGT7u+UYH5AVX7sm0zNuPiVY2bFJdUto5Dj5Jg6H/0GrD+PZ5Y91qlvdD1EhT8MGtBfBsgm3PrFw6HqpijyfqSpNTN4LhJYpczQuejAjj36VN6YWqGYnjTWPLy2hlU671nVxipP+E3vPMAWwYnuw8sAexy2amXwE8bsyanIxbr5qkjFI3g6eYlFubc9t2whvr1o9wr3yT/hLNSwN1hjjOGKr/7NS2vjW8mbyxpwUk4VvtCfMfQDcDWe3w0mZSRdzo395Zm3/mScVVbwLqUaeWPtN5CeGE1+GJ+mTmjlpk81RHUw6/eAMs1nHFJn+Mrz/wCPmry61Cq5l8hWHVeM/hya4X/hXmo9IwkI7xzRRy/mSSahX4eXTI8TmyJ/urbFV/T+hpckO41Uqdj0L+3NMjYNJJBEW/vIEJ9vent4j0vzvLS+s/OwGEZmUN+WTXk958KRPzcf2aJezfYjIR/383VRb4S2km+OO6ELnqtvYiNT9SAD+Rp+xp/zC9tV/lPapNUtTn/TraJupO9en50/+0YHjLi7tyuOCHU/jjNeFTfC2WxYf8Tm8I6hGiXH0+6Tiqt54X1+Fv8AREml4wJVROR6cgH9KfsIPaQfWJreB9CR3Q+VxNGyeoxj8805mMuSkilO+0jn9K+a93xB03atlaxyuPuo4IA5784/KnSeNPiXZt+/0KzkyNo8uWRSxz0GCQKPqvaQfW0t4s+klW5kkCoJOPu7ShB/PFPC3auOZM+qqP6186/8J34yhT95ptu+7/l3km3yD6ZYY/Knx/ErxZLMqpp95Ht/hj8sgfQb6n6rPyKWMh2Z9DC4vUZ1U3khPP8Aq0x+FSG9lIAczZPTfD1+uK8Df4neLIfm/wCJpEzcBGsUcH6OG5NRXXxs8a2eEgsNalbHLzWUO0fiSP5VH1Wb0VivrsFvc+hf7UeEgPHKp/vBDg/pVa48Wrak74pn7/KhPH4Zr59tfjt43Vg8lvebF+8G06PP/fWQK1B8fvEcMe/MU4/iU2AyPY7ZCf0qfqc+xax0Oja+R7LJ8RNLiwJ/NRicBTG4b9RTV8bWLKCLa+IY/wB015To/wC0FqtzKVurGzlVeTG8LwuPzLCtiP8AaEsIZhFdWGW7m2TzAPr82f0pPCzX2So4uEt5Hc3njvTLOMNLHqGw8Dbbu/f2FB8YQScwadqpz/cjVePX5q45v2gPDsatJ/Z7c8ZZGRiff5T+pqBfj94VaRRLpVyuTybZTJj6gCp+ry/lZf1mH8yO/h16AxMd2qRKOpZExn8qV9atHtwf7Q1BVbo0YTI/IGuFb4l/D7XM+bpFxKVOW3Wz7h9eAavab448BMZEhsXhdOCPKwTnnpmp9k19llKsntJHXHxFZ2yjzLq+w3AZ4lJJ/CkbxZYQ/K99OOM4Nvkn8iazLfxB4N8ndG32Pd2ZJIm/StC31Lw5dKq2+oSlT08uST+ZFZ8iW6Zqpt7NFm08TWt8uba9mcD+EWbr/MVcTUkZsmZy3obc/rzVJrHSrhCr38jq3/PSfB/DgU1PCekrnbK6g9WWZgR+tRaJalLyNFb6OaTEd0sbDs0BGalWZ5NwW6jJ6grFnn86oW3hXT49jJ50hxwWnZv602bwjYyMA8TZzn/WMp/SloVeXY0Q0ygebOsue32cj+tK3lNt8wMdp/55tWN/whVp52+OSRWzyPPl/TmpP+Ebmj3GK+eMZ92/U09O4/e7Gs+yEYx8v93Yeai3QtwAemT/AA/zrNj0HUVQhtSZwDnIYg/pVK48P6pJIu24mxnIb7e4B/4DnihKL+0S5S/lNs3EO0hEVmHYygEfhUTXig4WFM98uRVCLR9Tg5+1XTezzCQfhuBp/wDZF6eWur322tj+tVyx6Mz5pdjyG+046Pp6lNMtd0nLeU1upUdy2Ovpg5Nc3qHhdPE0ckMK3loQm8RQ+Y7OfUMjAAfhXY6RqWt6pfSGGa1v7BG5S3skAx2yXQH/AOvW1Jo9uZXdrKKOaQY2+cOe/occ16HtJROH2akeIappWqeH7EQG1vfEUm5UFh5ZEgUYzh2kGDg55/CqV9eeKYYrG30vT9W0ozLl5FxMYlydu7aDzjHAr3mGwN9Osa6ZZw26DE0cMgcMODnGAAc1dm0uCWI20U92kZG1VgJh2H8Dk/nVe37oh0L7M8Hs9Q8Z6Rpqx6j4uudQud7GJEsLgOgz/EVwOOnTtXo3hPxlrrRpLeaytwcfN51lNGD9B1rfXw1awvI08OoyEptDT3koTA9cscn3pzLBHGrsi2ceMCeELIfTqRRKcZLYUaco7Mv/APCcOvlrPIsjP0dNPnx+oNa9r4kjMKubm3BJxmSMx849DXMrpFu/yrq+o3BlGc8DH5Y/WnL4Rj2/v4bh1TlXlfk+5FY8sDdSmdMviGy3M0txZO/X5XBz+lSrrtpcEBJLfY38Stj+mK5pbZoS32YSRiMfdRF5+pIHP41Un1bU7Uk/ZboxIOF6kk8/wnFT7NPYr2kludktxDdSZiVZ8cEiUED8KkkhRlxs2AcH5Rz3rz6Pxe+4JNZTqRy371lI9hnr+dXbfxUtoyqNNu4UzktM4c/XGTxT9m1sHtF1OwS2V8CORkwM7ti0S2qzLg3L++VXP8q5dvG1m7AokhPQ4XaT+YGKrf8ACa2SzorfaIpGOCsxQH8MHmlySDngdethHCm2M7PcRjmk/s9Z4yGdwR6ACsD+3La42kXLHJ+7FGJSaRvEVpp/+vuHt933VktyufoBmq5JC54m5/ZC8/PtBPOVP+NLHZpGvliRAPQZH9ayo/FEfkjcVOTxlW6fQDNTW/ia2ZTmW38wtgIuScfTGajlkO8S9JpeV/1oB9Nu7+tMj02VCN1xhR0CKUA+vzVKurW5HJXfjPakXUraTaobDH7xXB/PileXYr3Rq2LbmJl3N/ss1E9mehlkIx/DK6/0p63MSsX+0qq/3igzSyXSOrmO5XI/vcVWotCp/ZttGRIZpl/7eGYn8xVgWsgTcHk2nplhj8yc/pTl1G0VUjlv4S3ZTIFz9KnQxyLhbpmOcjaQc/nU3Y7IrwxP0Z5j7q4I/AilNu4UlbiYNnqzD/Cp2yHx9oYem5VNRyJcFQFuFx7gCndkkbWTFg326SP1wEOfzFSfY5eP9JcY7qq8/pUH2Kfax88yAnJCtj+lV5dNnkb9zcSxDu27cPwzR8yfkXfJePnzZWz3KLz+OKGyiEBGz/e3L/hWcml3ysdmpSFs9ZEBH4CpVt9VGB9ojl56siiqH8ieEsq8KxPcl1/oKUrHJkt5yP8A3kf+XFNFtebsP5fHPybc/wA6lVbpkGI94HXPB/rQIrNaypseIXs55481R/MUR2sxKl4b3PXb5yso/AAU5vtqN8trbtIejPMwP5bDSSNfR48xZc/3YZU/qtGotC08e7AZ5U9lQKah8hoZsiW9ZD3ZU2D9Aaa2oXqqPKt3b/Zkkxj8garTa5qUciqdOMn+ym3n6liP5UWYaF9irsVYySD1wB/WkCxZwizJ6HcMfzqqPEV1GuW01kPQKkyt/IYqF/E9wFx/Zt2eedjRnH5mjlYcyNTyRJj98685z3/wqTylmyrP+PSsiLxWN20Wt2ZP7ojMmPrtFWY/ETOpLW7AA9JY3T+aYpcsg5kXfswWRVy+PXfSy2spXInjDD/nou7+RFUF8QXMn3NOSRT91hJjP6VPFq8+1jNpMqIOhTD5pWY7ourHMiDZsZu+1B/KkZ7hcA2okK+gVf5mqzXydrC5VSOSEIP6H+lPN4FVf9DkYejZ/XNIehdhcyL88LRjspIP8uKCsSnGxxjrhutZE2r20O7OkSMe+3B/wqGHxHY28gA0q7jdum2MkfoTRysfMjd8y2yV+1KrKMkbgSPqDTVaAxkx37e2FDD/ANBql/wlFqu0NY3SE9MW7D9eKtR+ILKfb5aXDv0K+SwOfxqbSKTQySS3XAku2b2C7f0qSO1sJ/mMQdT1cJz+dSprlvu2yR3UWM/eTOP1pV12yYgGfDN0DDBP60uaQ+WJVXw/pa7wsSAdSojXP48Uk3hXSbjCy2cjLjqg2/yxWquq2MOVeX5jwdyEAfjUia1p7LgXkIx/02AqeeaL9nB7nPnwHoqpmO3uEwePLJ/XNJH8P9IZgEt7onrl53I/Iniuqt761dcxXC4P/TUEU55ArLsYOD6Pz/Ko9tNdS/Y0+xzEnw5s5EKSRPNG38LuWP55z+tQyfCXRmY5tHQEdI5GX+tde8y7lUblz7j9eKd9oDHZiRP9rIxS9tU7h9XpvdHBN8DfC8igzafJnvtYgfmCM1Xb4D+DipSHRY2x1253fjzXo6qO8jOfwoZQ+QEkGO4wKf1ir3D6tS/lPN4vgr4atRiHSmQdGXKkEenH+FKvwl0ngWltJbqv8EMEafrjNeiLFOvzKZCewfbx+AWmiGQSKcYXviMH8jn+lP6zU7h9Upfynnc/wptpWUi61W2I6iK8dR+QOKiPwlilAMer6rAM4GJz/XNemv5/Hlr/AMBbA/lTf37ZzGg443MKf1qp3F9Vp9jyTUPg1fXDBbTxJfJnr5k2f5isq7+CPifyRFD4lkKcgI1wU/UV7cqTkbWity3fD9PwpjWatw4hKnqFZh/WqWLmupk8FTl0PnlfgD4stGcprXnB/wCD+05cH8+n4Gm2vwP8caVIRYa7Y2ncJNfXUpyTz1kr6KbTLdo9qxrIueFcbx+GTTRYrtbAKEcA7Bx9MGq+uy8vuI+oQW1/vPCo/hT8RVUNc+MLWTbnAWF2H59T+datl4P8e6eFX+2or47ccpIgGeeOTmvXm05OrAStjGSDz+Gab9lZWIMUSqeigEH+eKPrLl0RSwnLs3955e2k+PIVCHVfKTHLFGV/5nFWlh8ZpGq/2hMgHLShlkz+FehS6a0m0mGJtvbbn+tNbSzz+4RB/uDn8jS9uuqRX1aXRs8wabxhCsgW81e/Zj8rLaQ/J9OR+tSWuv8Ai+zkCy22rXgbq72kKBfwEmRXpb6KZF5YL6KBjH45qI6DNwBcBU74fr/n2p+2h2F9XqdJM4OTxV4iSbYumXN8B97yLlAQfQqRwfxrQt/E2sOn7zSr2DHRcJIfxbPNdPJ4bmkVsalJDngrEFx/Kqn/AAhCn7+r37H1SRFH5baftKT3RPs6y2ZgTXNhpcY89wsa8COOMop/Aj196WPXtLutkivLbvnaMwO4446g9KtW9vp6c29wZYudyyXTuB/wEnFRXPh2zmUGK88mZ+f3O3cf6ii8epVpdB51USx4igSbBwQsRRj9A3H61FPb6jcTb44JY1bnzPOUhceikkVk33gOzuFMdzrl/Dj5mX7QuT2Gcj9KtaT4Si0RSkV5e3Dsf9dIxxjrn5cAU/d6MPe6ooX8UGmyR/br25juCufMaGM4UdSSqYA+tX9J1rRbyEG21K31ktghUeN8c/7OKs7ry1+WKbz1Y4Mk10QFyeQAwOajj1DyVlJHkSjgPJbBl/4CVHP4in0J67Gp/aFms+1YhG47GMAn+dNvJBdKPIku9wI4WIY61TGrXenqkkkrSq4G0yWoUD9FqpP4ktJMySIk+75cwl05Hry1LlKckbMa3ayFpVZ0x92QbAPcip92ccbG/h3Dj9Dn9K5eXxHPMsY0+zSRd2Nshmcn1442/XmoR42uVYR3FnGG3ENJCJNg56AtVcrFzI6m4kvSiKkdu6E4O/eKhazOwl7WAuxxviOB+p/pVGz1r7ZEJHmUQ8jCzEEc+gJqz/bFt9xWkc4z1Zif0HNGqDRlebR55HX/AEaFFx1aRSxGemNpFSyaHbsmTZQyHHAXaMfQ4H6YpJNQESs7TymMdEdSGHt96oY9QjvAuLaWEDgtKykH3HzU/eJ5YlZ/AukzZkOkWfmnq75Dj8d1Oi8PJZxpFBDsQ/wxsT+uePyqxDa298CzIsqA8MxZc/lxUzaPZSnDW+1MfwStk/lT5n1I5V2KV1pLR5UW0j5HHkzOh/76VR/OqbWtyiiNtOijVuB5l2zH8Ca3f+EfsoV2xpMh7FXk/qaJNHs1UFneB+zBgG/Mg0+cOU5ebTb2NXW3SODj7sShmP8AwImqkdnfKnmStOkjdI/P2A+5IQ12S6bD5Z23VyB6pOCfzqZGCgR+fK6AYIyrk/XNV7Qn2ZxcN5fRqRPDaox+6wmeTH1O1aY+rXFuyea+mbe7LcknHqckV3CyRsGQhicfLhE4+mKT7PAVxvkGeqyKD+FHOuwcj7nJyeIEuVxFLbPtHPlukoyfbcKm/tqeNlDwxsfUW5/mGwP1reuNAt5myk9xGD/zzk5H0qr/AMIqkmdl5dSMTn9+8jlfp82P0o5oByyKP9oefIhj0+3dz90M0g/MgEVPBeQ+aVfyopVGdqXDED2ORx+VMuPBM025f7TnQnr+7J/r/Wqs3gS5SPYmsMkWMmNrJWVj75Of1qvdF76L0l9clSY2jRO3kuH3fXK00a1driLzGeQj/ngDj8MCsqPwVfx24R9UtkHXdDpyK3/oRNK2gNbRiN9ekjB4b/Q/nP0PQflRaPcXNI1rrXHtbf8AfXMlux/jW23c/Tnim23jK2WMCfU49zcDzYhGSfpWbD4ZUKNup3iEchlfyyR+YB/Kp20eDbue/mXPHzRiTd9Rk5pWgO8y7N4v0y3k/eXsQHQlYMj881Yh8UaZIokGpwvEf4dijH9ayV0OwjUDbbkd5Fsljb8lAoFnEvR4rodvNtsEfiBmjliK8joIdetrjmG6iY5+6sgXj6VK9/FkEzFQOuG4FcvP4et7r5Rotm6npJl2b8ioxU66XY2MPlz2sNguR/qptp/LGBU8qHzSNw3ST71hvvKPXKleP++qP9Lwnl3qyrnnzIQ35EHFZKw6bMxQTpKcfcfYcj6jmmQrHC263+xyAdVilcn6cHAP4U+XsPm7m49vqLMrLJDcY6pIig/gcUNYzzKFl0y1b5uB5ZIX9Kx21qO2jLNG8ZwciM7z+Awarf8ACU20apJJJeQR4wWcLGg/AgZ/Clyy6C54nSC0XaY5rSCMfwhUZB9MgUi6daR52o0QB58pz/8AXrlV+IGkfaDFLrQYgZ8uC4Uk/UDnP41OvxIsGkVIFv5Q3HCDp3PLZo5Jdg9pDudKmnpG3mfabrYfuq8hI/DipG09DuxPIWx0diP8K46/+KmiWJJnvbmML1VrYt/SpLP4xeG7pdsUrzcfxQsp/Wj2dS2wva09rnUJay2ibVjc+yykg/mf61F58qx4NteRDPARv65Nc/B8XvDs05hinUzDqvmRnb+T5/StIfEzSwwVZY3X13A8/TmlyT7D56fclm1m5s5FQw3wDc7mAcfoBUU3iryeZPO5/uWMrn8hwKjuvito1msb3MkFvGw6yFlx+O3FPj+LXhiZgI7+0duuI5xkj8xinyy6xDmi/tDofFlowIbzge0Zs3U/iCKltfEEE020xzbcf8tLdlH8qjk+IXh6Yx+aySbujeYu3H+8DTm8XeE45kWa8iQN8wkaT5fzzilZ/wApSkv5kXYtbikYpGqRsOibDz+Q4/GluNVLRr5lrC6hsA+UzkcewGKibXfC07Ii6nAA/I8m4IB/Fc/rU7QaFdg/8TORIcYx5ysp+u4HNZ/I0v2aIJNc0yxU/a2tbUdQryFR/wB8k8VA3xB8J2qBbi6t13fwxp5gH5dKuwjQoYPJk1S1uoAcCPbEdp/4CP6U77H4TmmLJPAJjxuWNd36Cl7vVMLy6NFFfGXhO6hLpqsEKqesRJUex+Tg1q2fiTQ7wL9n1OGRj0CybT+WKhOj+ElYJNNZgn+FsgN74IxUlv4F8NyszWn2RAe8BTP4VDULdS4uon0NJmCrvjmkdMc/vztA/Klj1JocLKVC4+UySjJ/8d/rUFv4PtLfaYbyRJB0Lykj8sgVZi0GeJsx36Sxt/z1VTj6cf1rG0e5uufsAulumwsBDdmU5B/I09YbhwcBTgc5WQfrmpF8OfvCw2ySH+IMV/lxSNoU6uojMYU8MxlOf1FK8O5dp9hjQ6jAoKpGUP8A01fP8sCkjk1ZTuEIEfol0G/mBUn/AAjdz5hZdTYH+75YP8iKSHQ9SgD+TqU2epUrgfkc0rx7oLS6pkgudQAVViKkno0qn+X+NMk1WW15uD5fbgA1Ns1OAZkaOcDj5ITu/POKZH/acmSY41X0OV/k5pWRd2SLqMjruimjb/eyP6VHNfalnGbdR2bLHP8A47TGa+Vj+5tW9VaaTcfx6Uxm1BWBaxES9il+w/mMCiyJ5mObUNR4zHBu/vFSc/pTJrzWIRlILVweSzQvgfiAaZ/amoRyAfY2CN0aS6L/AKiqdx4i1S1YmX7BDg/8tpJGYj6iqUeyRPN5st2+varyLqxxt5zaxSsMfioqwmrTXS7fImZSc8xEVlv41fbmWK1kxzlbhuPwxmo0+IVvM3ltNFDJnoZZEJ+hMZH61Xs30iL2i/mZtSXWqMhNvBFg/dWSNx+oBqsLrxGrndptgqAffW6fP4jyj/OhvERkx+5jkyOD9pAB/GljvpGb7lvbBfmLLMHJ/Sp5Wt0iuZfzMnjm1rcN9nabT1IuW/kYxVqP7aysHW3UDsuaqNfXjYETRsuc/fz/AEpG1S8xufy1I6BZQBRyvyHzLuy4ouedyRt7KpolkugRi3j6f36zJri6uMgOFPUN5hYfkDVWP+1Pm3ssoBwrRRYH6vTUGyHNDhp8Ee47EjLdSoBLfkKiM0lvA2wSxgZCnYWP4DgVyl34g1qxMSy+H7jUX/jkWAL+vygfrT4fGNx5hJ0R4f75e5OR9AoYHFdHLIw9ojXvpL240/Ys+oWU0h4nSCNWX6A7h/Oqdnd3lpILZtW1Ce6xvYXDx4I6Doo69etNuvFUKxxqq3EpfgxtFhV+uQKvWurWbQu6wPFhcndAwJ7Y/wA4os+qC6fU4jUPFPi3S5JJkiXWrVn2eW0SCZRnnafu9frxiq938VPEtjGqx+Er1oN4HnZWVxxk5jQf1rs7i1sdSVTtkiJbOZA4GPXG8VoQ21vIhjhlVgvUpOy/ief61pzRS2M+WV9JHnen+NtRmVLi4N1bxyvsCy6asXPv5jbh+ArRPii4dpVtYtW81cAyTwqsbH23OP5V1c+gwX0g8xbphksPs1xIAx9zvBx9ayJvAmhSRvi1nEnmZOx2BBx1ByKalAHGZz0vxQks7oQzWN5LAoIlmt4QY05x13nOT14FbU3i+SSOIafobXyM2MPJ5a/gcNyOn4Utj8PoLTcF1HUSJG34klEpB6ZAYMB0rZ/4RyeRFDTmQA/xoVLe+c0OURRjIp2XiOPUkYLpV7blThlkzEg9cMQAeaszKJIiYIdoIyd12ASR2yFJNaUdjcxjHnxkAY2thcfpmmqtwsjBmtFxjBM7H+lRzIvlZVhs1jQTmFtx5OZ3lK+3+RTmtbp9xjmWJeo3RjH455qwtm8MhVGt4hncfLOSfzFNaGZFJknOM53SAH9QMUXGQG1uGiaNbiO4bbnOxlGfqCKVdJj+xmOaRkbHIhuWDevUkmoVkFzG/wDpltIwbs5wPwAH86Vo5lj3YWQno2wHP4Zp6k6Aug2cLb3ubpU9JLtmH86j/sewMwZZm2j1kLZ/Ohri8jk+XTpHTuDsGfzbila/m+4NKuSrfxIEK/oarUnQsQafaMpWL5XHXBFSyR/Z1VFLfNzu8neT+AAqmdQuYwRFZw25xna4Z2/Jf8aZb6/czK+5olC8bXtJVH5k1Oo9DRxGFyyKX7kxKh/LIpkjb/8AVuqt+H9TUS+ILaOOQOmCvXy0JA/Cqq+MtAZyss8yd97QuBRqPQ04IX8orvRm7jcDj8BUsa+Uvz8p22qR/M1Rj8RaJcINl0Hi6bzE6j/vrFMuJNFuG3NIpXpvaWQD8OcGlbuHoXpJbdSN0oUf3dxqIz26t+7uI3OeVklA/TbRBpWmyrlUE2emJGx/OnNo9jACRAR23AM2Pzp6C1E+QyHExIPRd5C/lTtzNjy5OM4G0KV/MimyWtp5Slr14F6b96qf1GKr+Tpk2YjfxXC9fmnTOfcqRTAnks188yCLzJO7Lbo2fxOKCoj48khm7rCP6Go102EsvlXh+Xovnsy/h2qc28ivl7liMdEIA/lQSMVVkLK1rcxFeCzQ/e/HNJJp1uuTIck/3iR/Wkjto0dn+3XZLHhd+5R9BtqJmuIJAF1aELn7klsCw/HI/lQBFJoNgZPMZZBnqVlZf0zUP/CN6XJJvFxIuRjaxDH/ABrQOsRWOPtms2kcZ7MgU/qxp/2mxv8AlLtJwehCAr+GKd33JsmZN14YtWhEMN4YWc4+VirkfUMDUbeCFWMAXMk/Y+dM4zj8TmtmPSbR5t4lQkdVEQ/njNTrotu6kHaT/vMP60+d9xcnkcy/gHTlZidMg81usyzlWP6Uxvh5pszZa2mhA6kyq35Z5rqf7HtI8ko4A9Hdh+pqHybNZMCYRkfwyLn+dPnfcXs11Ryknw2glwf7Uuo9naBz0qrefC3SNQjaO51KW5OOl2jMR+IYV2whtFX940bIeQ7Iqf0prXGmIPmnsSq8E7gcf40/aS7kexh2POH+E/hj5Yo7+zt504DCKJmHthif5VYPwhtiyf6Sl1Gn3XGIiv8AuhFCiu1k1rSLb5ZLrTFRugCZJ/75UVYjudMkXej28ifSTBqvaztuT7GnfY891D4SrJGUt72e09WjeOV2+u8f0rAb4Hyqq51QXKBs/NYxqT9WRh/KvaVktFXYIIdjfxLnH5kf1psd9ZwtsW3Acfwxygfpuo9tNCeHgzxu5+Ci28bMkUlzKR96K8mgP5tuUflSL8MtUitTBbWKxDqPtlw90D9cba9kjuDDcYS0upyw+6ZUIP4GrCtHwZNPniwM4MeSPoRmq+sSJ+rQ6Hz5N8NtdYsnk2MUwHL6fbRI4X3aUYH5VJB8PvEktuYk0mScKPklupoJFf6hMY/AV9CrcLIobyplC/wzIy/kWGKiZYLjrAY+5ZgjD9Dmn9Zl2F9Uj3PnO48CeO7Pd5VtpaQ7RiC1EkLE98k8H8qpw+CfiD9oEr6TaR/9NE2ybh2zhVJ/OvpK4uZLcqFRcDjErsox7AA0KwmPMCsuM/dc/wA1o+svsT9UX8zPBtO0zxvanmOxiCHLeTC7HH/fQH55rWt7TXY5N17rEw/iEUMcacfRXz+dey5KSEFlUf8APP7OQRSq0MyyK0TDbj/l3zUvEeRpHD2+0eZ2Oj3lxEZ49XlcZ5VsbsfSRjUx0uG02tPc3duGPzD7EZM++6PAFd82jWskjNFDH5p6u1ghP6mkXTX8w+YZgehKW4Ufo3So9rc2VGxya/2VGgWHUr2wQDLSIzqv47smkh1zTT8lt4wuJD081iHA9juA/nXUzeH47p1cXd5CYz8uyaVV/IHFSx+HpTC0Zv8AUJC3JEiCUH/vpeanmj1L5ZnOrcF5Inm8ctBIp+UfuYlYfjuz+dXJvFw0v5J/FcsrHgKkYlJ/BV5/CtKTw3aAgXc8dwRwF/s+MkfkmR+dTJ4Y0V1CN50hb+FYyh/DpiocodSrVFsYzfES2t9jtqDSL6PpMzM34hgBT/8AhdGkRTLE25GY4LTxyIo+mM5/StFvhpoDMStnNcE9POKHn3ycmp/+EDS3twllpVsSo6HaF/HaOlK1F7ope3WzIl+LFnuJCzheokaBgg/HvSw/FbTb0nyorxmVsMIbN2/HOOlZMvg/Ube4Ei+H9HR88tDdkOffO3j9aW48H6tfxvvOqWbgYC6bqu8EenVcfjS9nRexXta6OtXxTeXGHtLS4niPRZ7VlJ9+BRJ4g1QqQmlrA4Gdsw689eua4WL4YXy4dNV1ouRy1xdoQvsSpBNOPw31STaza0GXHKNiQfq24fnS9nSXUftq3Y7X/hM7u1ZVuLSJVb+IMQfwBBJ/Srg8aaftDXLcdMLAzgfkK88b4UzMWaS9a3J6tDcyRk/98sT+VZ6fBm1jmeZPEN++DzDd3c7pn/gR/pR7Gi+ovb110PRJPid4YWb7M9/GJP7jQOCfw2/1q3b+KNFuIWeN45QOd/2Yjj0xXm1z8LvKWMW9+0Wf4rWYqPxG1gPwAqnd/C66hw93rc1wW4KzTvsUeuExn8hVewpdJMXt63WKPXFvdMm2mJFXjO4W4yPwIpyTQ4+e53K3TNuige3HWvGJPhyVVo4NS8he8tlcXQkP1JJApkHghbd0l/trVHZeObl5AfqXSl9Xj0kT9Yn1geyPJaeYUF3LG2OiBRx9KRbWzZizXc7N0+bP+HFeT/2NGIXkUafcuefMumdiccY3AcGq72Oq3Fm0Ec9hboDujjsr9pDjvkSDA596r6v2kH1jvE9faxtW+b7XO4/urjj9M0yKz0+Ldm4mUk5+dsZ+mTXkVnoviiKRXOshoe7N9mPHoSrDFbY0aS6YyXE+n+aQMnzY5SeO5EZ/nS9jb7QKvf7Jm6b4r8X2G37bPo0yAZK+XKQfqxGAfxrYi+Igg2G+fToAzY2qWQk/7OC2fxqNPC+ltnZ9oszncyW9xwx9SNpFV7zwnpWosYka8V8HLpEiM/HQuVyfzrb93IyXtIrc6FPHPh/5VbUbdW7okoJye3Yk/UVDcal4Yv8AzFl1CzTByytciPH+ySWGTXHW/wAKdAtzvSxuBuzuZirH36g05fhz4bkRFOnxkK2UQLHnP9PxpckFs2P2k3ukdLFofh/VGWO2n0+VSxby47zc49DxnH4VoWPhEwwusZgTk4Ks7gj6sf8ACuRuNLsdJ80S6pLpwZdojnuYAMey/N+gqCKTS7UNDaarxjLKtpuJPfkbfywKXK3sylNdUdydH1KC1C2s6wPuGX2kZHfGS3P1NR2em65GrM+pSTc5VJ1ROfT5Yya5iLWpLNYE8u8uYOfkmkMQI/vfKD+tSN8QmaQ5utLtLdWO5ZJ5Wkx9FHNTyTK9rE7CM6hHIVOw8Ywzkgn8EBpJ765txmeSJEXkhSef++h/WuQ/4TOzmKzwX0MDdBK1h9/3UPICfwBrSm8WPBEwF3HtODvkxFn64+6PzpezlfYftI9zWXWN7EIJCGywwUY4A7AGmSeIWiOw2lw4zgklR+m7P6VlQeOtMkkCz6xaNMB/qY5DI3PucHFSN400qPasmoQEscESLtPPtyTT9m+wvaK25qW2sCYuskOwDrgg5qRtbtlbbsMTdAFQFqzpdf0dowsk2nxY/iluVQH9c063XSrrezw2oX+CTzxIrfjjj86OXyDm8zRutQaGFigkz94nylBA/P8ApVRde024wZwUdenmDJ/ICpLe80m2VY4Li1hLHCokyjcfQfMas7dsiCW43Ek4SRlwO/Qjp+NFvIObzIlvrSQsIomkD9R5TBfz28VILiKPaFsJCg67Vxj8O9CvFd7iskbqP7pQ/ge1VbrSYnyWiusJ3hXYf0waXqO/YvHUPLUgWty5PG1VGPr14qRriNlVHVUDfwyJn9RWDcW62yoI31RUY87Zj0985zSz6jHaQ/v4LueNfu7ol/UnGKLdg5u5rRyIuRujQL0xTYYUlV2aYyLnliMf0rAbX0aFTaWEozwxKjA/KtC3vLf5G8m6j7H5iV/AA07MLo0WsYZl+Zosn7rbOR+Z5/KoF8PKGLG7lIK4XZGo/LrRNdhMPHLLuHRWYgfkaqy3l/cMpgeKAHncYy5/Pd/SkubuDcew+bRLfywj3t+wb5TtuCpH5CkOk2ixbXlvF28CS4kaQf8Aj3BpW1C+j2r+4kP8RV9mPzon1SVGBeTcnf5Rkfj3qtSfdG2+lwKP3d3HOeufs8Q/kBU5jkjjKiF5Tnr5YwfwBqH/AISqwZthumSQDldvzfyqePV7ZkZhJNNjoqqST+Qpe8Gg5Y2LY+zKnru3rj8OlJkxSYd2VSOFXJGPxpfMtrofOJcdgd4wfpST/Y2mWL7S0Un90MuP50ASrAdu/dgDkDywcflVb+0LVdwkjaHb1aS3O0/Q4p7Q2scwBnJDdfn4/wDQqma3tAp3SAn+HMoX+Ro0EQx6hayYOIXTPA8v/wCtUrXtsBgbhzx5Iz/SnfZ7ZWy0qhzwTJLkn+dK1oW+YQxMuMHADZ/GgNSOSRF2t9pkjB67yP6EUhJVR9nuYmQ93Bz/ADxUM1jGOU01hjrgIAfzzT4IAnCadMh65DJ+XFAtR80sioGVk3bsHdu5HtjNOW8eVhEtxasPRvMyPqO1TR/aFYMYSnHSRcn88VWltorpiJ7LJbll3tn/AAo0DUm+zzQ/Mpsp/wDYEz5b6bjipI5njwRaRxZPOGTj8jVCPSNM2MV09IiDwuSvPrxVqLZbr8lrImP+eZJH8qAsWVvvLZl32659zUc000jqvk2Ug7hyzE/jinLeQrwzyRH0dM/zpzXsKFQ0khQ/9Mjt/MCgYMsC/e01WH8RjgFTqsLRkpCQAMBWjAx+FRfao1bckhEZHUhsfypfODqD50YGOqE/rmoKJUjeJdqbXXOdjDH8sU2W3ZlkxYCQn0wc/wDfRpWzwrShSvcDOe/rUUy3MiFbS+EMo/vQbv5GgY23jdYWjFgUXuNqH+RNTs1xsAW1OfQRBv0JqmsmpxB2ur+1EROMm0ZCPxLGr9rNtADXcLk/d6L+XOaTEhsLXy/L5WM/wpEIyPqCTUiC5YMjWrlu52pzT2+1ohlD3MyjgLDsY/rzTI72SZgjQairDqzWybT+tTqaaE0cc5UKFwey+QVx+RNBsbxlbZMsLdy0ZP8AM0yOW5t1YyPdzxsc7Tbx/L9MEVMNUkjXZ9muju6FowAP1NR7xasRyafPdR/vL1oG/wCekcK4b8DmqX9h3nmZbxPdIOyJDEAP/Hc/rWhNrt9b5xp7SIOp4xS/2xLJtH9nhc9zFuH5g0rzHaHUqroU7KTJ4kvn9sKqj9MVHd6daxgrP4tu4Cv3ke7Vf0zxWhLumVidMhuW64VQf59ac2oQpGBLZRwbRyssIAH44p80h8sTMFhb3OzyvFk8rY+UR3K8/rT4/D8yrtm1u4nRu8gQ/wDjwpjeO9KgmNuY4pJR/wAs7ddx/ILxVlfHViv37e8tVxy5hO386Hz9hJQ7lb/hGGRT5eo3EmQdvlTIoT6ZFV/+ER1ASI8cVw7qMmT7cVJ/AHH6Vpf8JJp91IEtdY2OVztVlz+RBqz9u3cm43tjhgVH+FLmn1K5YdCiun65akCJpWiYfOj+VIPzIBq6ulxGNVlDxv1JTKH6ZBpJL6Tam1Y5+cEyXIQ/yNPOprDtE/7sEdEfePzxipu2VGMURNosAbd9sukcfd2uX/mDT2sbeFQXzK4H3vKw36CmyXVrcIfLeWT/AGYG3EfqKYvmwyLt+3DPdUXj6/vD/Kj3h2REsmmLNteS5jJ4A8klfw4qcWelyyfNAjyr91nPI/M5qb+1Z4dqG45PTdJgn6jFDTvcKD5zMD12Wu8/m1LXqGhX/sXSo9//ABL1TdyXjhIz9Tjmm7NLtcRiXy0UZCF2AH/AAKtpGqZaO4ZARgnygpP04FCWcrDcbjzieMSAHP5f40X8wt5Geun6DJ++S1twerSPblGJ9QeKbdL4btIC9zc28cfU+Y+R+uauSaKXIZoYZHHdmbH86V9JuU+aK0syf77LuP5Ef1quZdxcr7FCGHw3qUatbrazgjO6NVJP506PTdK3nyoPszKOG8hAD9MGrn9l+Xgzx2qNjqsXJqu+mwyMT5SgjoVhIP4HGKfMu5PL5FJtLsDl5LpAncyW8aj88U2DSdKvFLRT6dcRg8EIpx+taX2GN/lWRCf7rJTH0dtxKWtg5PViOTVc3mTyeRz8vjC3smfz47K2i/56NciP+SkfrViz8Qabq20xTxXJVv8AlnL5oGR64HFRyf2ZYZQzx2Cu3y/NGB+GRxUa6XFdY3axqE3O5W+1qEX3G1QP1Na+6ZJsuX1nbXigK7wgH7sKsQfyQ1Rm8M6YqgTwyPv6Al0Q/XlQaVvDtlHKHa7nuRnmRby4bJ9wHpLrw/bzSKyQR7M/M0krNke2aNtmJ69CKHwzbW0v+j6bBBGOTJCkKH1wBls9D1IqlcQpq7G7gDC0nJZIRLDG3p0XocitqTS0S1ULFDEM5Uyyh/0PFUrXTZbeDyYLqyiCggF4TIFySfUetVzPuHKuxjt4Rt9ga5tZr1yfljubhZlX9RgVnyeHraO6WO3tYLeQAktFbPKn6H+tdTJo7yYEl3asoHPkxHLfgDxU0mnobYCdEMS8b5TsUfgzc1fO0iORPocDdaHboVk1CKRxnb+4sFjk6dA0jZH4Gs2+0/QIYdtzp99bwg8ZueW+uz5f516Na2c1nMVhtXa3Y7vMj8hVI9AVbdVu6+2fP5ekQ3RxkLI6/lnGf0q1UMXSXQ8va20dLEi00t7mEjnfIZR+KqBiqUHguKZTJHoq2RIP/HtGzBhnuG6V6VNpepzyRSJp+i2pbja0DsR+OVBqZrXVI8AyW4kHT7LGIkH1GTn8609r2I9iup5EngHSbG8e5t1020vpBhpGslZzx1bBBJHA69qbNoN+1u6Pew3r4AX7SqwICfRVHT6k16o1xeRB/NkmvccO2ChXPYYWomtVkUu2izSqhyBdsWJ+g6/nTVR9RexXQ8gb4ftcRoHi0ppFOdxikde/zBVwvHsf1qrf+B42t/8Aia6Vo12+wAuzNabl+jFuPYGvXW0lNQyU0KOOQH5GEIUqfdmwG/AGrFvos5XyZNsTDkraoFA/DaOfxqva+RHsex4lb+FZysVtpcF5p1tFysNreQrGO42nGCP1rYs7jxJorNNFrBjRT8yzF5pifQEyhf0NenXnh2OacC41O4jVl/1cxOT+JziqB8BabMoLTQTICeZI5ZXXHqc/0queL3J9jKOxzNj8RfEtoyPNZ3lxCi/PNI2AB7KFYZ+pFaVn8cp5FaNvD97cDOA0ZV8e5Hyf1qvcfC3wzrV8lzNDZT3UQzE80UjOv03ZK/hir8/gPTvswtbi7sijD/VXCSEY9Mbgfzpfun0D97HZl+P4w20MYeTS76z4zuniCj8ycVo2/wATtLmcGGa0djgtFHcI7jjqQo4/OuQt/hPbQsYtOOj2GB/rLW0YOB7LnGaq6l8EYLhgLjVdTvFbG6O2kggT/ebnd+GankpMtTqncXPxd0C3aRZXSF4+qzuqD8C2M1OvxE8L3sIJ1jTYVcZCyXSK34YYVwf/AApnSFjjjNrbmBfmzLIZJT64LZFY958DbBrr7TDeaq8D8JbwRx4HtlicfhR7On3Fz1uyPXF17wrtVvPt5vdZWkP5ZNVm8ceGJLj7OVkLq2B5unSKDx/C+zB/OvKV+D76ewNvda9pka8gjVmUZ/2gDkfgas2/gW6t1dh4v1tRjBSK6knB59Zw36NS9lD+YPbVP5T2qK+024VCRa7WGF3AKR+gpvk6XdM7homRT8yq+MH1xmvCpPAt9CXkOrXl6rjPl6zMqge4ZEb+dY+o/DHxPDvlsNSEXmjIIuSsZH18vB/SmqMX9ol4ia+wfR8enWhHyzxqD2G3p+BH60q6Pbr+9CW8gX+Lywv5nFfMEPhn4m6UxA1aGRMYCRlo9w9yT196l0ePx1Z3xmun1ATr8qtHqUkgK9SNp+RRn2NN4frzEfW+8GfT0mnxLuCMFZj91nx+XH9KT+z4o8NK1qO373af5gfzrwGbxV4ztl23mhzXLSD5FtLr7SWH+1kYHHoBVf8AtfxUke+08Hadv/vXwaE59gFfJz6YqVh33LeKX8p9ER2NtMvyRwSqed6kbc/gTSx6au1jHaLC+R8wkPT1r5yj8TfEK3ZfN0TT9PZfmY4dgw/3T8/6D2rIf46+ONBvJ2vrWA245DDSriOMfi+P/Qqf1ab2YvrtOKXMmfVf2PyclTOPpIcH86VI/tCMc3EfHaQD9cZr5j0/9ra9kRx/Z9jcuDj93MUYn0C7myasN+1lfrCsTeGdRspXyfNu4CsYA9DwT+QqfqtXsH16h3Po/wCypHtXzbobjksLhif1q1HGwGEvJQnQiTDA18wWv7YV95qBdG+3K/CCFCh465LtgfnW9p/7WMTZN5pNnpgZvlN7qkCEfXBI/Wk8LUW6KjjaMtmfQcMyszL9ogmdfQBSv15ok85laNDFn/adj+gNeTWXx6sNQbZLYMAf4ls5HRu+Q+wAjHeuh0/4raPqGI7dJCmOVW1cFf0rJ0Zx3RvGtTlsztltWkXbMscir0PzD88k04abGx3LH9nJ4O3/ABzXMN8QPD0bCKVnXPQqjFfxOaWb4meG7ONRLfLADnCsN+4D3XNTyT7GvPDudA3hxd4kiuLhm6FTcNj8hSvoryRHKbucc5bP51y03xg8IWcnk/2rFByMLv55Gfuj5u9Wv+FieH34F5cIH/jRJOP50uWfYOan3Oij0UrHtcFx6crTl0posKsThe2XJrKg8YafMI/Kv5ZUOcFkJJx+VXv+EikZlFu7Pu4AYKvOP7rMM/gai0y04FhtMmkhKRr5L/7YDA/likW11Lcu8oRjB2A/+zE1Uk8UX9myI1o8pbtsCj8Dmiz8cPcXHk/YpFYHBzsO364NK0+xV4dyWTS9Q+0F7fzIB3ciNg34ZyPyqxCNVtXxMkLxnoWByfwAxUv9tXLKTHbR7h0TqfywP50+PXp2G1kWM88SrkD/AL5OKj3uxVo9yCO6uopDHNYuE670i3D+VWYtYiIMe9AVHK4x39ODT4fEIj4nhi+boY3P/wAT/OrEerwsuWtlZRxzHnB9OhpO/VGi8mVxqZyAsbPEepaGTB/HFT/a7WVV8tPKc9jkA/nSLqlqWLG0jBXg4Y5/lVtLy0ZVYR7f98A4/E1m/QtJdyozW8rDfF8w/wCecwBH4ZpzXBVsJcOo7I4Vx+W6ryxwStuMEDK3QlVx/jSHyIW+WCE5PG1lX8qjm1tY15dNynHqCDhtxX+JjAqinmS0vIyJLWKdOu0xKwx+FXJEhk2kxeaP7oKsPxBz/Oka0s0UbrRY89xEq/ypc3kwUGU4dNsotrW+lIoHQpDGuP0BqR7WKPD+QFHYMGA/TimHQ9NWZpYz5UzdW8wyH8ASf5CnyabaSKDLMrkfxyAA/iaXMHKyJrETbSlvb8c/vHIH5bahW11eB3ENrYeUfV3yfw28VYm0yyulJS6aEAYEkTpx+dRw6TtUJ9rmdVOfmfr+IOP0quYLeQosbiZSZ7GNQeG8m4fB/DApDoNvb/vEtvJf+8u4sfx3EmpZtLLMGdyw7KSCB+mf1qpdaVMqFodUks2/2GI/RgR+lLmu9wt5E8cflghXuFDdQ+9R+HOaq3EVluHmX0ySdtzuP51WW38R53Ra5YADobiMuT9cFcfhVuKPW5Ix5l1aSnOAYAwX35LGruu5GvYjNrp3meYrXE0y9SCWP86im1Wytdxk86Lb/wA9FYfzFXPsF/0aVdw9JCx/UGpVh1F96iSVNq5G9gUz9M07rqxWfYwm8XW/kyG3t2utvQCbBz79qzY/iMiL+902aFjxyGeusOn6hcYM81vJt+6BEMD880skdxCpDNGyY/hiLY9+/H4VacOqIan3OZi+IqSKyiCW2PaQqjKPcjdn9Khj+JkccpSSZrhx/wA87Nlx+OTXRtY+Y+A0IkP8S2yq36r/AEpPsE8bDN2+AOwRf5LVXp9iLVe5zq/Fa23lpkdYAPmZRux9RtGPzplp8XdAug5jEpKnDbAMfoxropNOO0OqCZs9W2jH/jtU7gX8b4TTbOdfVyCR+PFP932J/e9znI7OOMK9xriGH+7JFEo+jbiTn6AVYm0/TZAjSC1v493ztJhFA9AVFXW0rSLpklihtmnH3HaAMF5/2asfYl3L+82NGeGTzUCk/wCztAz9TVuQKBnldJRott39kUHCqsrhR+lWPItrkgi/huQh4bYHP4nPSr76bLJMQ+845LOse4/juJ/SsjUPDdlNI/mT6gwBG5IbshfptGP5Uk13HZ9ixC1taNmS4sI8nCR/Km7/AMiHH5VXTVLfMkcdzo8s+7AT7UNi+2R3/Cmr4atBGwsrn7KxG3fMqoyj67aWHwwVyza9cXG3+CFwR09MD+VV7vcn3uxYWE/J50MCoerQPJtP0wlEdpFCp8m2mRnPMmyQkfi1R/2Glvlp9XuEHXZJOka/+PAn9aQ7Z2LJJp93tHA+0Bz+O0kn9KWnQPUVNMdnZ0tzJN2kkBIX3+Y5pjXdw+IphFKF6jeyjr2BbrVtrszRqruiop/1cMRx07d/zFRvdNJJGY7SZR32wZ3fmKr1J9CB7qbah/s2FUJ5bPzD8Np/nU815dqpAhYEn7wCBV9OBg1WmW4vpgWsLqLZwUaGLaffJc0W9nLC2+2e7lduA8ksIVcHoAoFGgak/nXLIpmDsV6qM/0BqGS4nbL7XckHDKkzKPYkqo/WmX2keZGZZ7/UEYn7sMrL+gbFQDSbVlRTfXrnsrlsn69QapW6kalnz5LoossDREYIMkJ29PXcahuFG55QQqIvLjaB1+lOs7Dy4t8NxdAA533SAD6dv5VFI8xuCF1CxTcfm2IpfH5n+VGg9R8DwxrvUxvHxwrrye/RePzpG09I2eXZNLnkAXLsB7YyBSBNRk37L+HAztDwEKfcnjP4YqjJo+uqVZrqGePH+qjkeJPxyxz+lX8yfkXp3PlhY9Mt5+MGN5fLI/HBzT2gtrpIwmlowGPmZV2j1GS2az2/tbeqzX0NtGgzstpgPzyDTY3vjcM39rtcR7PubG2L+IUA/nTt5hfyLMnhuCe+c/ZbvyBzmK4CoB6YBqNvD9grGO2urm1/j8qH5QPqNoJ/E0sN0/mJ5l/HOIzkpFKy7vTOTVlvEiRTMi27bup3MZCRS94XulJtNeFGDaqogbkR/ZBk/wC8Rz+tVPsJj5bU32YyohtkRR+LAmtj/hKraHPm24tl3dJHVT9dvUVEPFVp8+ZJ1Dd4QGH8qOaXYm0e5kxm5ZT5VzNgHkyEMG/EDipH+2RsqzTyOMcKLpcj8Slba+ILiYnAaWPsA0YBHv8ANn9Klh1A3jfPZQxrjoxDEH8BRzPsCjHuYDSanABIY7uVR92O3cStj3G2rFlquoOpcaPebT1MhQAfVWKmtGZUEimcLBgZHzSAD3+7j8jUxs7W8AYCObcPlZlfH5sMUcw+XzKZjluwpmtRAG+6yuw5/DcP1pH02+GPkZ2XgbnUrj8TmmxwReZIqW1y38LeTOdo/wCAg1XutZSw2wjRL66QHG+WBnA+mBT1Jduom27aT7LJaLsY8eTIEb8sf1qvceELq4YzQypCFHPAeTOf7xPH5GtNrw3CjZol2GPI2TeS/wCv+NQreEMFFvqNnLnAV5yQfqQHA/OndkWizH/sK4VGhvYY7pW6B4nkb89oA/M0+PwrGzErYRahGVA8rywSPouAfzro4b4Wqsj2l7MGPO64DqT7Fm/pUcuoWcjmGW0lG4Zw8+3j86fPJbC9nFnHzeCrKOct/wAIveM5OORGFU+qqAMfhVe3+H+ltM+PCktxIxLGaaLyth9cyM278K7OG+sYTILewjSTr8s5kJqzHqou5UZbO5j2nGXX5c+uWU/oar2kiPYQ7HAr4A0uRnafwharjox8uQye5woP60SfDnSx5cx8E6aoDeWkkluokU8HGRjsePmr0GSe4uJmWK7jkQH5hHjOcepFU2fUX1JZHkl+yrAUML3CqhJbOcA9eB2FHtZh7CHY4C6+GpudrWdp5EowAvmBQhPQEhiSKyrj4c+NZUWS8uZ3iT7v2a+C7Vz0CgZI+ua9ZuLqJQX+y5K87Y5GT8NzcVnw+JoLbeZbS9s2J6KBchvxQAfzqlWmJ0KZ5gng7xNctIjW1mkGf9bLqM8Tn32iFAx/GtrTfCOtrH5bXlmEAOGWwJ/Aksc13n/CQW99n91dbRwCu1W/Adaqf2bo+tSEDUdQ80D5oXkkDfjuOKr2supPsEtjlz4L1Czk819O0vU5j0KwRQj9QTmpofD97w5sv7PYggRwXkckR57jZurWurHSNJkWC61BraA/dWaFmI99yuf5U2HRfDqNJLY7XuGGTMtus0r/AIY3UvaB7IzdPsfEturs+m6XbRl8CSKdrh3HTJ+VAv4Zq2lvZzMYzbxTXUT4ZZt2MkZyrMjAfgai/wCEf024dGfT2DsfmeWCS3lP/AXRv0YVPN4Cht1DwwXzIeQsl/KyD6AsaLpgoyWwNr76Aciw1i6iBwyQR5QfiSM/hV6y8RWOoSF8ajBg5P2iKPj2CgE/rWXNo/mHyku30+Y4xJCq+Z9N0iEfrXO3/hnxLcXDeVe+JzKp3RrIyQwvj1eNjx+ApcsZdRSnOOqV0dvqXh6TxRYutvq91arnIVLqSzOc9ypB/Ws+Lw18QNLtVi0nV7C8VeVXULkzl/YucsfxrzW88H+PZZDPc6hrdxGW+a0gu0aMdupiYkVSsIxp90xbQ9Qu73OZEVyzccZyiD8s1oqemjTM3V5ndxaPWtL0/wCJrSSm9n0C2jznNism5eO/Iz+QrTij8RLHsudbtVuc5DW7PBn2OWbNedWL6qzC80uz17TJ0/hvlaNB/wB9scirB8U+KGm2PrFvImcPsil3Dn1RCP1NZuDfY2jUS7noMcfiEsCmttAx++Idjn8MkfyqHGus+6bU9cvovussbWsXP+8uG/WuWhtb7U1w/iRtGkY/LJC5LPz2V0FPutPs7X9xrvjYFJD8ouUSIn6Nk81HKu5pzvojsIPEsPhuQfatTvlDdriV5Qv4kmrE3xQ0aRstemdeheO234/pXLp4a8PXEKEXU16GA2yCaQKffchA/nTbv4a6Ffr5cqw3SSDDRTXEgLe6tuwPyqeSm3qWqlZfCb//AAsnwhuLtbNPNnBdLJ4vzOetNvPjN4X8O2hnkttVhtOrPHA8mT6KMnNcUnwT0PT5ttnNBaPjMcc2syDn0K7cfzo/4U3qUPnTf2Nao0i4EumarcM5467jEVH4Cq9lR6sn21fsbcn7VHw1ESvJdazaxk4GdMuI9x/3gB/OrWn/ALSnw21zeltcXF06feE1vIo/77bgmuA/4QnVNLjMo0DW5XB25E7XOfrmIGkj8L299uGt+BJoYscyT3eB9drpgfhVfV6G6MfrWKTs7fcelzfHjwfBCrDStcnBbAS00hrjP12qa2dH+NvhjVVBgstQg2naVvrF7JlP0lC7v+A5rxS7+H+gjyns9FEOGDKza5PAD9BGuKn8+309XhaSK+2nJt7m8Myp74k5NS8LSktC44qun71j3QfF7w5DIy3LvCvuwkH5KTSj4yeDkjZzfONoyI1tZmJ/4Cqn+VeEya9qP2eJ7XSIdQhJwEtrgIPwVpgo/Ks7UPEFmrSNqfhpYgozIiW/mvjH/PVXCj8c1P1KDNP7QqL/AIY+j4fit4P1TyLd9YhgmmAZLe8heCQ++11yPxrZXxNoqREfbrfbyMblUkDuOa+RbPx3o9wwttK0y6tU+6pntobmNx1PMcgZOc9xVuTxNJHavK2lwFlyq3mlTr5sY6H93KZT2/uj8al4BdBrMns7H1Xb+JNNuJFS3kN0f4hFKrbfqCwNaCxRyZdbRiWx94DP8/Svkq18V3l/5a2erW87McBdXtYhIPZZBHGp+nJrctviFLZx/ZtR1e30lYxhY4n3Z55O0HjP0qJYHszSOYJ7o+lmjDR4CSQgk4aNgPw70pU24O5pE3D7zsvPvzivn9bzTL3ZeRNdSXRfInsZ0LrkdwcY/E1KPiTON1oItd1QR8KDbok7EdgJkIJ9DwMYxxzUfVHtc1+uR6o9937lGYJX/wBraP8AHmoJLiNRta2m3E9FU4/OvCbf4ka7aNuuLvxBpOT8lrqWiRT5HoXhJx9RitOb4+ajpse2XRL+4Ugbbgfu439cBlpfVZj+t0+p7GtxGuP3Lf8AAiT+lVpb6cOdkEzD1QYH61wmk/Ga21iEkuNGuBwE1BwQT/wE5NbA+ITRAC4uIXc94F+U/wDfTCs/YTi9UWsRTlqpFdrO42+WZLySJF4SEGQgehxtxSRtFZo7SW+oSRsMFJp8J+O5hite4Z42ALW0m7r9slfdn0IRCAPxqNIrxoiVi0qKYZ4hhkk/m39KrmK5bGfJJp0CrJNaxRQMchY5YgrfU5q0upWd1IYYVszERwnnBscdMq1TPJPFaFriZg+Qd4Xy+3QBz/WqbapesuYBcRxIed1xbnd+IbpQiS1awpNIwgt1gOMu4nJI9wppkljasrCfWTM56qZQmB77cGqf24xKZLmWJweBF5wfP1Kg1VOtaOZEWTehT+GK2Zo+exJX+WKdn0C6NKHw3bSAyJqU03fyxI7oP++hUtrY2cLkKfnYlf3Nu+T/ALzYArltc8UW9vHuj1DT7ILyI5LNpz+A3g/pUTfEzTrey23V/wCYsg2lre1Nuv5M5/kKvkmzPngmdhHZxDbiWWAJk7dynOfbmq0k0dozs9z5HHzM8ZX8yV5rl4fHWmMqul1dLGTtjYGIjA9sZrRtNQudabzLHW/tCj+CaPbt+mF/xp8kluLmT2NE3C3Cj7PfMyj5gY1ZA3PbBA60kX9oBTIdQkhbp5cwjf6Y4JpJNLvr7K3M0Vw3BYxxqRgdvmOT+QqEeEba6k2ugQNk7ICVUc9QQBR7o7SIJZtcjugkeoRzEj5l8kfJ+AWrTHV7eMs1zC4IyR5ZB/DkD9Kgk8E6XZoDD9vRmbLLazSlm9z3NPg8MadY828MqOxzI1w0m78SRxVc0SbMRtYCAm7uspt5VogBn0ySadp2sQTEpYIspA7qI8HrwcdKnuNQtLMMDfJhD91AXwPf/wDVWTeeNNGtbkvdava28CqT+8UqeO5JPT8KLX6CvbqaayTXErTSQyW79GZpg6/hgj+VPFzBO4H2xC+4ALySfyBI/Gudh8ceHrtA1prQmV/mD2sTylvpsHP51YW4065JkfVf9Zw8Vx+6dh6EE5/MU+XuLmOnVYQ53Phu5XGR9en8qz7yPQJJnS6eJi3BVpjjp6Zrm/7D8K3LsZ2CuDxEzblP4BRWjBoWhSReXHbsIlH3IoxGp59xn8qLLuF2XbfRbCOLZYW2mxRA/wCsjkyfxGODU39kalv/ANHuoYx0OYN3HsQRVT7Np9nCPL+1sin5Rj7v4DH60+PXBHIfKiuIV73EkYwT6csKWvQenUDpd/CD5ty8w6feVP8A2Un9anbRZLja0sLXKng/aJFYdMdcf0qs/jiK3UxtOlxITndsKqPbPPNOTxpB8rNbTyBujW6+YP5Cj3he6QReF4rMy+RpGnWsJOS9u53H6gD+VSyR/ug0d9LCD8uyNH28cdxmr1trlsYf9XcqWfpJGGI/IcVZlvjOzKJZoyBlSFXP65P6UXkPliYL3YswYvtsl8TyY2jOR9CVOT7U5dUW6XPk/ZYkGCJ4HRmP0IxW0NbiLCIbmkxySNpb9AKkeQ7c/ZU29tzA4+uf6GnfyDlMe3ljuFCRXb2zE8i3iUZ+pIJp629xHJg396+fu71IGf8AgJH61ejjTtb7HBySgH+IqO4zG+5be6mfHzbTgY+vXNFxcpWbTw/yT37Yx80asEYH1B6/nRu063Xyri6MqHoZ/wB8fzwKS1lhmkLDTLwOvRnd2z+lT3TWYXf9nuMr1VbdmP5YoCwQxafJEix20rkNuBjt2Cj3zzj8KWbWLCxJWUwoM/eeYEj/AL65qCE2t4SstlftH/ekgKflxzT/AOw9NgRpWR7KIDJEkaD8yAf50adQ16D11rRriU/Zb1POOAzW8ZbH1KrUlxFa3W1JNRnglc5UpuQn8SaoPptlNbrKs73KhsiSBBIQPb5aSG2iMjJHbX17t5/fEcfUMc/oKNBa9Uaq2UeFiTWZNynJ3GPOcfxbgc06bRtsyme+wT91ltYwT/wIisC+0uS4McjaJaywxdmgZ5PwyQv86sR3T28Y/wCJPcWwHRFdFX8AA386LeYc3kbrR3ceRDKtycYGSB/IU7ztWjjDNHGzgDoxH51ltJcSKfKtL9N3TJVVP5EH86q3Hia40/as2nag6KMGaJYyq8/7T7jSswujba7ufNRJrWIqeMxxuf8Ax7BFSLbysCq2MHlqP+Wc5J/Ebc1iR+MbC6A3G/mV+N0dkSc9OWWrVn9mDF7ebUNvXy93H5EZ/WlZlXRpbZ9y5jMSYwVzg/jnOaf5cLL+9j8xF5GPkI/lVGOc3CyNCWL/ANy6VoyPx60Lql1byRqYV2H5WH2hyR74NLUasaBW0dSzWvmw7c+X98n3xVRbHTPmkt/Dt0wbuECH8i2f0pjm4uWAF7Ayn+6QJV/MY/SomuDp6l57yR2Bx+/nQDHqNqfzFKwaF+3ht44dsWn3MK5yY3fAP1JB/nUyPbRkSNpzwuejqC5P4qOfxrPOsF4VlSV7yDOA1rmQj6njFVb3xLNbqJ/7O1i6CDP+jIkjH8AVP5iizKukdBMqzTI6iTOOP9HRiPfoDUNxDqF7GBDdX9iu77/kIFb/AL6zmsiz8X/bCCLG8sn6Yv4vJP45Az+DVox6peIytHa2zbh80kd5IV/BSD/Oo95Fe7IVdPvtrNPeyXUQHGIVUZ99pP6Com0ueVS9nqDI/UxtMyKPpwK1Yrm/aRSbG2T0liYh192weahml15psxy6Xc2x5IaKbf8AnuIo5pIOSLOcutM8QE/vbWO+jY8Ce4Rxn8Rn9az5tL8Q2zZg07SbOLOGWSNZSfpjkV3TXWpRxK82mxTjHK22Pw+8KktdcvJF+bw9PbEH7s3l8+/Ap+1kugvYxfU85uNA1+Ysyy3BjYZeKMDavH8KBT+pNZY0HxCmVt5tSeL+KGWyQgfQkKR+Ve0QasZcxeWrS9oc7WH51aku5FVSC9uQ3Im6fn0o+sS7B9Vj3PBrrwzdXCiO51jUraNfvRLo4O36MwYflUFv4NsLS6ieLxBq9vdA5SWcuPw++EH/AHzXud94gjtW2SeILGzkc8LM+5f1INPt777Uwie/028LdAhU/oSaf1h21QfVY33PKv7LikXNz4jvzKo/13mRtnn+6p/nmrNxpMcKr5WoXkLEY3wHazcdTjj9K9RfSW6J9kUdSv2bg/lTItF8ndtlFsN25hEAQfbBHA/Co+sdS/qz2PKvsOoIAYNQur2OQYKCSNW/BmjNOaxlvP3M/hJ5GznzmvYlJ9zhQw/KvT5PDelXbZuLKzuH6iT7Oiv+fWqcngjTZlMazXijOQiT9PbnNP6yupP1SSODPg95oWaLQ4WOcbZozPz6YY4/HFVP7IvLWeMT+BJFjU4W6juo0VPcqTla7ab4V6dJNHIbzXPMXkbdVkiVfwXA/SpF+HthbHMd9qUYY5J/teUlj9WaqWIj3J+rS7HISeEbLW1MepeFG1CPOQtw6TJ+eNv6mqq/DjRtPf7RpMVj4em3De0emROx7bWZGHH9K75PBYWQTx6leS+i3F2XU+2AcE1K2g3ka/up44ZOx+QEfhz+tH1jsw+r94nByeA728MjzWmlzMrf6yyjV2kHqVc4H4GoJvh54kZ82F5a6JF/dNpbMW9NzgE4+mK9ATQb5pALueWVsfejmER/8dGKa2gpu3Tac0q9D9suHc/lkg0/bvuH1WL3R5RJ8MviKPOZtc0maPqDGjbmyehUY4/GpbPwF8SJopLW6/sm4sjyWi1GeGTHp8jYFekyeF7WaMiPT44ixx5lvB5bj8cVQ/4Qu8jmLw6hexg/wm4IT8lq1iG+qMnhEtr/AHnKWvw18UrDtjuF0hRwGjuDcS4/3ioOP94mrU3g7xBZw+U0+pakzd5Y7WUfXD4wPpW6/g+ZgJJ9T1K4K8KzTSHbz0AA5H1FTW/h++hkC291cbF/hezPX3L8j8MUe2fcf1dfys4XUPgxZakouNU0+zlnbrMFW0ZPxjY5rPj+DcunFk07xLNawNz5f9ozyY/M8V6qvhq+ut0jT3FtL08xWIB+isSBSv4fvQFze3r8feQIM/XANL6xLa4vqsN3E84t/jUskIkeyt3tm/101rcJiMjqWUOSfwFbGk/GDwRq+RBqNjHcdDCsmyTJ9mCt79O/cV5DdfDHW5oVuI9Q8MkAcx3tu80Y9lMTIM/Ssy+8E+J5oYodG1LRYp84aCPT5J7f1xlssD/wLiumVGk9mc8cRWW6PoU3+kalOsqanPbpHhSo1H5CD22/WtWHRLdm3K00ic4bHDfTb1r5OfwH8TtKu/tNq2kNKh+Y29yI8fVdjhfxrN1Dxf8AGTS5mCajb3Ck48qyuHnK4HfZCoHP+1U/V7/BIaxlvjgfYv8AZ6Qx7YbmROcsq8fqc1L/AGe0i5MZmYjG0oo2j1yRya+Q9J+MHx2hA8y1V4wMpeX1otvEg7ggylmHuB71vaV+1ZqlnLLaarBYzXwZVK2twGjJxksWdwUHsVJ9Kh4Wotnc1jjKL3TR9Ox6TFH8vkWzSfew+Ny/goqnc29nJJifSIZpV58wQFsj0+Za8Yh/av0TUIzbvDewsWwDDavKCfQFUzj3JrqdO+Niatawf2b4T1+8gfIllW1jUL2zteTcRkelZeyqrdGvtqMtmd9CbSCbz20FIkjBPmska4HbAzn9KZN4htpvkgYndj5FtWcfoRis211y91K0VrTTnMZI/d3K+S6468YAP51fXUr6481W094IVAKvNOnPPbYxP50uV9TRSXQq3muaTGvkTOIznlY0MLevUHNVP7b0q6lMMGsw+aD/AKlbl9w9iTW7NG9wwUReeV+bYyBvwHTFZd0b7zvm0GJ4ByH+1s2B7oBgfnTViXfqNOivNGSl6+0DJ8uckD6uTgflVOGGSHen2+FgvJjMu5Tx/Ef8KszWcmzjTdGETdRPGwYe54xVuUXMSqBBEIkUAJ9l3Ic9xgnj8KdybGTp63MjOUm0yYMeiOyYGfQ9a05oZY2AMUYcjA2RoVAzUMqzzw7UnW3U5Csmnk4A9yQevtUUMepyFIxePCcYYi0Az/30f607sVixJqV3DlIolI6KCpGD9AQKpmW8O3zdN8rkkPsjRSfpmrLyXcMgH2uORRwyqqDn8Wx+QqCa8hijHmrG5JJ8xEEjrj2C9KLisVGmkNxulsrGRVXIDXIkOfcbePzpkljZ3bKbmx06QZ35mKfKfY4HH4Vpr4ghjgxDcskYGCRaAE89OFHP4VHI8FxIsn2O8d26vJBHEzj8VzxVXCxWFgYV3W8cUMS4Yt542gfQLVeRpkmcC4s7gk5+ffMuPbC4roPMS2ZZHiuZtw/jUKcfXoajMseqYaM3cMXRZoXjBBzgg45/U0cwcvYyYdRlvleK2voNy8mMQYVcehOMUTec0bK0wupR8xGeOnoGFWbzwrpFxMslxcXDyZ4Mkx4I9Rkj9KibwlZ3UASP95Fv/iUspHXoAOarmRnysxY7trybyhqmqacxyDHbxKide2Q2T+NM1G8WxxCbzWXdfuyI0YZvrk8Vqah4LtJkaGUX3kYw0UGI1I9tuGFPtdBtNLtVhhtLhrdVykZc7vplmz+dPmQuWRg3XjSCyt0EjandyDGFaRIsfVxmqlv46t2jlkntb1Ii3En724T6Z24P4GusjttJkXa0N5FI3IXI/Lcuc1KND0u8driCNp7zoPtGZCMDuGIIouuwWl3OaXx8rsnk3qOF4W2mgSMnPpvkDfzrV/4S+aKTyZYxbR4DCb7aIzyOgDDJq/D4dmXAgVYVcZZoY4I8evqf1o/4Q/PzJeTW/Py4WI59SNwJFF4DtIoSeK7tgPs2qWrn/npJM0u0e4wB+RNTW/i673Hzru3nO373llF/4Ccj+VaKaIII9xnZioyqs6qpPvsxmqtxNJaxx4TTIVc43SFXB/MjFLTsPXuSR6zcW8kchjWCFhy6N5hJ+gzx+NL/AMJQdx+ztZzAjBkiYIwPuCCP1qj9quxINmh2siD7s0UkJQn+YFW4biK9VUvoYLabJBSG6Xn9DRZCu3sy/a+JishhuJrZZcf6s3CFiPU4FWY9eTziv2cmPGd6yLg/h1/SuVuPAOk3WV/0iz35JT7QfLYk9QegpkfgNdJjKWxup3ByGhmAYd+pbB/Kjlh3FzTXQ7AeIIWkUiOZkzjIXAz9afLqMckm63upt3/PNQCM/ln9a5I6Hq5YMbyQp/zyuoUJ+uVqSeC4jkREguFZMEyRQHYfxD8flU8q7l8z7HSHUJvM/wBU2WO4tJBjP41IdajYnzEbd2Zbdmx+OCK4vUrzxBaoz6bbpdN/CredLj68gZ/Cqq+JPFl1gt4YiglRctJN54yemfkp+zJdSx3E+oafM26eFC3eR7SUY+pGP60+31SyvJPKMumzRqfkCs6SD/gJHNcbD4k8WrIYdQ8NQ3UcnyxyWdzIR9G3jIrTW+1Wa3Q/8I9dafKpwyx3AlB/4ERmjlBVDpZolZirXFvCucoyxA/hk8fpUwu7mJdoa2mmA+QSSiMEepAHFcwNS1MyCKXSruSM92WMr+oJpl1eMp8sWF4qd8GAKPxZsj8qnlZftEdLNZQXMiT3Wn2Ek6cKwdnPTuwH8xThvikRotMgII5+z3axn89vNcjusbiVJV1HUFkj6RW0iP8Ah+7IB/EGpP7UXyWCW+qGRT9+XT1lbH6fyo5GHOjsJdUSzdSky20h/gmuEJPsTyT+NRy+JIobhImeSEsOXjDyp69gQK52DxVp1ukccrS21yx2qLqyWMsfwXirn9raiqFzpsb2uOZEVRz6nO3I/Co5O5pzo1m8ZaaZms5NZtzOo3PAs6LJjPB2kg59iKYvjqzt3aG4j1CaIH/XfZFMYH1jJ/UVgL4p09WjAu7G3k5z5djuwfqoI/Kri6ml5bJnV/M3HcWtSsUh56BXQ4/Sk4x6jUpdC9N8QvC3meXLcG0mHKq8Mqg/kAK2IfEOhXMKz/a4XjIyJGwufzP9K52S60lQySa7d3DfxRTXPmbfqFyR+VZt9d+EY2WS+nhllbgFI2kY9uQAcfiBS9nF9GP2jXVHWw+JPD11MyQ6xpRI48t5zwf93P8AKnQeK9MW4MH/AAkOiMef3fm7H/DLZrzm58TfD21uAlzo1zKRwjppO9c+xArXtfGXhG1jKi3+zgDIE8HlMuf97p+VDoq2zGqrvuj0H+0rPUmjiS/t3yM7TOXH4YapprU8Ri4sj/sSRn/E15rceLvDNyv7rVbGQY+99nMmfYv0qBYbEqLjTVhnRid7faBF+Xzf4VKole2PT202GNlaSxtJp15ULDH+hIzSbbUsfMsPIlbghkEY/Bhz+teb2N1qUUnl/wDCK3UMGPlvRcCdJCT2w5P5mtcR61bszqbaSHqqzLINvsQAx/HdS9jLqw9st7Glqfh3w3uee9jmjJP3mvbgR/nv2ir2jro9sq/YJsL2WK5EwP44OfzrmLfxDq1rNINQ0VhC4/4+rOLcqj1YSPyPyqRvE2g7hvurONiM+ZHKB7cqrnBodN9QVWO6O1nlilj+a0WZT3l2KR/30RVO4voLRMNow46LbvCSf5Vyl1fafqke2yv/AA/e85Rb6F5B+LAU+PXrrRYT9u03R7lFH+r0uBwR77nbp+FL2RXtl3N2TXLa2jDbJLHPJinuQrD8FDCpjr2nXEJl+xpe4HLREM36gGuNuPjN4e0tljnaPS7iQ7drQSyqvuzKNq1P/wALGikgafT9TtpYe7C1wmfXcwxj3FP2LfQXtl3Olt9ZsI0AisNQWMnJCxEoPzFN1LxVoNiF8621ASMQB5NrK2T/AMBFcjN8XNQtWDm0ma3HDTQwI6fhhyxH/Aat2Hxi06ZlV/llPRQBCT+DlT+hp+xl/KL28P5jrDr2lNal3huEPHyLBJvH1TdmhdQtpPmstQu1foYSDx9Q3IrjdV+LEOnCSW68PpJb4+SQXqNI474TrWPpvx38NiGUpo/iC0B/5ZjTJFGfY+WAfzo9jO10hPEQvZyPU45n+XdL84/57TcfUkNxUf2+SRtzXtkoB6F2VfqCW5rgI/iXpWsN/o0fiGNwBvjvLdI429j5ilatTeLrP7OVs/DT39w3AjDW459ymBj8KSovsDrLozpJNelaSWK08SabdSrwYrYxFl78lnqzFPrSxO9xq1mIm7yRRrImfTBZT+tcLBqk93G8T+Cbi2kx9yO/hTn2Cr+PPrUoaeywr6frWmrs/wBXJL58Xv8AMuCDV+z6E+1vqdv56LFG9zqtqBnO7JUN+I6/lVeTULWU5/tqxgHZeDxn13jNchDInlGQQXCx4y00imbP4Mc1ny6lol0+RdXls4HziC3IUn1+aA/oaPZJCdZ9EQw3GtTYMltJ4eUcYZlLKO3RCo/I8VpQ6qLpXg1LVLS/iXgiKGSCTd6lgEDflV7Q/id4f8VWQluY1so2+ZPtcyqvvgd+c9B1rUaHw7fRJPB5ZlAJE27CqPUbuKuUmnaUbEKKesZXOfTS/DGpJsWC1uHBO1YhMR7kleMg+9PuvAEMtj5hk/c7eFZh5YGP7shIH5Vsf2XNeWbRw+IVKTDYrRpGxz9Pu8fQ1mt4E1CzZXT+yru4UczXNqC5z3wqhR/3zSU/Mtw7o5G6+EPhfUogNTi0+W2PJt1ud8cn1hXCn8qoXXwn8KWcKiw0exmRP9Uiae0yJz/DEoABz716MNOm0y2lnkj0kTgYby4uT+J244pIJTbWrtbuYZWGQ1reKGJPX5jlf0NWqkujMnSj1R5w/hXW48CJ4bRW4dv7OKyKvYYZiF4x2rH1ex+wxqX1HSr69DBFk1WV4Qnpgj75HHAxXqsmn6hfRhptOtfK6q9zfnex9SUUA81R/s+7jmD6g3h21jztRcPOcd8bjjP0GfetVUb3M3SS2PA9Y1jxpcXUdu/jOSyiQbkXwzorx7+enmylgRj3rc0/xB4ljVUN/wCKNaYD93t3M2fQxxKq/iXr2H+zpV2lXt/s+P8AV29gsa4/3mJauc17xlpfhly012yuMZt4Le4u5D2ACqu0flW3tFLSxg6Ti7uRzEfibWzNbnU9T1fSox8ot77Ura3BYn/nkAXP4Ma6IeNvEKxo0O2axiOwvcI0Uh+jOyhh74qhJ4s0y+t3ubrTdRaAHInktzaD3zvRDjt17VhXWoaVZy/adP8AD2nyox3LJFYPezN9JGJUZ9hSUU9LD5uXVM7SH4raja3A81tKMJ/u3hkm6Z27FXH5mpF+MGnzagsTzW0MzfdWSzlMjjH977o/E1zEPiyS6gTy7H+ypJDh4b21WPzFzxtMag/4VNdeILexs3bUWaCPoYYpGnkb2AC4wfel7OPYr2sujO+tvGCXm2SfTbqxT7paQxZk91Cykge5FSR60ZLsoyXMUePlVJUlbH+0m2vGLp/CkMv9pQfDjVLq5PL3du8Nvkdgzbt36VqaX45uLq3MWm+HL60ZsqYrzUnC/gcNj8xmk6Wl7Aq+tmz1q68QWOnxo1xeygseStiAV/Nf6U60ureOYrJqN9PG2Su6REBDDPICqQK88GuWR2W9xJfeayjf5csskcZ9Ou0j6VJDZ2SyGWO5muWB/wCX6FUjP0Z1yR9GNT7M19oeh3F7p91eRRRanbi4XhIWuIwwHqMqWz+NX1jldvkvZC6HDfvRt+h44/KvMLjXbG2hxe3mg6db52oYXYyls9FAOT+dNk8YaHLaCKbxDZRwbtnz28qt9Mh8fnio9mw9qj0aHS2a8xJq0kU7HIhjf7w+pGfyp19pCRkEalNby5z8sgYn25HFefRtoS2/mG7vjA38UdiVMnPZnyw+ua0rbXbD7O0Vq97dLjZ5U0yKVGf+mhGfwo5GCqROmuoUjjMl1qdvHx/y3uE/+tTPIvpFjktYdLulA+Vhcsh/8dDA/hXOrY2iybodGvYnPIeG235P1zg/hioLjS9Wurgzw32r23YLLabMf8CEhGKfKLm7HcWNvqsluf3NnFNnqZmcfyFSwW+pSMReCxZR1jjV2Y/iSB+lcJDoWoqDNdeIbq3I7KgXn3ZpD+gFPH2iFYxH43uNxPEUTwsM++4sf1pcnmUpeR2y3FsrvHHYbJQMlQgH5/8A66pXCXM8JVLYQ/KSG8zA56/KorFsdU1lVaGO4l1di2c77eN/w+bGPwNX2j8Q3UbeVcyRNjG4+WJgO4A2lT9RS5bD5isuna1aqVisrJVbCgRyOJCMdyeuevbrUj6DrsisBNap/wBMmunbHHTmo1bXrfbukuLrZwsbwxqX+rBev0qWy1LxDMGRdMtIxk7EluCC35Diq18idOpQHgq5mkU3egaVcjP/AB8R3JD/AFIK4P51qDT5NNjB8kmA/L5VrYBmH48iluLy8e2VLmzkWUHLw2bLKo/4EwB/SnHXLpdojtp4mIA8yUQoR78t/SlqPQrWt5Ym68mHSpi4GZBJCFkb3+7V9rG6uE3Wkb2qf3o4kA9cHKE/rUk19qrQhQI5g3y/NIoc/QoOBVG21zV2maK7sI0U5AYhghA7Ek5J/AUai0LYs9SSFiZFnHTDYxn3GD+gFT2zStCFnjWAj/nm6/yIB/Ssy6v1LBrb+y7aVBx9quyq5z0Axk0/drFxJGxbQ52H8EdxIHHuDyP0peodTdW1bYyLFJcAjOdu1T9WFOjkvImCNatEg5+W5GRx2H/1q53ULG8vIcTxbGX+GOeVT9flIyKgXXl01VWLT5HkXhQ+VPv85LE/jS5Sua250kuoG1+V79otxG0yAjvz8+3+dT+YJG3fazkZw+8nj6g81y8fjy5WQm706W0CNy1xGxyP9naTn8RVqTxVBcDO+C5i6iL7PNu+h4GKOSQKSfU35NJEyArfTp5g+ZUuCAfwYGmnQ5oxiKdknUYxJIWyPr61kpNpDKr3W2yV/u+fMdm70UfKR+NOuNc0rRpCja5pMe5R/o95dlD/AOhH+VTaQ/d6l2bR9UjV0mLXkWM7NwAx7HOf1qnH4bmkjdY9KfGNyiWYsD+Aardl4ytXtztv7K9IPC2EjSDHpmrNv4uVnRxDEiFsF5J9h/Bec/pR7/YXuPqY8ejX8ZKR6FHGM/eZlVD64CgNn61JceE5JeSUhY8MszyMPpgMK3H8T2XnNH9ssw/3tkV0FOcep7/nUy+JrS3VUkuZCzJvWNUEmfoQMHmlzT7GkYQ7mJD4R8tBss7hxjHlrIgQ+4z8w/Oov+ETuT+8gtLy2deF+1XaFPwJ3fqK2/8AhJtJWHzruR7DnH+lMsefcAsKZpfxC8LX1w0Fn4n06Wbo0AuVP55PNR7SfYv2cO5jyaLrzR4XXbTTbjsZCJA34JtpX0rU4LfN/qS3IAwXgaUBv+AKcj867OGawljY28lnKD3TH6HFWFtLe4j2/ZLWRMfPvXcan2r2aK9jF7M4B9D8N3WJ9T0+xZkGFuWt3dx9cjIqnZ6D4NuJ5Vil0xB3+xPJFNn32YP5ivR7bS9GQoYbCC3ljb5vLjZcH6Y/nU39l291IVjucKTyqLtP5g0vbJF+wdjibfwlaWq50qGVwRl/JumDn6mRTVhtFlt7cM2lak6/xeXcxSoPqHyB+FdG/g9jLkandGPPMZYA9fU5p8/g+zCoWSSRyennvHn/AL54NL266sPYtdDlvJtG2xPY6zp0X/PzHZQOh/2cBW/lTVtfDwuXdQLWcf8ALabS2Rj9eAD+VdMPBdhDdPNBdahbSkciSfep/BhSzeEWkYMb7zCvQttyPzBzS9tHuCpS6I5NtJ8P6g5hk1BJZ34IsnMBP1XJ5+orMn8JWWiyK1vaeKZAG+/HeAD8v/rV3E3hG/mYbNRGzGPLK7VP4YwfwpqeF9XsQwgGmKSMglJFH4jdj8sVSqx6MiVGT3ichJp+gX0J/tLWtWsQrZ2Xcixtn64BNXT4I0+4jR9J1G2ctyDNbNLuHvtrek8MWt5hb9tNM/UpHB5p/AOSf5VUbwOsMjPDq0kMPaO3VbYY926n86pVF0kR7F/y3Of1D4c/aAWFho8szdXmt3tc/RgGzS2vhW8t4Qn2fSI5V4WNrp5lI9McEV2lpZGMFYLw3jYAKSXec/Qbjn8qkm0yTGf7Mtjg/N5kYA+uSRxR7V7FKitzm4dBljh2XEtnZN/csbnCfRtwx+lV18Lxwztcrb2d8WHH7iAg/wDbUAn/AMdFdONB0m1hSWVYbE5yTDL8oyeflLMDTvtdpDIBFPYyxE8MybD+BAwan2rL9mkjml0RrpS76bpT448tpJsL9cKf/Qaq3Hw90+4yw0yOIkZ823RxtPorD5h/3zXbzRm4xIkvyr0XyycfQk8fhUBuZY8lbFrlgf7h3/XIPFCqSWwexg9zj7bwfbWuQk9zZT4wJJIJRIfoxwfzqFtI1u1vIpLHxfqwt1OHtriw85D9WbnFdm19dQw/Pot+EZvvWsnm7fcqWBH5UfZdQucSQXd7asPurIoZfxBUkfgRVe1l1I9jHdI5i2tdZSRlvrBb9GORc2NsYh/wLL5rR+wSFv3ulL5PVi8gyB67QpJ/OiTSvGEkhaTXLJgT/q49OcuB2wS4/lVG58K+JdSBik8X3KLn/VrbCJ8+xDU+ZPqieVroy7Lpcl9GBHeyWNuOBDChhUj3IO6orDwjJZSCWDVZpTz+5aaRwfb5+351DH4P8YW5aE+J5rpMctJC27Hpuzg1Ym8P+KY4QF19iB0j2rk/TcG/pS5uikh26uLBND1X7Q3lWNmnmcma3vSnT+8hXk1LN4b1IMN1+tu3dfOlP6AgD8KzLqLxpbhdurywFvlHmaa0wP1ZGzVRZ/GajbExnI+9JDG8eT7pI2V/CmubpJCbj1iz4c8T6Df+HtG/ta916+udGU7UijKmeVhwWkLAjjBABLcAcjoM4/GxfAMenrZf27qhuY/NQXmsSRIihiMbE+Xt6Yoor3Wk1qfN3aeh6Rpn7RvxIkSO8efRdPsQhcJHZm6m2Z2n5nKgNgdcV1/gj9ruz1cra3dtqVxcKSpleGABjnAJ2kdgKKK5alONtjqoVql9z2DSfist/cWcZSREuwWjxCM5Hr8/H4ZrqrLxA02p/wBnrFuunUMkjsdqg8+5zzRRXnuKR6sJyfUu3tjFbymW4T7QzLuy7sxI9CSafFpttstw1rHA864xCxxyecng0UVg9zrIxolvDJO6RQrg4LCFNy/RiCfzNVpIRFmLzJJo2+ZhO5OB6DBGKKKqLZEkrkEOkafOplgV4Z2z87qsnQ+hqwPDMNzGr3MvmNJ0AhUKPwGKKKfPLuPkj2KcvgSwmDlbm6aTONpYRxdO6JgN/wACzXJS+BwLgiGS3e45RC1qiKmDjjAJI+uaKK2hOXcwqQj2KMfw0vdduUjur2GKZ/8AV/Z41VF+o2c1Be/A0l/KbWLogHLKk8kSN9ViKE/nRRW8Zy7nO4R7GTeeD5bCIRDVriKELytqiAsMYwTKJaz7P4V2jO11HbR3l0v3rzUpxLKo/wBgLEqj8qKK3uYtIkhu7K1m+zrAxkGVMsiRu/B7MVyBSaxdT6RbLc6bpmnyXJcjztQZ5GUeowBzRRQtyJbHGN4/vJNSFtqFnaS3cudslvGqAegJKkkdK1bGyk1+5X7WZg+7Z5cN48cY+m1Qf1oorV6I51qzcb4XaVdTq95PqUzq2CDqMpXp6E8/jV268Kz+CbeSTTbuNLdU81xdQm4+UHoqBkAPvmiislqzdKz0OA0z44WPiDV2ji0C11FYJPLMt9brAwPqAjNn8TXoNlqmtasJ/sFvY2IGQzROIuM+giJPH+0KKKqysZxnK+4x4tYmhaW41BgIm5mjclsAdlI/9mpNO0e/mZJtO1m+ilk5DXE7yBvm2nIYsR+B/wAKKKT6GkTWnvvE2lwL5V/DPuGBHMzYY9yWA4/I1attSm1JEW4t4laPDPsk3E8Z4Yr/AEoorNpDjJluHU9ywIYXiYsQgW4JVTnrgKua0JY2mjWQxy/3dy3rD/x0oQPzoorN7nREs29xFp7PBJA8hHzKGm3AH67Qa0INSsZdP81rNmjZtu0vzn1zRRWL3NUUrnTdF1hArWk0IzgtGybgfUEqc1Sg+E1kUNzY6vq9nl8Ex3Khsnv9w0UVSbSJklcltPBkcc6qb+7mk5HnSTPv/wDQsfpWhJ4cOnWflT3kzCVseYgQuAR6spz+OaKKd3YpJCR/D2xukhh+0TSPKvyySJGpX3+VRk1zep/CbUoFke31uaPYduI5PJyPcqmf1oopRnJdRzhG2xzEvwmu47mWCW/+3E/MyanM12gOOq7lBBqfT/hnrGn2xuEv7BIc5DeRulxnoDgKPyNFFdd2cDSuKvw8g1pJp3vpp54iGUtHHEVPs6LmsXxF8KteVhKvizUraAkeZGt9NLkD0yRiiihSZUoRtsYs/wDas1mzaLqaQ3EJKvNe2odsDjI+YjPHUis/Ro/iRqUEl8/iyMWkWdyKZFdgpIwAuFXp2FFFbR1RxVHaWhnX/wAZfFPhqUzDTNF1S3j+9/aLTSyMT3Bz8v61dHxn1PxDp1tqX2a0sInJTy4Id7KQSPvOSCOPQUUVo4R7GaqSvud54cs9W8WaessF6RbnO7zZWjbvnAQYHOa0nsdS8MW802k+IdQjljTe9vMEeN++N5BYfWiiuSSO5SdtzhI/2nfEE9xLHDo6WsttMI3ZdYnYSe/3APwxXfJ+0XrkVkb2+0zT5Ywu7y03l8D/AG8jJ/CiilKlB9CI16ifxEvgX9qvw58QtbTTLXSta027YZLGSNoj9Rnd29a9X1bxVc+ErMTSP50cqLIqohJ57Hcx/SiiuKdOF9j04VZvdmpaeNbe8htZPszZnX+IDg9PWtGbV/sNtJPLDHJEp52qN34dqKK5JQj2PQpzlpqVrLxvYapBI8EU4A7TRL247NVvTfE1nqZZEgkEi4yWUD8jk0UVjKEexupyvuaa3ImLZ3YztHqKkW2Q/O8cZA4xtJ/maKKx22NtyOXTrZJtrxIZGHVUUcemcZrBmm0izjnnS3uBjhgsh5/NjRRT5ncyaHae2myxw3FvYq3nc5mUBhz685rQSC1kYJ9jhZphxvGQPwOf0oorXoQyg3h6C1BmTTbVgT/z8yr39ORV6KO1VfLNvsbbnAcsuD27UUUwHT2C20iRp+5LDKhGYqv4ZFQNpupvcgQCzaM85leTP5DiiinEUtx88GpwwN5lxb4HLRpGdv4EmsqS8ayBabT4JI8EgpMQRz6bP60UVSFcntZILwCZbRVY/wB6Rj+lK91OoZliiiRWwPLPXjuNv9aKKdlcV9DFuvFV9HthtbgNk5PmQKuCRnggmltfEOqbSs90FZeBsRWH6iiit4wj2OVzlfc//9k=')
    }
    return w
  }


  async getImageByBase64(base64){
    let req = new Request(base64)
    return await req.loadImage()
  }
  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {

    const url = "https://api.notion.com/v1/databases/"+this.databaseId+"/query";
    //获取前三十条数据
    let numberOfPages = 30;
    
    let lastIdExist = Keychain.contains("lastId");
    if (!lastIdExist) {
      numberOfPages = 100;
    }
    
    const options = {
    method: "POST",
    headers: {
      "Authorization": "Bearer "+this.NotionKey,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "sorts": [
        {
          "property": "Created time",
          "direction": "descending"
        }
      ],
      "page_size": numberOfPages
    })
    };
    let req = new Request(url); 
    req.method = options.method;
    req.body = options.body;
    req.headers = options.headers;
    let alldata = await req.loadJSON();
    if(lastIdExist){
      let lastId = Keychain.get("lastId");
    //获取所有数据
    for (let i = 0; i < alldata["results"].length; i++) {
      //判断id是否与缓存中的id相同，相同则跳出循环，不同的话将数据存入data
        if (alldata["results"][i]["id"] == lastId) {
          break;
        }
        await this.handleData({
          "id": alldata["results"][i]["id"],
          "created_time": alldata["results"][i]["created_time"],
          "Price": alldata["results"][i]["properties"]["Price"]["number"]
        })
      }
    }else{
    for (let i = 0; i < alldata["results"].length; i++) {
      await this.handleData({
        "id": alldata["results"][i]["id"],
        "created_time": alldata["results"][i]["created_time"],
        "Price": alldata["results"][i]["properties"]["Price"]["number"]
      })
      }
    }
    //将最新一条数据的id存入缓存
    Keychain.set("lastId", alldata["results"][0]["id"])
    return {"monthCost":Keychain.get("monthCost"),"dayCost":Keychain.get("dayCost")}
  }

    /**
   * 处理数据，从data中提取需要的数据
   * 首先把created_time转换为本地时间，然后提取出月和日
   */
  async handleData (data) {
    let date = new Date(data["created_time"])
    let month = date.getMonth() + 1
    let day = date.getDate()
    let price = data["Price"]
    if(Keychain.get("month")==month.toString()){
      Keychain.set("monthCost",(this.accAdd(Number(Keychain.get("monthCost")),price)).toString())
    }
    if(Keychain.get("day")==day.toString()){
      Keychain.set("dayCost",(this.accAdd(Number(Keychain.get("dayCost")),price)).toString())
    }
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }


  /**
   * accAdd函数，用来得到精确的加法结果
   * @param {number} arg1
   * @param {number} arg2
   */
 accAdd(arg1,arg2){ 
    var r1,r2,m;  
    try{
    　　r1 = arg1.toString().split(".")[1].length;
    }catch(e){r1=0}  try{
    　　r2 = arg2.toString().split(".")[1].length;}catch(e){r2=0}m = Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}

}


await Running(Widget)
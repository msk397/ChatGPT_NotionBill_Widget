// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;
// 
// 「小件件」
// 开发环境，用于小组件调用
// https://x.im3x.cn
// https://github.com/im3x/Scriptables
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
    //判断是否有小数点，如果有，保留两位小数，如果没有，直接显示
    if(dayCost.indexOf(".")!=-1){
      dayCost = dayCost.substring(0,dayCost.indexOf(".")+3);
      Keychain.set("dayCost", dayCost);
    }
    if(monthCost.indexOf(".")!=-1){
      monthCost = monthCost.substring(0,monthCost.indexOf(".")+3);
      Keychain.set("monthCost", monthCost);
    }
    let content = w.addStack()
    let todayText = content.addText("🍔今日消费\n"+dayCost+"块");
    content.setPadding(20, 30, 0, 30)
    todayText.font = Font.lightSystemFont(16)
    content.addSpacer()
    let monthText =  content.addText("🐼本月消费\n"+monthCost+"元");
    monthText.font = Font.lightSystemFont(16)
    w.addSpacer()
    if(this.dark){
      //图片来源：https://images.unsplash.com/photo-1677216794333-c6efad6f23f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
      monthText.textColor = Color.white()
      todayText.textColor = Color.white()
      w.backgroundImage = await this.getImageByBase64('data:image/png;base64,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')
    }else{
      //图片来源：https://unsplash.com/photos/-yWZ9cI4XX0
      monthText.textColor = Color.black()
      todayText.textColor = Color.black()
      w.backgroundImage = await this.getImageByBase64('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4SskRXhpZgAATU0AKgAAAAgABgALAAIAAAAmAAAIYgESAAMAAAABAAEAAAExAAIAAAAmAAAIiAEyAAIAAAAUAAAIrodpAAQAAAABAAAIwuocAAcAAAgMAAAAVgAAEUYc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAV2luZG93cyBQaG90byBFZGl0b3IgMTAuMC4xMDAxMS4xNjM4NAAyMDIzOjAyOjI0IDE3OjU4OjQ5AAAGkAMAAgAAABQAABEckAQAAgAAABQAABEwkpEAAgAAAAMwMAAAkpIAAgAAAAMwMAAAoAEAAwAAAAEAAQAA6hwABwAACAwAAAkQAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAyMzowMjoyNCAxNzoyMDo1OAAyMDIzOjAyOjI0IDE3OjIwOjU4AAAAAAYBAwADAAAAAQAGAAABGgAFAAAAAQAAEZQBGwAFAAAAAQAAEZwBKAADAAAAAQACAAACAQAEAAAAAQAAEaQCAgAEAAAAAQAAGXgAAAAAAAAAYAAAAAEAAABgAAAAAf/Y/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAlQEAAwEhAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A6kWwH90c46YpwtFPOUY9snNdFzmsI0K7cZU/TBAo+z5GAB04wKLhYUWvlryoI9cim+UcYVGJPtRcLAIWA5VvypfKOcYAPfjrRcVhwt3Jzjp+FIIn5yB6YzRcdh3kNgfLn3pY4H2ng0XCw420mB8nX/ao+zNjjav+8aVwsKYVxzJGD3OaBFGOSQfcKTRcLC+UmMZPsNtKIQB8qn6jii4WHBF6iIt6/NR5QH3YlH5mkMUKCSvlpx7U4L/sx/kKAHrv5C449hTiZSPmcj9KRQnlEgcg475pnlpv+YgNnjJpXCxIYOeuDSeXgckD8aLjsIqK3AYHHam+WoOMp+BHWi4WFaP5e4/4FTfKQDJJA75JouKxa+xI4+b6jlqc1nGBgcZ96XMPlIfs+w7d30UU77LJjnDf7zU7isL5TLxkZ9jUZtx0bJOfWi4WE+znso/Gm+SVPC/kKdxWAQhj8yEH3pxhVPujGfRaLhYb5bqMrI3sAmKTZKQfmb8VFACeTzyenqBTvKXBygx3+Wi4gMQVMxqqnHZKjWJ+G3rnvhKdwsSqABnjPrtpQGzyVA+lIBwHoAR7Uuwk8AfiaBgI25+6KTYwPHPtQArME5YHH+ypP9KFKSjIDc9fkwT+YpDHrgddwHbIp2QD1b68f40highumcZ9KUiPd0HvkUhi7T/CP0phHqCD7CgBn8WNj/XHFNdl7lh/wE0xF3cgOCD+VNfaf48/8BzU6lET7jjEi/gtIFfHEv8A47iqJDDDgup/A0g5B4WgQza4+6EP4mnDPQ4B9ATTAds9D+lLwDjg+2KQCMoYjPH50pi3Ljfj3FFwGLCB/wAtdx9zUuwY6/lRcLDfLXdndg0GPPSXH4UAKIif+Wg/KnmH0IouAzyiCcMPypRE3/PRM+wp3Af5ZA+8KQxt2K0rjsO+ztj5uaXyf7o/pSuNId5J6YP4kU142GM4H1FK5VgEeelHlHPAOPpRcVhNjY6n8qYcDqW/75oAGQkfKx/EVH5ZPU/himmKxMUHXIB+lN2kHlifcigLCGNM5NNKL1DfpQIayZxh1A/3ab2++Ov92qEIxP8Aeo8xh0P6UAKHkI6c+5FA8zdnj8AKAHhm7jP4Ubiegx+NIAG8f3aXL9cCgBc+qLRvbphPyoAN5HPH5U4SHsn60AKZGxyq/mf8KBk/wKD60APAx1JP1pw2/wB2kMcGU9vzp4wPuhfzqWWhpbB4XJ9KQlmHEZ/AikAqu4H+rcflSiST+4aLId2NMkuf9WKdukI+7+lFkF2IWYD7n5L/APXpokOOYx+JosFyuZLgLk2pP/A1pjT3GcCxfHruWrsu5nd9gEkhOGtHH1YUE7Rkwke27/69MQwzr2glPuB/9eo/tC8/6NOMd9vWmkJsryajAr7fs90T7RtUqTQyYJSRM8AOSKdmhKSbJf3Y7fqad+7C9OPxpaj0ECwhtwyD9TQSp4ySKNQE8mM4IpwUdgaAAxqfX86T7OnJ3MD/AL7f40XAPJYdHGB67if50GNs/K4P1Un+tFxDljYcsfyBxUgbHQ8/ShjQFiepb8BQH5x8/wCVKw7jwQOdzfiKeJAD1/8AHTSaKTHblIzg/hTDGhOeR+AqStw2ADh3/OnKGAxuf6k//XoEHl7jzIfxNL5Z7OfzouOw0h+5P4ml2N25ouFiQJJjjFIyyDsPyo0DUifzPQ/kaibd2Rz9MiqViHci8xskeRKffP8A9elMrBc+VJ/3yaqwrjPMLf8ALJx7kUbx1MbflQK4pkXHcfjTS6KMnAHuaAIzcW3/AD1Qf8CFRme0yAblQfTIpq4roAbc8i4bHsf8KeDbEcSscfU0ai0Bo4pRjc/HoXH8qekUYPWT8d1Fx2HYTcOXz7ZqTHPU/maQC56ZJ/DNAPfnj2NAx2/HcijzPRh+OaQx3mRjhnTNO8yEcmZR+IpalKwC5tycCZTT96N92QfWlqPQaF+b5ZB+VKImz/rD+QpXCwGGTr5/6Cl8uTH+sJ+oFF0FmM8qQD5mJ/Cm+U/95sfWndBZkJ1BLfAmvgM/3kAq2J1cDFynNDXkCfmKWyP9Yh981EcluJU+lCBilWPVlxUThgeGX86aJYzcR/En50xpivQxk+74qrE3EFwx6eV/39/+tSG4lA/1C/8AfwU7CuN+0XJ/5dE/7+ijzp+nkRj/AIGKLILvsSLLIR80YH0YU8P/ALB/OkMXdx90Ux2T+IL+JoATKYPC/gxp6lMdvxagQoKE4wv4kVIFXH8P6UhjTa25OTBEfqgp32aL/nnH/wB8ildjsiQRD/nmmPb/APVThFxgJ+ppNlJB5LY+7+GabskA/wBUT/wIUrjsAjfJ/dY/4EKXY+OYc/UigNRDCccQJ+YqJ7bd962jP1Of6U7+YW8hotlUApBEv4Uuz1wKLisYjW2tId0Lac7DkFo2H/s1WVuddTHmW9tJx/yzYjn8a091mac0Rf2lqQYrPpMjAd0ZT+XNTrrdt0ewvFYdf3DGk4dmNT7osxalZ3HRJV9nhZf5ipTLZsMZj+lK0kVeLIma0HRY+KZ5tnnGIh+VPUnQDNZnjdEfbcKcPszD7seP94Uai0DybdukaH6MKPstsTnyE+uBRdhZDvs8OMeWmPpR5MY6CP8AlRcdiRUVR0H4UpXJ4yPypAM8gnkSsM0w2pJ5uJP0p3FYBaDP+uc+24U8WnvJ/wB90XDlJFhYDAZ/zzTjG+Orf5/ClcpITyZv4Gb/AL6pBFdqSQwb6mldDsxxW9HJK/T/ACKUfaVHIJ/L/Cl7o/eHCRwOUJPsKcJHP/LPH1pWQ7sXe3oKPMbuKVh3DzD6Cm7mPQDinYLlXB2nDIcf7P8A9eo23bv4D6YJFWQKFnc4xGvryT/hT1hGBljx9aAJVULyH6+1DEd9ue2aQERiQnJSPNM8pP8Anmhqrk2E8qHvHEKPJgPGyM0XYWQn2WD/AJ4x/n/9amNYwn+AfTzDTuxcqBLGKM5WNAf941JslB4ZMe+aLha2w4ed6Ifo5H9KdmY9AB/wL/61LQNQ3Sg5IP4HP9KdlzztP4ijQYmXAz5efrxSGR/+eRz7UAOEz9PIl+uad53J/dyj9aVh3FEu7nE4+gHNO8xc5P2j86Vikx/nL0HnD/gJqNrxE4JnH0iJpcocwfbFIwJZx9Yv/rU4T7hn7Qy/WPFFh83mBnj6G6/IYoEsZ6XQzSt5Bddxwyek5P4ChhJjAkz+AphqVEhRHztOT3JzmrAQEfLn65obEhTGfUn60hBxjH6UANO0cFf50wsO3bp1qhDQQe36UZ96BBvGMkfpSeYvqPxFMQnmxgcsg/SjzEPQr+tFguG9O/8AWm+dCuclR9SaLBdB9pt8gF1JPTk1J9ptz/GBRZiugNzb9DIv40CeLOROmPpRZhdEiujH5XQn2FSKCR1WkUO2/wCeadjA6mpGLle5/MU4bPVaTKQZg7yJ/wB9U0tbA580A/8AXSlqPQXdER8shI/3gaQhCuPPI/FaNQ0FESYyHBPuBR5R/wBj/vmi4WDyT/s/lTDC4HDqPcjNNMTTOZju9TtTh3jmPUqke39alXxBODg6fM/OCVBwPfJrXlT2Mudov2urLPHlopE9Qy5q2LqNsDzFHtmocbFqVx/mKejU08jnafrQAzZnqqE0nl8/cA/GncVg2YbOz9aUrz9z9aAsIYx/cxTTbRseYl9+lO4WQ0WduP8Algg+gpfs8GOIvwyaLsmyG/ZYm48jj1yaPsNvggxNg9tzEUczDlQ4WcHRYyv0YikNhEf74+jkUczDlQ3+zoiOTJ+eaibRrWQ5JOfUnmnzsXIhp0NP+WdzIv0fP86QaTej/V6rNj0YD/CjnXVB7N9GPGm6qPu6ix/Cj+z9bJyNSOPQrS5odh8lTuKLLXVbJuYG9N6Dj9Kf5OtdzaZ9ozReActQURakG3NbWrH1xihpb9M/8SuN/TbKBS919SvfXQRbu8J+bR3+onX/ABqYXLkZbTp1+kg/xocV0YKT6xFa7I/5drn8GJ/lQtyneO65/vBuKXKw5kVVWKFdpLnvuPT86MwzKVQowXruINMB0ccbj5gTjjBTj9f6VJ5EYOAoVfwFF2FkNNouflkYfVqRreTp57AD6E07isN2SD/lvn8KN0ynh8++aegtQ827znarDPY0G5mX7yY9Dj/61KyC7D7bxyoHvkUhu4j2U0+UOYT7VACPkHvtNSLdxE42yD/gJoswuhwnhPI3D6g0oO4/K5/MikFxQpznziP+BCnhWz/rT+dAx2JB3LfjTGM+fuSnHoRS0DUVZpQcFZvxxTvtLKR978qGkNMP7QwcFZs/9cTipkvVccEg+jIV/nUuJSmSi4z0H4mjzuf+Wf8A31ip5SuYf5h6lfyNBf8A2VP1alYdxC7/APPJT/wMUZJH+r/AsKAEGT96NP8AvvP9KGSH+KOM/U5piZRE0XRJFJ9Gao5DKVfYyE9s4IFXYi/Yqf6fgEwW+3vhmz/Ko2e43BTabgeoLHp+VVoTqWoUcbsxqi+zH/CpfL9SaQxRxxvP4Cjd/wBNW/MUAODKTxID6/NTgTng8fXNACE9vLJ+gpuwHnyj/wB8igQgRf7pH1zSeWn8QIpgIbcDoz/8BxTTaswyZJPyFFxWIm08t0nnX6Gon0oscfabkfRx/jVKRLiI2kz4+S+nH1NM/sq83fLqL+nJo5l2FyPuA03VF+7qH45PH+frQttranjUomH+6f8AGneHYLTXUsImqL9+4z7rj+tTCa8Qcu7e4wT/ACqGostOS3JFubvP3ZPpsWnfbb5T/wAeO4epIFTyxK55dhv9pv1azXj0Of5A07+0Fx/qOfTy2o5PMfP5EZ1GL/nxmLD0Uj+dIupWqjm3uF/A0+R9xc67Ev8AaVsV+5KB7rj+dIL+0c7QZSR2KUuWQc8SiPtkS52rN/v7QT+IFBuJsfvbOJR32zYx+lXZE3aJEuYlGMOv0cHFOW9tlxiduvcilZj5kPN9Hk/v0GP7xoW7VuFnhdvTNHKHML56f89YMdxu6frT93GVEbZ7gUrBcaZVx8ygH6UKIiC2wc0D0D90Om9ffJo3RH+Ln3NPUWg7cAOHH54oOe238TQAAEdAvvg05S59R9DQAfNnoT+P/wBal2r3AH4UCHALj+Ej6U75dvA/IUhgnzDrj/gNPAHr/wCO0hodtjxks34CgRx9Qzn/AIEaV2VZDSIg2Hcr/wBtGP8ASgLA/CSt+D0tQsh4VATly31pfkzgdfrmjUdkG1D1UGkMQP8AyyUge9Fx2GGBSTm3jx65NNNuvXyV/OnfzJ5SssrbuJlce4NLjcRxHz1wKokjaDJJZFODwcdKha0RmHPXtgH+dNMTRG2m5JHO0nnCqP1qN9LjJx5ePxquYnkIDo6Dswz6sf8AGov7IKHMUmxv9knJquYnkHi31KFB/prjHqvH6iniTVeQt1AOOu3Jpe6w95dRoutXBOTaP7gEH+tP+2aoFwIreRvdutFohzSGf2lqyECTS4uvVZKe+q3a/wDMOIPuw/xo5V3Fzy6oifxDNCf32lTlcclMGg+KYx/zC70/SOn7O/UXtrbosReJLd+trcxf78RWraazZNz5h549alwaKVRMd/aliW+62eufLI/WplvLUqCAcduKlxZalEeLm3LDhue+eKdHcWrZEcpJHB2yA4pWZV0TefDj/j4x+IqRJoJDhbhGb0yDUNMtNDsqDxJj/gNLxn76/lSKE27jxz7gsKGRgPlQH8aVwsN2uf8Almo+uDTWjkPRyvvxTuhWZGbefGBcyEe+KaYLoDK3T/kDVXRNpdyFNvRWfHoV6UrIxAPmEA9iBmmIZsKnLOW54/dU7qOUJB9RTEMIAx0X3601mTOPMQeoxTEGPlwCD70hEh6Mv0waAEImj/hyPYYx+tDTA8MmfxpiGZXcAYTjtk/0p2yJj0I/EijUNA+6DtXcO2c/zpAueBECOvIyKBD/ACRjAhx7A4pPJTp5Rz9WNFwsNNsjBt0S49xwfzqI6fbH/l0gyOhGDTuxOKYv2AZG1F9cqoBFINNlUsyIEJOTtUc/WjmFyjGsNQBzBJjPUOxI/LNVpNOv2f8A0mCzm9C0Q4/Q01KInGRMIrmM7Wjtox22pRvfkG4ZSO6YP8iaNB6kL+dnMeo3XPYIxx+XNQ/ZtRLbl1K8K9f9ZIMfgRT06oT5nsyRE1GNy63l1L7NK3H5nH6UrT6v/C8px2WcUrRYJzWwv2/XFAEiunpudeam/ty7iwtwyxsOhOOaXs4PYaqTW5ImvXDtlRFIv+yxP8hU39uSLxPZyKP7yksP8RSdNFKq+xMl1aTk7LiIn8M/rUih2yUXCn3FRa25pdPYGW5OdmAT0yTxUWLvdhntx77iD/KmrCdxSq4+aXd9DTCFByBMfU5piEJJ5jjXj+9kf0phZu5HTopIx+lMQKSCCAxI/wBtqf8AaZBkcf8AAlNFgvYT7YVO1lDZ7DA/maY19b9XC9e5B/rRYLjlu7Zgdrjn05pfOiIwXOfdTRZhdC/uWAy3PsSKeFXBAnAH1oDQflhwZR9cZpN0meZIiPUA5pAS5f8AvfjikOSc8HHTI/8ArUDFYsMYkjU9srmnrIqnDTRA+nHNSxok3AjPmoVPQcU9BGRysbdvu0tSlYGijJ4hhx6kY/pTfLiDhfIwPUMMUrsdkDwWnUqo991Rm3tuu4nH95h/hReQcsR4WAEBZQCenzCl2owwGbB7g/4GndisiNkUD/Xy47cUojQD77j6Lii7FZHMtols/DpLF6HcR/XioZPD8i/8e2o3EWOgWY/1zW3P3MfZ9h0dprlrwNUeVPTZux+JNSnU9QtvleKW5Y47qoH5DP6UWix3lHcnGrswAms3UHqS3P4fLzUqalbbeUmX8AaXKPm7kiXltK37tycHBB4p3nxl9vmr+NKzHdD96hd5dCfXIH9KR2TGX8lgeh3UAN2278FF/Bl5/Wn+VEeRtb22g/rRqLQjCAkgWob8QKAkmD+7VMdgM/yNMBwiJXld6nruGKFtYQOE2fQ0XCw824ZeJJF91bFILRgeLiQ+oZx/LFK4WHm2lA+Xd7cg/wBKb9muOcAhvoBRdBZj/IugOx+nH9KTypguGjUc8EjI/IUroqzGG3mY4DW/H/TP/HNO8qUYXzIlz/0y/wAKLoLMURSLzHMCf7pJUfyJo/f5x5kan+7ISfyyB/OjQWo7ZeBt3AyOGXH8t1AivTk+eD/uoMj9aWg/eE8nUhwJ9ynuyDI/KmJFfBiJJWK57KpH8gafuhaQ9oHYkmUM3plVx+hpfskhGMg+uWUii6CzOFTxdq1nGxlkiuI1O3aUwT+OTW3pHiT+04BM9jEhz2P/ANatJU0tUZQqtuzN1CkoAKfmc0/7JHgY4z2AFZXsbWuVW0uNtx82Xk4I3cflUE+kJDHuSaTk8ZOcfnVKRDgjNaydh5ouH4/hYlh/Ok2zrtPn/KTjGz/Grvci1iC6vJLNo/md9545Ax+lS29xdzjiYKPdSf6inZWJu72EkvjBKImjDNnBccZ/MGpIr+V5CFWMY9Rn+WKLD5iaO/LyiNoUzjOVyP0q6sjMOOPzqWikyyI1b5hkMR1BqM28sfPmxsp7GLB/MGkUH2V2TcJipHpn/Gs+a5vYCdtwmB/0z5/Un+VNWZLutgN3frbeclyv+60Qx+mKpXPiXUbWWOPdE5bGSVx+WD/WqUUyXOSG23i69nmKKChRtpywYH8MZ/WtWTxFe21sJ3WKQMcBdpGPxzUumhxrStcs2HiV74hWtUViOu7I/lWvFeiQkGFQQOorKULdTaFTm6FjMTKpMKnNP8mIrjYAPTArPVGtkxDAAMA/pTGT5SdzZH0/wppisIEDJuOc/WoiInYq0Ktt6EnNNCaQggt8bvITj2FV50twyg2yHJ9SKpNktLsf/9n/4THkaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdG9yVG9vbD5XaW5kb3dzIFBob3RvIEVkaXRvciAxMC4wLjEwMDExLjE2Mzg0PC94bXA6Q3JlYXRvclRvb2w+PHhtcDpDcmVhdGVEYXRlPjIwMjMtMDItMjRUMTc6MjA6NTg8L3htcDpDcmVhdGVEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAFWAk4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAV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')
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

      Keychain.set("monthCost",((Number(Keychain.get("monthCost"))+price)).toString())
    }
    if(Keychain.get("day")==day.toString()){
      Keychain.set("dayCost",((Number(Keychain.get("dayCost"))+price)).toString())
    }
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }
}

await Running(Widget)

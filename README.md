# ChatGPT_NotionBill_Widget
## 效果：
  1. 人工输入文字至快捷指令，例如“拉面15元”，快捷指令会使用openAI的api解析成notion可识别的json格式，并上传到notion中
  2. 利用该[js文件](Notion记账.js)，获取到notion中的账单内容，进行统计，以小组件的形式展现在桌面
![效果图1](https://github.com/msk397/ChatGPT_NotionBill_Widget/blob/main/lightWidget.jpg "浅色模式下效果")
![效果图2](https://github.com/msk397/ChatGPT_NotionBill_Widget/blob/main/darkWidget.jpg "深色模式下效果")
## 1.Notion设置
* 复制[database模板](https://msk397.notion.site/e7080a3f84e4475b92d75599c4a5abdb?v=485d7cecb2db4b25b70758d5cceca2d8)
* 把Notion的机器人(需要自己去申请)加到这个database里面

## 2. 快捷指令
* 点击[快捷指令分享网址](https://www.icloud.com/shortcuts/e6d97dd072f34937823c00823203fcd6)，下载快捷指令到手机上
* 按照说明，将Notion的database_id，openAI和Notion的Key填上

## 3.Scriptable
* 首先下载[js文件](Notion记账.js)，并把766，767行改成自己的database_id和Notion Key
* 将[js文件](Notion记账.js)添加到Scriptable软件中
* 将小组件添加到桌面

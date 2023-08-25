# ChatGPT_NotionBill_Widget
## 效果：
  1. 输入文字到快捷指令，例如“拉面15元”，快捷指令会调用OpenAI的API，将文字转换成NotionAPI可用的json数据，并上传到指定的Notion的页面上，页面支持按类及按月统计花费。
  2. 利用[Notion.js](Notion记账.js)，获取到notion中的账单内容，进行统计，并以小组件的形式展现在桌面
![浅色模式下效果图](https://github.com/msk397/ChatGPT_NotionBill_Widget/blob/main/lightWidget.jpg "浅色模式效果")
![浅色模式下效果图](https://github.com/msk397/ChatGPT_NotionBill_Widget/blob/main/darkWidget.jpg "深色模式效果")
## 1.Notion && openAI
* 复制[Database模板](https://msk397.notion.site/e7080a3f84e4475b92d75599c4a5abdb?v=485d7cecb2db4b25b70758d5cceca2d8)
* 在[Notion的开发者中心](https://developers.notion.com/)申请KEY
* 把Notion机器人加到Database里面
* 去[OpenAI](https://platform.openai.com/)申请KEY

## 2. 快捷指令
* 下载[快捷指令](https://www.icloud.com/shortcuts/521006ebdce3431d9539c4d5121c9c33)
* 按照快捷指令上的说明，将Notion的Database_id，OpenAI和Notion的KEY填上

## 3.Scriptable APP
* 下载[Notion.js](Notion记账.js)，并把767及768行改成自己的Database_id和Notion KEY
* 将[Notion.js](Notion记账.js)添加到Scriptable应用中
* 将小组件添加到桌面

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func main() {
	var text string
	_, err := fmt.Scanf("%s", &text)
	if err != nil {
		// 处理错误
		return
	}
	url := "https://api.openai.com/v1/completions"
	apiKey := "your_OpenAI_API_key"      // 替换成你的 OpenAI API key
	notionApiKey := "your_Notion_API_key" // 替换成你的 Notion API key
	databaseId := "your_database_id"
	ss := "请把我提供的账单信息“" + text + "”，填入下面的json内容中，顺便帮我根据以下类目分下类，餐饮，购物，娱乐，交通，缴费（例如水电煤气费、房租、物业费、保险费),学习。并把json返回给我\n{\n  \"parent\": {\n    \"database_id\": \"" + databaseId + "\"\n  },\n  \"properties\": {\n    \"Name\": {\n      \"title\": [\n        {\n          \"text\": {\n            \"content\": \"\"\n          }\n        }\n      ]\n    },\n    \"Price\":{\n        \"number\": \n      },\n    \"Category\":{\n        \"select\": {\"name\": \"\"}\n      }\n  }\n}"
	input := ss
	model := "text-davinci-003"
	params := map[string]interface{}{
		"prompt":      input,
		"temperature": 0.5,
		"max_tokens":  500,
		"model":       model,
	}
	data, err := json.Marshal(params)
	if err != nil {
		// 处理错误
		return
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		// 处理错误
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		// 处理错误
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		// 处理错误
		return
	}
	Notionurl := "https://api.notion.com/v1/pages"

	payload := strings.NewReader(result["choices"].([]interface{})[0].(map[string]interface{})["text"].(string))
	req, err = http.NewRequest("POST", Notionurl, payload)
	if err != nil {
		// 处理错误
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+notionApiKey)
	req.Header.Set("Notion-Version", "2022-06-28")

	client = &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		// 处理错误
		return
	}
	defer resp.Body.Close()

	var res map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&res)
	if err != nil {
		// 处理错误
		return
	}
	fmt.Println(res)

}

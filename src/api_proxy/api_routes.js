import { convertGrokToOpenAI, convertOpenAIToGrok } from './openai_proxy.js';
import { handleGrokRequest } from '../handle_grok.js';

/**
 * 处理聊天补全请求
 * @param {Request} request - 原始请求
 * @param {string} apiKey - API密钥
 * @returns {Promise<Response>} - 响应
 */
export async function handleChatCompletions(request, apiKey) {
    try {
        // 验证API密钥（如果需要）
        const validApiKey = Deno.env.get("GROK_API_KEY") || "";
        if (validApiKey && apiKey !== validApiKey) {
            return new Response(JSON.stringify({
                error: {
                    message: 'API密钥无效',
                    type: 'authentication_error',
                    code: 'invalid_api_key'
                }
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // 解析请求体
        const requestData = await request.json();
        
        // 将OpenAI格式转换为Grok格式
        const grokRequest = convertOpenAIToGrok(requestData);
        
        // 创建一个模拟的请求对象，用于复用现有的handleGrokRequest函数
        // 修改URL路径，确保使用正确的端点
        const mockRequest = new Request('http://localhost/api/conversation', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                // 添加更多模拟浏览器的头信息
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Origin': 'https://grok.x.com',
                'Referer': 'https://grok.x.com/'
            }),
            body: JSON.stringify(grokRequest)
        });
        
        console.log("发送请求到handleGrokRequest...");
        
        // 使用现有的handleGrokRequest函数处理请求
        const grokResponse = await handleGrokRequest(mockRequest);
        
        // 检查响应状态
        if (grokResponse.status !== 200) {
            const errorText = await grokResponse.text();
            console.error(`Grok响应错误: ${grokResponse.status}`, errorText);
            throw new Error(`处理Grok请求失败: ${grokResponse.status}, ${errorText.substring(0, 100)}...`);
        }
        
        // 解析Grok响应
        const grokData = await grokResponse.json();
        console.log("成功获取Grok响应");
        
        // 将Grok响应转换为OpenAI格式
        const openaiResponse = convertGrokToOpenAI(grokData);
        
        // 返回响应
        return new Response(JSON.stringify(openaiResponse), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('处理聊天补全请求时出错:', error);
        return new Response(JSON.stringify({
            error: {
                message: '处理请求时出错: ' + error.message,
                type: 'api_error',
                code: 'internal_error'
            }
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

/**
 * 处理模型列表请求
 * @returns {Response} - 响应
 */
export function handleModels() {
    const models = {
        data: [
            {
                id: "grok-3",
                object: "model",
                created: Math.floor(Date.now() / 1000),
                owned_by: "grok"
            }
        ],
        object: "list"
    };
    
    return new Response(JSON.stringify(models), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
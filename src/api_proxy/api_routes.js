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
        // 这里可以添加验证逻辑，例如检查环境变量中的API密钥
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
        const mockRequest = new Request('http://localhost/api/chat', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(grokRequest)
        });
        
        // 使用现有的handleGrokRequest函数处理请求
        // 这样可以复用现有的网页模拟逻辑，保留原有功能
        const grokResponse = await handleGrokRequest(mockRequest);
        
        // 检查响应状态
        if (grokResponse.status !== 200) {
            const errorText = await grokResponse.text();
            throw new Error(`处理Grok请求失败: ${grokResponse.status}, ${errorText}`);
        }
        
        // 解析Grok响应
        const grokData = await grokResponse.json();
        
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
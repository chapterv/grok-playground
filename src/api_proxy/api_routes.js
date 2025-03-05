import { convertGrokToOpenAI, convertOpenAIToGrok } from './openai_proxy.js';

/**
 * 处理聊天补全请求
 * @param {Request} request - 原始请求
 * @param {string} apiKey - API密钥
 * @returns {Promise<Response>} - 响应
 */
export async function handleChatCompletions(request, apiKey) {
    try {
        // 验证API密钥（如果需要）
        // 直接使用传入的apiKey作为cookie
        const cookies = apiKey;
        
        // 解析请求体
        const requestData = await request.json();
        
        // 将OpenAI格式转换为Grok格式
        const grokRequest = convertOpenAIToGrok(requestData);
        
        if (!cookies) {
            return new Response(JSON.stringify({
                error: {
                    message: '未找到有效的Grok账户，请先在Web界面添加账户',
                    type: 'authentication_error',
                    code: 'no_account'
                }
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        console.log("使用cookie访问Grok API");
        
        // 使用cookies访问Grok API
        const grokResponse = await fetch('https://grok.x.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            body: JSON.stringify(grokRequest)
        });
        
        if (!grokResponse.ok) {
            throw new Error(`Grok API responded with status: ${grokResponse.status}`);
        }
        
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
        console.error('Error handling chat completions:', error);
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

// 删除不需要的getCookiesFromStorage函数

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
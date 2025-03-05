import { convertGrokToOpenAI, convertOpenAIToGrok } from './openai_proxy.js';

/**
 * 处理 OpenAI 兼容的聊天完成请求
 * @param {Request} request - 原始请求
 * @param {string} apiKey - Grok API 密钥
 * @returns {Response} - OpenAI 格式的响应
 */
async function handleChatCompletions(request, apiKey) {
    try {
        // 解析请求体
        const requestData = await request.json();
        
        // 转换为 Grok 格式
        const grokRequest = convertOpenAIToGrok(requestData);
        
        console.log('Sending request to Grok API', grokRequest);
        
        // 调用 Grok API
        const grokResponse = await fetch('https://api.grok.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(grokRequest)
        });
        
        if (!grokResponse.ok) {
            const errorText = await grokResponse.text();
            throw new Error(`Grok API error: ${grokResponse.status} ${errorText}`);
        }
        
        // 解析 Grok 响应
        const grokData = await grokResponse.json();
        console.log('Received response from Grok API', grokData);
        
        // 转换为 OpenAI 格式
        const openaiResponse = convertGrokToOpenAI(grokData);
        
        // 返回 OpenAI 格式的响应
        return new Response(JSON.stringify(openaiResponse), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Chat completions error', error);
        return new Response(JSON.stringify({
            error: {
                message: error.message,
                type: 'api_error',
                code: 'internal_error'
            }
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * 处理模型列表请求
 * @returns {Response} - 模型列表响应
 */
function handleModels() {
    // 返回支持的模型列表
    const models = {
        object: "list",
        data: [
            {
                id: "grok-3",
                object: "model",
                created: Math.floor(Date.now() / 1000),
                owned_by: "xAI"
            }
        ]
    };
    
    return new Response(JSON.stringify(models), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export { handleChatCompletions, handleModels };
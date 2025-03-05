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
        // 这里可以添加验证逻辑
        
        // 解析请求体
        const requestData = await request.json();
        
        // 将OpenAI格式转换为Grok格式
        const grokRequest = convertOpenAIToGrok(requestData);
        
        // 从存储中获取当前选中账户的cookies
        // 这里需要实现获取cookies的逻辑
        const cookies = await getCookiesFromStorage();
        
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

// 从存储中获取cookies的辅助函数
async function getCookiesFromStorage() {
    // 这里需要实现从存储中获取当前选中账户的cookies
    // 可能需要读取文件或数据库
    
    // 示例实现（需要根据实际存储方式修改）
    try {
        const accountsData = await Deno.readTextFile('./src/static/js/accounts.json');
        const accounts = JSON.parse(accountsData);
        const selectedAccount = accounts.find(acc => acc.selected);
        
        if (selectedAccount) {
            return selectedAccount.cookies;
        }
        return null;
    } catch (error) {
        console.error('Error reading accounts data:', error);
        return null;
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
/**
 * 将 Grok API 的响应转换为 OpenAI 格式
 * @param {Object} grokResponse - Grok API 的原始响应
 * @returns {Object} - OpenAI 格式的响应
 */
function convertGrokToOpenAI(grokResponse) {
    try {
        // 根据 Grok 的实际响应结构进行转换
        return {
            id: `grok-${Date.now()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: "grok-3",
            choices: [
                {
                    index: 0,
                    message: {
                        role: "assistant",
                        content: grokResponse.content || grokResponse.message || "",
                    },
                    finish_reason: "stop"
                }
            ],
            usage: {
                prompt_tokens: -1,
                completion_tokens: -1,
                total_tokens: -1
            }
        };
    } catch (error) {
        console.error('Error converting Grok response to OpenAI format', error);
        throw error;
    }
}

/**
 * 将 OpenAI 格式的请求转换为 Grok API 格式
 * @param {Object} openaiRequest - OpenAI 格式的请求
 * @returns {Object} - Grok API 格式的请求
 */
function convertOpenAIToGrok(openaiRequest) {
    try {
        // 提取消息内容
        const messages = openaiRequest.messages || [];
        
        // 构建 Grok 请求格式
        return {
            messages: messages,
            model: openaiRequest.model || "grok-3",
            temperature: openaiRequest.temperature,
            max_tokens: openaiRequest.max_tokens,
        };
    } catch (error) {
        console.error('Error converting OpenAI request to Grok format', error);
        throw error;
    }
}

export { convertGrokToOpenAI, convertOpenAIToGrok };
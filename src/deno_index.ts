import { handleGrokRequest } from "./handle_grok.js";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { handleChatCompletions, handleModels } from "./api_proxy/api_routes.js";
import { handleGrok } from "./handle_grok.js";

// 检查是否有从 gemini-playground 复制的不兼容代码
// 确保 API 路由处理正确集成

import { handleChatCompletions, handleModels } from "./api_proxy/api_routes.js";
import { handleGrok } from "./handle_grok.js";

// 从环境变量获取 API 密钥，或者使用默认值
const GROK_API_KEY = Deno.env.get("GROK_API_KEY") || "";

async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // API route handling
    if (path === "/v1/chat/completions") {
        // Extract API key
        const authHeader = request.headers.get("Authorization") || "";
        const apiKey = authHeader.startsWith("Bearer ") 
            ? authHeader.substring(7) 
            : Deno.env.get("GROK_API_KEY") || "";
            
        return await apiHandleChatCompletions(request, apiKey);
    } else if (path === "/v1/models") {
        return handleModels();
    }
    
    // Original Grok handling logic
    return await handleGrok(request);
}

serve(handler);

console.log("Grok API server running on http://localhost:8000");
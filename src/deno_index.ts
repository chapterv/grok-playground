import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { handleChatCompletions, handleModels } from "./api_proxy/api_routes.js";
// Fix the import to match what's actually exported from handle_grok.js
import { handleGrokRequest } from "./handle_grok.js";

// 从环境变量获取 API 密钥，或者使用默认值
const GROK_API_KEY = Deno.env.get("GROK_API_KEY") || "";

async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // API 路由处理
    if (path === "/v1/chat/completions") {
        // 提取 API 密钥
        const authHeader = request.headers.get("Authorization") || "";
        const apiKey = authHeader.startsWith("Bearer ") 
            ? authHeader.substring(7) 
            : Deno.env.get("GROK_API_KEY") || "";
            
        return await handleChatCompletions(request, apiKey);
    } else if (path === "/v1/models") {
        return handleModels();
    }
    
    // 原有的 Grok 处理逻辑 - use handleGrokRequest instead of handleGrok
    return await handleGrokRequest(request);
}

serve(handler);

console.log("Grok API server running on http://localhost:8000");
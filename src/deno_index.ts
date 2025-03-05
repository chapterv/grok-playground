import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { handleChatCompletions, handleModels } from "./api_proxy/api_routes.js";
import { handleGrokRequest } from "./handle_grok.js";

// 从环境变量获取 API 密钥，或者使用默认值
const GROK_API_KEY = Deno.env.get("GROK_API_KEY") || "";

async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 处理主页面
    if (path === '/' || path === '/index.html') {
        try {
            // 读取静态 HTML 文件
            const html = await Deno.readTextFile('./src/static/index.html');
            return new Response(html, {
                headers: {
                    'content-type': 'text/html;charset=UTF-8',
                },
            });
        } catch (error) {
            console.error('Error serving index.html:', error);
            return new Response('Error loading homepage', { status: 500 });
        }
    }
    
    // 处理静态资源
    if (path.startsWith('/static/')) {
        try {
            const filePath = `.${path}`;
            const content = await Deno.readFile(filePath);
            const contentType = getContentType(path);
            return new Response(content, {
                headers: {
                    'content-type': contentType,
                },
            });
        } catch (error) {
            console.error(`Error serving static file ${path}:`, error);
            return new Response('File not found', { status: 404 });
        }
    }
    
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
    
    // 原有的 Grok 处理逻辑
    return await handleGrokRequest(request);
}

// 根据文件扩展名获取内容类型
function getContentType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'html': return 'text/html;charset=UTF-8';
        case 'css': return 'text/css';
        case 'js': return 'text/javascript';
        case 'json': return 'application/json';
        case 'png': return 'image/png';
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

serve(handler);

console.log("Grok API server running on http://localhost:8000");
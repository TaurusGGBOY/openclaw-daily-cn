const fs = require('fs');
const path = require('path');

async function generate() {
    console.log('🚀 开始生成静态网站...');
    
    const postsDir = path.join(__dirname, 'source/_posts');
    const publicDir = path.join(__dirname, 'public');
    const posts = [];
    
    // 读取文章
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const titleMatch = content.match(/title:\s*(.+)/);
        const dateMatch = content.match(/date:\s*(.+)/);
        const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');
        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
        posts.push({ title, date, file, content });
    }
    
    console.log(`📄 找到 ${posts.length} 篇文章`);
    
    // 创建 public 目录
    fs.mkdirSync(publicDir, { recursive: true });
    fs.mkdirSync(path.join(publicDir, 'posts'), { recursive: true });
    
    // 生成首页
    const indexHTML = `<!DOCTYPE html>
<html>
<head>
    <title>OpenClaw Daily CN</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #3b82f6;
            --accent-color: #1d4ed8;
            --text-color: #1f2937;
            --text-light: #6b7280;
            --bg-color: #ffffff;
            --bg-light: #f9fafb;
            --border-color: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --radius: 12px;
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-color);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        
        .navbar {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .logo::before {
            content: '🐾';
            font-size: 1.2rem;
        }
        
        .nav-links {
            display: flex;
            gap: 1.5rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            font-size: 0.95rem;
            opacity: 0.9;
            transition: var(--transition);
            padding: 0.5rem 0;
            position: relative;
        }
        
        .nav-links a:hover {
            opacity: 1;
        }
        
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: var(--transition);
        }
        
        .nav-links a:hover::after {
            width: 100%;
        }
        
        .hero {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
            line-height: 1.2;
        }
        
        .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .content {
            padding: 3rem 2rem;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-header h2 {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .section-header p {
            color: var(--text-light);
            font-size: 1.1rem;
        }
        
        .posts-list {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .post-card {
            background: var(--bg-color);
            border-radius: var(--radius);
            padding: 2rem;
            border: 1px solid var(--border-color);
            transition: var(--transition);
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .post-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
            transition: var(--transition);
        }
        
        .post-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
        }
        
        .post-card:hover::before {
            width: 6px;
        }
        
        .post-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .post-category {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .post-read-time {
            color: var(--text-light);
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .post-card h2 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.4;
        }
        
        .post-card h2 a {
            color: var(--text-color);
            text-decoration: none;
            transition: var(--transition);
            background: linear-gradient(120deg, var(--primary-color), var(--accent-color));
            background-size: 100% 2px;
            background-repeat: no-repeat;
            background-position: 0 100%;
            padding-bottom: 2px;
        }
        
        .post-card h2 a:hover {
            background-size: 100% 100%;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
        }
        
        .post-excerpt {
            color: var(--text-light);
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-size: 1.05rem;
        }
        
        .post-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .post-date {
            color: var(--text-light);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .post-date::before {
            content: '📅';
            font-size: 0.8rem;
        }
        
        .read-more {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            transition: var(--transition);
        }
        
        .read-more:hover {
            color: var(--accent-color);
            gap: 0.5rem;
        }
        
        .footer {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #cbd5e1;
            padding: 3rem 2rem 0;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .footer-section h3 {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .footer-section p {
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section li {
            margin-bottom: 0.5rem;
        }
        
        .footer-section a {
            color: #94a3b8;
            text-decoration: none;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .footer-section a:hover {
            color: white;
            transform: translateX(4px);
        }
        
        .footer-section a::before {
            content: '→';
            font-size: 0.8rem;
            opacity: 0;
            transition: var(--transition);
        }
        
        .footer-section a:hover::before {
            opacity: 1;
        }
        
        .footer-bottom {
            text-align: center;
            padding: 2rem 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.9rem;
            color: #94a3b8;
        }
        
        .footer-bottom p {
            margin: 0.5rem 0;
        }
        
        .footer-bottom a {
            color: #60a5fa;
            text-decoration: none;
        }
        
        .footer-bottom a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 640px) {
            .navbar {
                padding: 1rem;
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-links {
                gap: 1rem;
            }
            
            .hero {
                padding: 3rem 1rem;
            }
            
            .hero h1 {
                font-size: 2.25rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .content {
                padding: 2rem 1.5rem;
            }
            
            .section-header h2 {
                font-size: 1.75rem;
            }
            
            .post-card {
                padding: 1.5rem;
            }
            
            .post-card h2 {
                font-size: 1.5rem;
            }
            
            .post-card-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .post-card-footer {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
            }
            
            .footer {
                padding: 2rem 1.5rem 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <nav class="navbar">
                <a href="/" class="logo">OpenClaw Daily</a>
                <div class="nav-links">
                    <a href="/">首页</a>
                    <a href="https://github.com/TaurusGGBOY/openclaw-daily-cn" target="_blank">GitHub</a>
                    <a href="https://github.com/TaurusGGBOY/openclaw-daily-cn/issues" target="_blank">反馈</a>
                </div>
            </nav>
            <div class="hero">
                <h1>OpenClaw Daily CN</h1>
                <p>OpenClaw 项目的每日新闻中文站，为您提供最新的技术动态和开发资讯</p>
            </div>
        </header>
        
        <main class="content">
            <div class="section-header">
                <h2>最新文章</h2>
                <p>探索 OpenClaw 的最新动态和技术分享</p>
            </div>
            <div class="posts-list">
                ${posts.map(p => `
                <article class="post-card">
                    <div class="post-card-header">
                        <span class="post-category">技术新闻</span>
                        <span class="post-read-time">📖 3 分钟阅读</span>
                    </div>
                    <h2><a href="/posts/${p.file.replace('.md', '.html')}">${p.title}</a></h2>
                    <p class="post-excerpt">${p.content.split('\n').find(line => line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.includes('---')) || '阅读完整文章了解更多...'}</p>
                    <div class="post-card-footer">
                        <div class="post-date">${p.date}</div>
                        <a href="/posts/${p.file.replace('.md', '.html')}" class="read-more">阅读全文 →</a>
                    </div>
                </article>
                `).join('')}
            </div>
        </main>
        
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>OpenClaw Daily CN</h3>
                    <p>致力于为中文用户提供 OpenClaw 项目的最新动态和技术资讯。</p>
                </div>
                <div class="footer-section">
                    <h3>链接</h3>
                    <ul>
                        <li><a href="/openclaw-daily-cn/">首页</a></li>
                        <li><a href="https://github.com/TaurusGGBOY/openclaw-daily-cn" target="_blank">GitHub 仓库</a></li>
                        <li><a href="https://github.com/TaurusGGBOY/openclaw-daily-cn/issues" target="_blank">问题反馈</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>联系</h3>
                    <p>如有任何问题或建议，欢迎通过 GitHub Issues 联系我们。</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© ${new Date().getFullYear()} OpenClaw Daily CN. 所有文章采用 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> 许可协议</p>
                <p>Powered by <a href="https://github.com/TaurusGGBOY/openclaw-daily-cn" target="_blank">OpenClaw Daily CN</a></p>
            </div>
        </footer>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHTML);
    console.log('✅ 首页已生成');
    
    // 生成文章页
    for (const post of posts) {
        const html = `<!DOCTYPE html>
<html>
<head>
    <title>${post.title} - OpenClaw Daily CN</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #3b82f6;
            --accent-color: #1d4ed8;
            --text-color: #1f2937;
            --text-light: #6b7280;
            --bg-color: #ffffff;
            --bg-light: #f9fafb;
            --border-color: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --radius: 12px;
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-color);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            text-decoration: none;
            font-size: 0.9rem;
            opacity: 0.9;
            transition: var(--transition);
            position: relative;
            z-index: 1;
            margin-bottom: 1rem;
        }
        
        .back-link:hover {
            opacity: 1;
            transform: translateX(-4px);
        }
        
        .post-header {
            position: relative;
            z-index: 1;
        }
        
        .post-header h1 {
            font-size: 2.25rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            line-height: 1.3;
        }
        
        .post-date {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            opacity: 0.9;
        }
        
        .post-date::before {
            content: '📅';
            font-size: 0.9rem;
        }
        
        .content {
            padding: 2.5rem 2rem;
        }
        
        .article-content {
            font-size: 1.1rem;
        }
        
        .article-content h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 2rem 0 1rem;
            color: var(--text-color);
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-color);
        }
        
        .article-content h2 {
            font-size: 1.75rem;
            font-weight: 600;
            margin: 1.75rem 0 0.75rem;
            color: var(--text-color);
        }
        
        .article-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.5rem;
            color: var(--text-color);
        }
        
        .article-content p {
            margin: 1rem 0;
            color: var(--text-color);
        }
        
        .article-content ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        
        .article-content li {
            margin: 0.5rem 0;
            position: relative;
            padding-left: 0.5rem;
        }
        
        .article-content li::before {
            content: '•';
            color: var(--primary-color);
            font-weight: bold;
            position: absolute;
            left: -1rem;
        }
        
        .article-content a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: var(--transition);
        }
        
        .article-content a:hover {
            border-bottom-color: var(--primary-color);
        }
        
        .article-content hr {
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--border-color), transparent);
            margin: 2rem 0;
        }
        
        .article-content pre {
            background: var(--bg-light);
            border-radius: 8px;
            padding: 1.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid var(--border-color);
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .article-content code {
            background: var(--bg-light);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9em;
            color: var(--accent-color);
        }
        
        .article-content blockquote {
            border-left: 4px solid var(--primary-color);
            margin: 1.5rem 0;
            padding: 0.5rem 0 0.5rem 1.5rem;
            background: var(--bg-light);
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: var(--text-light);
        }
        
        .footer {
            text-align: center;
            padding: 2rem;
            color: var(--text-light);
            font-size: 0.9rem;
            border-top: 1px solid var(--border-color);
            background: var(--bg-light);
        }
        
        .footer a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 640px) {
            .header {
                padding: 1.5rem;
            }
            
            .post-header h1 {
                font-size: 1.75rem;
            }
            
            .content {
                padding: 1.5rem;
            }
            
            .article-content {
                font-size: 1rem;
            }
            
            .article-content h1 {
                font-size: 1.75rem;
            }
            
            .article-content h2 {
                font-size: 1.5rem;
            }
            
            .article-content h3 {
                font-size: 1.25rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <a href="/" class="back-link">← 返回首页</a>
            <div class="post-header">
                <h1>${post.title}</h1>
                <div class="post-date">${post.date}</div>
            </div>
        </header>
        
        <main class="content">
            <article class="article-content">
${post.content.split('\n').map(line => {
    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
    if (line.trim() === '') return '<br>';
    if (line.includes('---')) return '<hr>';
    if (line.includes('*更新时间:')) return `<p class="update-time"><em>${line.replace('*', '').replace('*', '')}</em></p>`;
    return `<p>${line}</p>`;
}).join('\n')}
            </article>
        </main>
        
        <footer class="footer">
            <p>© ${new Date().getFullYear()} OpenClaw Daily CN. 所有文章采用 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> 许可协议</p>
            <p>Powered by <a href="https://github.com/TaurusGGBOY/openclaw-daily-cn" target="_blank">OpenClaw Daily CN</a></p>
        </footer>
    </div>
</body>
</html>`;
        
        fs.writeFileSync(path.join(publicDir, 'posts', post.file.replace('.md', '.html')), html);
        console.log(`  - 已生成: ${post.title}`);
    }
    
    console.log(`\n✅ 完成！共生成 ${posts.length + 1} 个 HTML 文件`);
    console.log(`📁 输出目录: ${publicDir}`);
}

generate().catch(err => {
    console.error('❌ 错误:', err);
    process.exit(1);
});

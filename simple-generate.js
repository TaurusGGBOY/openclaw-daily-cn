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
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .post { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .date { color: #666; font-size: 0.9em; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>OpenClaw Daily CN</h1>
    <p>OpenClaw 项目的每日新闻中文站</p>
    <hr>
    ${posts.map(p => `
    <div class="post">
        <h2><a href="/openclaw-daily-cn/posts/${p.file.replace('.md', '.html')}">${p.title}</a></h2>
        <p class="date">${p.date}</p>
    </div>
    `).join('')}
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
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        a { color: #0066cc; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <p><a href="/openclaw-daily-cn/">← 返回首页</a></p>
    <h1>${post.title}</h1>
    <p class="date">${post.date}</p>
    <hr>
    <div class="content">
${post.content.split('\n').map(line => {
    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
    if (line.trim() === '') return '<br>';
    return `<p>${line}</p>`;
}).join('\n')}
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

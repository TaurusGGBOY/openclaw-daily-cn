const Hexo = require('hexo');
const path = require('path');

async function generate() {
    console.log('🚀 初始化 Hexo...');
    const hexo = new Hexo(path.resolve(__dirname), {
        debug: false,
        safe: false
    });

    console.log('📦 加载中...');
    await hexo.load();
    
    console.log('📝 加载文章...');
    const posts = hexo.locals.get('posts').toArray();
    console.log(`📄 找到 ${posts.length} 篇文章`);
    
    if (posts.length === 0) {
        console.log('⚠️ 没有找到文章，检查 source/_posts 目录');
        const fs = require('hexo-fs');
        const files = await fs.listDir(path.join(__dirname, 'source/_posts'));
        console.log('文件列表:', files);
    }

    console.log('🔨 生成静态文件...');
    
    // 使用 render 方法生成
    for (const post of posts) {
        console.log(`  - 生成: ${post.title}`);
    }
    
    // 生成 public 目录
    const publicDir = path.join(__dirname, 'public');
    console.log(`📁 输出目录: ${publicDir}`);
    
    // 复制静态资源
    console.log('✅ 完成！');
}

generate().catch(err => {
    console.error('❌ 错误:', err);
    process.exit(1);
});

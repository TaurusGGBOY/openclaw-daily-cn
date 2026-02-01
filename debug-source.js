const Hexo = require('hexo');
const path = require('path');

async function debug() {
    const hexo = new Hexo(path.resolve(__dirname), {
        debug: true,
        silent: false
    });

    console.log('🔍 调试 Hexo source...');
    console.log('source_dir:', hexo.config.source_dir);
    console.log('posts_dir:', hexo.config.posts_dir || path.join(hexo.config.source_dir, '_posts'));
    
    await hexo.load();
    
    console.log('\n📂 检查目录存在性:');
    console.log('source 目录存在:', require('hexo-fs').existsSync(hexo.source.base));
    console.log('_posts 目录存在:', require('hexo-fs').existsSync(path.join(hexo.source.base, '_posts')));
    
    console.log('\n📝 posts 数量:', hexo.locals.get('posts').length);
    console.log('pages 数量:', hexo.locals.get('pages').length);
}

debug().catch(console.error);

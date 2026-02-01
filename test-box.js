const Hexo = require('hexo');
const path = require('path');

async function test() {
    const hexo = new Hexo(path.resolve(__dirname), {
        debug: true,
        silent: false
    });

    console.log('🔍 检查 Hexo 配置...');
    console.log('source_dir:', hexo.config.source_dir);
    console.log('post_asset_folder:', hexo.config.post_asset_folder);
    
    console.log('\n📦 加载 Hexo...');
    await hexo.load();
    
    console.log('\n🔍 检查 box...');
    console.log('box source:', hexo.source);
    console.log('box processors:', Object.keys(hexo.source.processors || {}));
    
    console.log('\n📄 检查 posts...');
    console.log('posts count:', hexo.locals.get('posts').length);
}

test().catch(console.error);

const fs = require('hexo-fs');
const path = require('path');
const { parse: frontMatter } = require('hexo-front-matter');

async function test() {
    const postsDir = path.join(__dirname, 'source/_posts');
    console.log('📁 posts 目录:', postsDir);
    
    const files = await fs.listDir(postsDir, { ignoreHidden: false });
    console.log('📄 文件列表:', files);
    
    for (const file of files) {
        const filePath = path.join(postsDir, file);
        console.log(`\n📝 读取文件: ${file}`);
        const content = await fs.readFile(filePath);
        console.log('内容前 200 字:', content.substring(0, 200));
    }
}

test().catch(console.error);

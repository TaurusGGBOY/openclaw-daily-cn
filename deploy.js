#!/usr/bin/env node
'use strict';

const Hexo = require('hexo');
const path = require('path');

async function main() {
    const hexo = new Hexo(path.resolve(__dirname), {
        debug: false,
        safe: false,
        silent: false
    });
    
    console.log('Initializing Hexo...');
    await hexo.init();
    
    console.log('Loading files...');
    await hexo.load();
    
    const posts = hexo.locals.get('posts').toArray();
    console.log(`Found ${posts.length} posts`);
    
    console.log('Generating static files...');
    await hexo.call('generate', {});
    
    console.log('Deploying...');
    await hexo.call('deploy', { setup: false });
    
    console.log('Done!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

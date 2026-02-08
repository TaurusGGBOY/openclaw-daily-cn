#!/usr/bin/env python3
"""更新首页 index.html，添加最新新闻和技能推荐"""
import re
from datetime import datetime, timedelta

today = datetime.now()
today_str = today.strftime('%Y年%m月%d日')
today_date = today.strftime('%Y-%m-%d')
day_num = today.strftime('%d')
prev_day = today - timedelta(days=1)
prev_day_str = prev_day.strftime('%Y-%m-%d')
prev_day_num = str(int(prev_day.strftime('%d'))).zfill(2)

# 读取现有首页
with open('/Users/gaoguobin/openclaw-daily-cn/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 添加 2月8日 的新闻卡片（如果不存在）
feb8_card = '''
                <article class="post-card">
                    <div class="post-card-header">
                        <span class="post-category">技术新闻</span>
                        <span class="post-read-time">📖 5 分钟阅读</span>
                    </div>
                    <h2><a href="/openclaw-daily-cn/2026/02/08.html">OpenClaw 每日新闻 - 2026年2月8日</a></h2>
                    <p class="post-excerpt">极致轻量 OpenClaw 开源、160 万 AI 智能体社交、阿里腾讯等大厂接入、飞书集成插件上线等最新动态</p>
                    <div class="post-card-footer">
                        <div class="post-date">2026-02-08</div>
                        <a href="/openclaw-daily-cn/2026/02/08.html" class="read-more">阅读全文 →</a>
                    </div>
                </article>
'''

# 在 posts-lists 开头插入新卡片
content = content.replace(
    '<div class="posts-list">',
    '<div class="posts-list">\n' + feb8_card
)

# 添加技能推荐部分（在 footer 之前）
skills_section = '''
        <main class="content">
            <div class="section-header">
                <h2>🔥 热门技能推荐</h2>
                <p>精选 OpenClaw 实用技能，提升你的 AI 助手能力</p>
            </div>
            
            <div class="posts-list">
                <article class="post-card">
                    <div class="post-card-header">
                        <span class="post-category">📦 智能家居</span>
                        <span class="post-read-time">⚡ HomeAssistant</span>
                    </div>
                    <h2><a href="https://clawhub.com/skill/homeassistant" target="_blank">控制智能家居设备</a></h2>
                    <p class="post-excerpt">通过 HomeAssistant 控制智能灯、插座、空调等设备。支持场景联动和自动化，让你的 AI 助手成为真正的智能管家。</p>
                    <div class="post-card-footer">
                        <div class="post-date">智能控制</div>
                        <a href="https://clawhub.com/skill/homeassistant" class="read-more" target="_blank">查看详情 →</a>
                    </div>
                </article>
                
                <article class="post-card">
                    <div class="post-card-header">
                        <span class="post-category">🎤 语音合成</span>
                        <span class="post-read-time">🎭 ElevenLabs TTS</span>
                    </div>
                    <h2><a href="https://clawhub.com/skill/elevenlabs-tts" target="_blank">高质量语音合成</a></h2>
                    <p class="post-excerpt">使用 ElevenLabs 生成自然流畅的语音。支持多种音色选择，让你的 AI 助手开口说话，增强交互体验。</p>
                    <div class="post-card-footer">
                        <div class="post-date">语音合成</div>
                        <a href="https://clawhub.com/skill/elevenlabs-tts" class="read-more" target="_blank">查看详情 →</a>
                    </div>
                </article>
                
                <article class="post-card">
                    <div class="post-card-header">
                        <span class="post-category">🧠 记忆系统</span>
                        <span class="post-read-time">🗂️ PARA</span>
                    </div>
                    <h2><a href="https://clawhub.com/skill/para-second-brain" target="_blank">构建第二大脑</a></h2>
                    <p class="post-excerpt">基于 PARA 方法论的个人知识管理系统。自动整理笔记、建立双向链接，让你的知识永久留存并可随时检索。</p>
                    <div class="post-card-footer">
                        <div class="post-date">知识管理</div>
                        <a href="https://clawhub.com/skill/para-second-brain" class="read-more" target="_blank">查看详情 →</a>
                    </div>
                </article>
            </div>
        </main>
'''

# 找到 footer 位置并插入技能部分
content = content.replace(
    '<footer class="footer">',
    skills_section + '\n        <footer class="footer">'
)

# 写回文件
with open('/Users/gaoguobin/openclaw-daily-cn/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 首页已更新：添加 2月8日新闻 + 技能推荐")

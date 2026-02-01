#!/usr/bin/env python3
"""生成 OpenClaw 每日新闻 HTML 页面"""
import json
import re
import sys
from datetime import datetime

if len(sys.argv) != 4:
    print("Usage: gen_html.py <json_file> <output_html> <repo_dir>")
    sys.exit(1)

json_file = sys.argv[1]
html_file = sys.argv[2]
repo_dir = sys.argv[3]

with open(json_file, 'r') as f:
    data = json.load(f)

now = datetime.now().strftime('%Y-%m-%d %H:%M')
today = datetime.now().strftime('%Y年%m月%d日')
prev_day = datetime.now().strftime('%Y-%m-%d')

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw 每日新闻 - {today}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
        }}
        .header {{
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }}
        .header h1 {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 28px;
            margin-bottom: 10px;
        }}
        .header p {{ color: #666; font-size: 14px; }}
        .lobster {{
            font-size: 60px;
            margin-bottom: 10px;
        }}
        .news-item {{
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }}
        .news-item:hover {{
            transform: translateY(-2px);
        }}
        .news-item h2 {{
            color: #333;
            font-size: 18px;
            margin-bottom: 12px;
            line-height: 1.4;
        }}
        .news-item p {{
            color: #666;
            line-height: 1.8;
            font-size: 15px;
        }}
        .news-item .meta {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }}
        .news-item .meta a {{
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }}
        .news-item .meta a:hover {{
            text-decoration: underline;
        }}
        .news-item .meta span {{
            color: #999;
            font-size: 13px;
        }}
        .footer {{
            text-align: center;
            padding: 30px;
            color: rgba(255,255,255,0.8);
            font-size: 14px;
        }}
        .empty {{
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }}
        .nav {{
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }}
        .nav a {{
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }}
        .nav a:hover {{
            background: rgba(255,255,255,0.3);
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="nav">
            <a href="../01/index.html">← 昨日</a>
            <a href="./">今日</a>
        </div>
        
        <div class="header">
            <div class="lobster">🦞</div>
            <h1>OpenClaw 每日新闻</h1>
            <p>{now} · 自动更新</p>
        </div>
        
        <div class="news-list">
'''

news_count = 0
if 'organic' in data:
    for item in data['organic'][:10]:
        # 只保留包含 OpenClaw、Clawdbot、Moltbot 的新闻
        title = item.get('title', '')
        if not any(keyword in title.lower() for keyword in ['openclaw', 'clawdbot', 'clawd', 'moltbot']):
            continue
        
        news_count += 1
        title = title[:120]
        snippet = item.get('snippet', '')[:400]
        link = item.get('link', '')
        date = item.get('date', '')[:10]
        
        # 清理 HTML 标签
        snippet = re.sub(r'<[^>]+>', '', snippet)
        snippet = snippet.replace('\n', ' ').strip()
        
        html += f'''            <div class="news-item">
                <h2>{title}</h2>
                <p>{snippet}</p>
                <div class="meta">
                    <a href="{link}" target="_blank">查看原文 →</a>
                    <span>{date}</span>
                </div>
            </div>
'''
else:
    html += '''            <div class="empty">
                <p>今日暂无更新</p>
            </div>
'''

html += '''        </div>
        
        <div class="footer">
            <p>🦞 OpenClaw 每日新闻 · 由贾维斯自动生成</p>
        </div>
    </div>
</body>
</html>
'''

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ 生成 HTML: {html_file} ({news_count} 条新闻)")

#!/usr/bin/env python3
import requests
import time

def analyze_navigation_flow():
    base_url = "https://taurusggboy.github.io/openclaw-daily-cn"
    
    print("🔍 分析网站导航流程")
    print(f"基础URL: {base_url}")
    print()
    
    # 1. 访问首页
    print("1. 访问首页...")
    home_response = requests.get(f"{base_url}/?t={int(time.time())}")
    home_html = home_response.text if home_response.status_code == 200 else ""
    
    if home_response.status_code != 200:
        print(f"   ❌ 首页无法访问: {home_response.status_code}")
        return
    
    print(f"   ✅ 首页状态: {home_response.status_code}")
    
    # 从首页提取文章链接
    import re
    article_links = re.findall(r'href="(/posts/[^"]*\.html)"', home_html)
    print(f"   找到 {len(article_links)} 个文章链接")
    
    if not article_links:
        print("   ⚠️ 首页没有找到文章链接，尝试其他模式...")
        article_links = re.findall(r'href="([^"]*posts/[^"]*\.html)"', home_html)
        print(f"   找到 {len(article_links)} 个文章链接（其他模式）")
    
    if article_links:
        # 测试第一个文章链接
        first_article = article_links[0]
        if not first_article.startswith('http'):
            if first_article.startswith('/'):
                first_article = base_url + first_article
            else:
                first_article = base_url + '/' + first_article
        
        print(f"\n2. 点击第一个文章链接: {first_article}")
        article_response = requests.get(f"{first_article}?t={int(time.time())}")
        
        if article_response.status_code == 200:
            print(f"   ✅ 文章页面状态: {article_response.status_code}")
            article_html = article_response.text
            
            # 检查返回首页链接
            back_links = re.findall(r'href="([^"]*)"[^>]*>.*返回首页', article_html)
            if back_links:
                back_link = back_links[0]
                print(f"   找到返回首页链接: {back_link}")
                
                # 处理返回链接
                if back_link.startswith('/'):
                    back_link_full = 'https://taurusggboy.github.io' + back_link
                elif back_link.startswith('http'):
                    back_link_full = back_link
                else:
                    back_link_full = base_url + '/' + back_link
                
                print(f"\n3. 点击返回首页链接: {back_link_full}")
                back_response = requests.get(f"{back_link_full}?t={int(time.time())}")
                
                if back_response.status_code == 200:
                    print(f"   ✅ 返回首页成功: {back_response.status_code}")
                    
                    # 检查返回后的页面是否正常
                    back_html = back_response.text
                    back_article_links = re.findall(r'href="(/posts/[^"]*\.html)"', back_html)
                    print(f"   返回后找到 {len(back_article_links)} 个文章链接")
                    
                    if len(back_article_links) == len(article_links):
                        print("   ✅ 返回后文章链接数量一致")
                    else:
                        print(f"   ⚠️ 返回后文章链接数量不一致: 之前{len(article_links)}，现在{len(back_article_links)}")
                else:
                    print(f"   ❌ 返回首页失败: {back_response.status_code}")
            else:
                print("   ⚠️ 文章页面没有找到'返回首页'链接")
                
                # 检查其他可能的返回链接
                all_links = re.findall(r'href="([^"]*)"', article_html)
                home_links = [link for link in all_links if '首页' in article_html[article_html.find(f'href="{link}"'):article_html.find(f'href="{link}"')+100]]
                if home_links:
                    print(f"   找到可能的首页链接: {home_links}")
        else:
            print(f"   ❌ 文章页面无法访问: {article_response.status_code}")
    
    print("\n📊 导航流程分析完成")
    
    # 检查所有可能的导航问题
    print("\n🔍 检查常见导航问题:")
    
    # 问题1: 相对路径 vs 绝对路径
    print("1. 路径类型检查:")
    if home_html:
        all_hrefs = re.findall(r'href="([^"]*)"', home_html)
        relative_paths = [h for h in all_hrefs if not h.startswith('http') and not h.startswith('#') and not h.startswith('mailto:')]
        absolute_paths = [h for h in all_hrefs if h.startswith('http')]
        
        print(f"   相对路径: {len(relative_paths)} 个")
        print(f"   绝对路径: {len(absolute_paths)} 个")
        
        # 检查相对路径是否以/开头
        relative_with_slash = [h for h in relative_paths if h.startswith('/')]
        relative_without_slash = [h for h in relative_paths if not h.startswith('/')]
        
        print(f"   以/开头的相对路径: {len(relative_with_slash)} 个")
        print(f"   不以/开头的相对路径: {len(relative_without_slash)} 个")
        
        if relative_without_slash:
            print("   ⚠️ 有不以/开头的相对路径，可能在子目录下有问题")
            print(f"   示例: {relative_without_slash[:3]}")

if __name__ == "__main__":
    analyze_navigation_flow()
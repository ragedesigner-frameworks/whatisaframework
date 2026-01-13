#!/usr/bin/env python3
"""
RSS Feed Generator for GitHub Pages Static Sites
Scans HTML files, extracts metadata, generates RSS 2.0 XML feed
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

class HTMLMetadataExtractor(HTMLParser):
    """Extract metadata from HTML head section"""
    
    def __init__(self):
        super().__init__()
        self.metadata = {}
        self.in_head = False
        self.current_title = []
        self.in_title = False
        
    def handle_starttag(self, tag, attrs):
        if tag == 'head':
            self.in_head = True
        elif tag == 'title' and self.in_head:
            self.in_title = True
        elif tag == 'meta' and self.in_head:
            attrs_dict = dict(attrs)
            # Extract meta tags
            if 'name' in attrs_dict and 'content' in attrs_dict:
                self.metadata[attrs_dict['name']] = attrs_dict['content']
            elif 'property' in attrs_dict and 'content' in attrs_dict:
                self.metadata[attrs_dict['property']] = attrs_dict['content']
                
    def handle_endtag(self, tag):
        if tag == 'head':
            self.in_head = False
        elif tag == 'title':
            self.in_title = False
            self.metadata['title'] = ''.join(self.current_title).strip()
            
    def handle_data(self, data):
        if self.in_title:
            self.current_title.append(data)

def extract_metadata_from_html(html_path):
    """Extract title, description, date from HTML file"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        parser = HTMLMetadataExtractor()
        parser.feed(html_content)
        
        metadata = parser.metadata
        
        # Get title (try multiple sources)
        title = (metadata.get('og:title') or 
                metadata.get('twitter:title') or 
                metadata.get('title') or 
                Path(html_path).stem.replace('-', ' ').title())
        
        # Get description
        description = (metadata.get('og:description') or 
                      metadata.get('twitter:description') or 
                      metadata.get('description') or 
                      'Read more on our site')
        
        # Get published date (try to extract from file or use file modification time)
        pub_date = metadata.get('article:published_time')
        if not pub_date:
            # Use file modification time as fallback
            mtime = os.path.getmtime(html_path)
            pub_date = datetime.fromtimestamp(mtime).strftime('%a, %d %b %Y %H:%M:%S +0000')
        else:
            # Convert ISO format to RSS format
            try:
                dt = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
                pub_date = dt.strftime('%a, %d %b %Y %H:%M:%S +0000')
            except:
                mtime = os.path.getmtime(html_path)
                pub_date = datetime.fromtimestamp(mtime).strftime('%a, %d %b %Y %H:%M:%S +0000')
        
        return {
            'title': title,
            'description': description,
            'pub_date': pub_date,
            'link': None  # Will be filled in by caller
        }
        
    except Exception as e:
        print(f"Error extracting metadata from {html_path}: {e}")
        return None

def generate_rss_feed(config_path, output_path):
    """Generate RSS feed based on configuration"""
    
    # Load configuration
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    site_url = config['site_url'].rstrip('/')
    site_title = config['site_title']
    site_description = config['site_description']
    author = config.get('author', 'Site Author')
    email = config.get('email', '')
    blog_directory = config.get('blog_directory', '.')
    post_pattern = config.get('post_pattern', '*.html')
    max_items = config.get('max_items', 50)
    
    # Find all HTML files
    blog_path = Path(blog_directory)
    if not blog_path.exists():
        print(f"Blog directory not found: {blog_directory}")
        return
    
    html_files = list(blog_path.glob(post_pattern))
    
    # Extract metadata from each file
    items = []
    for html_file in html_files:
        # Skip index files
        if html_file.stem.lower() in ['index', 'home']:
            continue
            
        metadata = extract_metadata_from_html(html_file)
        if metadata:
            # Construct full URL
            relative_path = html_file.relative_to('.')
            metadata['link'] = f"{site_url}/{relative_path}"
            metadata['file_path'] = str(html_file)
            items.append(metadata)
    
    # Sort by publication date (newest first)
    items.sort(key=lambda x: x['pub_date'], reverse=True)
    
    # Limit to max_items
    items = items[:max_items]
    
    # Generate RSS XML
    rss = ET.Element('rss', version='2.0', attrib={
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
    })
    
    channel = ET.SubElement(rss, 'channel')
    
    ET.SubElement(channel, 'title').text = site_title
    ET.SubElement(channel, 'link').text = site_url
    ET.SubElement(channel, 'description').text = site_description
    ET.SubElement(channel, 'language').text = 'en-us'
    ET.SubElement(channel, 'lastBuildDate').text = datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S +0000')
    
    # Add atom:link for self-reference
    atom_link = ET.SubElement(channel, '{http://www.w3.org/2005/Atom}link', attrib={
        'href': f"{site_url}/feed.xml",
        'rel': 'self',
        'type': 'application/rss+xml'
    })
    
    # Add items
    for item_data in items:
        item = ET.SubElement(channel, 'item')
        ET.SubElement(item, 'title').text = item_data['title']
        ET.SubElement(item, 'link').text = item_data['link']
        ET.SubElement(item, 'description').text = item_data['description']
        ET.SubElement(item, 'pubDate').text = item_data['pub_date']
        ET.SubElement(item, 'guid', isPermaLink='true').text = item_data['link']
        if author:
            ET.SubElement(item, '{http://purl.org/dc/elements/1.1/}creator').text = author
    
    # Write to file
    tree = ET.ElementTree(rss)
    ET.indent(tree, space='  ')
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    
    print(f"✓ Generated RSS feed: {output_path}")
    print(f"  - {len(items)} items included")
    print(f"  - Feed URL: {site_url}/feed.xml")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python rss-generator.py <config.json> <output-feed.xml>")
        sys.exit(1)
    
    config_path = sys.argv[1]
    output_path = sys.argv[2]
    
    generate_rss_feed(config_path, output_path)

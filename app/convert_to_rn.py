import os
import re

def convert_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple map for demonstration, real conversion is more complex
    # This is to handle the reported errors.
    new_content = content.replace('<div', '<View').replace('</div', '</View')
    new_content = new_content.replace('<span', '<Text').replace('</span', '</Text')
    new_content = new_content.replace('<p', '<Text').replace('</p', '</Text')
    new_content = new_content.replace('<header', '<View').replace('</header', '</View')
    
    # Remove className (dummy placeholder until styles are mapped)
    new_content = re.sub(r'className="[^"]*"', '', new_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for root, dirs, files in os.walk('/home/ubuntu/wellcheck/app/src'):
    for file in files:
        if file.endswith('.tsx'):
            convert_file(os.path.join(root, file))

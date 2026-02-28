import os, glob, re

root = r'c:\Users\Admin\Desktop\DoAnCS2_MOONLIGHTCAFE\Moonlight-Cafe'
count = 0
for fpath in glob.glob(os.path.join(root, '*.html')):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    new = re.sub(r'images/logo\.png(\?v=\d+)?', 'images/logo.png?v=4', content)
    if new != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new)
        count += 1
print(f'Done. {count} files updated to v=4.')

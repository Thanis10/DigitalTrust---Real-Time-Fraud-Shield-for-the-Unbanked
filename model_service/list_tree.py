import os
root_path = r'c:\Users\shivar\fraud-detection-project'
for root, dirs, files in os.walk(root_path):
    level = root.replace(root_path, '').count(os.sep)
    indent = '    ' * level
    print(f"{indent}{os.path.basename(root)}/")
    for f in files:
        print(f"{indent}    {f}")

import re

# Cloudflare workers fails CI on ANY warning, including no-img-element. We need to disable these properly.
# The previous disable comments applied inside JSX might not be suppressing it completely if it's considered a strict warning by CF workers.
# Instead of inline, let's put it at the top of the file.

file1 = "components/CustomerPhotosPanel.tsx"
with open(file1, "r") as f: content1 = f.read()
if "/* eslint-disable @next/next/no-img-element */" not in content1:
    content1 = "/* eslint-disable @next/next/no-img-element */\n" + content1
    with open(file1, "w") as f: f.write(content1)

file2 = "components/SaveCustomerModal.tsx"
with open(file2, "r") as f: content2 = f.read()
if "/* eslint-disable @next/next/no-img-element */" not in content2:
    content2 = "/* eslint-disable @next/next/no-img-element */\n" + content2
    with open(file2, "w") as f: f.write(content2)

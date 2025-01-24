import os
import shutil
import sys

# Replace "\" with "\\"
MINECRAFT_FOLDER = "D:\\Program Files\\MinecraftTL"
VERSION_CHANGER_KEY = "version_changer"

version_changer_folder = os.path.join(MINECRAFT_FOLDER, VERSION_CHANGER_KEY)
if not os.path.exists(version_changer_folder):
    os.makedirs(version_changer_folder)
    print(f"The destination directory {version_changer_folder} has been newly created.")

version_changer_name = input("Enter package name to change: ")
version_changer_folder = os.path.join(version_changer_folder, version_changer_name)
if not os.path.exists(version_changer_folder):
    print(f"The source directory {version_changer_folder} does not exist.")
    sys.exit()
print()


def copy_files(key):
    source_dir = os.path.join(version_changer_folder, key)
    dest_dir = os.path.join(MINECRAFT_FOLDER, key)
    if os.path.exists(dest_dir):
        for filename in os.listdir(dest_dir):
            os.remove(os.path.join(dest_dir, filename))
    print(f"{dest_dir} has been cleared!")
    if not os.path.exists(source_dir):
        print(f"The source directory {source_dir} does not exist.")
        return
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"The destination directory {dest_dir} has been newly created.")
    print(f"Start copying from {source_dir}")
    for filename in os.listdir(source_dir):
        source_file = os.path.join(source_dir, filename)
        if os.path.isfile(source_file):
            dest_file = os.path.join(dest_dir, filename)
            shutil.copy2(source_file, dest_file)
            print(f"    Copied: {filename}")
    print()


for item in os.listdir(version_changer_folder):
    copy_files(item)

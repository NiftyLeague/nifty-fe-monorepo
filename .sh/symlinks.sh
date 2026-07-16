#!/usr/bin/env sh

# variables
##################################################################

root_dir="$(pwd)"  # Set the project's root directory to the current working directory
apps_dir="$root_dir/apps"
static_dir="$root_dir/assets"

# create static 
##################################################################
create_static_link() {
  if test -d $apps_dir/$1/public; then
    # failure message
    echo "    📁 apps/$1/public folder exists!"
  else
    # create static symlinked folder
    cd $apps_dir/$1/
    ln -sf $static_dir public
    cd ../..

    echo "    ✅ apps/$1/public folder created!"
  fi
}

# symlinks function
##################################################################

create_symlinks() {
    echo "
    
    creating $1 symlinks ...
    ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼"
    create_static_link "$1"
}

# create symlinks
create_symlinks "app"
create_symlinks "docs"
create_symlinks "smashers"
create_symlinks "web"
create_symlinks "template"

echo "  "
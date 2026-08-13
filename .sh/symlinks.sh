#!/usr/bin/env sh

# variables
##################################################################

root_dir="$(pwd)"  # Set the project's root directory to the current working directory
apps_dir="$root_dir/apps"
static_dir="$root_dir/assets"
static_link="../../assets"

# create static 
##################################################################
create_static_link() {
  public_dir="$apps_dir/$1/public"

  # Worktrees can inherit ignored symlinks from another checkout. Repoint only
  # an existing symlink; leave a real public directory untouched.
  resolve_dir() (
    unset CDPATH
    cd -P "$1" 2>/dev/null && pwd -P
  )

  if test -L "$public_dir"; then
    current_target="$(resolve_dir "$public_dir")"
    expected_target="$(resolve_dir "$static_dir")"
    if test -n "$current_target" && test "$current_target" = "$expected_target"; then
      echo "    ✅ apps/$1/public already points at this checkout"
      return
    fi

    rm "$public_dir"
    ln -s "$static_link" "$public_dir"
    echo "    🔁 apps/$1/public repointed to this checkout"
  elif test -d "$public_dir"; then
    echo "    📁 apps/$1/public folder exists; leaving it untouched"
  else
    ln -s "$static_link" "$public_dir"
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

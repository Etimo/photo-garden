{
  # Dependencies
  yarn2nix,
  # Settings
  src,
  workspaceDependencies ? {},
}:
yarn2nix.mkYarnPackage {
  inherit src workspaceDependencies;
  yarnLock = ./yarn.lock;

  yarnFlags = [
    "--offline"
    # --frozen-lockfile doesn't work with workspace dependencies :(
    # "--frozen-lockfile"
    "--ignore-engines"
    "--ignore-scripts"
  ];
}

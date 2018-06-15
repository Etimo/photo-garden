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
}

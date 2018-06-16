{
  # Dependencies
  yarn2nix,
  # Settings
  src,
  workspaceDependencies ? {},
  postInstallHook ? "",
  extraBuildInputs ? [],
}:
yarn2nix.mkYarnPackage {
  inherit extraBuildInputs src workspaceDependencies;
  yarnLock = ./yarn.lock;
  postInstall = postInstallHook;
}

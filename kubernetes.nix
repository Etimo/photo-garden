{
  # Photo garden packages
  apps,

  # Dependencies
  linkFarm, symlinkJoin, writeText, loadYAML
}:
let
  appDeployment = app:
  let
    template = loadYAML (./apps + "/${app}/kube.deployment.yml");
  in template;
  appDeploymentFile = app: writeText "${app}.kube.deployment.yml" (builtins.toJSON (appDeployment app));
  appFiles = app: linkFarm "${app}-kube" [
    {
      name = "${app}.kube.deployment.yml";
      path = appDeploymentFile app;
    }
  ];
in
  symlinkJoin {
    name = "photo-garden-kube";
    paths = map appFiles ["gateway"];
  }

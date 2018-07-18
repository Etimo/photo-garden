{
  # Photo garden packages
  apps, appImages,

  # Dependencies
  lib, linkFarm, symlinkJoin, writeText, loadYAML
}:
let
  baseDeploymentTemplate = loadYAML ./deploy/deployment.template.yml;

  appDeployment = app:
  let
    templatePath = ./apps + "/${app}/kube.deployment.yml";
    template = if builtins.pathExists templatePath
      then loadYAML templatePath
      else {};
  in lib.foldl (base: new: lib.recursiveUpdate base (new base)) {} [
    (super: baseDeploymentTemplate)
    (super: template)
    (super: {
      metadata.name = app;
      spec.template.metadata.labels.app = app;
      spec.template.spec.containers = map (container: lib.recursiveUpdate container {
        name = app;
        image = "${appImages.${app}.imageName}:${appImages.${app}.imageTag}";
      }) super.spec.template.spec.containers;
    })
  ];
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
    paths = map appFiles apps;
  }

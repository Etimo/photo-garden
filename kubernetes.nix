{
  # Photo garden packages
  apps, appImages,

  # Dependencies
  lib, linkFarm, symlinkJoin, writeText, loadYAML
}:
let
  kubeAppYamlFile = {fileType, app, override}:
  let
    baseTemplate = loadYAML (./deploy + "/${fileType}.template.yml");
    appTemplatePath = ./apps + "/${app}/kube.${fileType}.yml";
    appTemplate =
      if builtins.pathExists appTemplatePath
        then loadYAML appTemplatePath
        else {};
    appFileData =
      lib.foldl (base: new: lib.recursiveUpdate base (new base)) {} [
        (super: baseTemplate)
        (super: appTemplate)
        override
      ];
  in
    writeText "${app}.${fileType}.yml" (builtins.toJSON appFileData);

  appDeploymentFile = app: kubeAppYamlFile {
    inherit app;
    fileType = "deployment";
    override = super: {
      metadata.name = app;
      spec.template.metadata.labels.app = app;
      spec.template.spec.containers = map (container: lib.recursiveUpdate container {
        name = app;
        image = "${appImages.${app}.imageName}:${appImages.${app}.imageTag}";
      }) super.spec.template.spec.containers;
    };
  };

  appFiles = app: linkFarm "${app}-kube" [
    {
      name = "${app}.deployment.yml";
      path = appDeploymentFile app;
    }
  ];
in
  symlinkJoin {
    name = "photo-garden-kube";
    paths = map appFiles apps;
  }

{
  # Photo garden packages
  apps, appImages,

  # Dependencies
  lib, linkFarm, symlinkJoin, writeText, loadYAML
}:
let
  kubeAppYamlFile = {fileType, app, override, skipIfMissing ? true}:
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
    writeText "${app}.${fileType}.yml" (builtins.toJSON appFileData) // {
      skip = skipIfMissing && (!builtins.pathExists appTemplatePath);
    };

  appDeployment = app: kubeAppYamlFile {
    inherit app;
    fileType = "deployment";
    skipIfMissing = false;
    override = super: {
      metadata.name = app;
      spec.template.metadata.labels.app = app;
      spec.template.spec.containers = map (container: lib.recursiveUpdate container {
        name = app;
        image = "${appImages.${app}.imageName}:${appImages.${app}.imageTag}";
      }) super.spec.template.spec.containers;
    };
  };
  appService = app: kubeAppYamlFile {
    inherit app;
    fileType = "service";
    override = super: {
      metadata.name = app;
      spec.selector.app = app;
    };
  };

  appFiles = app: linkFarm "photo-garden-kube-${app}" (lib.filter (file: !file.path.skip) [
    {
      name = "${app}.deployment.yml";
      path = appDeployment app;
    }
    {
      name = "${app}.service.yml";
      path = appService app;
    }
  ]);

  sharedFiles = linkFarm "photo-garden-kube-shared" [
    {
      name = "ingress.yml";
      path = deploy/ingress.yml;
    }
    {
      name = "keys.yml";
      path = deploy/keys.yml;
    }
    {
      name = "serviceaccount.tiller.yml";
      path = deploy/serviceaccount.tiller.yml;
    }
  ];
in
  symlinkJoin {
    name = "photo-garden-kube";
    paths = map appFiles apps ++ [sharedFiles];
  }

{
  # Photo garden packages
  apps, jobs, appImages, dockerImageRef,

  # Dependencies
  lib, linkFarm, symlinkJoin, writeText, loadYAML
}:
let
  kubeAppYamlFile = {fileType, app, override, base ? ./apps, skipIfMissing ? true}:
  let
    baseTemplate = loadYAML (./deploy + "/${fileType}.template.yml");
    appTemplatePath = base + "/${app}/kube.${fileType}.yml";
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

  containerTemplate = loadYAML ./deploy/container.template.yml;
  controller = args: app: kubeAppYamlFile ({
    inherit app;
    skipIfMissing = false;
    override = super: {
      metadata.name = app;
      spec.template.metadata.labels.app = app;
      spec.template.spec.containers = map (container: lib.foldl lib.recursiveUpdate {} [
        containerTemplate
        container
        {
          name = app;
          image = dockerImageRef app;
        }
      ]) super.spec.template.spec.containers;
    };
  } // args);

  appDeployment = controller {
    fileType = "deployment";
  };
  appService = app: kubeAppYamlFile {
    inherit app;
    fileType = "service";
    override = super: {
      metadata.name = app;
      spec.selector.app = app;
    };
  };

  jobController = controller {
    fileType = "job";
    base = ./jobs;
  };

  entityFiles = entityType: app: files: linkFarm "photo-garden-kube-${entityType}-${app}" (lib.filter (file: !file.path.skip) files);

  appFiles = app: entityFiles "app" app [
    {
      name = "${app}.deployment.yml";
      path = appDeployment app;
    }
    {
      name = "${app}.service.yml";
      path = appService app;
    }
  ];
  jobFiles = job: entityFiles "job" job [
    {
      name = "${job}.job.yml";
      path = jobController job;
    }
  ];

  sharedFiles = lib.cleanSourceWith {
    src = ./deploy;
    filter = (name: type: !lib.hasSuffix ".template.yml" name);
  };
in
  symlinkJoin {
    name = "photo-garden-kube";
    paths = map appFiles apps ++ map jobFiles jobs ++ [sharedFiles];
  }

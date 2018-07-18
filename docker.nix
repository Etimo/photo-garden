{
  # Photo garden packages
  workspace, apps,

  # Config
  prod,

  # Dependencies
  lib,
  dockerTools,
  linkFarm, symlinkJoin, runCommand, writeText,
  bashInteractive, coreutils, less, nodejs, remarshal,
  nodemon,
}:
let
  relativizePath = base: path: lib.removePrefix (toString base + "/") (toString path);
  pkgAndDeps = pkg: [pkg] ++ lib.attrValues pkg.workspaceDependencies;

  symlinkAddPkg = pkg: symlinkJoin {
    name = "${pkg.name}-symlinkJoin";
    paths = pkg;
  };

  # Adapted from https://github.com/xtruder/kubenix/blob/bc37b314ee5123da9f61721e2845291a2fdd0e58/k8s.nix
  loadYAML = path: builtins.fromJSON (builtins.readFile (runCommand "yaml-to-json" {} "${remarshal}/bin/remarshal -i ${path} -if yaml -of json > $out"));
in rec {
  imageConfig = linkFarm "config" [ {
    name = "photo-garden.json";
    path = if prod
      then ./config.production.json
      else ./config.development.json;
  } ];
  baseImage = dockerTools.buildImage {
    name = "photo-garden-base";
    contents = map symlinkAddPkg [
      # Debugging
      bashInteractive
      coreutils
      less
      # /usr/bin/env
      (linkFarm "photo-garden-base-overlay" [{
        name = "usr";
        path = linkFarm "photo-garden-base-usr" [{
          name = "bin";
          path = linkFarm "photo-garden-base-usr-bin" [{
            name = "env";
            path = "${coreutils}/bin/env";
          }];
        }];
      }])
      # Shared packages to reduce duplication
      nodejs
    ];
  };
  images = map (name: {
    name = "${name}.docker.tar.gz";
    path = dockerTools.buildImage {
      name = "photo-garden-${name}";
      tag = "latest";
      fromImage = baseImage;
      contents = [ imageConfig workspace.${name} ];
      config =
      let
        pkg = workspace.${name};
        pkgBin = "/bin/${name}";
        nodemonConfig = {
          watch = map (dep: "/node_modules/${dep.pname}") (pkgAndDeps pkg);
          # By default nodemon ignores everything inside node_modules
          ignoreRoot = [];
        };
        nodemonConfigJSON = writeText "nodemon.json" (builtins.toJSON nodemonConfig);
      in {
        Cmd = if (!prod) && (pkg.useNodemon or true)
          then [ "${nodemon}/bin/nodemon" "--exec" "${nodejs}/bin/node" "--config" nodemonConfigJSON pkgBin ]
          else [ pkgBin ];
        Env = [
          "PHOTO_GARDEN_CONFIG=/photo-garden.json"
          "APP_NAME=${name}"
        ];
      };
    };
  }) apps ++ [{
    name = "docker-base.tar.gz";
    path = baseImage;
  }];

  composeFileBase = loadYAML ./docker-compose.template.yml;
  composeFileOverrides = {
    services = lib.listToAttrs (map (name: rec {
      inherit name;
      existingService = (composeFileBase.services or {}).${name} or {};
      value = {
        image = "photo-garden-${name}:latest";
        volumes =
        let
          existing = existingService.volumes or [];
          dependencyVolumes = map (dep: "./${relativizePath ./. dep.src}:/node_modules/${dep.pname}") (pkgAndDeps workspace.${name});
        in existing ++ lib.optionals (!prod) dependencyVolumes;
        environment = (existingService.environment or []) ++ [
          "LOG_LEVEL"
        ];
      };
    }) apps);
  };
  composeFileData = lib.recursiveUpdate composeFileBase composeFileOverrides;
  composeFile = writeText "docker-compose.yml"
    ''
      # DO NOT EDIT DIRECTLY, THIS WAS GENERATED BY composeFile in docker.nix
      # Instead, edit docker-compose.template.yml, and run ./build-docker.sh to regenerate
      ${builtins.toJSON composeFileData}
    '';

  extraFiles = [
    {
      name = "docker-compose.yml";
      path = composeFile;
    }
  ];
}

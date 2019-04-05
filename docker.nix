{
  # Photo garden packages
  apps, jobs,

  # Config
  prod, dockerTag, dockerImagePrefix,

  # Dependencies
  lib,
  dockerTools, skopeo,
  linkFarm, symlinkJoin, runCommand, writeText, copyPathToStore,
  bashInteractive, coreutils, less, nodejs, remarshal,
  callPackage,
}:
let
  relativizePath = base: path: lib.removePrefix (toString base + "/") (toString path);
  pkgAndDeps = pkg: [pkg] ++ pkg.workspaceDependencies;

  symlinkAddPkg = pkg: symlinkJoin {
    name = "${pkg.name}-symlinkJoin";
    paths = pkg;
  };

  # Adapted from https://github.com/xtruder/kubenix/blob/bc37b314ee5123da9f61721e2845291a2fdd0e58/k8s.nix
  loadYAML = path: builtins.fromJSON (builtins.readFile (runCommand "yaml-to-json" {} "${remarshal}/bin/remarshal -i ${path} -if yaml -of json > $out"));

  dockerImageRef = app: "${dockerImagePrefix}${app}:${dockerTag}";
in rec {
  imageConfig = copyPathToStore (if prod
    then ./config.production.json
    else ./config.development.json);
  imageConfigDir = linkFarm "config" [ {
    name = "photo-garden.json";
    path = imageConfig;
  } ];
  appImages = lib.mapAttrs (name: pkg: dockerTools.buildLayeredImage {
    inherit name;
    maxLayers = 30;
    contents = [
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
      # Config
      imageConfigDir
    ];
    config =
    let
      pkgBin = "${pkg}/bin/${name}";
      nodemonConfig = {
        watch = map (dep: "${pkg}/libexec/${name}/node_modules/${dep.pname}") (pkgAndDeps pkg) ++ ["/photo-garden.json"];
        # By default nodemon ignores everything inside node_modules
        ignoreRoot = [];
      };
      nodemonConfigJSON = writeText "nodemon.json" (builtins.toJSON nodemonConfig);
    in {
      Cmd = if (!prod) && (pkg.useNodemon or true)
        then [ "${pkg}/libexec/${name}/node_modules/nodemon/bin/nodemon.js" "--exec" "${nodejs}/bin/node" "--config" nodemonConfigJSON pkgBin ]
        else [ pkgBin ];
      Env = [
        "PHOTO_GARDEN_CONFIG=/photo-garden.json"
        "APP_NAME=${name}"
      ];
    };
  }) (apps // jobs);

  composeFileBase = loadYAML ./docker-compose.template.yml;
  composeFileOverrides = {
    services = lib.mapAttrs (name: pkg:
      let
        existingService = (composeFileBase.services or {}).${name} or {};
      in {
        image = dockerImageRef name;
        volumes =
          let
            existing = existingService.volumes or [];
            originalSourcePath = path: assert lib.canCleanSource path;
              if path ? _isLibCleanSourceWith
                then path.origSrc
                else path;
            dependencyVolumes = map (dep: "./${relativizePath ./. (originalSourcePath dep.src)}:${pkg}/libexec/${name}/deps/${dep.pname}") (pkgAndDeps pkg);
            configVolume = "./${relativizePath ./. imageConfig}:/photo-garden.json";
          in existing ++ lib.optionals (!prod) (dependencyVolumes ++ [configVolume]);
        environment = (existingService.environment or []) ++ [
          "LOG_LEVEL"
        ];
      }) (apps // jobs);
  };
  composeFileData = lib.recursiveUpdate composeFileBase composeFileOverrides;
  composeFile = writeText "docker-compose.yml"
    ''
      # DO NOT EDIT DIRECTLY, THIS WAS GENERATED BY composeFile in docker.nix
      # Instead, edit docker-compose.template.yml, and run ./build-docker.sh to regenerate
      ${builtins.toJSON composeFileData}
    '';

  kubernetesConfig = callPackage ./kubernetes.nix {
    inherit apps jobs appImages dockerImageRef loadYAML;
  };

  skopeoLoadImgMap = targetProto: name: img: "docker-archive:${img} ${targetProto}${dockerImageRef name}";
  skopeoLoadImgsMap = targetProto: lib.concatStringsSep "\n" (lib.mapAttrsToList (skopeoLoadImgMap targetProto) appImages);
  skopeoLoadMap = writeText "docker-load" (skopeoLoadImgsMap "docker-daemon:");
  skopeoUploadMap = writeText "docker-upload" (skopeoLoadImgsMap "docker://");
}

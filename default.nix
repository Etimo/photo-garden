{
  useDocker ? false,
  dockerTag ? "latest",
  dockerImagePrefix ? "photo-garden-",
  prod ? false,

  pkgsOpts ?
    if useDocker
      then { system = "x86_64-linux"; }
      else {},
  pkgsBootstrap ? import <nixpkgs> {},
  pkgsSrc ? pkgsBootstrap.fetchFromGitHub {
    owner = "nixos";
    repo = "nixpkgs-channels";
    # branch = "nixpkgs-unstable";
    rev = "79e699096d949d50d70e266b6964f9200f236b82";
    sha256 = "0bbv93pxyanprpia0ibbkawbpdncxdma2a8qkl8p7qjfpvfbfhi5";
  },
  pkgs ? import pkgsSrc pkgsOpts,

  nodejsName ? "nodejs",
  nodejs ? pkgs.${nodejsName},

  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "teozkr";
    repo = "yarn2nix";
    rev = "59c9dfe6209bca13fc4bce6e473c5c0a6ec2dcee";
    sha256 = "11f7d4ssipdn4855wf7c234ngj6i15ksn5b97cxnc0ipx7ny7yva";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs nodejs; },
}:
rec {
  workspace = yarn2nix.mkYarnWorkspace rec {
    src = ./.;
    sourceCleaner = src: pkgs.lib.cleanSourceWith {
      filter =
        if prod || !useDocker
          then name: type: (baseNameOf name != "node_modules") && pkgs.lib.cleanSourceFilter name type
          # We volume-mount the source code anyway, so there's no point copying it here.
          else name: type: (baseNameOf name == "package.json");
      inherit src;
    };
    yarnFlags = [
      "--offline"
      "--frozen-lockfile"
      "--ignore-engine"
    ];

    packageOverrides = {
      web-frontend = let
        runScript = pkgs.writeScript "run-web-frontend"
          ''
            #!${pkgs.bash}/bin/bash
            set -euo pipefail
            export PATH="${pkgs.lib.makeBinPath [ pkgs.coreutils pkgs.utillinuxMinimal pkgs.gnugrep nodejs ]}"

            cd "$(dirname "$(realpath "$0")")/.."
            TMP_BASE=/tmp/photo-garden/web-frontend
            mkdir -p $TMP_BASE

            exec node libexec/web-frontend/node_modules/parcel-bundler/bin/cli.js libexec/web-frontend/node_modules/web-frontend/src/index.html --hmr-port=33710 --out-dir=$TMP_BASE/dist --cache-dir=$TMP_BASE/cache --no-autoinstall
          '';

        mimeTypeMapping = pkgs.writeText "darkhttpd-extra-mime-types"
          ''
            image/svg+xml svg
          '';
        prodRunScript = pkgs.writeScript "run-web-frontend-prod"
          ''
            #!${pkgs.bash}/bin/bash
            set -euo pipefail

            cd "$(${pkgs.coreutils}/bin/dirname "$(${pkgs.coreutils}/bin/realpath "$0")")/.."

            exec ${pkgs.darkhttpd}/bin/darkhttpd dist --port 1234 --mimetypes ${mimeTypeMapping}
          '';
      in if prod
        then {
          PHOTO_GARDEN_GATEWAY_BASE_URL = "https://api.photo.garden";

          extraBuildInputs = [ pkgs.utillinuxMinimal ];
          installPhase =
            ''
              node node_modules/parcel-bundler/bin/cli.js build src/index.html --out-dir=$out/dist --out-file=index.html --no-source-maps
              mkdir -p $out/bin
              cp ${prodRunScript} $out/bin/web-frontend
            '';

          distPhase = "true";

          passthru.useBaseLayer = false;
        }
        else {
          extraBuildInputs = [ pkgs.makeWrapper ];
          postInstall =
            ''
              cp ${runScript} $out/bin/web-frontend
            '';

          passthru.useNodemon = false;
        };
    };


    # Prevent  (dependency of node-sass) from redownloading the Node headers
    # (network access is not allowed inside the sandbox)
    pkgConfig.node-gyp.buildInputs = [ nodejs.python ];
    yarnPreBuild =
      ''
        export npm_config_nodedir=${nodejs}
        export SKIP_SASS_BINARY_DOWNLOAD_FOR_CI=1
      '';

    # Strip debugging references for the sake of the closure size
    pkgConfig.node-sass.postInstall =
      ''
        find -iname binding.node -exec strip -s {} +
      '';
    pkgConfig.snappy.postInstall =
      ''
        find -iname binding.node -exec strip -s {} +
      '';
  };

  apps = pkgs.lib.mapAttrs (name: tpe: workspace."${name}") (builtins.readDir ./apps);
  jobs = pkgs.lib.mapAttrs (name: tpe: workspace."${name}") (builtins.readDir ./jobs);

  ${if useDocker then "dockerBuild" else null} = pkgs.callPackage ./docker.nix {
    inherit apps jobs prod dockerTag dockerImagePrefix nodejs;
  };

  managementEnv = pkgs.stdenvNoCC.mkDerivation {
    name = "management-env";
    srcs = [];
    buildInputs = [
      # To build
      pkgs.nix
      pkgs.bash
      pkgs.docker
      pkgs.parallel-rust
      vendor.skopeo

      # To deploy
      pkgs.kubectl
      pkgs.kubernetes-helm
      pkgs.helmfile
      pkgs.awscli
    ];
    buildPhase =
      ''
        echo "This should only be used with nix-shell!"
        exit 1
      '';
  };

  vendor = {
    # Skopeo 0.1.34 produces a ton of log spam, and has no silence option
    # 0.1.35 (not yet released) disables this when output is not a TTY
    # See #99
    skopeo = assert pkgs.skopeo.name == "skopeo-0.1.34"; pkgs.skopeo.overrideAttrs (old: {
      name = "skopeo-0.1.35-dev";
      src = pkgs.fetchFromGitHub {
        rev = "42b01df89e77cab17cad306567a5dd59ec3f7881";
        owner = "containers";
        repo = "skopeo";
        sha256 = "1bchd6qvjw3q0g4jcxdw03jfrhnjdxwj6bq3mqmkk9i7xf9rl7lf";
      };
    });
  };
}

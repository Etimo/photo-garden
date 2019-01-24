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
    rev = "61c3169a0e17d789c566d5b241bfe309ce4a6275";
    sha256 = "0qbycg7wkb71v20rchlkafrjfpbk2fnlvvbh3ai9pyfisci5wxvq";
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
      filter = name: type: (baseNameOf name != "node_modules") && pkgs.lib.cleanSourceFilter name type;
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
}

{
  useDocker ? false,
  prod ? false,
  pkgsOpts ?
    if useDocker
      then { system = "x86_64-linux"; }
      else {},
  pkgs ? import <nixpkgs> pkgsOpts,
  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "teozkr";
    repo = "yarn2nix";
    rev = "74356856bd584196c458a5e3f6e08fc99e70e34c";
    sha256 = "1jb2w57z6jrbzvshkg801vjc5pxnzq3yb7kr0544ysx7lqvqz2f7";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
let
  workspace = yarn2nix.mkYarnWorkspace rec {
    src = ./.;
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
            export PATH="${pkgs.lib.makeBinPath [ pkgs.coreutils pkgs.utillinuxMinimal pkgs.gnugrep pkgs.nodejs ]}:$PATH"

            cd "$(dirname "$(realpath "$0")")/.."
            TMP_BASE=/tmp/photo-garden/web-frontend
            mkdir -p $TMP_BASE

            # Parcel will not recompile stuff in node_modules... unless it both:
            # 1) has a source field in package.json
            # 2) is a symlink
            # Please don't ask me to explain what they were thinking
            FAKE_PKG=$TMP_BASE/fake-symlinked-pkg-to-force-parcel-to-recompile
            rm -f $FAKE_PKG
            ln -s $(pwd)/node_modules/web-frontend $FAKE_PKG
            rm -f $TMP_BASE/node_modules
            ln -s $(pwd)/node_modules $TMP_BASE/node_modules

            exec node node_modules/parcel-bundler/bin/cli.js $FAKE_PKG --hmr-port=33710 --out-dir=$TMP_BASE/dist --cache-dir=$TMP_BASE/cache --no-autoinstall
          '';

        prodRunScript = pkgs.writeScript "run-web-frontend-prod"
          ''
            #!${pkgs.bash}/bin/bash
            set -euo pipefail

            cd "$(dirname "$(realpath "$0")")/.."

            exec ${pkgs.darkhttpd}/bin/darkhttpd dist --port 1234
          '';
      in if prod
        then {
        extraBuildInputs = [ pkgs.utillinuxMinimal ];
        installPhase =
          ''
            node node_modules/parcel-bundler/bin/cli.js build --out-dir=$out/dist
            mkdir -p $out/bin
            cp ${prodRunScript} $out/bin/web-frontend
          '';
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
  };
  packages = pkgs.lib.mapAttrsToList (name: tpe: name) (builtins.readDir ./apps);
  rawBuilds = map (name: {
    name = "${name}";
    path = workspace."${name}";
  }) packages;
  dockerBuild = pkgs.callPackage ./docker.nix {
    inherit packages workspace prod;
    inherit (pkgs.nodePackages) nodemon;
  };
in
  pkgs.linkFarm "photo-garden" (pkgs.lib.optionals useDocker (dockerBuild.images ++ dockerBuild.extraFiles) ++ rawBuilds)

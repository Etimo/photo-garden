{
  useDocker ? false,
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
      web-frontend = {
        extraBuildInputs = [ pkgs.makeWrapper ];
        postInstall =
          ''
            wrapProgram $out/bin/web-frontend \
            --prefix PATH : "${pkgs.lib.makeBinPath [ pkgs.coreutils pkgs.utillinuxMinimal pkgs.gnugrep pkgs.nodejs ]}"
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
    inherit packages workspace;
    inherit (pkgs.nodePackages) nodemon;
  };
in
  pkgs.linkFarm "photo-garden" (pkgs.lib.optionals useDocker (dockerBuild.images ++ dockerBuild.extraFiles) ++ rawBuilds)

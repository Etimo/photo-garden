{
  useDocker ? false,
  pkgsOpts ?
    if useDocker
      then { system = "x86_64-linux"; }
      else {},
  pkgs ? import <nixpkgs> pkgsOpts,
  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "moretea";
    repo = "yarn2nix";
    rev = "d3b5e201f894a2d2224e71f59569959aef029c67";
    sha256 = "1yb64gkv4dy43d38mmn6fd8nwbcbx3sp8dcz827bcvdwccc70qim";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
let
  workspace = yarn2nix.mkYarnWorkspace rec {
    src = ./.;
    yarnFlags = [
      "--offline"
      "--frozen-lockfile"
    ];
    packageOverrides = {
      web-frontend = {
        extraBuildInputs = [ pkgs.makeWrapper ];
        postInstall =
          ''
            wrapProgram $out/bin/web-frontend \
            --prefix PATH : "${pkgs.lib.makeBinPath [ pkgs.coreutils pkgs.utillinuxMinimal pkgs.gnugrep pkgs.nodejs ]}"
          '';
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
  };
in
  pkgs.linkFarm "photo-garden" (pkgs.lib.optionals useDocker (dockerBuild.images ++ dockerBuild.extraFiles) ++ rawBuilds)

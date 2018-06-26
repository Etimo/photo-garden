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
    rev = "d85025ea19975d0595a7bd35216b61447d43e53d";
    sha256 = "1yb64gkv4dy43d38mmn6fd8nwbcbx3sp8dcz827bcvdwccc70qim";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
let
  workspace = yarn2nix.mkYarnWorkspace {
    src = ./.;
    packageOverrides = {
      web-frontend = {
        extraBuildInputs = [ pkgs.makeWrapper ];
        postInstall =
          ''
            wrapProgram $out/bin/web-frontend \
            --prefix PATH : "${pkgs.lib.makeBinPath [ pkgs.coreutils ]}"
          '';
      };
    };
  };
  packages = pkgs.lib.mapAttrsToList (name: tpe: name) (builtins.readDir ./apps);
  dockerImageConfig = pkgs.linkFarm "config" [ {
    name = "photo-garden.json";
    path = ./config.development.json;
  } ];
  baseImage = pkgs.dockerTools.buildImage {
    name = "photo-garden-base";
    contents = [
      # Debugging
      pkgs.bash
      pkgs.coreutils
      # Shared packages to reduce duplication
      pkgs.nodejs
    ];
  };
  dockerImages = map (name: {
    name = "${name}.docker.tar.gz";
    path = pkgs.dockerTools.buildImage {
      name = "photo-garden-${name}";
      fromImage = baseImage;
      contents = [ dockerImageConfig workspace."${name}" ];
      config = {
        Cmd = [ "/bin/${name}" ];
        Env = [ "PHOTO_GARDEN_CONFIG=/photo-garden.json"];
      };
    };
  }) packages;
  rawBuilds = map (name: {
    name = "${name}";
    path = workspace."${name}";
  }) packages;
in
  pkgs.linkFarm "photo-garden" (pkgs.lib.optionals useDocker dockerImages ++ rawBuilds)

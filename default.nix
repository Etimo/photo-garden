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
    rev = "5deef049a1d26aae8900a899b614d0f1a687e908";
    sha256 = "18kzzk1lmq9w4b5wm5w4f3gkd0ziv347l37195f0qllmx8khixzj";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
let
  workspace = pkgs.callPackage ./workspace.nix { inherit yarn2nix; };
  packages = [
    "gateway"
    "be-photo-import"
    "be-download-user-photo-google-drive"
    "be-normalize-user-photo-google-drive"
    "be-download-user-photo-dropbox"
    "api-photos"
    "web-frontend"
  ];
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

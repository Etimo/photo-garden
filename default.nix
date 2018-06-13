{
  pkgs ? import <nixpkgs> {},
  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "teozkr";
    repo = "yarn2nix";
    rev = "de4ddd1d117af93e8874d4dd4d27d97f70d83328";
    sha256 = "13hwa4lc99lh46adskb913nfvhvq9cdmym3qi2dls6ch7fal16gq";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
let
  workspace = import ./workspace.nix { inherit yarn2nix; };
  packages = [
    "gateway"
    "be-photo-import"
    "be-download-user-photo-google-drive"
    "be-normalize-user-photo-google-drive"
    "be-download-user-photo-dropbox"
    "api-photos"
    "web-frontend"
  ];
in
  pkgs.linkFarm "photo-garden" (map (name: {
    inherit name;
    path = workspace."${name}";
  }) packages)

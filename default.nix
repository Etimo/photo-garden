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
(import ./workspace.nix { inherit yarn2nix; }).gateway

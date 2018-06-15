{
  pkgs ? import <nixpkgs> {},
  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "teozkr";
    repo = "yarn2nix";
    rev = "5deef049a1d26aae8900a899b614d0f1a687e908";
    sha256 = "18kzzk1lmq9w4b5wm5w4f3gkd0ziv347l37195f0qllmx8khixzj";
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

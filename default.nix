{
  pkgs ? import <nixpkgs> {},
  yarn2nixSrc ? pkgs.fetchFromGitHub {
    owner = "teozkr";
    repo = "yarn2nix";
    rev = "local-dependencies";
    sha256 = "1j39kwhr078mhhyhk4fpg52aybqr33qri0hmg5zksfwbc1q7gvwh";
  },
  yarn2nix ? import yarn2nixSrc { inherit pkgs; },
}:
(import ./workspace.nix { inherit yarn2nix; }).gateway

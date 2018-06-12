{
  pkgs ? import <nixpkgs> {},
  yarn2nix ? import ../yarn2nix { inherit pkgs; },
}:
(import ./workspace.nix { inherit yarn2nix; }).gateway

{
  # Photo garden packages
  workspace, packages,

  # Dependencies
  dockerTools, linkFarm,
  bashInteractive, coreutils, nodejs,
}:
rec {
  imageConfig = pkgs.linkFarm "config" [ {
    name = "photo-garden.json";
    path = ./config.development.json;
  } ];
  baseImage = dockerTools.buildImage {
    name = "photo-garden-base";
    contents = [
      # Debugging
      bashInteractive
      coreutils
      # Shared packages to reduce duplication
      nodejs
    ];
  };
  images = map (name: {
    name = "${name}.docker.tar.gz";
    path = dockerTools.buildImage {
      name = "photo-garden-${name}";
      tag = "latest";
      fromImage = baseImage;
      contents = [ imageConfig workspace."${name}" ];
      config = {
        Cmd = [ "/bin/${name}" ];
        Env = [ "PHOTO_GARDEN_CONFIG=/photo-garden.json"];
      };
    };
  }) packages ++ [{
    name = "docker-base.tar.gz";
    path = baseImage;
  }];
}

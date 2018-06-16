{yarn2nix, makeWrapper, coreutils, lib}:
let
  pkgDefaultArgs = { inherit yarn2nix; };
  pkg = args: import ./yarn-workspace-package.nix (pkgDefaultArgs // args);
in rec {
  app-name = pkg {
    src = ./libs/app-name;
  };

  communication = pkg {
    src = ./libs/communication;
    workspaceDependencies = { inherit config logging; };
  };

  config = pkg {
    src = ./libs/config;
  };

  db = pkg {
    src = ./libs/db;
  };

  logging = pkg {
    src = ./libs/logging;
    workspaceDependencies = { inherit app-name config; };
  };

  image-path = pkg {
    src = ./libs/image-path;
    workspaceDependencies = { inherit config; };
  };

  provider-google-drive-tokens = pkg {
    src = ./libs/provider-google-drive-tokens;
    workspaceDependencies = { inherit db; };
  };

  provider-user = pkg {
    src = ./libs/provider-user;
    workspaceDependencies = { inherit db; };
  };

  dropbox-api = pkg {
    src = ./libs/dropbox-api;
  };

  dropbox-db = pkg {
    src = ./libs/dropbox-db;
    workspaceDependencies = { inherit db; };
  };

  gateway = pkg {
    src = ./apps/gateway;
    workspaceDependencies = { inherit config communication dropbox-api dropbox-db provider-google-drive-tokens provider-user; };
  };

  be-photo-import = pkg {
    src = ./apps/be-photo-import;
    workspaceDependencies = { inherit communication db image-path; };
  };

  be-download-user-photo-google-drive = pkg {
    src = ./apps/be-download-user-photo-google-drive;
    workspaceDependencies = { inherit communication db image-path; };
  };

  be-normalize-user-photo-google-drive = pkg {
    src = ./apps/be-normalize-user-photo-google-drive;
    workspaceDependencies = { inherit communication db image-path; };
  };

  be-download-user-photo-dropbox = pkg {
    src = ./apps/be-download-user-photo-dropbox;
    workspaceDependencies = { inherit communication db dropbox-api dropbox-db image-path provider-user; };
  };

  api-photos = pkg {
    src = ./apps/api-photos;
    workspaceDependencies = { inherit config db logging; };
  };

  web-frontend = pkg {
    src = ./apps/web-frontend;
    extraBuildInputs = [ makeWrapper ];
    postInstallHook =
      ''
        wrapProgram $out/bin/web-frontend \
          --prefix PATH : "${lib.makeBinPath [ coreutils ]}"
      '';
  };
}

{yarn2nix}:
let
  pkgDefaultArgs = { inherit yarn2nix; };
  pkg = args: import ./yarn-workspace-package.nix (pkgDefaultArgs // args);
in rec {
  app-name = pkg {
    src = ./libs/app-name;
  };

  communication = pkg {
    src = ./libs/communication;
    workspaceDependencies = { inherit app-name config logging; };
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
  };

  provider-google-drive-tokens = pkg {
    src = ./libs/provider-google-drive-tokens;
  };

  provider-user = pkg {
    src = ./libs/provider-user;
  };

  dropbox-api = pkg {
    src = ./libs/dropbox-api;
  };

  dropbox-db = pkg {
    src = ./libs/dropbox-db;
  };

  gateway = pkg {
    src = ./apps/gateway;
    workspaceDependencies = { inherit config communication dropbox-api; };
  };
}

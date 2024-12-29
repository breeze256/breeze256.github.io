{
  description = "The flake for breeze256's Blog.";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.nodejs = pkgs.nodejs;
        packages.default = self.packages.pnpm;

        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.nodePackages.pnpm
          ];

          shellHook = ''
            export NODE_ENV=development
            if [ ! -d "node_modules" ]; then
              pnpm install
            fi
          '';
        };
      });
}
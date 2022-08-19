#!/bin/bash

PJSON=$(cat package.json | jq --indent 4 '
	del(.type)
	| .description = .description + ". This is a fork of node-fetch/fetch-blob, but with CommonJS support."
	| .repository = "esm2cjs/" + .name
	| .name |= "@esm2cjs/" + .
	| .author = { "name": "Dominic Griesel", "email": "d.griesel@gmx.net" }
	| .publishConfig = { "access": "public" }
	| .funding = "https://github.com/sponsors/AlCalzone"
	| .main = "cjs/index.js"
	| .module = "esm/index.js"
	| .files = ["cjs/", "esm/", "streams.cjs"]
	| .exports = {}
	| .exports["."].import = "./esm/index.js"
	| .exports["."].require = "./cjs/index.js"
	| .exports["./from.js"].import = "./esm/from.js"
	| .exports["./from.js"].require = "./cjs/from.js"
	| .exports["./file.js"].import = "./esm/file.js"
	| .exports["./file.js"].require = "./cjs/file.js"
	| .exports["./package.json"] = "./package.json"
	| .types = "esm/index.d.ts"
	| .typesVersions = {}
	| .typesVersions["*"] = {}
	| .typesVersions["*"]["esm/index.d.ts"] = ["esm/index.d.ts"]
	| .typesVersions["*"]["cjs/index.d.ts"] = ["esm/index.d.ts"]
	| .typesVersions["*"]["*"] = ["esm/*"]
	| .scripts["to-cjs"] = "esm2cjs --in esm --out cjs -t node12"
	| .scripts.build = .scripts.prepublishOnly
	| del(.scripts.prepublishOnly)
')
echo "$PJSON" > package.json

# Update package.json -> version if upstream forgot to update it
if [[ ! -z "${TAG}" ]] ; then
	VERSION=$(echo "${TAG/v/}")
	PJSON=$(cat package.json | jq --tab --arg VERSION "$VERSION" '.version = $VERSION')
	echo "$PJSON" > package.json
fi

npm i
npm run build

mkdir -p esm cjs
mv {index,file,from}.{js,d.ts} esm/
sed -i 's#./streams.cjs#../streams.cjs#' esm/index.js

# Fix tests
for file in test/*.js ; do
	sed -i 's#\.\./#../esm/#' "$file"
done
echo '{"type":"module"}' > test/package.json

# un-ignore definition files
sed -i 's#\*.d.ts##' .gitignore

npm i -D @alcalzone/esm2cjs
npm run to-cjs
npm uninstall -D @alcalzone/esm2cjs

PJSON=$(cat package.json | jq --indent 4 'del(.scripts["to-cjs"])')
echo "$PJSON" > package.json

npm test

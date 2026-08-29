import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'playcanvas', 'PLAYCANVAS_EDITOR_MANIFEST.json');

const fail = (message) => {
    console.error(`PLAYCANVAS CONTRACT ERROR: ${message}`);
    process.exitCode = 1;
};

if (!fs.existsSync(manifestPath)) {
    fail(`missing ${path.relative(root, manifestPath)}`);
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const expectedScripts = manifest.scriptAssets ?? [];

for (const entry of expectedScripts) {
    const file = path.join(root, entry.path);
    if (!fs.existsSync(file)) {
        fail(`manifest script asset does not exist: ${entry.path}`);
        continue;
    }

    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(`static scriptName = '${entry.script}'`)) {
        fail(`${entry.path}: expected static scriptName '${entry.script}'`);
    }
    if (!file.endsWith('.mjs')) {
        fail(`${entry.path}: new Editor scripts must use .mjs`);
    }
}

const scriptsDir = path.join(root, 'playcanvas', 'editor', 'scripts');
if (fs.existsSync(scriptsDir)) {
    for (const name of fs.readdirSync(scriptsDir)) {
        if (!name.endsWith('.mjs')) continue;
        const source = fs.readFileSync(path.join(scriptsDir, name), 'utf8');
        if (/pc\.createScript\s*\(/.test(source)) {
            fail(`${path.join('playcanvas/editor/scripts', name)} uses deprecated classic-script registration`);
        }
        if (/\bapiKey\s*=/.test(source) || /['"]x-api-key['"]/.test(source)) {
            fail(`${path.join('playcanvas/editor/scripts', name)} appears to carry a client API key`);
        }
    }
}

const gameRoot = fs.readFileSync(path.join(root, 'playcanvas', 'editor', 'scripts', 'game-root.mjs'), 'utf8');
if (!gameRoot.includes("this.app.once('update'")) {
    fail('GameRoot must defer clamour:boot until the initial script wiring has completed');
}

const player = fs.readFileSync(path.join(root, 'playcanvas', 'editor', 'scripts', 'player-controller.mjs'), 'utf8');
if (!player.includes('rigidbody.linearVelocity')) {
    fail('PlayerController must use native Rigidbody velocity for a dynamic body');
}
if (/this\.entity\.(translate|setPosition)\s*\(/.test(player)) {
    fail('PlayerController contains a direct Entity movement mutation incompatible with normal dynamic-body movement');
}

const streetView = fs.readFileSync(path.join(root, 'playcanvas', 'editor', 'scripts', 'streetview-manager.mjs'), 'utf8');
if (!streetView.includes("'address:selected'")) {
    fail('StreetViewManager must listen to the canonical address:selected event');
}

const health = fs.readFileSync(path.join(root, 'universal-server', 'artifacts', 'api-server', 'src', 'routes', 'health.ts'), 'utf8');
const network = fs.readFileSync(path.join(root, 'playcanvas', 'editor', 'scripts', 'network-manager.mjs'), 'utf8');
const healthPathMatch = network.match(/healthPath\s*=\s*['\"]([^'\"]+)['\"]/);
if (!healthPathMatch || healthPathMatch[1] !== '/api/healthz') {
    fail(`NetworkManager healthPath must be /api/healthz, got ${healthPathMatch?.[1] ?? 'missing'}`);
}
if (!health.includes('router.get("/healthz"')) {
    fail('Universal Server does not expose the health endpoint expected by NetworkManager');
}

const importMap = fs.readFileSync(path.join(root, 'playcanvas', 'playcanvas-importmap.json'), 'utf8');
if (!importMap.includes('playcanvas@2.21.4')) {
    fail('PlayCanvas import map is not pinned to the audited stable engine version 2.21.4');
}

console.log('PlayCanvas source contract validation passed.');
console.log('NOTE: live Editor Scene/Entity/Component/Asset/Settings state still requires live PlayCanvas verification.');

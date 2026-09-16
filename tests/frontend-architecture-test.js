/**
 * frontend-architecture-test.js
 *
 * FM 前端 Harness 架构验证测试。
 * 验证 Vue 多模块工程的入口、路由、Store 和核心组件结构。
 * 测试路径：webSourceRoot/tests/frontend-architecture-test.js
 */

const fs = require('fs');
const path = require('path');

const WEB_SOURCE_ROOT = path.resolve(__dirname, '..');

// ---------- 模块清单 ----------
const MODULES = ['aop_assetcenter', 'aop_tradecode', 'aop_tradedesign'];

// ---------- 必要的模块文件 ----------
const REQUIRED_FILES = [
    'Entry.vue',
    'main.js',
    'package.json',
    'core/router/index.js',
    'core/store/index.js'
];

// ---------- 辅助函数 ----------
function exists(filePath) {
    return fs.existsSync(path.resolve(WEB_SOURCE_ROOT, filePath));
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(`FAIL: ${message}`);
    }
}

function assertExists(relPath, label) {
    assert(exists(relPath), `${label || relPath} 不存在`);
}

// ---------- 测试集 ----------
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failed++;
        console.error(`  ✗ ${name}: ${e.message}`);
    }
}

console.log('FM 前端架构测试');
console.log('================\n');

// 1. 根 package.json
test('根 package.json 存在', () => {
    assertExists('package.json');
});

// 2. 知识库存在
test('知识库目录 docs/arch-knowledge-base 存在', () => {
    assertExists('docs/arch-knowledge-base');
});

test('platforms.yaml 存在', () => {
    assertExists('docs/arch-knowledge-base/platforms.yaml');
});

test('frontend-engineering-facts.json 存在', () => {
    assertExists('docs/arch-knowledge-base/frontend-engineering-facts.json');
});

// 3. AGENTS.md
test('AGENTS.md 已生成', () => {
    assertExists('AGENTS.md');
    const content = fs.readFileSync(path.resolve(WEB_SOURCE_ROOT, 'AGENTS.md'), 'utf-8');
    assert(content.includes('business_type'), 'AGENTS.md 应包含 business_type');
    assert(content.includes('channel_type'), 'AGENTS.md 应包含 channel_type');
    assert(content.includes('product_type'), 'AGENTS.md 应包含 product_type');
    assert(content.includes('frontend_stack'), 'AGENTS.md 应包含 frontend_stack');
    assert(content.includes('classification_evidence'), 'AGENTS.md 应包含 classification_evidence');
});

// 4. harness-state.json
test('harness-state.json 已生成', () => {
    assertExists('harness-state.json');
    const state = JSON.parse(fs.readFileSync(path.resolve(WEB_SOURCE_ROOT, 'harness-state.json'), 'utf-8'));
    assert(state.schemaVersion === 'fm-frontend-harness-state/2.0', 'schemaVersion 应为 fm-frontend-harness-state/2.0');
    assert(state.stateKind === 'application-harness', 'stateKind 应为 application-harness');
    assert(state.status === 'completed', 'status 应为 completed');
});

// 5. 模块结构与入口
MODULES.forEach(mod => {
    const modulePath = `src/modules/${mod}`;

    test(`${mod} 目录存在`, () => {
        assertExists(modulePath);
    });

    REQUIRED_FILES.forEach(file => {
        const filePath = `${modulePath}/${file}`;
        test(`${mod}/${file} 存在`, () => {
            assertExists(filePath, filePath);
        });
    });

    test(`${mod} 路由映射存在`, () => {
        assert(exists(`${modulePath}/core/router/map/`) && fs.readdirSync(path.resolve(WEB_SOURCE_ROOT, `${modulePath}/core/router/map/`)).length > 0,
            `${modulePath}/core/router/map/ 应包含至少一个路由映射文件`);
    });
});

// 6. 核心视图目录
const VIEW_CHECKS = [
    ['aop_assetcenter', ['applicationArchitecture', 'applicationPanorama', 'architecturePanorama', 'capabilityModel', 'dataManagement', 'deploymentArchitecture', 'entityModel', 'processModel', 'productModel', 'technologyArchitecture']],
    ['aop_tradecode', ['assetList', 's4workdesign', 's5workdesign', 'workbench']],
    ['aop_tradedesign', ['controlWorkbench', 'd4workbench', 'datadict', 'dicmgmt']]
];

VIEW_CHECKS.forEach(([mod, views]) => {
    views.forEach(v => {
        test(`${mod}/views/${v} 目录存在`, () => {
            assertExists(`src/modules/${mod}/views/${v}`);
        });
    });
});

// 7. 构建环境配置
test('config/dev.env.js 包含三个模块配置', () => {
    assertExists('config/dev.env.js');
    const content = fs.readFileSync(path.resolve(WEB_SOURCE_ROOT, 'config/dev.env.js'), 'utf-8');
    MODULES.forEach(mod => {
        assert(content.includes(mod), `config/dev.env.js 应包含模块 ${mod}`);
    });
});

// 8. Harness 状态文件不应包含 Run 状态字段
test('harness-state.json 不包含 Run 状态字段', () => {
    const state = JSON.parse(fs.readFileSync(path.resolve(WEB_SOURCE_ROOT, 'harness-state.json'), 'utf-8'));
    assert(!('runId' in state), '不应包含 runId');
    assert(!('currentStage' in state), '不应包含 currentStage');
    assert(!('runRoot' in state), '不应包含 runRoot');
});

// ---------- 结果 ----------
console.log(`\n结果: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) {
    process.exit(1);
}
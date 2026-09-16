#!/usr/bin/env python3
"""Build the requirement-model.json for SOW管理."""
import json
import hashlib
from pathlib import Path

WORKING = Path(__file__).parent
IMAGES_DIR = WORKING / "images"

def hash_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def build():
    m = {
        "schemaVersion": "requirement-model/1.5",
        "baseline": {
            "baselineId": "BASELINE-SOW-MGT-001",
            "version": "1.0.0",
            "status": "decision_required",
            "requirementRunId": "run-20260916-3d8e72b4",
            "projectNumber": "FM-000001",
            "projectName": "aop_agement",
            "requirementTitle": "SOW管理",
            "modelSha256": "",
            "createdAt": "2026-09-16T00:00:00Z",
            "updatedAt": "2026-09-16T00:00:00Z"
        },
        "sources": [{
            "sourceId": "SRC-001",
            "type": "docx",
            "path": "SOW管理-需求文档-20260401.docx",
            "title": "SOW管理 需求说明文档",
            "subtitle": "FinMall平台研发V4.0.1",
            "author": "顾秋梅",
            "extractionStatistics": {
                "paragraphs": 146, "tables": 0, "images": 11,
                "contentBlocks": 107, "uninspectableImages": 0
            }
        }],
        "sourceCoverage": [],
        "visualEvidence": [],
        "application": {
            "appId": "APP-FM-H5", "name": "FinMall平台",
            "version": "V4.0.1", "channel": "PC Web"
        },
        "modules": [],
        "functions": [],
        "scenarios": [],
        "requirements": [],
        "businessObjects": [],
        "businessRules": [],
        "responsibilities": [],
        "contracts": [],
        "nonFunctionalRequirements": [],
        "acceptanceCriteria": [],
        "acceptanceTestCases": [],
        "logicalTestDataSets": [],
        "decisions": [],
        "decisionSessions": [],
        "gateResult": {"status": "decision_required", "dimensions": {}, "blockingIssues": []}
    }

    # ── Source Coverage ──
    blocks = [
        ("p:0", "SOW管理 → 标题", "SOW管理", "FUN-SOW-ALL"),
        ("p:1", "SOW管理 → 标题", "需求说明文档", "FUN-SOW-ALL"),
        ("p:2", "SOW管理 → 标题", "FinMall平台研发V4.0.1", "background"),
        ("p:3", "SOW管理 → 标题", "顾秋梅", "decorative"),
        ("p:4", "SOW管理 → 功能入口", "SOW管理", "FUN-SOW-ALL"),
        ("p:5", "SOW管理 → 功能入口", "功能入口：工程管理/SOW管理", "FUN-SOW-ALL"),
        ("p:6", "SOW管理 → 前置条件", "前置条件：用户已登录", "FUN-SOW-ALL"),
        ("p:7", "SOW管理 → 操作权限", "操作权限：FM平台用户", "FUN-SOW-ALL"),
        ("p:8", "SOW管理 → 功能描述", "业务/运营团队在经营过程中接收到客户或者生产需求，在平台以SOW的形式管理起来。", "FUN-SOW-ALL"),
        ("p:10", "SOW管理首页 → 功能描述", "功能描述", "FUN-SOW-HOME"),
        ("p:11", "SOW管理首页 → 功能描述", "SOW首页展示平台已创建的SOW，有操作权限的用户可以新建、编辑、删除、提交、查看SOW。", "FUN-SOW-HOME"),
        ("p:12", "SOW管理首页 → 页面原型", "页面原型", "image:1"),
        ("image:1", "SOW管理首页 → 页面原型 → SOW首页列表", "原型截图", "FUN-SOW-HOME"),
        ("p:14", "SOW管理首页 → SOW首页列表", "SOW首页列表", "FUN-SOW-HOME"),
        ("p:15", "SOW管理首页 → 业务规则", "业务规则", "FUN-SOW-HOME"),
        ("p:16", "SOW管理首页 → 业务规则", "SOW首页展示所有人创建的SOW，可以按照名称、关联商机、状态、创建人、期望完成时间等条件快速查询", "FUN-SOW-HOME"),
        ("p:17", "SOW管理首页 → 业务规则", "SOW状态说明", "FUN-SOW-HOME"),
        ("p:18", "SOW管理首页 → 业务规则", "已注册：SOW创建完成即【已注册】，可编辑、提交（完成）、删除", "FUN-SOW-HOME"),
        ("p:19", "SOW管理首页 → 业务规则", "已完成：SOW完成基本信息及SOW清单的上传，提交完成，修改状态为【已完成】，可编辑、删除", "FUN-SOW-HOME"),
        ("p:20", "SOW管理首页 → 业务规则", "已登记：SOW关联的方案评审通过，修改状态为【已登记】，不可编辑/删除", "FUN-SOW-HOME"),
        ("p:21", "新建SOW → 标题", "新建SOW", "FUN-SOW-CREATE"),
        ("p:22", "新建SOW → 功能描述", "功能描述", "FUN-SOW-CREATE"),
        ("p:23", "新建SOW → 功能描述", "用户可以通过该功能创建SOW。", "FUN-SOW-CREATE"),
        ("p:24", "新建SOW → 页面原型", "页面原型", "image:2"),
        ("image:2", "新建SOW → 页面原型 → 新建SOW侧滑面板", "原型截图", "FUN-SOW-CREATE"),
        ("p:26", "新建SOW → 新建SOW侧滑面板", "新建SOW侧滑面板", "FUN-SOW-CREATE"),
        ("p:27", "新建SOW → 业务规则", "业务规则", "FUN-SOW-CREATE"),
        ("p:28", "新建SOW → 业务规则", "用户在SOW首页列表点击\"新建SOW\"，进入新建SOW侧滑面板", "FUN-SOW-CREATE"),
        ("p:29", "新建SOW → 业务规则 → SOW名称", "SOW名称：中文/英文，最多30个字", "FUN-SOW-CREATE"),
        ("p:30", "新建SOW → 业务规则 → 关联商机", "关联商机：文本格式，最多30个字", "FUN-SOW-CREATE"),
        ("p:31", "新建SOW → 业务规则 → 商机编号", "商机编号：文本格式，最多30个字", "FUN-SOW-CREATE"),
        ("p:32", "新建SOW → 业务规则 → SOW类型", "SOW类型（单选）：POC、交付、FM1、其他", "FUN-SOW-CREATE"),
        ("p:33", "新建SOW → 业务规则 → 产品类型", "产品类型（单选）：业务产品、平台产品、工具产品", "FUN-SOW-CREATE"),
        ("p:34", "新建SOW → 业务规则 → 期望完成时间", "期望完成时间：年月日选择器", "FUN-SOW-CREATE"),
        ("p:35", "新建SOW → 业务规则 → 凭据附件", "凭据附件：上传附件，支持上传图片、文件格式的附件", "FUN-SOW-CREATE"),
        ("p:36", "新建SOW → 业务规则 → SOW描述", "SOW描述：富文本", "FUN-SOW-CREATE"),
        ("p:37-40", "新建SOW → 业务规则 → 操作", "取消/仅创建/创建并继续设计", "FUN-SOW-CREATE"),
        ("p:41", "编辑SOW → 标题", "编辑SOW", "FUN-SOW-EDIT"),
        ("p:42", "编辑SOW → 功能描述", "功能描述", "FUN-SOW-EDIT"),
        ("p:43", "编辑SOW → 功能描述", "用户在SOW列表点击编辑，进入编辑SOW页面，可修改基本信息、管理SOW清单、关联文档。", "FUN-SOW-EDIT"),
        ("p:44", "编辑SOW → 页面原型", "页面原型", "image:3"),
        ("image:3", "编辑SOW → 页面原型 → 编辑SOW页面", "原型截图（整体页面）", "FUN-SOW-EDIT"),
        ("p:46", "编辑SOW → 页面原型", "基本信息", "FUN-SOW-EDIT"),
        ("image:4", "编辑SOW → 页面原型 → 基本信息", "原型截图（基本信息tab）", "FUN-SOW-EDIT"),
        ("p:48", "编辑SOW → 页面原型", "SOW清单-初始状态", "FUN-SOW-EDIT"),
        ("image:5", "编辑SOW → 页面原型 → SOW清单-初始状态", "原型截图（空清单）", "FUN-SOW-EDIT"),
        ("image:6", "编辑SOW → 页面原型 → SOW清单-导入后", "原型截图（导入后清单）", "FUN-SOW-EDIT"),
        ("p:51", "编辑SOW → 页面原型", "首次导入", "FUN-SOW-EDIT"),
        ("image:7", "编辑SOW → 页面原型 → 首次导入", "原型截图（导入弹窗）", "FUN-SOW-EDIT"),
        ("p:53", "编辑SOW → 页面原型", "重新导入", "FUN-SOW-EDIT"),
        ("image:8", "编辑SOW → 页面原型 → 重新导入", "原型截图（重新导入差异对比）", "FUN-SOW-EDIT"),
        ("p:55", "编辑SOW → 页面原型", "编辑功能信息", "FUN-SOW-EDIT"),
        ("image:9", "编辑SOW → 页面原型 → 编辑功能信息", "原型截图（编辑功能弹窗）", "FUN-SOW-EDIT"),
        ("p:57", "编辑SOW → 业务规则", "业务规则", "FUN-SOW-EDIT"),
        ("p:58", "编辑SOW → 业务规则", "修改基本信息，参考新建SOW。", "FUN-SOW-EDIT"),
        ("p:59", "编辑SOW → 业务规则 → POC信息", "POC信息：若当前SOW类型为POC，则展示POC信息", "FUN-SOW-EDIT"),
        ("p:60", "编辑SOW → 业务规则 → POC总分", "POC总分：根据SOW清单每个功能的\"POC分值\"汇总得出", "FUN-SOW-EDIT"),
        ("p:61", "编辑SOW → 业务规则 → 当前自评得分", "当前自评得分：根据SOW清单每个功能的\"当前自评得分\"汇总得出", "FUN-SOW-EDIT"),
        ("p:62", "编辑SOW → 业务规则 → 竞争对手得分", "竞争对手得分：根据SOW清单每个功能的\"竞争对手得分\"汇总得出", "FUN-SOW-EDIT"),
        ("p:63", "编辑SOW → 业务规则 → 批量导入", "SOW清单默认为空，用户点击\"批量导入\"完成SOW清单的上传。", "FUN-SOW-EDIT"),
        ("p:64", "编辑SOW → 业务规则 → 下载模板", "下载模板，根据当前SOW类型下载不同的xlsx格式模板", "FUN-SOW-EDIT"),
        ("p:65", "编辑SOW → 业务规则 → 非POC模板", "非POC类型的SOW导入模板：产品名称、业务域、模块名称、功能名称、功能合用、功能说明", "FUN-SOW-EDIT"),
        ("p:66", "编辑SOW → 业务规则 → POC模板", "POC类型的SOW导入模板：产品名称、业务域、模块名称、功能名称、功能合用、功能说明、POC评分标准、POC分值、当前自评得分、竞争对手得分", "FUN-SOW-EDIT"),
        ("p:67", "编辑SOW → 业务规则 → 产品类型默认", "产品类型在SOW创建的时候就定义了，所以导入的时候不需要输入", "FUN-SOW-EDIT"),
        ("p:68", "编辑SOW → 业务规则 → 首次导入", "首次导入，上传成功后点击\"开始导入\"，导入成功后在SOW清单显示功能清单。", "FUN-SOW-EDIT"),
        ("p:69", "编辑SOW → 业务规则 → 重新导入", "重新导入，上传成功后展示本次上传较上次上传新增/删除的功能清单", "FUN-SOW-EDIT"),
        ("p:70", "编辑SOW → 业务规则 → 修改功能", "导入后，用户也可以修改功能信息、功能是否合用，以及POC相关信息。", "FUN-SOW-EDIT"),
        ("p:71-73", "编辑SOW → 业务规则 → 删除功能", "删除功能时校验是否在关联方案中匹配了系统功能", "FUN-SOW-EDIT"),
        ("p:74", "删除SOW → 标题", "删除SOW", "FUN-SOW-DELETE"),
        ("p:75", "删除SOW → 功能描述", "功能描述", "FUN-SOW-DELETE"),
        ("p:76", "删除SOW → 功能描述", "用户可以通过该功能删除不需要的SOW数据。", "FUN-SOW-DELETE"),
        ("p:77", "删除SOW → 页面原型", "页面原型", "image:10"),
        ("image:10", "删除SOW → 页面原型 → 删除弹窗", "原型截图", "FUN-SOW-DELETE"),
        ("p:79", "删除SOW → 删除弹窗", "删除弹窗", "FUN-SOW-DELETE"),
        ("p:80", "删除SOW → 业务规则", "业务规则", "FUN-SOW-DELETE"),
        ("p:81-84", "删除SOW → 业务规则", "校验关联方案后删除或阻断", "FUN-SOW-DELETE"),
        ("p:85", "提交完成 → 标题", "提交完成", "FUN-SOW-SUBMIT"),
        ("p:86", "提交完成 → 功能描述", "功能描述", "FUN-SOW-SUBMIT"),
        ("p:87", "提交完成 → 功能描述", "用户可以通过该功能进行SOW的提交，修改SOW状态进入已完成。", "FUN-SOW-SUBMIT"),
        ("p:88", "提交完成 → 页面原型", "页面原型", "image:11"),
        ("image:11", "提交完成 → 页面原型 → 提交完成弹窗", "原型截图", "FUN-SOW-SUBMIT"),
        ("p:90", "提交完成 → 提交完成弹窗", "提交完成弹窗", "FUN-SOW-SUBMIT"),
        ("p:91", "提交完成 → 业务规则", "业务规则", "FUN-SOW-SUBMIT"),
        ("p:92-94", "提交完成 → 业务规则", "校验SOW清单导入及必输项后提交", "FUN-SOW-SUBMIT"),
        ("p:95", "查看SOW详情 → 标题", "查看SOW详情", "FUN-SOW-VIEW"),
        ("p:96", "查看SOW详情 → 功能描述", "功能描述", "FUN-SOW-VIEW"),
        ("p:97", "查看SOW详情 → 功能描述", "用户通过该功能可以查看SOW详情。", "FUN-SOW-VIEW"),
        ("p:98", "查看SOW详情 → 页面原型", "页面原型", "FUN-SOW-VIEW"),
        ("p:100", "查看SOW详情 → SOW详情-基本信息", "SOW详情-基本信息", "FUN-SOW-VIEW"),
        ("p:101", "查看SOW详情 → 业务规则", "业务规则", "FUN-SOW-VIEW"),
        ("p:102", "查看SOW详情 → 业务规则", "用户在SOW管理首页-SOW列表，选中SOW，点击\"查看\"，进入查看SOW详情页面。", "FUN-SOW-VIEW"),
        ("p:103", "查看SOW详情 → 业务规则 → 页签", "默认展示基本信息，切换页签可以查看SOW清单、关联文档、关联方案、项目概览", "FUN-SOW-VIEW"),
        ("p:104", "查看SOW详情 → 业务规则 → 基本信息", "基本信息在新建输入信息的基础上增加创建人及创建时间的展示", "FUN-SOW-VIEW"),
        ("p:105", "查看SOW详情 → 业务规则 → SOW清单下载", "SOW清单支持下载", "FUN-SOW-VIEW"),
        ("p:106", "查看SOW详情 → 业务规则 → 关联方案", "展示当前SOW关联的方案，点击方案新开页面进入方案详情页面。", "FUN-SOW-VIEW"),
    ]
    m["sourceCoverage"] = []
    for locator, display_location, quote, mapped_to in blocks:
        m["sourceCoverage"].append({
            "locator": locator,
            "displayLocation": display_location,
            "quote": quote,
            "mappedTo": mapped_to,
            "status": "covered" if mapped_to not in ("background", "decorative") else mapped_to
        })

    # ── Visual Evidence ──
    img_descriptions = [
        {"img": "image:1", "name": "SOW管理首页", "type": "prototype",
         "section": "SOW管理首页 → 页面原型 → SOW首页列表",
         "desc": "SOW管理首页列表，含左侧导航（工程管理→商机管理/SOW管理/方案管理/工序组管理/工序模板管理/工位管理/岗位模板管理）、顶部搜索区域（SOW名称/ID、关联商机、状态、创建人、期望完成时间筛选）、操作按钮（+新增SOW）、表格（SOW ID、SOW名称、SOW类型、关联商机、期望完成时间、状态、创建人、操作列含提交/编辑/查看/删除按钮）、分页（10条/页，跳至）。表格展示POC、交付、亮点、FMI四种类型SOW，状态含已注册和已完成。",
         "relations": ["FUN-SOW-HOME"],
         "readability": "pass",
         "completeness": "基本完整：页面入口、搜索筛选、列表、操作按钮、分页均可见。缺少：列表空状态展示、多选批量操作。",
         "consistency": [
             {"aspect": "SOW类型", "category": "not_covered", "detail": "图片显示POC、交付、亮点、FMI四种；正文描述为POC、交付、FM1、其他。'亮点' vs 'FM1'，'FMI' vs '其他'不一致", "decisionRef": "DEC-SOW-001"},
             {"aspect": "状态操作权限", "category": "consistent", "detail": "已注册行显示提交/编辑/查看/删除，已完成行显示编辑/查看/删除，与正文一致"},
             {"aspect": "搜索条件", "category": "consistent", "detail": "图片搜索条件包含SOW名称/ID、关联商机、状态、创建人、期望完成时间，与正文一致"},
             {"aspect": "左侧导航", "category": "not_covered", "detail": "图片显示完整的导航层级（工程管理子菜单），正文未提及菜单层级和各子菜单项"}
         ]
        },
        {"img": "image:2", "name": "新建SOW侧滑面板", "type": "prototype",
         "section": "新建SOW → 页面原型 → 新建SOW侧滑面板",
         "desc": "新建SOW侧滑面板，含必填标识（*）的字段：SOW名称、关联商机、商机编号、SOW类型（POC单选显示，展开选项为POC/交付/FM1/其他）、产品类型、期望完成时间；非必填：SOW描述（富文本）、凭据附件（上传按钮，已上传文件显示为PDF图标及文件名）。底部操作按钮：取消、仅创建、创建并继续设计。",
         "relations": ["FUN-SOW-CREATE"],
         "readability": "pass",
         "completeness": "基本完整。缺少：SOW类型下拉展开后的全部选项不可见（仅显示POC选中态）；字段校验错误提示未展示；必填项未填时点击创建的错误反馈。",
         "consistency": [
             {"aspect": "字段列表", "category": "consistent", "detail": "图片字段与正文描述完全对应"},
             {"aspect": "必填标识", "category": "not_covered", "detail": "图片中SOW名称、关联商机、商机编号、SOW类型、产品类型、期望完成时间标有*必填，正文未明确标注哪些字段必填"},
             {"aspect": "SOW类型选项", "category": "conflict", "detail": "图片下拉可能展示POC/交付/FM1/其他（被POC遮住），正文描述相同。但首页列表图片显示亮点/FMI，需确认统一术语"}
         ]
        },
        {"img": "image:3", "name": "编辑SOW页面", "type": "prototype",
         "section": "编辑SOW → 页面原型 → 编辑SOW页面",
         "desc": "编辑SOW整体页面，左侧导航（资产平台→工程管理→商机管理/SOW管理/方案管理/工序组管理/工序模板管理/岗位管理/岗位模板管理），右上角用户信息（李美丽），顶部面包屑（方案管理），页面标题SOW编辑，三个Tab页签（基本信息/SOW清单/关联文档），默认显示基本信息Tab，含保存按钮和所有表单字段。POC类型的SOW显示POC信息模块（POC总分/当前自评分/竞争对手得分）。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "基本完整。缺少：关联文档Tab内容；非POC类型SOW的页面展示。",
         "consistency": [
             {"aspect": "导航菜单", "category": "conflict", "detail": "图片显示'岗位管理'和'方案管理'顶部面包屑，但首页原型（image:1）和正文均写'工位管理'和'工程管理'。菜单项'岗位管理'vs'工位管理'不一致。"},
             {"aspect": "POC信息模块", "category": "consistent", "detail": "图片显示POC信息模块，与正文规则一致"},
             {"aspect": "Tab页签", "category": "not_covered", "detail": "图片显示基本信息/SOW清单/关联文档三个Tab，正文描述了基本信息修改和SOW清单管理但'关联文档'Tab在正文中未详细描述"}
         ]
        },
        {"img": "image:4", "name": "编辑SOW-基本信息Tab", "type": "prototype",
         "section": "编辑SOW → 页面原型 → 基本信息",
         "desc": "与image:3的信息重复，聚焦基本信息Tab内容：字段含SOW名称、关联商机、商机编号、SOW类型、产品类型、期望完成时间、SOW描述、凭据附件、POC信息（POC总分360、当前自评分450、竞争对手得分480）。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "重复image:3部分内容。",
         "consistency": [
             {"aspect": "凭据附件", "category": "consistent", "detail": "显示已上传PDF附件，与正文'支持上传图片、文件格式的附件'一致"}
         ]
        },
        {"img": "image:5", "name": "SOW清单-初始空状态", "type": "prototype",
         "section": "编辑SOW → 页面原型 → SOW清单-初始状态",
         "desc": "SOW清单Tab初始空状态页面，显示提示文字'请上传SOW清单'。对应首次进入编辑页面SOW清单未上传的状态。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "仅展示空状态，缺少批量导入按钮在此视图下的展示。",
         "consistency": [{"aspect": "空状态", "category": "consistent", "detail": "与正文'SOW清单默认为空'一致"}]
        },
        {"img": "image:6", "name": "SOW清单-导入后列表", "type": "prototype",
         "section": "编辑SOW → 页面原型 → SOW清单-导入后",
         "desc": "SOW清单Tab导入后展示，顶部搜索区域（产品名称/模块名称/功能名称/功能合用筛选），操作按钮（批量导入/SOW清单下载），表格展示SOW清单：产品名称、产品类型、模块名称（分组）、功能名称、功能合用、功能说明、POC评分标准、POC分值、当前自评分、竞争对手得分、操作（编辑/删除）。演示数据含对公产品/业务产品分类，多模块多功能。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "基本完整。缺少：非POC类型SOW的表格列（无POC列时）；功能合用的下拉选项（图片显示合用/不合用）。",
         "consistency": [
             {"aspect": "表格列", "category": "consistent", "detail": "POC模板的11列（含POC评分标准/POC分值/当前自评分/竞争对手得分）与正文描述一致"},
             {"aspect": "功能说明", "category": "not_covered", "detail": "图片中功能说明为'这是一段功能说明'占位文本，正文未明确功能说明的格式和长度限制"},
             {"aspect": "产品类型列", "category": "not_covered", "detail": "图片显示产品类型列（业务产品），正文说'产品类型在SOW创建的时候就定义了，所以导入的时候不需要输入'，但图片仍展示此列，可能是系统自动填充"}
         ]
        },
        {"img": "image:7", "name": "首次导入弹窗", "type": "prototype",
         "section": "编辑SOW → 页面原型 → 首次导入",
         "desc": "批量导入弹窗，标题'批量导入'，内容含选择文件区域（点击上传）、下载模板链接、提示文字'请上传xlsx格式文件，用于解析导入。'，底部取消/开始导入按钮。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "基本完整。缺少：上传中状态、文件格式错误提示、导入失败的错误反馈。",
         "consistency": [{"aspect": "下载模板", "category": "consistent", "detail": "图片提供下载模板链接，与正文'下载模板'规则一致"}]
        },
        {"img": "image:8", "name": "重新导入差异对比", "type": "prototype",
         "section": "编辑SOW → 页面原型 → 重新导入",
         "desc": "重新导入弹窗，已选择文件后展示差异对比。上半部'新增功能'表格（功能名称/所属产品/所属模块），下半部'删除功能'表格（功能名称/所属产品/所属模块/是否已匹配功能）。提示文字：'新文件将新增/删除以下功能，导入后删除功能不可恢复，请确认。'",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "基本完整。展示了新增和删除差异对比，删除行显示是否已匹配功能列。",
         "consistency": [
             {"aspect": "差异对比", "category": "consistent", "detail": "图片展示新增/删除功能对比，含是否已匹配功能列，与正文'展示本次上传较上次上传新增/删除的功能清单，删除功能清单中还需要展示是否已经在方案设计中匹配了系统功能'完全一致"}
         ]
        },
        {"img": "image:9", "name": "编辑SOW功能弹窗", "type": "prototype",
         "section": "编辑SOW → 页面原型 → 编辑功能信息",
         "desc": "编辑功能弹窗，标题'编辑SOW功能'，表单含*功能名称（输入框，展示'单笔转账'）和功能说明（富文本编辑器，含B/I/U/G/A/字号/字体工具栏），底部取消/确定按钮。",
         "relations": ["FUN-SOW-EDIT"],
         "readability": "pass",
         "completeness": "仅展示功能名称和功能说明两个字段。缺少：POC类型的SOW是否在此弹窗编辑POC评分标准/POC分值/当前自评分/竞争对手得分；功能合用字段不在弹窗中而在列表行内编辑。",
         "consistency": [
             {"aspect": "编辑字段", "category": "not_covered", "detail": "图片仅显示功能名称和功能说明可编辑，但正文说'修改功能信息、功能是否合用，以及POC相关信息'，POC列编辑方式未展示"}
         ]
        },
        {"img": "image:10", "name": "删除SOW确认弹窗", "type": "prototype",
         "section": "删除SOW → 页面原型 → 删除弹窗",
         "desc": "删除确认弹窗，标题'删除提示'，内容'确定删除当前SOW?'，底部取消/确定按钮。",
         "relations": ["FUN-SOW-DELETE"],
         "readability": "pass",
         "completeness": "仅展示无方案关联时的简单删除确认。缺少：已关联方案时的阻断提示弹窗。",
         "consistency": [
             {"aspect": "关联方案阻断", "category": "not_covered", "detail": "正文规定了关联方案时不允许删除并提示方案名称，但图片未展示此场景的原型"}
         ]
        },
        {"img": "image:11", "name": "查看SOW详情页（基本信息Tab）", "type": "prototype",
         "section": "提交完成 / 查看SOW详情 → 页面原型",
         "desc": "SOW详情页，当前显示基本信息Tab。左侧导航（资产平台→工程管理），顶部信息（李美丽、方案管理），页面标题'SOW详情'和子标题'企业网银对公渠道交付方案'，多个Tab页签（基本信息/SOW清单/关联文档/关联方案/项目概览/工序进度/功能看板/业务模型/关联文档/导出文档）。基本信息区展示：SOW名称、SOW ID（FM-SOW-000001）、商机ID（FM-SJ-000001）、关联商机、SOW类型、产品类型（业务资产）、期望完成时间、依据附件、创建人、创建时间、SOW描述。POC信息模块展示POC总分500/当前自评得分450/竞争对手得分480。",
         "relations": ["FUN-SOW-VIEW"],
         "readability": "pass",
         "completeness": "基本完整展示了基本信息Tab和Tab导航。缺少：SOW清单/关联文档/关联方案/项目概览等Tab内容；提交完成功能的弹窗原型（image:11似乎是查看详情而非提交弹窗）。",
         "consistency": [
             {"aspect": "产品类型", "category": "conflict", "detail": "图片显示'产品类型：业务资产'，但正文描述为单选'业务产品、平台产品、工具产品'。'业务资产'不在正文选项中。"},
             {"aspect": "依据附件 vs 凭据附件", "category": "conflict", "detail": "图片显示'依据附件'，正文创建/编辑使用'凭据附件'。字段名不一致。"},
             {"aspect": "商机ID字段", "category": "not_covered", "detail": "详情页显示'商机ID：FM-SJ-000001'，但创建表单中只有'商机编号'没有'商机ID'。可能为系统自动生成字段，正文未说明。"},
             {"aspect": "Tab页签", "category": "not_covered", "detail": "图片显示工序进度/功能看板/业务模型/关联文档(出现两次)/导出文档等Tab，正文仅描述基本信息/SOW清单/关联文档/关联方案/项目概览"},
             {"aspect": "创建人和创建时间", "category": "consistent", "detail": "与正文'基本信息在新建输入信息的基础上增加创建人及创建时间的展示'一致"},
             {"aspect": "图片归属", "category": "not_covered", "detail": "image:11 按段落位置属于提交完成功能（块89），但图片内容为SOW详情页。正文中查看SOW详情也有image块（块99）但无对应图片文件。可能图片错位或一张图服务于两个功能。"}
         ]
        }
    ]
    m["visualEvidence"] = []
    for i, d in enumerate(img_descriptions):
        img_num = i + 1
        img_hash = hash_file(IMAGES_DIR / f"image-{img_num:03d}.png")
        m["visualEvidence"].append({
            "evidenceId": f"VE-SOW-{img_num:03d}",
            "imageLocator": d["img"],
            "mediaPath": f"images/image-{img_num:03d}.png",
            "mediaSha256": img_hash,
            "displayPosition": d["section"],
            "imageCategory": d["type"],
            "description": d["desc"],
            "legibility": d["readability"],
            "scopeAssessment": "in_scope",
            "completenessAssessment": d["completeness"],
            "consistencyChecks": d["consistency"],
            "relatedRefs": d["relations"],
            "decisionRefs": [c["decisionRef"] for c in d["consistency"] if "decisionRef" in c],
            "overallAssessment": "issues_found" if any(c.get("category") in ("conflict", "not_covered") for c in d["consistency"]) else "consistent"
        })

    # ── Module ──
    m["modules"] = [{
        "moduleId": "MOD-SOW",
        "name": "SOW管理",
        "description": "业务/运营团队在经营过程中接收到客户或者生产需求，在平台以SOW的形式管理起来，包括SOW的创建、编辑、删除、提交完成和查看功能。",
        "parentAppId": "APP-FM-H5",
        "entryPoint": "工程管理/SOW管理"
    }]

    # ── Functions ──
    m["functions"] = [
        {"functionId": "FUN-SOW-HOME", "moduleId": "MOD-SOW", "name": "SOW管理首页",
         "description": "展示平台已创建的全部SOW列表，支持多条件搜索筛选，提供新建、编辑、删除、提交、查看等操作入口。",
         "actors": ["FM平台用户"], "precondition": "用户已登录", "trigger": "进入工程管理/SOW管理页面",
         "businessResult": "用户查看SOW列表并可发起各项操作"},
        {"functionId": "FUN-SOW-CREATE", "moduleId": "MOD-SOW", "name": "新建SOW",
         "description": "通过侧滑面板创建新的SOW，填写基本信息后保存或继续设计。",
         "actors": ["FM平台用户"], "precondition": "用户已登录且处于SOW管理首页",
         "trigger": "点击SOW首页列表'+新增SOW'按钮", "businessResult": "成功创建SOW，状态为已注册"},
        {"functionId": "FUN-SOW-EDIT", "moduleId": "MOD-SOW", "name": "编辑SOW",
         "description": "编辑SOW的基本信息、管理SOW清单（批量导入/修改/删除功能）、查看POC信息、管理关联文档。",
         "actors": ["FM平台用户"], "precondition": "用户已登录且SOW状态为已注册或已完成",
         "trigger": "在SOW列表点击'编辑'", "businessResult": "SOW信息和清单被更新"},
        {"functionId": "FUN-SOW-DELETE", "moduleId": "MOD-SOW", "name": "删除SOW",
         "description": "删除不需要的SOW数据，需校验是否关联方案。",
         "actors": ["FM平台用户"], "precondition": "用户已登录且SOW状态为已注册或已完成",
         "trigger": "在SOW列表点击'删除'", "businessResult": "未关联方案的SOW被删除，已关联方案的删除被阻断"},
        {"functionId": "FUN-SOW-SUBMIT", "moduleId": "MOD-SOW", "name": "提交完成",
         "description": "提交SOW使其状态变更为已完成，已完成SOW可被方案关联。",
         "actors": ["FM平台用户"], "precondition": "用户已登录且SOW状态为已注册",
         "trigger": "在SOW列表点击'提交完成'", "businessResult": "SOW状态变更为已完成"},
        {"functionId": "FUN-SOW-VIEW", "moduleId": "MOD-SOW", "name": "查看SOW详情",
         "description": "查看SOW的完整信息，包括基本信息、SOW清单、关联文档、关联方案、项目概览等。",
         "actors": ["FM平台用户"], "precondition": "用户已登录", "trigger": "在SOW列表点击'查看'",
         "businessResult": "展示SOW完整详情"}
    ]

    # ── Scenarios ──
    m["scenarios"] = [
        # FUN-SOW-HOME
        {"scenarioId": "SCN-SOW-HOME-001-NORMAL", "functionId": "FUN-SOW-HOME", "type": "normal",
         "name": "查看SOW列表", "description": "用户进入SOW管理首页，查看全部SOW列表，支持分页浏览。"},
        {"scenarioId": "SCN-SOW-HOME-002-NORMAL", "functionId": "FUN-SOW-HOME", "type": "normal",
         "name": "搜索筛选SOW", "description": "用户通过SOW名称/ID、关联商机、状态、创建人、期望完成时间等条件搜索筛选SOW。"},
        {"scenarioId": "SCN-SOW-HOME-003-ALT", "functionId": "FUN-SOW-HOME", "type": "alternative",
         "name": "搜索无结果", "description": "用户搜索条件无匹配SOW时展示空状态。"},
        {"scenarioId": "SCN-SOW-HOME-004-BOUNDARY", "functionId": "FUN-SOW-HOME", "type": "boundary",
         "name": "大量SOW分页", "description": "SOW数量超过一页时正常分页（每页10条），支持跳转到指定页。"},
        # FUN-SOW-CREATE
        {"scenarioId": "SCN-SOW-CREATE-001-NORMAL", "functionId": "FUN-SOW-CREATE", "type": "normal",
         "name": "仅创建SOW", "description": "用户填写完整信息后点击'仅创建'，SOW创建成功并关闭弹窗。"},
        {"scenarioId": "SCN-SOW-CREATE-002-NORMAL", "functionId": "FUN-SOW-CREATE", "type": "normal",
         "name": "创建并继续设计", "description": "用户填写信息后点击'创建，并继续设计'，SOW创建成功并跳转编辑页面。"},
        {"scenarioId": "SCN-SOW-CREATE-003-ALT", "functionId": "FUN-SOW-CREATE", "type": "alternative",
         "name": "取消创建", "description": "用户点击'取消'关闭侧滑面板，不保存任何信息。"},
        {"scenarioId": "SCN-SOW-CREATE-004-EXCEPTION", "functionId": "FUN-SOW-CREATE", "type": "business_exception",
         "name": "必填字段未填写", "description": "用户未填必填字段时点击创建，提示校验错误。"},
        {"scenarioId": "SCN-SOW-CREATE-005-BOUNDARY", "functionId": "FUN-SOW-CREATE", "type": "boundary",
         "name": "字段长度限制", "description": "SOW名称、关联商机、商机编号超过30字时提示。"},
        {"scenarioId": "SCN-SOW-CREATE-006-EXCEPTION", "functionId": "FUN-SOW-CREATE", "type": "technical_exception",
         "name": "附件上传失败", "description": "凭据附件上传失败时的处理和提示。"},
        # FUN-SOW-EDIT
        {"scenarioId": "SCN-SOW-EDIT-001-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "修改基本信息", "description": "用户在基本信息Tab修改SOW字段后保存。"},
        {"scenarioId": "SCN-SOW-EDIT-002-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "首次导入SOW清单", "description": "用户下载模板、上传xlsx文件、点击开始导入，成功导入功能清单。"},
        {"scenarioId": "SCN-SOW-EDIT-003-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "重新导入SOW清单", "description": "用户重新导入xlsx，查看新增/删除差异，确认后导入。"},
        {"scenarioId": "SCN-SOW-EDIT-004-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "修改功能信息", "description": "用户在SOW清单中编辑功能名称、功能说明、功能合用及POC相关信息。"},
        {"scenarioId": "SCN-SOW-EDIT-005-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "删除未匹配功能", "description": "用户删除未被方案匹配的SOW清单功能，确认后直接删除。"},
        {"scenarioId": "SCN-SOW-EDIT-006-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "删除已匹配功能", "description": "用户删除已被方案匹配的功能，提示关联方案名称，确认后一并删除匹配关系。"},
        {"scenarioId": "SCN-SOW-EDIT-007-ALT", "functionId": "FUN-SOW-EDIT", "type": "alternative",
         "name": "取消删除功能", "description": "用户在删除功能确认弹窗点击取消，不执行删除。"},
        {"scenarioId": "SCN-SOW-EDIT-008-EXCEPTION", "functionId": "FUN-SOW-EDIT", "type": "business_exception",
         "name": "导入文件格式错误", "description": "上传非xlsx格式文件时的错误提示。"},
        {"scenarioId": "SCN-SOW-EDIT-009-EXCEPTION", "functionId": "FUN-SOW-EDIT", "type": "business_exception",
         "name": "导入模板字段不匹配", "description": "上传的xlsx文件列与模板不一致时的错误处理。"},
        {"scenarioId": "SCN-SOW-EDIT-010-NORMAL", "functionId": "FUN-SOW-EDIT", "type": "normal",
         "name": "查看POC信息", "description": "POC类型SOW在编辑页展示POC总分、当前自评得分、竞争对手得分。"},
        {"scenarioId": "SCN-SOW-EDIT-011-BOUNDARY", "functionId": "FUN-SOW-EDIT", "type": "boundary",
         "name": "大量功能导入", "description": "导入包含大量功能的清单时的性能和展示。"},
        # FUN-SOW-DELETE
        {"scenarioId": "SCN-SOW-DELETE-001-NORMAL", "functionId": "FUN-SOW-DELETE", "type": "normal",
         "name": "删除未关联方案的SOW", "description": "SOW未关联方案，确认删除后SOW被删除。"},
        {"scenarioId": "SCN-SOW-DELETE-002-EXCEPTION", "functionId": "FUN-SOW-DELETE", "type": "business_exception",
         "name": "删除已关联方案的SOW被阻断", "description": "SOW已关联方案，提示不允许删除并显示方案名称。"},
        {"scenarioId": "SCN-SOW-DELETE-003-ALT", "functionId": "FUN-SOW-DELETE", "type": "alternative",
         "name": "取消删除", "description": "用户在删除确认弹窗点击取消。"},
        {"scenarioId": "SCN-SOW-DELETE-004-EXCEPTION", "functionId": "FUN-SOW-DELETE", "type": "technical_exception",
         "name": "删除SOW失败", "description": "后端删除失败时的错误提示和恢复。"},
        # FUN-SOW-SUBMIT
        {"scenarioId": "SCN-SOW-SUBMIT-001-NORMAL", "functionId": "FUN-SOW-SUBMIT", "type": "normal",
         "name": "提交完成SOW", "description": "SOW清单已导入且必填项完整，用户确认提交后状态变为已完成。"},
        {"scenarioId": "SCN-SOW-SUBMIT-002-EXCEPTION", "functionId": "FUN-SOW-SUBMIT", "type": "business_exception",
         "name": "提交时必填项不完整", "description": "SOW清单未导入或必填项未完成，点击提交时提示。"},
        {"scenarioId": "SCN-SOW-SUBMIT-003-ALT", "functionId": "FUN-SOW-SUBMIT", "type": "alternative",
         "name": "取消提交", "description": "用户在提交确认弹窗点击取消。"},
        # FUN-SOW-VIEW
        {"scenarioId": "SCN-SOW-VIEW-001-NORMAL", "functionId": "FUN-SOW-VIEW", "type": "normal",
         "name": "查看SOW详情-基本信息", "description": "用户查看SOW详情基本信息Tab，含创建人和创建时间。"},
        {"scenarioId": "SCN-SOW-VIEW-002-NORMAL", "functionId": "FUN-SOW-VIEW", "type": "normal",
         "name": "查看SOW清单并下载", "description": "切换到SOW清单Tab查看功能清单，支持下载。"},
        {"scenarioId": "SCN-SOW-VIEW-003-NORMAL", "functionId": "FUN-SOW-VIEW", "type": "normal",
         "name": "查看关联方案", "description": "切换到关联方案Tab，点击方案名称新开页面查看方案详情。"},
        {"scenarioId": "SCN-SOW-VIEW-004-NORMAL", "functionId": "FUN-SOW-VIEW", "type": "normal",
         "name": "查看关联文档", "description": "切换到关联文档Tab查看关联文档。"},
        {"scenarioId": "SCN-SOW-VIEW-005-NORMAL", "functionId": "FUN-SOW-VIEW", "type": "normal",
         "name": "查看项目概览", "description": "切换到项目概览Tab查看项目整体信息。"},
    ]

    # ── Requirements ──
    reqs = [
        # FUN-SOW-HOME
        ("REQ-SOW-HOME-001", "FUN-SOW-HOME", "SOW列表展示", "系统展示全部SOW列表，包含SOW ID、SOW名称、SOW类型、关联商机、期望完成时间、状态、创建人列和操作按钮列。", "FUN-SOW-HOME", ["BR-SOW-STATUS"]),
        ("REQ-SOW-HOME-002", "FUN-SOW-HOME", "SOW搜索筛选", "系统支持按SOW名称/ID、关联商机、状态、创建人、期望完成时间条件搜索SOW，提供搜索和重置按钮。", "FUN-SOW-HOME", []),
        ("REQ-SOW-HOME-003", "FUN-SOW-HOME", "SOW列表操作入口", "已注册SOW行展示提交/编辑/查看/删除按钮；已完成SOW行展示编辑/查看/删除按钮；已登记SOW行不可编辑/删除。", "FUN-SOW-HOME", ["BR-SOW-STATUS"]),
        ("REQ-SOW-HOME-004", "FUN-SOW-HOME", "SOW分页", "SOW列表支持分页，默认每页10条，支持跳至指定页。", "FUN-SOW-HOME", []),
        ("REQ-SOW-HOME-005", "FUN-SOW-HOME", "新建SOW入口", "SOW首页提供'+新增SOW'按钮，点击进入新建SOW侧滑面板。", "FUN-SOW-CREATE", []),
        # FUN-SOW-CREATE
        ("REQ-SOW-CREATE-001", "FUN-SOW-CREATE", "新建SOW侧滑面板", "系统打开新建SOW侧滑面板，展示SOW名称、关联商机、商机编号、SOW类型、产品类型、期望完成时间、凭据附件、SOW描述字段及取消/仅创建/创建并继续设计按钮。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-002", "FUN-SOW-CREATE", "SOW名称校验", "SOW名称支持中文/英文，最多30个字，必填。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-003", "FUN-SOW-CREATE", "关联商机和商机编号", "关联商机文本格式最多30字，商机编号文本格式最多30字。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-004", "FUN-SOW-CREATE", "SOW类型选择", "SOW类型为单选：POC、交付、FM1、其他。必填。", "FUN-SOW-CREATE", ["DEC-SOW-001"]),
        ("REQ-SOW-CREATE-005", "FUN-SOW-CREATE", "产品类型选择", "产品类型为单选：业务产品、平台产品、工具产品。", "FUN-SOW-CREATE", ["DEC-SOW-006"]),
        ("REQ-SOW-CREATE-006", "FUN-SOW-CREATE", "期望完成时间", "期望完成时间为年月日选择器。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-007", "FUN-SOW-CREATE", "凭据附件上传", "支持上传图片和文件格式附件。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-008", "FUN-SOW-CREATE", "SOW描述", "SOW描述为富文本输入。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-009", "FUN-SOW-CREATE", "仅创建操作", "用户填写完整信息后点击'仅创建'，创建SOW（状态为已注册）并关闭弹窗。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-010", "FUN-SOW-CREATE", "创建并继续设计", "用户点击'创建，并继续设计'，创建SOW并跳转编辑页面。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-011", "FUN-SOW-CREATE", "取消创建", "用户点击'取消'关闭弹窗不保存。", "FUN-SOW-CREATE", []),
        ("REQ-SOW-CREATE-012", "FUN-SOW-CREATE", "必填校验", "必填字段未填写时点击创建按钮提示校验错误。", "FUN-SOW-CREATE", []),
        # FUN-SOW-EDIT
        ("REQ-SOW-EDIT-001", "FUN-SOW-EDIT", "编辑页面布局", "编辑SOW页面包含基本信息/SOW清单/关联文档三个Tab页签，默认显示基本信息Tab。", "FUN-SOW-EDIT", ["DEC-SOW-008"]),
        ("REQ-SOW-EDIT-002", "FUN-SOW-EDIT", "修改基本信息", "基本信息Tab展示与新建SOW一致的字段，用户可修改并保存。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-003", "FUN-SOW-EDIT", "POC信息展示", "当前SOW类型为POC时展示POC总分、当前自评得分、竞争对手得分，均根据SOW清单汇总得出。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-004", "FUN-SOW-EDIT", "首次批量导入", "SOW清单初始为空，用户点击批量导入，下载模板（根据SOW类型下载不同模板），上传xlsx文件后点击开始导入。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-005", "FUN-SOW-EDIT", "重新批量导入", "重新导入时展示本次上传较上次新增/删除的功能清单，删除功能中展示是否已在方案设计中匹配了系统功能。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-006", "FUN-SOW-EDIT", "非POC导入模板", "非POC类型模板列：产品名称、业务域、模块名称、功能名称、功能合用、功能说明。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-007", "FUN-SOW-EDIT", "POC导入模板", "POC类型模板比非POC多：POC评分标准、POC分值、当前自评得分、竞争对手得分。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-008", "FUN-SOW-EDIT", "产品类型默认", "导入时产品类型默认使用SOW创建时定义的类型，用户无需输入。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-009", "FUN-SOW-EDIT", "修改功能信息", "导入后用户可编辑功能名称、功能说明（富文本）、功能合用，POC类型还可编辑POC相关字段。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-010", "FUN-SOW-EDIT", "删除未匹配功能", "删除未被方案匹配的功能，确认后直接删除。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-011", "FUN-SOW-EDIT", "删除已匹配功能", "删除已匹配的功能时提示关联方案名称，确认后删除功能及方案中的匹配关系。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-012", "FUN-SOW-EDIT", "导入文件格式校验", "仅支持xlsx格式文件导入，非xlsx格式提示错误。", "FUN-SOW-EDIT", []),
        ("REQ-SOW-EDIT-013", "FUN-SOW-EDIT", "SOW清单下载", "已导入的SOW清单支持下载。", "FUN-SOW-EDIT", []),
        # FUN-SOW-DELETE
        ("REQ-SOW-DELETE-001", "FUN-SOW-DELETE", "删除未关联方案SOW", "SOW未关联方案时弹出删除确认弹窗，确认后删除。", "FUN-SOW-DELETE", []),
        ("REQ-SOW-DELETE-002", "FUN-SOW-DELETE", "删除已关联方案SOW阻断", "SOW已关联方案时提示'当前SOW已关联方案【XXXXX方案名称】，不允许删除。'方案名称可点击跳转方案详情。", "FUN-SOW-DELETE", []),
        ("REQ-SOW-DELETE-003", "FUN-SOW-DELETE", "删除状态限制", "仅已注册和已完成状态的SOW可删除，已登记状态不可删除。", "FUN-SOW-DELETE", ["BR-SOW-STATUS"]),
        # FUN-SOW-SUBMIT
        ("REQ-SOW-SUBMIT-001", "FUN-SOW-SUBMIT", "提交完成入口", "SOW列表已注册SOW行显示'提交完成'按钮。", "FUN-SOW-SUBMIT", []),
        ("REQ-SOW-SUBMIT-002", "FUN-SOW-SUBMIT", "提交完成校验-清单已导入", "完成SOW清单导入且所有功能完成合用/不合用评价后可提交，否则提示'请先完成SOW清单导入，并确保必填项都已输入'。", "FUN-SOW-SUBMIT", []),
        ("REQ-SOW-SUBMIT-003", "FUN-SOW-SUBMIT", "提交完成确认弹窗", "校验通过后弹出提交确认弹窗，确认后状态变更为已完成。", "FUN-SOW-SUBMIT", []),
        # FUN-SOW-VIEW
        ("REQ-SOW-VIEW-001", "FUN-SOW-VIEW", "查看入口", "SOW列表每行提供'查看'按钮，点击进入查看详情页。", "FUN-SOW-VIEW", []),
        ("REQ-SOW-VIEW-002", "FUN-SOW-VIEW", "详情页签", "详情页包含基本信息、SOW清单、关联文档、关联方案、项目概览等页签，默认展示基本信息。", "FUN-SOW-VIEW", ["DEC-SOW-008"]),
        ("REQ-SOW-VIEW-003", "FUN-SOW-VIEW", "基本信息展示", "基本信息展示SOW名称、SOW ID、商机ID、关联商机、SOW类型、产品类型、期望完成时间、依据/凭据附件、创建人、创建时间、SOW描述。POC类型额外展示POC信息。", "FUN-SOW-VIEW", ["DEC-SOW-006", "DEC-SOW-007"]),
        ("REQ-SOW-VIEW-004", "FUN-SOW-VIEW", "SOW清单下载", "详情页SOW清单Tab支持下载。", "FUN-SOW-VIEW", []),
        ("REQ-SOW-VIEW-005", "FUN-SOW-VIEW", "关联方案查看", "关联方案Tab展示当前SOW关联的方案，点击方案名称新开页面进入方案详情。", "FUN-SOW-VIEW", []),
    ]
    m["requirements"] = []
    for rid, fid, name, desc, func, deps in reqs:
        m["requirements"].append({
            "requirementId": rid, "functionId": fid, "name": name,
            "description": desc, "relatedFunction": func,
            "acceptanceCriteriaRefs": [], "relatedRuleRefs": deps
        })

    # ── Business Rules ──
    m["businessRules"] = [
        {"ruleId": "BR-SOW-STATUS", "name": "SOW状态流转规则", "description": "SOW状态流转：已注册（创建后默认）→已完成（提交完成后）→已登记（关联方案评审通过后）。已注册可编辑/提交/删除；已完成可编辑/删除；已登记不可编辑/删除。", "relatedFunctions": ["FUN-SOW-HOME", "FUN-SOW-SUBMIT", "FUN-SOW-DELETE"]},
        {"ruleId": "BR-SOW-CREATE-FIELDS", "name": "新建SOW字段规则", "description": "SOW名称中文/英文最多30字；关联商机文本最多30字；商机编号文本最多30字；SOW类型单选POC/交付/FM1/其他；产品类型单选业务产品/平台产品/工具产品；期望完成时间年月日选择器；凭据附件支持图片和文件；SOW描述富文本。", "relatedFunctions": ["FUN-SOW-CREATE"]},
        {"ruleId": "BR-SOW-IMPORT-TEMPLATE", "name": "导入模板规则", "description": "非POC模板列：产品名称、业务域、模块名称、功能名称、功能合用、功能说明。POC模板额外含：POC评分标准、POC分值、当前自评得分、竞争对手得分。导入时产品类型使用SOW创建时定义的值。", "relatedFunctions": ["FUN-SOW-EDIT"]},
        {"ruleId": "BR-SOW-POC-CALC", "name": "POC分值汇总规则", "description": "POC总分=SUM(SOW清单各功能POC分值)；当前自评得分=SUM(各功能当前自评得分)；竞争对手得分=SUM(各功能竞争对手得分)。仅POC类型SOW展示。", "relatedFunctions": ["FUN-SOW-EDIT", "FUN-SOW-VIEW"]},
        {"ruleId": "BR-SOW-DELETE-CHECK", "name": "删除SOW关联方案校验", "description": "删除未关联方案SOW：弹出确认弹窗后删除。删除已关联方案SOW：提示方案名称并阻断。删除已匹配功能：提示关联方案名称，确认后一并删除匹配关系。", "relatedFunctions": ["FUN-SOW-DELETE", "FUN-SOW-EDIT"]},
        {"ruleId": "BR-SOW-SUBMIT-CHECK", "name": "提交完成校验规则", "description": "必须完成SOW清单导入且所有功能完成合用/不合用评价后才能提交；未完成时提示'请先完成SOW清单导入，并确保必填项都已输入'。", "relatedFunctions": ["FUN-SOW-SUBMIT"]},
        {"ruleId": "BR-SOW-FUNC-USABILITY", "name": "功能合用评价规则", "description": "导入后每个功能需标记合用或不合用；提交完成前要求所有功能完成评价。", "relatedFunctions": ["FUN-SOW-EDIT", "FUN-SOW-SUBMIT"]},
    ]

    # ── Business Objects ──
    m["businessObjects"] = [
        {"objectId": "BO-SOW", "name": "SOW", "description": "工作说明书（Statement of Work），记录客户或生产需求的核心业务对象。包含基本信息和SOW清单。", "attributes": ["SOW ID", "SOW名称", "SOW类型", "产品类型", "关联商机", "商机编号", "期望完成时间", "凭据附件", "SOW描述", "状态", "创建人", "创建时间"]},
        {"objectId": "BO-SOW-ITEM", "name": "SOW清单项", "description": "SOW清单中的功能项，包含产品名称、业务域、模块名称、功能名称、功能合用、功能说明及POC相关信息。", "attributes": ["产品名称", "产品类型", "业务域", "模块名称", "功能名称", "功能合用", "功能说明", "POC评分标准", "POC分值", "当前自评得分", "竞争对手得分"]},
        {"objectId": "BO-SCHEME", "name": "方案", "description": "与SOW关联的方案，匹配系统功能。SOW已登记状态依赖于关联方案的评审通过。", "attributes": ["方案名称", "方案ID", "关联SOW"]},
    ]

    # ── Responsibilities ──
    m["responsibilities"] = [
        {"responsibilityId": "RESP-SOW-FRONTEND", "type": "frontend", "scope": "SOW管理全部页面交互", "description": "负责SOW管理首页、新建侧滑面板、编辑页面（含Tab切换）、删除弹窗、提交确认弹窗、详情页等所有页面渲染、表单校验、文件上传交互、分页搜索等前端用户交互。"},
        {"responsibilityId": "RESP-SOW-BACKEND", "type": "backend", "scope": "SOW管理全部业务逻辑与数据持久化", "description": "负责SOW CRUD、SOW清单导入/导出/下载、模板生成、状态流转、方案关联校验、POC分值汇总计算、附件存储等后端服务和数据库操作。"},
        {"responsibilityId": "RESP-SOW-SCHEME", "type": "external", "scope": "方案管理模块", "description": "方案模块负责方案创建、评审、系统功能匹配。SOW管理通过关联关系与方案模块交互，查询方案关联状态和匹配信息。"},
    ]

    # ── Contracts ──
    m["contracts"] = [
        {"contractId": "CONTRACT-SOW-SCHEME-001", "name": "SOW与方案关联契约", "participants": ["SOW管理", "方案管理"], "description": "SOW删除、功能删除、状态变更时需查询方案关联状态。方案评审通过后触发SOW状态变更为已登记。", "trigger": "SOW删除/功能删除/方案评审通过", "successResponse": "返回关联状态或触发状态变更", "failureResponse": "返回阻断原因和关联方案信息"},
    ]

    # ── Non-Functional Requirements ──
    m["nonFunctionalRequirements"] = [
        {"nfrId": "NFR-SOW-001", "category": "usability", "description": "SOW列表支持分页（10条/页）和跳至指定页，确保大量数据下的浏览体验。", "relatedFunctions": ["FUN-SOW-HOME"]},
        {"nfrId": "NFR-SOW-002", "category": "security", "description": "所有操作需要用户登录（FM平台用户），权限控制到操作级别。", "relatedFunctions": ["FUN-SOW-HOME", "FUN-SOW-CREATE", "FUN-SOW-EDIT", "FUN-SOW-DELETE", "FUN-SOW-SUBMIT", "FUN-SOW-VIEW"]},
        {"nfrId": "NFR-SOW-003", "category": "data_integrity", "description": "SOW清单重新导入时，删除已匹配功能的匹配关系需要保证数据一致性和提示。", "relatedFunctions": ["FUN-SOW-EDIT"]},
        {"nfrId": "NFR-SOW-004", "category": "audit", "description": "记录SOW创建、编辑、删除、提交完成等操作的操作人、操作时间和变更内容。", "relatedFunctions": ["FUN-SOW-HOME"]},
    ]

    # ── Acceptance Criteria ──
    acs = []
    ac_num = 1
    for req in m["requirements"]:
        rid = req["requirementId"]
        acs.append({"acceptanceCriteriaId": f"AC-{rid}-01", "requirementId": rid, "description": f"验证{req['name']}功能可正确执行并产生预期结果。", "verificationMethod": "manual"})
        req["acceptanceCriteriaRefs"].append(f"AC-{rid}-01")
    m["acceptanceCriteria"] = acs

    # ── Acceptance Test Cases ──
    tests = []
    for scn in m["scenarios"]:
        sid = scn["scenarioId"]
        fid = scn["functionId"]
        tests.append({
            "testCaseId": f"TEST-{sid}",
            "functionId": fid, "scenarioId": sid,
            "name": scn["name"], "description": scn["description"],
            "precondition": "用户已登录FM平台",
            "steps": [{"stepNumber": 1, "action": "执行操作", "expectedObservation": "预期结果符合需求描述"}],
            "expectedResult": scn["description"],
            "automationFeasibility": "manual_only",
            "requirementRefs": [], "acceptanceCriteriaRefs": []
        })
    m["acceptanceTestCases"] = tests

    # ── Logical Test Data Sets ──
    m["logicalTestDataSets"] = [
        {"dataSetId": "DATA-SOW-001-NORMAL", "scenarioId": "SCN-SOW-CREATE-001-NORMAL", "category": "normal", "description": "正常新建SOW数据集", "fields": [{"name": "SOW名称", "valueCategory": "中英文文本", "constraint": "≤30字", "example": "企业网银渠道POC"}, {"name": "SOW类型", "valueCategory": "枚举", "constraint": "POC/交付/FM1/其他", "example": "POC"}], "expectedResult": "SOW创建成功，状态为已注册"},
        {"dataSetId": "DATA-SOW-002-BOUNDARY", "scenarioId": "SCN-SOW-CREATE-005-BOUNDARY", "category": "boundary", "description": "字段长度边界测试", "fields": [{"name": "SOW名称", "valueCategory": "文本", "constraint": "31个中文字符", "example": "这是一个超过三十个字的SOW名称用于测试边界条件一二三四五六七八九十"}], "expectedResult": "提示字段长度限制"},
        {"dataSetId": "DATA-SOW-003-EXCEPTION", "scenarioId": "SCN-SOW-DELETE-002-EXCEPTION", "category": "business_exception", "description": "删除已关联方案SOW", "fields": [{"name": "SOW关联状态", "valueCategory": "布尔", "constraint": "已关联方案", "example": "已关联方案\"XX项目建设方案\""}], "expectedResult": "提示不允许删除并显示方案名称"},
    ]

    # ── Decisions ──
    m["decisions"] = [
        {"decisionId": "DEC-SOW-001", "type": "conflict", "priority": "P0", "blocking": True, "status": "open",
         "title": "SOW类型术语不一致",
         "description": "正文描述SOW类型为'POC、交付、FM1、其他'，但SOW首页列表原型图（image:1）显示'亮点'和'FMI'替代了'FM1'和'其他'。",
         "impact": "影响SOW类型字段的数据字典和前后端实现；SOW类型影响模板选择和POC信息展示。",
         "relatedObjects": ["REQ-SOW-CREATE-004", "BR-SOW-CREATE-FIELDS", "FUN-SOW-CREATE"],
         "locations": [{"kind": "text", "displayLocation": "新建SOW → 业务规则 → SOW类型", "quote": "SOW类型（单选）：POC、交付、FM1、其他"}, {"kind": "image", "imageLocator": "image:1", "displayLocation": "SOW管理首页 → 页面原型 → SOW首页列表 → 表格列'SOW类型'", "detail": "原型表格显示POC、交付、亮点、FMI四种类型"}],
         "candidates": [{"option": "A", "description": "统一使用正文术语：POC、交付、FM1、其他", "impact": "需更新原型图"}, {"option": "B", "description": "统一使用原型术语：POC、交付、亮点、FMI", "impact": "需更新需求文档；需明确亮点和FMI的业务含义"}],
         "recommendationStatus": "process_only",
         "recommendation": "建议由产品负责人确认SOW类型的最终术语。推荐采用正文描述术语，因正文是文字规格的权威来源，且'FM1'和'其他'比'亮点'和'FMI'更清晰。",
         "recommendationBasis": "正文是需求文档的主要规范载体，通常以正文描述为最终依据；原型可能为早期版本或视觉设计稿草稿。两处不一致可能导致开发和测试标准不一，需在开发前统一。"},
        {"decisionId": "DEC-SOW-002", "type": "missing", "priority": "P1", "blocking": True, "status": "open",
         "title": "已登记状态的操作权限未完全说明",
         "description": "正文说明已登记状态'不可编辑/删除'，但未明确是否可以查看、是否可以修改状态回退，以及已登记SOW在列表中的操作列展示。",
         "impact": "影响状态机设计和列表操作列渲染。",
         "relatedObjects": ["BR-SOW-STATUS", "FUN-SOW-HOME"],
         "locations": [{"kind": "text", "displayLocation": "SOW管理首页 → 业务规则 → SOW状态说明", "quote": "已登记：SOW关联的方案评审通过，修改状态为【已登记】，不可编辑/删除。"}],
         "candidates": [{"option": "A", "description": "已登记SOW仅可查看，列表操作列仅展示'查看'按钮", "impact": ""}, {"option": "B", "description": "已登记SOW可查看和进行其他管理操作", "impact": ""}],
         "recommendationStatus": "process_only",
         "recommendation": "建议确认：建议已登记状态仅保留查看权限，列表操作列仅展示'查看'按钮。SOW登记后与方案强绑定，修改和删除涉及方案侧数据一致性。",
         "recommendationBasis": "已登记后SOW与方案评审结果关联，从数据一致性角度应限制变更操作。"},
        {"decisionId": "DEC-SOW-003", "type": "missing", "priority": "P1", "blocking": True, "status": "open",
         "title": "关联文档Tab功能未描述",
         "description": "原型图显示编辑页面和详情页均有'关联文档'Tab，但正文未描述关联文档的任何业务规则、操作方式和数据类型。",
         "impact": "影响编辑页面Tab内容和功能实现。",
         "relatedObjects": ["FUN-SOW-EDIT", "FUN-SOW-VIEW", "REQ-SOW-EDIT-001"],
         "locations": [{"kind": "image", "imageLocator": "image:3", "displayLocation": "编辑SOW → 页面原型 → Tab页签", "detail": "原型显示'关联文档'Tab页签"}, {"kind": "image", "imageLocator": "image:11", "displayLocation": "查看SOW详情 → 页面原型 → Tab页签", "detail": "详情页也包含'关联文档'Tab"}],
         "candidates": [{"option": "A", "description": "关联文档支持上传/查看/删除与SOW相关的文档附件", "impact": "需补充文档管理的CRUD功能"}, {"option": "B", "description": "从本期需求中移除关联文档功能，后续迭代实现", "impact": "需更新原型图"}],
         "recommendationStatus": "process_only",
         "recommendation": "建议由产品负责人明确关联文档的业务含义和本期范围。从需求完整性角度建议补充至少包含文档上传/查看/删除的基本功能描述。",
         "recommendationBasis": "原型图中两个页面均存在此Tab，说明是设计中的一部分；但正文完全未提及，属于功能定义缺口。"},
        {"decisionId": "DEC-SOW-004", "type": "conflict", "priority": "P1", "blocking": True, "status": "open",
         "title": "左侧导航菜单项名称不一致",
         "description": "SOW首页原型显示'工位管理'和'岗位模板管理'，编辑页和详情页原型显示'岗位管理'和'岗位模板管理'。'工位管理'与'岗位管理'不一致。",
         "impact": "影响前端菜单渲染和用户导航体验。",
         "relatedObjects": ["FUN-SOW-HOME"],
         "locations": [{"kind": "image", "imageLocator": "image:1", "displayLocation": "SOW管理首页 → 左侧导航", "detail": "显示'工位管理'"}, {"kind": "image", "imageLocator": "image:3", "displayLocation": "编辑SOW → 左侧导航", "detail": "显示'岗位管理'"}],
         "candidates": [{"option": "A", "description": "统一为'工位管理'", "impact": ""}, {"option": "B", "description": "统一为'岗位管理'", "impact": ""}],
         "recommendationStatus": "process_only",
         "recommendation": "建议由产品负责人确认菜单项标准名称。'岗位管理'更符合人力资源管理系统中的常见术语。",
         "recommendationBasis": "两处不一致属于设计稿不同版本之间的差异。"},
        {"decisionId": "DEC-SOW-005", "type": "missing", "priority": "P0", "blocking": True, "status": "open",
         "title": "SOW ID和商机ID的生成规则未定义",
         "description": "原型图显示SOW ID格式为'FM-SOW-2025-000001'、商机ID为'FM-SJ-000001'，但正文未说明ID的生成规则（自动/手动、编码规则、唯一性保证）。",
         "impact": "影响ID生成策略、数据库设计和前后端实现。",
         "relatedObjects": ["BO-SOW", "FUN-SOW-CREATE"],
         "locations": [{"kind": "image", "imageLocator": "image:1", "displayLocation": "SOW管理首页 → 列表 → SOW ID列", "detail": "显示'FM-SOW-2025-000001'"}, {"kind": "image", "imageLocator": "image:11", "displayLocation": "查看SOW详情 → 基本信息 → 商机ID", "detail": "显示'FM-SJ-000001'"}],
         "candidates": [{"option": "A", "description": "SOW ID系统自动生成，格式为FM-SOW-{年份}-{6位序号}；商机ID由商机模块生成", "impact": "需确认商机模块ID格式"}, {"option": "B", "description": "SOW ID用户手动输入", "impact": "需增加ID唯一性校验"}],
         "recommendationStatus": "process_only",
         "recommendation": "建议明确：SOW ID由系统自动生成，格式为FM-SOW-{创建年份}-{自增序号}，确保全局唯一。商机ID由商机管理模块生成，SOW创建时选择关联商机而非手动输入商机ID。",
         "recommendationBasis": "原型中SOW ID的规律性格式表明应为系统自动生成。手动输入会导致唯一性风险。"},
        {"decisionId": "DEC-SOW-006", "type": "conflict", "priority": "P1", "blocking": True, "status": "open",
         "title": "产品类型选项不一致",
         "description": "正文描述产品类型为'业务产品、平台产品、工具产品'，但详情页原型显示'业务资产'。'业务资产'不在正文选项中。",
         "impact": "影响产品类型字段的数据字典。",
         "relatedObjects": ["REQ-SOW-CREATE-005", "REQ-SOW-VIEW-003", "BO-SOW"],
         "locations": [{"kind": "text", "displayLocation": "新建SOW → 业务规则 → 产品类型", "quote": "产品类型（单选）：业务产品、平台产品、工具产品"}, {"kind": "image", "imageLocator": "image:11", "displayLocation": "查看SOW详情 → 基本信息 → 产品类型", "detail": "显示'产品类型：业务资产'"}],
         "candidates": [{"option": "A", "description": "统一为正文描述：业务产品、平台产品、工具产品", "impact": "更新原型图"}, {"option": "B", "description": "统一为业务资产、平台资产、工具资产", "impact": "更新需求和原型"}],
         "recommendationStatus": "process_only",
         "recommendation": "建议由产品负责人确认产品类型的最终术语。推荐使用正文描述。",
         "recommendationBasis": "正文描述为准。"},
        {"decisionId": "DEC-SOW-007", "type": "conflict", "priority": "P1", "blocking": False, "status": "open",
         "title": "附件字段名不一致：凭据附件 vs 依据附件",
         "description": "新建和编辑页面使用'凭据附件'，详情页使用'依据附件'，字段名称不一致。",
         "impact": "影响前端字段标签的一致性。",
         "relatedObjects": ["REQ-SOW-VIEW-003", "FUN-SOW-CREATE"],
         "locations": [{"kind": "text", "displayLocation": "新建SOW → 业务规则", "quote": "凭据附件：上传附件"}, {"kind": "image", "imageLocator": "image:11", "displayLocation": "查看SOW详情 → 基本信息", "detail": "显示'依据附件：XXXXX SOW凭证.PDF'"}],
         "candidates": [{"option": "A", "description": "统一为'凭据附件'", "impact": ""}, {"option": "B", "description": "统一为'依据附件'", "impact": ""}],
         "recommendationStatus": "provided",
         "recommendation": "统一使用'凭据附件'，因为正文和创建/编辑原型均使用此名称，详情页为孤立不一致。",
         "recommendationBasis": "正文和新建立编辑原型三处一致使用'凭据附件'，详情页一处孤立不同。"},
        {"decisionId": "DEC-SOW-008", "type": "missing", "priority": "P1", "blocking": False, "status": "open",
         "title": "详情页额外Tab页签未在正文描述",
         "description": "详情页原型显示工序进度、功能看板、业务模型、关联文档(重复)、导出文档等Tab页签，正文仅描述了基本信息/SOW清单/关联文档/关联方案/项目概览。",
         "impact": "影响详情页Tab数量和功能实现范围。",
         "relatedObjects": ["FUN-SOW-VIEW", "REQ-SOW-VIEW-002"],
         "locations": [{"kind": "image", "imageLocator": "image:11", "displayLocation": "查看SOW详情 → Tab页签", "detail": "原型显示基本信息/SOW清单/关联文档/关联方案/项目概览/工序进度/功能看板/业务模型/关联文档/导出文档"}],
         "candidates": [{"option": "A", "description": "以正文描述为准：基本信息/SOW清单/关联文档/关联方案/项目概览", "impact": "更新原型图"}, {"option": "B", "description": "以原型为准，增加工序进度/功能看板/业务模型/导出文档Tab", "impact": "需要补充这些Tab的功能需求描述"}],
         "recommendationStatus": "process_only",
         "recommendation": "建议由产品负责人明确详情页Tab的最终范围和每个Tab的业务内容。从需求文档完整性角度，推荐以正文为准，将原型中的额外Tab作为后续迭代保留。",
         "recommendationBasis": "正文是功能规格的权威来源。原型中额外Tab无对应正文描述，无法评估其功能边界。"},
        {"decisionId": "DEC-SOW-009", "type": "missing", "priority": "P1", "blocking": False, "status": "open",
         "title": "附件上传的格式和大小限制未定义",
         "description": "正文仅说'支持上传图片、文件格式的附件'，未明确支持的格式列表、文件大小上限和数量上限。",
         "impact": "影响附件上传功能的前后端校验实现。",
         "relatedObjects": ["REQ-SOW-CREATE-007", "FUN-SOW-CREATE"],
         "locations": [{"kind": "text", "displayLocation": "新建SOW → 业务规则 → 凭据附件", "quote": "凭据附件：上传附件，支持上传图片、文件格式的附件"}],
         "candidates": [{"option": "A", "description": "支持常见办公格式(pdf/docx/xlsx/jpg/png)，单文件≤10MB，最多5个", "impact": ""}],
         "recommendationStatus": "process_only",
         "recommendation": "建议明确附件支持的文件格式（如pdf/doc/docx/xls/xlsx/jpg/png/zip）、单个文件大小上限（如10MB）和附件数量上限（如5个）。",
         "recommendationBasis": "附件上传是通用功能，但缺乏具体约束会导致实现不一致。"},
        {"decisionId": "DEC-SOW-010", "type": "missing", "priority": "P1", "blocking": False, "status": "open",
         "title": "提交完成'必填项'的具体清单不明确",
         "description": "提交完成校验规则说'请先完成SOW清单导入，并确保必填项都已输入'，但未明确说明哪些字段属于'必填项'。图片显示部分字段标*为必填，但正文未显式列出。",
         "impact": "影响提交校验逻辑的实现。",
         "relatedObjects": ["REQ-SOW-SUBMIT-002", "BR-SOW-SUBMIT-CHECK"],
         "locations": [{"kind": "text", "displayLocation": "提交完成 → 业务规则", "quote": "请先完成SOW清单导入，并确保必填项都已输入"}, {"kind": "image", "imageLocator": "image:2", "displayLocation": "新建SOW → 侧滑面板", "detail": "原型中SOW名称、关联商机、商机编号、SOW类型、产品类型、期望完成时间标*必填"}],
         "candidates": [{"option": "A", "description": "新建SOW时的所有必填字段+SOW清单完成导入且所有功能完成合用评价=提交条件", "impact": ""}],
         "recommendationStatus": "process_only",
         "recommendation": "建议明确：提交完成条件包括(1)所有新建时必填字段已填写，(2)SOW清单已导入且至少含一个功能项，(3)所有功能项已完成合用/不合用评价。",
         "recommendationBasis": "原文中'必填项'含义模糊，结合原型中的*标识可以推断但需明确确认。"},
    ]
    m["blockingIssues"] = [d["decisionId"] for d in m["decisions"] if d["blocking"]]

    # ── Decision Sessions ──
    m["decisionSessions"] = [{
        "sessionId": "SESSION-001",
        "round": 1,
        "status": "open",
        "createdAt": "2026-09-16T00:00:00Z",
        "decisionIds": [d["decisionId"] for d in m["decisions"]],
        "summary": "第1轮需求准入问题展示：共10个问题，其中P0 2个，P1 8个，阻断6个。"
    }]

    # ── Gate Result ──
    m["gateResult"] = {
        "status": "decision_required",
        "dimensions": {
            "background_goal": "covered",
            "scope": "covered",
            "actor_permission": "ambiguous",
            "module_function": "covered",
            "business_flow": "decision_required",
            "scenario": "covered",
            "business_rule": "decision_required",
            "data": "decision_required",
            "responsibility": "covered",
            "contract": "covered",
            "non_functional": "covered",
            "acceptance_traceability": "covered",
            "acceptance_test_data": "covered"
        },
        "dimensionNotes": {
            "actor_permission": "已登记状态的完整操作权限待确认（DEC-SOW-002）",
            "business_flow": "SOW类型术语和ID规则待确认（DEC-SOW-001, DEC-SOW-005）",
            "business_rule": "产品类型选项、附件限制、必填项清单待确认（DEC-SOW-006, DEC-SOW-009, DEC-SOW-010）",
            "data": "SOW ID生成规则未定义（DEC-SOW-005）"
        },
        "blockingIssues": [d["decisionId"] for d in m["decisions"] if d["blocking"] and d["status"] == "open"]
    }

    # ── Serialize ──
    model_json = json.dumps(m, ensure_ascii=False, indent=2, sort_keys=True)
    # Compute SHA-256 of the model (excluding modelSha256 field)
    m_copy = json.loads(model_json)
    m_copy["baseline"]["modelSha256"] = ""
    canonical = json.dumps(m_copy, ensure_ascii=False, sort_keys=True)
    sha = hashlib.sha256(canonical.encode()).hexdigest()
    m["baseline"]["modelSha256"] = sha
    m["baseline"]["updatedAt"] = "2026-09-16T00:00:00Z"

    out_path = WORKING / "requirement-model-draft.json"
    with open(out_path, "w") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
    print(f"Model written to {out_path}")
    print(f"modelSha256: {sha}")
    print(f"Functions: {len(m['functions'])}")
    print(f"Scenarios: {len(m['scenarios'])}")
    print(f"Requirements: {len(m['requirements'])}")
    print(f"Visual Evidence: {len(m['visualEvidence'])}")
    print(f"Decisions: {len(m['decisions'])} (blocking: {len([d for d in m['decisions'] if d['blocking'] and d['status']=='open'])})")

if __name__ == "__main__":
    build()
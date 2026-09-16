import rpcMixins from '@m/core/mixin/'
export default [
    rpcMixins,
    {
        mounted() {
            this.getBizObjectList()
        },
        methods: {
            formatEdgeLabel(value){
                let map = {
                    '0-N': '1:0..*',
                    '1-N': '1:1..*',
                    '0-1': '1:0..1',
                    '1-1': '1:1'
                }
                return map[value]
            },
            formatData(data, copy = false){
                let { point, ...other } = data
                return {
                    point,
                    id: other.objCode,
                    name: other.objName,
                    code: other.objCode,
                    shape: '00' ? 'ConnectionObject' : 'ConnectionValue',
                    attr: other.attributeInfos.map(attr => {
                        return {
                            name: attr.dictryName,
                            code: attr.dictryNo,
                            type: attr.dictryType
                        }
                    }),
                    edge: other.objectRelInfos.map(attr => {
                        return {
                            origin: attr.curObjCode,
                            target: attr.tgtObjCode,
                            label: this.formatEdgeLabel(attr.relashMult),
                            type: attr.obrRelash
                        }
                    }),
                    data: other
                }
            },
            saveBatchObject() {
                let { baiId: taskId, fnId, channel, assetId, designRouter } = this.$route.query
                let bizObjectLists = this.Stager.render.toJSON()
                if (designRouter == 'aop_l5design') {
                    //对象关系编辑器兼容自有L5研发
                    bizObjectLists.map((item) => {
                        item.appCntrNo = this.$route.query.projectId
                        item.bizDomainNo = this.$route.query.bizDomainNo
                        item.objCd = item.objCode
                        item.objClsCd = item.objClass
                        item.objClsNm = item.objClassName
                        item.objNm = item.objName
                        item.objTpCd = item.objType
                        item.l5SysBizObjectRelDTOs = item.objectRelInfos
                        item.l5SysBizObjectAttributeDTOs = item.attributeInfos
                        item.l5SysBizObjectLocationInfo = item.point
                        item.l5SysBizObjectRelDTOs.map((rel) => {
                            rel.curObjCd = rel.curObjCode
                            rel.objRelCd = rel.obrCode
                            rel.objRelDesc = rel.obrDesc
                            rel.objRelId = rel.obrId
                            rel.objRelNm = rel.obrName
                            rel.objRelTpCd = rel.obrRelash
                            rel.bjRelEnum = rel.relashMult
                            rel.targetObjCd = rel.tgtObjCode
                            rel.targetObjId = rel.tgtObjId
                            rel.targetObjName = rel.tgtObjName
                        })
                        item.l5SysBizObjectAttributeDTOs.map((att) => {
                            att.attrDesc = att.dictryDesc
                            att.attrTpCd = att.dictryType
                            att.attrEngNm = att.dictryNo
                            att.attrChiNm = att.dictryName
                            att.objAttrId = att.dictryId

                        })
                    })
                    this.rpc.graph.saveSysBizObjectRelLocationList({ l5SysBizObjectInfoList: bizObjectLists }).then(res => {
                        this.$notify({
                            title: '成功',
                            message: '保存成功！',
                            duration: 2000,
                            type: 'success'
                        })
                        this.Stager.render.updateObjId(res.bizObjectLists)
                    })
                } else {
                    let query = {
                        taskId, fnId, channel, assetId
                    }

                    this.rpc.graph.saveBatchObject({ ...query, bizObjectLists }).then(res => {
                        this.$notify({
                            title: '成功',
                            message: '保存成功！',
                            duration: 2000,
                            type: 'success'
                        })
                        this.Stager.render.updateObjId(res.bizObjectLists)
                    })
                }
            },
            async getBizObjectList() {

                let { baiId: taskId, fnId, channel, assetId, objList, designRouter } = this.$route.query
                if (designRouter == 'aop_l5design') {
                    let parmas = {
                        bizDomainNo: this.$route.query.bizDomainNo,
                        appCntrNo: this.$route.query.projectId,
                    };
                    const data = await this.rpc.graph.qrySysBizObjectInfoList(
                        parmas
                    );
                    let l5SysBizObjectInfos = data.l5SysBizObjectInfos
                    l5SysBizObjectInfos.map((item) => {
                        item.objCode = item.objCd
                        item.objClass = item.objClsCd
                        item.objClassName = item.objClsNm
                        item.objName = item.objNm
                        item.objType = item.objTpCd
                        item.createTime = item.updTm
                        item.userName = item.upderNm
                        item.objectRelInfos = item.l5SysBizObjectRelDTOs
                        item.attributeInfos = item.l5SysBizObjectAttributeDTOs
                        item.point = item.l5SysBizObjectLocationInfo
                        item.objectRelInfos.map((rel) => {
                            rel.curObjCode = rel.curObjCd
                            rel.obrCode = rel.objRelCd
                            rel.obrDesc = rel.objRelDesc
                            rel.obrId = rel.objRelId
                            rel.obrName = rel.objRelNm
                            rel.obrRelash = rel.objRelTpCd
                            rel.relashMult = rel.bjRelEnum
                            rel.tgtObjCode = rel.targetObjCd
                            rel.tgtObjId = rel.targetObjId
                            rel.tgtObjName = rel.targetObjName
                        })
                        item.attributeInfos.map((att) => {
                            att.dictryDesc = att.attrDesc
                            att.dictryType = att.attrTpCd
                            att.dictryNo = att.attrEngNm
                            att.dictryName = att.attrChiNm
                            att.dictryId = att.objAttrId

                        })
                    })
                    this.Stager.render.render(l5SysBizObjectInfos)

                } else {
                    let objIdList = window.sessionStorage.getItem("objIdList")
                    let query = {
                        taskId,
                        channel,
                        fnId,
                        assetId,
                        objList: objList ? JSON.parse(objIdList) : [],
                    }
                    let res = await this.rpc.graph.getBizObjectList(query)
                    this.Stager.render.render(res.bizObjectLists)
                }
            },
        }
    }
]
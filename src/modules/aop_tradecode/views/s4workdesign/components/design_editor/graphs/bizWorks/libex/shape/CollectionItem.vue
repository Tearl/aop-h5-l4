<template>
  <div class="x6-custom-bizWorks-shape" :class="shape">

		<div class="tool" v-if="actived">
			<span @click="editor">编辑</span>
			<!-- <span @click="deleteNode">删除</span> -->
		</div>

		<div class="body">
			<div class="header layout">
				<p>
					<label>{{ options.objName }}</label>
					<span>{{ options.objCode | formatH }}</span>
				</p>
				<label @click="showHandle">
					<Icon v-if="!show" name="#icon-arrow-down" fill="white" />
					<Icon v-if="show" name="#icon-arrow-up" fill="white" />
				</label>
			</div>
			<div class="main" ref="main">
				<div class="data-empty">
					<div class="layout" v-if="!desc">
						<p>
							<span>暂未添加内容</span>
						</p>
					</div>
				</div>
				<div class="data-desc" v-if="desc && !show">
					<div class="layout">
						<p>
							<label>{{ desc }}</label>
						</p>
					</div>
				</div>
				<template v-if="show">
					<div class="data-attr" v-if="options.attributeInfos">
						<div class="layout" v-for="(j, k) in options.attributeInfos" :key="k">
							<p>
								<label>{{ j.dictryName }}</label>
								<span>({{ j.dictryNo }})</span>
							</p>
							<span>{{ j.dictryType }}</span>
						</div>
					</div>
					<div class="data-action" v-if="options.objectBehaviorInfos">
						<div class="layout" v-for="(j,k) in options.objectBehaviorInfos" :key="k">
							<p>
								<label>{{ j.obeName }}</label>
								<span>({{ j.obeNo }})</span>
							</p>
						</div>
					</div>
				</template>
			</div>
		</div>

  </div>
</template>
<script>
import Icon from "../../components/svgContainer";
import mixins from "./mixins";
export default {
  mixins,
  components: {
	Icon,
  },
  props: ["shape"],
  data() {
	return {
	  show: false,
	  actived: false,
	  options: {},
	};
  },
};
</script>

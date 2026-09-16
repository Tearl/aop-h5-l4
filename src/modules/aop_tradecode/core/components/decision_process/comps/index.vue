<template>
  <div class="aop_tradecode_comps_process">
    <div ref="svgBox" class="process_svg_box">
      <svg
        ref="svg"
        class="process_svg_main"
        :style="svgStyle"
        :viewBox="`0 0 ${svgOptions.width} ${svgOptions.height}`"
      >
        <!-- 背景 -->
        <g
          class="process_bg"
          @click="handleSvgBgClick"
          @mousedown="checkBoxSvgMove($event)"
        >
          <rect
            :width="svgOptions.width"
            :height="svgOptions.height"
            :fill="svgOptions.fillColor"
          ></rect>
        </g>

        <!-- 泳道 -->
        <g
          class="process_swimlane"
          v-for="(item, i) in swimLaneDiagrams"
          :key="i"
          @click="handleSvgBgClick"
          @mousedown="checkBoxSvgMove($event)"
          @mousemove="throttle(handleSwimlaneMousemove(item, $event))"
          @mouseleave="handleSwimlaneMouseleave"
          @contextmenu.prevent="handleBackgroundCm($event)"
        >
          <rect
            :width="item.width"
            :height="item.height"
            :stroke="swimlaneOptions.stroke"
            :stroke-width="swimlaneOptions.strokeWidth"
            :fill="swimlaneOptions.fill"
            :x="
              swimlaneOptions.shiftx * 1 +
              (i == 0 ? 0 : item.width * (2.3 + i - 1))
            "
            :y="swimlaneOptions.shifty"
          ></rect>
          <rect
            :width="item.width"
            :height="item.height"
            :stroke="swimlaneOptions.stroke"
            :stroke-width="swimlaneOptions.strokeWidth"
            :fill="swimlaneOptions.fill"
            :x="
              swimlaneOptions.shiftx * 1 +
              (i == 0 ? 0 : item.width * (2.3 + i - 1))
            "
            :y="swimlaneOptions.shifty"
          ></rect>

          <foreignObject
            v-if="isRead"
            :width="item.width"
            :height="swimlaneOptions.headHeight * 1"
            :x="
              swimlaneOptions.shiftx * 1 +
              (i == 0 ? 0 : item.width * (2.3 + i - 1)) +
              0.5
            "
            :y="swimlaneOptions.shifty * 1"
            class="swimlane_name"
          >
            <p>{{ item.name }}</p>
          </foreignObject>
        </g>

        <!-- 线条 -->
        <g
          class="process_line process_line_dash"
          v-for="item in lineList"
          :key="item"
        >
          <!-- 起点 -->
          <circle
            v-if="item.lineType == 'polyline'"
            :cx="item.x1"
            :cy="item.y1"
            :r="itemOptions.circleR"
            :fill="lineOptions.startCircleColor"
          />
          <!-- 直线 -->
          <polyline
            v-if="item.lineType != 'polyline'"
            :points="item.polyline"
            :stroke="
              item.type
                ? lineOptions.loseStrokeColor
                : item.checked
                ? lineOptions.checkStrokeColor
                : lineOptions.strokeColor
            "
            :stroke-width="lineOptions.strokeWidth"
            :marker-end="
              item.type
                ? getMarkerEndUrl('lose')
                : item.checked
                ? getMarkerEndUrl('hoverArrow')
                : getMarkerEndUrl('arrow')
            "
            :class="item.checked || isRead ? '' : 'dash'"
            fill="none"
          />
          <!-- 折线 -->
          <polyline
            v-if="item.lineType == 'polyline'"
            :points="item.polyline"
            :stroke="
              item.type
                ? lineOptions.loseStrokeColor
                : item.checked
                ? lineOptions.checkStrokeColor
                : lineOptions.strokeColor
            "
            :stroke-width="lineOptions.strokeWidth"
            :marker-end="
              item.type
                ? getMarkerEndUrl('lose')
                : item.checked
                ? getMarkerEndUrl('hoverArrow')
                : getMarkerEndUrl('arrow')
            "
            fill="none"
          />
          <!-- 点击遮罩 -->
          <polyline
            :points="item.polyline"
            :stroke-width="lineOptions.checkStrokeWidth"
            stroke="transparent"
            fill="none"
            @click="handleLineClick($event, item)"
            @mousedown.left="handleLineMouseDown($event, item)"
            @dblclick.stop="handleLineDClick($event, item)"
            @contextmenu.prevent="handleLineCm($event, item)"
          />
          <!-- 线条遮罩 -->
          <text
            :x="getPolylineTextX(item, getPolylineX(item.polyline))"
            :y="getPolylineTextY(item, getPolylineY(item.polyline))"
            @mouseover="handleLineTextMouseOver(item)"
            @mouseleave="handleLineTextMouseLeave(item)"
            @click.stop="handleLineTextMouseClick(item)"
          >
            {{ getLineText(item, item.isFocus) }}
          </text>
          <!-- 折线点上的圆圈 -->
          <g
            v-show="
              item.checked
            "
          >
            <g v-for="(point, index) in getPolylineArray(item.polyline)" :key="index">
              <!-- 动画控制 -->
              <line
                :class="isCircleClick ? 'process_line_circle_cap' : ''"
                :x1="point.x"
                :y1="point.y"
                :x2="point.x"
                :y2="point.y"
                :stroke="itemOptions.circleStroke"
              />
              <!-- 本身 -->
              <circle
                :cx="point.x"
                :cy="point.y"
                :r="itemOptions.circleR * 1"
                :fill="itemOptions.circleFill"
                :stroke="itemOptions.circleStroke"
              />
              <!-- 圆圈遮罩 -->
              <circle
                class="process_line_circle"
                :cx="point.x"
                :cy="point.y"
                :r="itemOptions.circleR * 2"
                @mousedown.left="handlePolyLinePonitMouseDown($event, point)"
                @contextmenu.prevent="handlePolyLinePonitCm($event, point)"
                fill="transparent"
              />
            </g>
            
          </g>
        </g>
        
        <!-- 容器 -->
        <g
          class="process_container"
          v-for="item in containerList"
          :key="item"
          @mouseover="handleItemMouseover(item)"
          @mouseout="handleItemMouseout(item)"
          @click="handleItemClick(item)"
          @contextmenu.prevent="handleItemCm($event, item)"
        >
          <rect
            :x="item.actionX"
            :y="item.actionY"
            :width="getContainerActionWidth(item, itemOptions)"
            :height="getContainerActionHeight(item, itemOptions)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="getItemStrokeColor(item, itemOptions)"
          />
          <!-- 容器文字 -->
          <foreignObject
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
          >
            <p class="process_rect_text container">{{ getItemDisplayText(item) }}</p>
          </foreignObject>

          <!-- 容器遮罩 -->
          <g
            class="process_move_group"
            v-show="
              item.actionCoverShow ||
              currentActionId == item.actionId ||
              isCircleClick
            "
          >
            <!-- 遮罩层背景 -->
            <rect
              :x="item.actionX"
              :y="getProcessMoveY(item, itemOptions)"
              :width="getProcessMoveWidth(item, itemOptions)"
              :height="getProcessMoveHeight(item, itemOptions)"
              fill="transparent"
              class="process_move"
              @mousedown="handleMoveMD($event, item, itemOptions)"
            />

            <!-- 左边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction'}"
              :x1="getLeftCircleX(item, itemOptions)"
              :y1="getLeftCircleY(item, itemOptions)"
              :x2="getLeftCircleX(item, itemOptions)"
              :y2="getLeftCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getLeftCircleX(item, itemOptions)"
              :cy="getLeftCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getLeftCircleX(item, itemOptions)"
              :cy="getLeftCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleMoveLineMouseDown($event, 'left', item)"
              fill="transparent"
            />
            <!-- 右边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction'}"
              :x1="getRightCircleX(item, itemOptions)"
              :y1="getRightCircleY(item, itemOptions)"
              :x2="getRightCircleX(item, itemOptions)"
              :y2="getRightCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getRightCircleX(item, itemOptions)"
              :cy="getRightCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getRightCircleX(item, itemOptions)"
              :cy="getRightCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleMoveLineMouseDown($event, 'right', item)"
              fill="transparent"
            />
            <!-- 上边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction'}"
              :x1="getUpCircleX(item, itemOptions)"
              :y1="getUpCircleY(item, itemOptions)"
              :x2="getUpCircleX(item, itemOptions)"
              :y2="getUpCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getUpCircleX(item, itemOptions)"
              :cy="getUpCircleY(item, itemOptions)"
              :r="getUpCircleR(item, itemOptions, 1)"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getUpCircleX(item, itemOptions)"
              :cy="getUpCircleY(item, itemOptions)"
              :r="getUpCircleR(item, itemOptions, 2)"
              @mousedown="handleMoveLineMouseDown($event, 'top', item)"
              fill="transparent"
            />
            <!-- 下边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction'}"
              :x1="getDownCircleX(item, itemOptions)"
              :y1="getDownCircleY(item, itemOptions)"
              :x2="getDownCircleX(item, itemOptions)"
              :y2="getDownCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getDownCircleX(item, itemOptions)"
              :cy="getDownCircleY(item, itemOptions)"
              :r="getDownCircleR(item, itemOptions, 1)"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction'}"
              :cx="getDownCircleX(item, itemOptions)"
              :cy="getDownCircleY(item, itemOptions)"
              :r="getDownCircleR(item, itemOptions, 2)"
              @mousedown="handleMoveLineMouseDown($event, 'bottom', item)"
              fill="transparent"
            />
          </g>
        </g>

        <!-- 主体 -->
        <g
          v-for="item in _dataList"
          :key="item"
          @mouseover="handleItemMouseover(item)"
          @mouseout="handleItemMouseout(item)"
          @click="handleItemClick(item)"
          @contextmenu.prevent="handleItemCm($event, item)"
          @dblclick="handleItemDouble(item)"
        >
          <!-- 流程组件、服务组件、数据库组件、为数据域赋值、复制数据域、错误信息映射组件 -->
          <rect
            v-if="
              ![
                'newAction',
                'startAction',
                'endAction',
                'judgeAction',
                'throwExceptionAction',
                'transAction',
                'domainAction',
                'systemAction',
                'newD5Action',
                'D4bAction',
                'D5SelfAction',
                'D5LinkAction',
                'ruleAction',
                'dataDealAction',
                'loopAction',
                'inputAction',
                'outputAction',
                'newD5Action',
                '4RAction',
                'sbsectAction',
                'fieldAction',
                'concurrentAction',
                'asyncAction',
                'containerAction',
                'cacheSessionAction',
                'getSessionAction',
                'createGraphValidateCodeAction',
                'verifyGraphValidateCodeAction',
                'decisionAction',
                'updateSessionAction',
              ].includes(item.actionType)
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill=" (isAssetsDev && item.actionType != isDelArry[0] && item.actionType != isDelArry[1] && item.actionType != isDelArry[2] && item.actionType != isDelArry[3]) ?  itemOptions.assetsDevBgClor : itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              (isAssetsDev && item.actionType != isDelArry[0] && item.actionType != isDelArry[1] && item.actionType != isDelArry[2] && item.actionType != isDelArry[3]) ? itemOptions.assetsDevStroke : 
              (isTest
                ? item.resultFlg == 'true'
                  ? itemOptions.successItemStroke
                  : item.resultFlg == 'false'
                  ? itemOptions.errorItemStroke
                  : itemOptions.itemStroke
                : currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke)
            "
          />
          <!-- 创建组件 -->
          <rect
            v-if="item.actionType == 'newAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.newItemItemBgClor"
            :stroke-dasharray="itemOptions.newItemStrokeDasharray"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.newItemStroke
            "
          />
          <!-- 开始和结束 -->
          <rect
            v-if="
              item.actionType == 'startAction' || item.actionType == 'endAction'
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item) - 8"
            :fill="itemOptions.startEndItemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              isTest ? itemOptions.successItemStroke : 
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.startEndItemBgClor
            "
            rx="20"
            ry="20"
          />
          <!-- 输入和输出 -->
          <polygon
            v-if="
              item.actionType == 'inputAction' || item.actionType == 'outputAction'
            "
            :points="getInputOrOutputItemPoints(item, itemOptions)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item) - 8"
            :fill="itemOptions.startEndItemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              isTest ? itemOptions.successItemStroke : 
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.startEndItemBgClor
            "
          />
          <!-- 判断组件 -->
          <polygon
            v-if="item.actionType == 'judgeAction'"
            :points="item.actionPoint"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            fill="#358aff"
          />
          <!-- 规则组件 -->
          <polygon
            v-if="item.actionType == 'ruleAction'"
            :points="getRuleItemPoints(item.actionPoint)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />
          <!-- 数据处理组件 -->
          <polygon
            v-if="item.actionType == 'dataDealAction'"
            :points="getRuleItemPoints(item.actionPoint)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />
          <!-- 循环组件 -->
          <!-- <circle
            v-if="item.actionType == 'loopAction'"
            :cx="item.actionX + getItemWidth(item) / 2"
            :cy="item.actionY + getItemHeight(item) / 2"
            :fill="itemOptions.itemBgClor"
            :r="itemOptions.circleItemRadius"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          /> -->

          <!-- 异常组件 -->
          <rect
            v-if="item.actionType == 'throwExceptionAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />

          <!-- 交易网关、领域服务、关联系统 -->
          <rect
            v-if="
              item.actionType == 'transAction' ||
              item.actionType == 'domainAction' ||
              item.actionType == 'systemAction'
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />

          <!-- 创建D5组件 -->
          <rect
            v-if="item.actionType == 'newD5Action'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.newItemItemBgClor"
            :stroke-dasharray="itemOptions.newItemStrokeDasharray"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.newItemStroke
            "
          />
          <!-- D4b、D5服务 -->
          <rect
            v-if="
              item.actionType == 'D4bAction' ||
              item.actionType == 'D5SelfAction' ||
              item.actionType == 'D5LinkAction' 
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />
          <!-- 规则组件 -->
          <rect
            v-if="item.actionType == 'decisionAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />
          <!-- 4R组件 -->
          <template v-if="fourRTypeList.includes(item.actionType)">
            <rect
              :x="item.actionX"
              :y="item.actionY"
              :width="get4RActionWidth(item, itemOptions)"
              :height="get4RActionHeight(item, itemOptions)"
              :fill="item.actionDetailShow ? 'transparent' : itemOptions.itemBgClor"
              :stroke-width="
                currentActionId == item.actionId || item.checkStroke
                  ? itemOptions.checkStrokeWidth
                  : itemOptions.strokeWidth
              "
              :stroke="
                currentActionId == item.actionId || item.checkStroke
                  ? itemOptions.checkStroke
                  : itemOptions.itemStroke
              "
              :stroke-dasharray="['asyncAction'].includes(item.actionType) ? '4 2' : ''"
            />
          </template>

          <!-- 设置会话组件、获取会话信息、生产图形验证码、校验图形验证码 -->
          <template v-if="['cacheSessionAction', 'getSessionAction', 'createGraphValidateCodeAction', 'verifyGraphValidateCodeAction', 'updateSessionAction'].includes(item.actionType)">
            <rect
              :x="item.actionX"
              :y="item.actionY"
              :width="getItemWidth(item)"
              :height="getItemHeight(item)"
              :fill="itemOptions.itemBgClor"
              :stroke-width="
                currentActionId == item.actionId || item.checkStroke
                  ? itemOptions.checkStrokeWidth
                  : itemOptions.strokeWidth
              "
              :stroke="
                currentActionId == item.actionId || item.checkStroke
                  ? itemOptions.checkStroke
                  : itemOptions.itemStroke
              "
            />
          </template>

          <!-- 分段组件 -->
          <rect
            v-if="item.actionType == 'sbsectAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="itemOptions.sbsectActionWidth"
            :height="getSbsectActionHeight(item)"
            :fill="itemOptions.itemBgClor"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          />
          <!-- 字段组件 -->
          <!-- <rect
            v-if="item.actionType == 'fieldAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="itemOptions.fieldActionWidth"
            :height="itemOptions.fieldActionHeight"
            :fill="'transparent'"
            :stroke-width="0"
            :stroke="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStroke
                : itemOptions.itemStroke
            "
          /> -->
          <!-- 普通组件标题文字 -->
          <foreignObject
            v-if="
              ![
                'newAction',
                'startAction',
                'endAction',
                'judgeAction',
                'throwExceptionAction',
                'transAction',
                'domainAction',
                'systemAction',
                'newD5Action',
                'D4bAction',
                'D5SelfAction',
                'D5LinkAction',
                'ruleAction',
                'dataDealAction',
                'loopAction',
                'inputAction',
                'outputAction',
                'newD5Action',
                '4RAction',
                'sbsectAction',
                'fieldAction',
                'concurrentAction',
                'asyncAction',
                'containerAction',
                'cacheSessionAction',
                'getSessionAction',
                'createGraphValidateCodeAction',
                'verifyGraphValidateCodeAction',
                'getCacheAction',
                'updateCacheAction',
                'setCacheAction',
                'decisionAction',
                'updateSessionAction',
                'listAction',
                'setHeaderAction',
                'transferStateAction',
                'listSetValAction',
                'getFlowNumAction',
              ].includes(item.actionType)
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{
              textAlign: 'center',
            }"
          >
            <div class="ordinary_text_wrapper ellipsis">
              <div class="content top">{{ `${getDServText(item, "actionSeq")}` }}</div>
              <div class="content bottom">{{ `${item.actionName}` }}</div>
            </div>
            <!-- <p class="process_rect_text" :class="{white: ['judgeAction', 'startAction', 'endAction', 'inputAction', 'outputAction'].indexOf(item.actionType) != -1}">{{ item.actionName }}</p> -->
          </foreignObject>

          <!-- input、output组件文字 -->
          <foreignObject
            v-if="
              item.actionType == 'inputAction' ||
              item.actionType == 'outputAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{
              textAlign: 'center',
            }"
          >
            <div class="process_rect_text flex h100 white ellipsis">
              <div>{{ `${item.actionName}` }}</div>
              <div>{{ `(${getDServText(item, "actionSeq")})` }}</div>
            </div>
          </foreignObject>
          <!-- 数据库组件code -->
          <foreignObject
            v-if="item.actionType == 'sqlAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <div class="process_rect_text flex h100 white ellipsis">
              <div>{{ `${item.actionName}` }}</div>
            </div>
            <!-- <p class="process_rect_text">
              ({{ item.conf.filter((e) => e.name == "actionCode")[0].value }})
            </p> -->
          </foreignObject>

          <!-- 异常文字描述 -->
          <foreignObject
            v-if="item.actionType == 'throwExceptionAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="error_rect_text">
              {{ item.actionName }}
            </p>
            <p class="error_rect_code">
              {{ item.conf.filter((e) => e.name == "errorCode")[0].value }}
            </p>
            <p class="error_rect_msg">
              {{ item.conf.filter((e) => e.name == "errorMsg")[0].value }}
            </p>
          </foreignObject>

          <!-- 分段组件文字描述 -->
          <foreignObject
            v-if="item.actionType == 'sbsectAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="itemOptions.sbsectActionWidth"
            :height="getSbsectActionHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="sbsect_action_text">
              <span class="sbsect_name">
                <el-tag v-if="isShowSbsectActionTag(item)" size="mini" type="danger">new</el-tag>
                <span>{{ item.actionName }}</span>
              </span>
              <span v-if="!isRead" class="btn_area">
                <i @click.stop="sbsectActionOperate('add', item)" class="icon el-icon-plus"></i>
                <i
                  @click.stop="sbsectActionOperate('merge', item)"
                  class="icon el-icon-copy-document"
                  :class="{disabled: isSbsectActionOperateDisabled('merge', item)}"
                >
                </i>
                <i
                  @click.stop="sbsectActionOperate('split', item)"
                  class="icon el-icon-c-scale-to-original"
                  :class="{disabled: isSbsectActionOperateDisabled('split', item)}"
                >
                </i>
                <i @click.stop="sbsectActionOperate('dataBase', item)" class="icon el-icon-coin"></i>
                <i
                  @click.stop="sbsectActionOperate('save', item)"
                  class="icon el-icon-folder-opened"
                  :class="{disabled: isSbsectActionOperateDisabled('save', item)}"
                >
                </i>
              </span>
            </p>
            <ul class="sbsect_action_field_list">
              <li v-for="field in getSbsectFieldList(item)" :key="field" class="sbsect_action_field_list_item">
                <div class="text">{{field.name}}</div>
                <div class="tag_area">
                  <span class="btn" v-if="field.canDelete" @click.stop="deleteField(item, field)">删除</span>
                  <span v-else>
                    <el-tag v-if="field.status == 1" size="mini" type="danger">新增</el-tag>
                    <el-tag v-if="field.status == 2" size="mini" type="success">更新</el-tag>
                    <el-tag v-if="field.status == 3" size="mini" class="info">删除</el-tag>
                  </span>
                </div>
              </li>
            </ul>
            <ul class="sbsect_action_l5service_list">
              <li v-for="l5service in getL5ServiceList(item)" :key="l5service" class="sbsect_action_l5service_list_item">
                <div class="text">{{`${l5service.svcNm}()`}}</div>
                <div class="tag_area">
                  <el-tag v-if="l5service.status == 1" size="mini" type="danger">新增</el-tag>
                  <el-tag v-if="l5service.status == 2" size="mini" type="success">更新</el-tag>
                  <el-tag v-if="l5service.status == 3" size="mini" class="info">删除</el-tag>
                </div>
              </li>
            </ul>
          </foreignObject>

          <!-- 字段组件文字描述 -->
          <!-- <foreignObject
            v-if="item.actionType == 'fieldAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="itemOptions.fieldActionWidth"
            :height="itemOptions.fieldActionHeight"
            :style="{ textAlign: 'left', color: item.color }"
          >
            <p class="field_action_text">
              <span>{{ item.actionName }}</span>
            </p>
          </foreignObject> -->

          <!-- 交易网关、领域服务、关联系统文字描述 -->
          <foreignObject
            v-if="
              item.actionType == 'transAction' ||
              item.actionType == 'domainAction' ||
              item.actionType == 'systemAction'
            "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="spec_rect_text">
              {{ item.actionName }}
            </p>
            <p class="spec_rect_msg">
              {{ item.conf.filter((e) => e.name == "actionMsg")[0].value }}
            </p>
          </foreignObject>

          <!-- <rect
            :x="item.actionX - 10"
            :y="item.actionY - 10"
            :width="getItemWidth(item) + 20"
            :height="getItemHeight(item) + 20"
            rx="5"
            fill="transparent"
            :class="isTest ? 'process_pointer' : ''"
          /> -->

          <!-- D4b、D5服务文字 -->
          <foreignObject
            v-if="
              item.actionType == 'newD5Action' ||
              item.actionType == 'D4bAction' ||
              item.actionType == 'D5SelfAction' ||
              item.actionType == 'D5LinkAction' "
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="d_rect_text">
              {{ getDServText(item, "actionSeq") || "位置序号" }}
            </p>
            <div class="d_rect_code service"
              :class="{
                d5: item.actionType == 'newD5Action' || item.actionType == 'D5LinkAction',
                d4: item.actionType == 'D5SelfAction'
              }">
              <div>{{ getDServText(item, "svcNo") }}</div>
              <div class="text">{{ getDServText(item, "actionDesc") }}</div>
            </div>
            <p class="d_rect_msg" v-if="item.actionType == 'D4bAction' || item.actionType == 'newD5Action' || item.actionType == 'D5SelfAction' || item.actionType == 'D5LinkAction'">
              {{ `${getDServText(item, "svcTpCd")} ${getDServText(item, "sysNm")}`}}
            </p>
          </foreignObject>

          <!-- 规则组件文字 -->
          <foreignObject
            v-if="item.actionType == 'decisionAction'"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="d_rect_text">
              {{ getDServText(item, "actionSeq") || "位置序号" }}
            </p>
            <div class="d_rect_code service"
              :class="{
                decision: item.actionType == 'decisionAction'
              }">
              <div>{{ getDServText(item, "svcNo") }}</div>
              <div class="text">{{ getDServText(item, "actionDesc") }}</div>
            </div>
            <p class="d_rect_msg">
              {{ getDServText(item, "apiServiceType") }}
            </p>
          </foreignObject>

           <!-- 4R组件文字内容 -->
           <foreignObject
            v-if="fourRTypeList.includes(item.actionType)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="d_rect_text">
              <i @click.stop="switch4RAction(item)" class="icon el-icon-link"></i>
              <!-- {{ fourRTypeMap[item.actionType] }} -->
              {{ getDServText(item, "actionSeq") || "位置序号" }}
            </p>
            <div v-if="!item.actionDetailShow">
              <p class="d_rect_code" :class="{
                blue: ['4RAction', 'loopAction'].includes(item.actionType),
                purple: item.actionType == 'asyncAction'
              }">
                {{ getDServText(item, "actionDesc") }}
              </p>
              <p class="d_rect_msg mt5">
                {{ fourRTypeMap[item.actionType] }}
              </p>
            </div>
          </foreignObject>

          <!-- 设置会话组件、获取会话组件、生成图形验证码组件、校验图形验证码组件文字内容 -->
          <foreignObject
            v-if="['cacheSessionAction', 'getSessionAction', 'createGraphValidateCodeAction', 'verifyGraphValidateCodeAction', 'getCacheAction', 'setCacheAction', 'updateCacheAction', 'updateSessionAction', 'listAction', 'setHeaderAction'].includes(item.actionType)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
            :style="{ textAlign: 'center', color: item.color }"
          >
            <p class="d_rect_text">
              <i v-if="['cacheSessionAction', 'getSessionAction', 'createGraphValidateCodeAction', 'verifyGraphValidateCodeAction', 'updateSessionAction'].includes(item.actionType)" class="icon el-icon-user"></i>
              <i v-else-if="['getCacheAction', 'setCacheAction', 'updateCacheAction'].includes(item.actionType)" class="icon el-icon-coin"></i>
              {{ getDServText(item, "actionSeq") || "位置序号" }}
            </p>
            <p class="d_rect_code" :class="{
              blue: ['cacheSessionAction', 'getSessionAction', 'createGraphValidateCodeAction', 'verifyGraphValidateCodeAction', 'getCacheAction', 'setCacheAction', 'updateCacheAction', 'updateSessionAction', 'listAction', 'setHeaderAction'].includes(item.actionType)
            }">
              {{ getDServText(item, "actionDesc") }}
            </p>
            <p class="d_rect_msg mt5">
              {{ actionTypeToName[item.actionType] }}
            </p>
          </foreignObject>

          <!-- 新建D5需求 -->
          <foreignObject
            v-if="
              item.actionType == 'newD5Action' && item.actionId == currentActionId
            "
            :x="item.actionX + getItemWidth(item) + 10"
            :y="item.actionY"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
          >
            <slot name="cpnServiceProps" :data="item"></slot>
          </foreignObject>
          <!-- 创建需求 -->
          <foreignObject
            v-if="
              item.actionType == 'newAction' && item.actionId == currentActionId
            "
            :x="item.actionX + getItemWidth(item) + 10"
            :y="item.actionY - 20"
            :width="getItemWidth(item)"
            :height="getItemHeight(item)"
          >
            <slot name="createNeedsProps" :data="item"></slot>
          </foreignObject>
          <foreignObject
            v-if="item.actionType == 'newAction' && item.stusCd != '04'"
            :x="
              item.actionX + getItemWidth(item) - getItemWidth(item) / 2
            "
            :y="item.actionY - (getItemHeight(item)/ 3) * 1.5"
            :width="getItemWidth(item) / 2"
            :height="(getItemHeight(item)/ 3) * 1.5"
          >
            <p class="process_rect_tips">{{item.stusCd | cpnStusCd}}</p>
          </foreignObject>

          <!-- 服务活动开发需求 -->
          <foreignObject
            v-if="isTest && item.actionType != 'startAction' &&
              item.actionType != 'endAction' &&
              item.actionType != 'setErrorMsgAction'" 
            :x="
              item.actionX + getItemWidth(item)+10
            "
            :y="item.actionY+itemOptions.itemHeight/2 - 15"
            :width="60"
            :height="30"
          >
            <div class="right_box">
              <img
                :class="
                  item.resultFlg == 'true' || item.resultFlg == 'false' ? 'test_record_icon' : ''
                "
                :src="
                  item.resultFlg == 'true'
                    ? require('@m/assets/images/icon_success.png')
                    : item.resultFlg == 'false'
                    ? require('@m/assets/images/icon_fail.png')
                    : ''
                "
              />
              <span
                class="content_info status"
                :class="
                  item.resultFlg == 'true' ? 'success' : item.resultFlg == 'false' ? 'fail' : ''
                "
                >{{
                  item.resultFlg == "true" ? "成功" : item.resultFlg == "false" ? "失败" : ""
                }}</span
              >
            </div>
          </foreignObject>

          <!-- 服务活动开发测试样式 -->
          <foreignObject
            v-if="
              isAssetsDev && item.actionType != isDelArry[0] && item.actionType != isDelArry[1] && item.actionType != isDelArry[2] && item.actionType != isDelArry[3] && item.actionType != 'newAction' &&  item.actionType != 'startAction' &&
              item.actionType != 'endAction'
            "
            :x="
              item.actionX + getItemWidth(item) - 13
            "
            :y="item.actionY-1"
            :width="14"
            :height="16"
          >
            <p class="process_rect_dev_tips">原</p>
          </foreignObject>
          
          <!-- 服务活动开发测试样式 -->
          <foreignObject
            v-if="
              item.actionType == 'sqlAction'
            "
            :x="
              item.actionX + getItemWidth(item) - 39
            "
            :y="item.actionY-1"
            :width="40"
            :height="16"
          >
            <p class="process_rect_database_tips">数据库</p>
          </foreignObject>

          <!-- 已创建需求 -->
          <foreignObject
            v-if="
              item.actionType != 'newAction' &&
              item.actionType != 'startAction' &&
              item.actionType != 'endAction' &&
              item.actionType != 'conditionalAction' &&
              item.actionType != 'flowAction' &&
              item.actionType != 'throwExceptionAction' &&
              item.actionType != 'transAction' &&
              item.actionType != 'systemAction' &&
              item.actionType != 'judgeAction' &&
              item.actionType != 'setFieldValueAction' &&
              item.actionType != 'copyFieldValueAction' &&
              item.actionType != 'setErrorMsgAction' &&
              item.actionType != 'ruleAction' &&
              item.actionType != 'dataDealAction' &&
              item.actionType != 'loopAction' &&
              item.actionType != 'inputAction' &&
              item.actionType != 'outputAction' &&
              item.actionType != 'newD5Action' &&
              item.actionType != '4RAction' &&
              item.actionType != 'sbsectAction' &&
              item.actionType != 'fieldAction' &&
              item.actionId == currentActionId
            "
            :x="item.actionX + getItemWidth(item) + 10"
            :y="item.actionY + itemOptions.itemHeight / 5"
            :width="getItemWidth(item)"
            :height="itemOptions.itemHeight + 20"
          >
            <slot name="hasCreateNeedsProps" :data="item"></slot>
          </foreignObject>

          <!-- 遮罩 -->
          <g
            class="process_move_group"
            v-show="
              item.actionCoverShow ||
              currentActionId == item.actionId ||
              isCircleClick
            "
          >
            <!-- 遮罩层背景 -->
            <rect
              :x="item.actionX"
              :y="getProcessMoveY(item, itemOptions)"
              :width="getProcessMoveWidth(item, itemOptions)"
              :height="getProcessMoveHeight(item, itemOptions)"
              fill="transparent"
              class="process_move"
              @mousedown="handleMoveMD($event, item, itemOptions)"
            />

            <!-- 左边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :x1="getLeftCircleX(item, itemOptions)"
              :y1="getLeftCircleY(item, itemOptions)"
              :x2="getLeftCircleX(item, itemOptions)"
              :y2="getLeftCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getLeftCircleX(item, itemOptions)"
              :cy="getLeftCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getLeftCircleX(item, itemOptions)"
              :cy="getLeftCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleMoveLineMouseDown($event, 'left', item)"
              fill="transparent"
            />
            <!-- 右边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :x1="getRightCircleX(item, itemOptions)"
              :y1="getRightCircleY(item, itemOptions)"
              :x2="getRightCircleX(item, itemOptions)"
              :y2="getRightCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getRightCircleX(item, itemOptions)"
              :cy="getRightCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getRightCircleX(item, itemOptions)"
              :cy="getRightCircleY(item, itemOptions)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleMoveLineMouseDown($event, 'right', item)"
              fill="transparent"
            />
            <!-- 上边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId) || subcomponentIdList.includes(item.actionId) || subcomponentIdList.includes(item.actionId)}"
              :x1="getUpCircleX(item, itemOptions)"
              :y1="getUpCircleY(item, itemOptions)"
              :x2="getUpCircleX(item, itemOptions)"
              :y2="getUpCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId) || subcomponentIdList.includes(item.actionId)}"
              :cx="getUpCircleX(item, itemOptions)"
              :cy="getUpCircleY(item, itemOptions)"
              :r="getUpCircleR(item, itemOptions, 1)"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId) || subcomponentIdList.includes(item.actionId)}"
              :cx="getUpCircleX(item, itemOptions)"
              :cy="getUpCircleY(item, itemOptions)"
              :r="getUpCircleR(item, itemOptions, 2)"
              @mousedown="handleMoveLineMouseDown($event, 'top', item)"
              fill="transparent"
            />
            <!-- 下边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="{'process_line_circle_cap': isCircleClick, 'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :x1="getDownCircleX(item, itemOptions)"
              :y1="getDownCircleY(item, itemOptions)"
              :x2="getDownCircleX(item, itemOptions)"
              :y2="getDownCircleY(item, itemOptions)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getDownCircleX(item, itemOptions)"
              :cy="getDownCircleY(item, itemOptions)"
              :r="getDownCircleR(item, itemOptions, 1)"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :class="{'hidden': item.actionType == 'sbsectAction' || subcomponentIdList.includes(item.actionId)}"
              :cx="getDownCircleX(item, itemOptions)"
              :cy="getDownCircleY(item, itemOptions)"
              :r="getDownCircleR(item, itemOptions, 2)"
              @mousedown="handleMoveLineMouseDown($event, 'bottom', item)"
              fill="transparent"
            />
          </g>

          <!-- 分段组件下的字段连线点 -->
          <g
            v-for="(fieldItem, fieldIndex) in getSbsectFieldList(item)"
            :key="fieldItem"
            v-show="
              item.actionCoverShow ||
              currentActionId == item.actionId ||
              isCircleClick
            "
          >
            <!-- 左边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="isCircleClick ? 'process_line_circle_cap' : ''"
              :x1="item.actionX"
              :y1="getFieldLeftCircleY(item, fieldIndex)"
              :x2="item.actionX"
              :y2="getFieldLeftCircleY(item, fieldIndex)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :cx="item.actionX"
              :cy="getFieldLeftCircleY(item, fieldIndex)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :cx="item.actionX"
              :cy="getFieldLeftCircleY(item, fieldIndex)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleFieldMoveLineMouseDown($event, 'left', item, fieldItem, fieldIndex)"
              fill="transparent"
            />
            <!-- 右边小圈圈 -->
            <!-- 动画控制 -->
            <line
              :class="isCircleClick ? 'process_line_circle_cap' : ''"
              :x1="item.actionX + itemOptions.sbsectActionWidth"
              :y1="getFieldRightCircleY(item, fieldIndex)"
              :x2="item.actionX + itemOptions.sbsectActionWidth"
              :y2="getFieldRightCircleY(item, fieldIndex)"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 本身 -->
            <circle
              :cx="item.actionX + itemOptions.sbsectActionWidth"
              :cy="getFieldRightCircleY(item, fieldIndex)"
              :r="itemOptions.circleR * 1"
              :fill="itemOptions.circleFill"
              :stroke="itemOptions.circleStroke"
            />
            <!-- 圆圈遮罩 -->
            <circle
              class="process_line_circle"
              :cx="item.actionX + itemOptions.sbsectActionWidth"
              :cy="getFieldRightCircleY(item, fieldIndex)"
              :r="itemOptions.circleR * 2"
              @mousedown="handleFieldMoveLineMouseDown($event, 'right', item, fieldItem, fieldIndex)"
              fill="transparent"
            />
          </g>
        </g>

        <!-- 容器上方的灰色遮罩 -->
        <!-- <g
          class="process_container"
          v-for="item in containerList"
          :key="item"
          @mouseover="item.actionCoverShow = true"
          @mouseout="handleItemMouseout(item)"
        >
          <rect
            v-if="item.actionType == 'containerAction' && !(item.actionCoverShow || item.checkStroke)"
            :x="item.actionX"
            :y="item.actionY"
            :width="getContainerActionWidth(item, itemOptions)"
            :height="getContainerActionHeight(item, itemOptions)"
            :fill="'rgba(0, 0, 0, 0.1)'"
            :stroke-width="
              currentActionId == item.actionId || item.checkStroke
                ? itemOptions.checkStrokeWidth
                : itemOptions.strokeWidth
            "
            :stroke="getItemStrokeColor(item, itemOptions)"
          />
        </g> -->
        
        <defs>
          <marker
            viewBox="0 0 10 10"
            markerWidth="9"
            markerHeight="9"
            orient="auto"
            refX="6"
            refY="3"
            :id="getArrowId('arrow')"
          >
            <path
              d="M0,6 L6,3 M6,3 L0,0 z"
              :stroke="lineOptions.strokeColor"
            ></path>
          </marker>
          <marker
            viewBox="0 0 10 10"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
            refX="6"
            refY="3"
            :id="getArrowId('hoverArrow')"
          >
            <path
              d="M0,6 L6,3 M6,3 L0,0 z"
              :stroke="lineOptions.checkStrokeColor"
            ></path>
          </marker>
          <marker
            viewBox="0 0 10 10"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
            refX="6"
            refY="3"
            :id="getArrowId('lose')"
          >
            <path
              d="M0,6 L6,3 M6,3 L0,0 z"
              :stroke="lineOptions.loseStrokeColor"
            ></path>
          </marker>
          <!-- 实体三角形箭头 -->
          <marker id="triangle1" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
            <path d="M 0 0 L 5 2 L 0 4 z" />
          </marker>
          <marker id="triangle2" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto-start-reverse">
            <path d="M 0 0 L 5 2 L 0 4 z" />
          </marker>
        </defs>

        <!-- 选中框体 -->
        <rect
          v-show="rectList.show"
          :x="rectList.actionX"
          :y="rectList.actionY"
          :width="rectList.itemWidth"
          :height="rectList.itemHeight"
          :fill="checkBoxOptions.fill"
          :stroke-width="checkBoxOptions.strokeWidth"
          :stroke="checkBoxOptions.stroke"
          :fill-opacity="checkBoxOptions.fillDasharray"
          :stroke-dasharray="checkBoxOptions.strokeDasharray"
          @mousedown="checkBoxrectMove($event)"
          class="process_move"
        ></rect>

        <!-- 泳道图宽度调整 -->
        <line :x1="swimLaneWidth - 7" :y1="changeWidthBtnY" :x2="swimLaneWidth + 7" :y2="changeWidthBtnY"
          @mousedown="handleSwinLaneWidthChange"
          v-if="changeSwinLaneSizeShow"
          style="stroke:rgb(99,99,99);stroke-width:2"
          :marker-start="'url(#triangle2)'"
          :marker-end="'url(#triangle1)'"/>
      </svg>
    </div>
    <AttrList class="used_action" ref="attrListRef" v-show="dataViewVisible" :dataObj="dataObj" @handleListClick="handleListClick"></AttrList>

    <!-- 删除 -->
    <div
      class="process_pop"
      v-show="isPopShow"
      :class="{ hidden: (pageType == 'downDesign' && ['inputAction', 'outputAction'].includes(itemObj.actionType))}"
      :style="{ left: currentLocation.x + 'px', top: currentLocation.y + 'px', transform: `scale(${scaleRate})`, 'transform-origin': 'left top',}"
    >
      <div class="process_del">
        <ul>
          <li v-for="item in rightClickMenuList" :key="item">
            <p @click="toApply(item.operation, item.args)">{{ item.text }}</p>
          </li>
        </ul>
        <!-- <p v-if="delType == 'line'" @click="handleDelLine">删除</p>
        <p v-else-if="delType == 'polylinePoint'" @click="handleDelPolyLinePonit">删除</p>
        <div v-else>
          <p  @click="handleItemBtnClick('del')">删除</p>
        </div> -->
      </div>
    </div>

    <!-- 编辑 -->
    <div
      class="process_pop_edit"
      v-show="isPopShow && delType == 'newD5Action'"
      :style="{ left: currentLocation.x + 'px', top: currentLocation.y + 47 + 'px' }"
    >
      <div class="process_del">
        <p @click="handleItemBtnClick('edit')">编辑</p>
      </div>
    </div>

    <!-- 粘贴 -->
    <div
      class="process_pop"
      v-show="isPastePopShow"
      :style="{ left: currentLocation.x + 'px', top: currentLocation.y + 'px' }"
    >
      <div class="process_del">
        <p @click="handleItemBtnClick('paste')">粘贴</p>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@m/core/mixin";
import compsMixin from "./mixin";
import processCore from "../core/index";
import processConf from "../core/conf";
import { throttle } from "@m/utils/throttle.js";
import { escape2Html } from "@m/utils/html2e.js";
import { getSessionStorage, setSessionStorage } from "@m/utils/localStorage.js";
import filters from "@m/utils/filters";
import AttrList from "./components/attr_list";

export default {
  mixins: [mixin, compsMixin],
  components: {
    AttrList
  },
  props: {
    dataObj: {
      type: Object,
      default: () => ({}),
    },
    // 画布默认宽度
    processWidth: {
      type: Number,
      default: () => 2000,
    },
    // 画布默认高度
    processHeight: {
      type: Number,
      default: () => 2000,
    },
    // 阅读模式
    isRead: {
      type: Boolean,
      default: () => false,
    },
    // 调试开关
    isTest: {
      type: Boolean,
      default: () => false,
    },
    //泳道图显示
    swimLaneDiagrams: {
      type: Array,
      default: () => [],
    },
    //删除开关
    isDelArry: {
      type: Array,
      default: () => [],
    },
    // 活动开发
    isAssetsDev: {
      type: Boolean,
      default: () => false
    },
    // 组件设计
    isCpnDesign: {
      type: Boolean,
      default: () => false
    },
    // 泳道图总宽度
    swimLaneWidth: {
      type: Number,
      default: () => 0
    },
    pageType: {
      type: String,
      default: () => ""
    },
    fourRAttrFlag: {
      type: Boolean,
      default: () => false,
    },
    dataViewVisible: {
      type: Boolean,
      default: () => false
    },
    swimlaneInfo: {
      type: Object,
      default: () => ({})
    },
    scaleRate: {
      type: Number,
      default: () => 1
    },
    layoutActionList: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      // dataViewVisible: false, //点击数据视图参数在画布显示组件列表
      // 核心工具
      processCore: processCore,
      // 计时器
      timer: null,
      // 组件配置
      itemOptions: processConf.itemOptions,
      // 线条配置
      lineOptions: processConf.lineOptions,
      // 画布配置
      svgOptions: processConf.svgOptions,
      // 选中框配置
      checkBoxOptions: processConf.checkBoxOptions,
      // 泳道配置
      swimlaneOptions: processConf.swimlaneOptions,
      // 完整数据
      dataList: [],
      // 线条数据
      lineList: [],
      // 当前选中连接线
      lineObj: {},
      // 当前选中的折线点
      polylinePointObj: {},
      // 当前位置
      currentLocation: {
        x: 0,
        y: 0,
      },
      // 默认线条样式
      lineType: "line",
      // lineType: "polyline",
      // 移动中组件
      currentMoveItem: {},
      currentActionId: "",
      // 右键菜单显示
      isPopShow: false,
      // 右键粘贴菜单显示
      isPastePopShow: false,
      // 判断删除条件还是组件
      delType: "line",
      // 当前选中组件
      itemObj: {},
      // 圆圈点下标志
      isCircleClick: false,
      // 选中矩形
      rectList: {
        show: false,
        actionX: 0,
        actionY: 0,
        itemWidth: 0,
        itemHeight: 0,
      },
      // 原始完整数据的值
      oldDataList: [],
      // 是否显示调整泳道图尺寸的按钮
      changeSwinLaneSizeShow: false,
      // 调整泳道图尺寸按钮的Y坐标
      changeWidthBtnY: 0,
      // 操作步骤数据记录
      stepDataRecord: {
        index: 0,
        data: []
      },
      //默认线段数据
      defaultLineList: [
        {
            "x1": 245.1092529296875,
            "y1": 55.00421142578125,
            "polyline": "245.1092529296875 55.00421142578125 246.80853838230666 127",
            "checked": false,
            "drection": "bottom",
            "condition": {
                "condPrit": "0"
            },
            "lineId": "line1665474418063",
            "lineType": "line",
            "sourceId": "inputAction1",
            "targetId": "4RAction3"
        },
        {
            "x1": 247.375,
            "y1": 151,
            "polyline": "247.375 151 248.0011448620593 290.00421142578125",
            "checked": false,
            "drection": "bottom",
            "condition": {
                "condPrit": "0"
            },
            "lineId": "line1665474420951",
            "lineType": "line",
            "sourceId": "4RAction3",
            "targetId": "outputAction2"
        }
      ],
      // 默认4R线段数据
      fourRDefaultLineList:[
        // {
        //     "x1": 247.1092529296875,
        //     "y1": 90.00421142578125,
        //     "polyline": "247.1092529296875 90.00421142578125 247.97810538870388 249.00421142578125",
        //     "checked": false,
        //     "drection": "bottom",
        //     "condition": {
        //         "condPrit": "0"
        //     },
        //     "lineType": "line",
        //     "sourceId": "inputAction1",
        //     "targetId": "outputAction2",
        //     "lineId": "line1665474595614"
        // }
      ],
      fourRDataObj: {},
      fourRDataMap: {},
    };
  },
  computed: {
    _dataList() {
      const dataList = this.dataList.filter(item => !this.containerTypeList.includes(item.actionType))
      if (this.fourRAttrFlag) {
        return dataList
      } else {
        if (Object.keys(this.fourRDataMap).length) {
          let appendList = []
          for (let i in this.fourRDataMap) {
            appendList.push(...this.fourRDataMap[i])
          }
          return dataList.concat(appendList)
        } else {
          return dataList
        }
      }
    },
    containerList() {
      return this.dataList.filter(item => this.containerTypeList.includes(item.actionType));
    },
    subcomponentIdList() {
      return this.containerList.reduce((prev, container) => {
        const conf = this.getConfItem("subcomponent", container.actionId)
        const subcomponent = JSON.parse((conf.value || "[]"))
        return prev.concat(subcomponent)
      }, [])
    },
    svgStyle() {
      return {
        // height: this.svgOptions.height + 'px',
        // width: this.svgOptions.width + 'px',
        height: this.svgOptions.height * this.scaleRate + "px",
        width: this.svgOptions.width  * this.scaleRate + "px",
        cursor: this.svgOptions.cursor,
        // transform: `scale(${this.scaleRate})`,
        // "transform-origin": "left top",
      }
    },
    rightClickMenuList() {
      if (this.delType == "line") {
        return [
          { text: "删除", operation: "handleDelLine"},
        ]
      } else if (this.delType == "polylinePoint") {
        return [
          { text: "删除", operation: "handleDelPolyLinePonit"},
        ]
      } else {
        if (this.subcomponentIdList.includes(this.itemObj.actionId)) {
          return [
            // { text: "删除", operation: "handleItemBtnClick", args: ["del"]},
            { text: "移出容器", operation: "moveOutFromContainer"},
          ]
        } else {
          return [
            { text: "删除", operation: "handleItemBtnClick", args: ["del"]},
          ]
        }
      }
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.removeEventListener();
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  mounted() {
    this.svgOptions.width = this.processWidth;
    this.svgOptions.height = this.processHeight;
  },
  methods: {
    // 页面初始化
    init() {
      this.addEventListener()
    },
    getDServText(item, str) {
      let target = ""
      if (str == "svcTpCd") {
        target = item.conf.find(item => item.name == str)
        if (target && target.value && target.value.indexOf("D4b") > -1) return "D4b"
        if (target && target.value && target.value.indexOf("D5自有") > -1) return "自有服务"
        if (target && target.value && target.value.indexOf("D5直连") > -1) return "直连服务"
      } else {
        target = item.conf.find(item => item.name == str)
        return target && target.value || ""
      }
    },
    // 获取箭头的ID 
    getArrowId(str) {
      return `${str}${this.isTest ? "_test" : ""}`
    },
    getMarkerEndUrl(str) {
      return `url(#${this.getArrowId(str)})`
    },
    // 添加事件监听器
    addEventListener() {
      document.addEventListener("keyup", this.handleKeyup, false)
    },
    // 移除事件监听器
    removeEventListener() {
      document.removeEventListener("keyup", this.handleKeyup, false)
    },
    handleKeyup(ev) {
      if (ev.ctrlKey && ev.shiftKey && ev.keyCode == 90) {
        let { index, data } = this.stepDataRecord
        if (index < data.length) {
          this.stepDataRecord.index = ++index
          this.dataList = JSON.parse(data[index - 1].dataList)
          this.lineList = JSON.parse(data[index - 1].lineList)
        }
      } else if (ev.ctrlKey && ev.keyCode == 90) {
        let { index, data } = this.stepDataRecord
        if (index > 1) {
          this.stepDataRecord.index = --index
          this.dataList = JSON.parse(data[index - 1].dataList)
          this.lineList = JSON.parse(data[index - 1].lineList)
        }
      }
    },
    // 创建选中矩形
    checkBoxSvgMove(ev) {
      if (this.isRead) return;
      this.rectList = {
        show: false,
        actionX: 0,
        actionY: 0,
        itemWidth: 0,
        itemHeight: 0,
      };
      this.dataList.forEach((item) => {
        item.checkStroke = false;
        item.actionCoverShow = false;
      });
      // 获取鼠标点击后的坐标
      // let x1 = ev.offsetX;
      // let y1 = ev.offsetY;
      let x1 = ev.offsetX / this.scaleRate;
      let y1 = ev.offsetY / this.scaleRate;
      this.rectList.actionX = x1;
      this.rectList.actionY = y1;
      this.rectList.show = true;
      // 鼠标移动事件监听
      document.onmousemove = throttle((ev) => {
        // let nx1 = ev.offsetX;
        // let ny1 = ev.offsetY;
        let nx1 = ev.offsetX / this.scaleRate;
        let ny1 = ev.offsetY / this.scaleRate;
        this.rectList.actionX = nx1 - x1 > 0 ? x1 : nx1;
        this.rectList.actionY = ny1 - y1 > 0 ? y1 : ny1;
        this.rectList.itemWidth = nx1 - x1 > 0 ? nx1 - x1 : 0 - (nx1 - x1);
        this.rectList.itemHeight = ny1 - y1 > 0 ? ny1 - y1 : 0 - (ny1 - y1);
        let lastX = nx1 - x1 > 0 ? nx1 : x1;
        let lastY = ny1 - y1 > 0 ? ny1 : y1;
        this.dataList.forEach((item) => {
          if (
            ((this.rectList.actionX < item.actionX &&
              item.actionX < lastX &&
              this.rectList.actionY < item.actionY &&
              item.actionY < lastY) ||
            (this.rectList.actionX <
              item.actionX + this.getItemWidth(item) &&
              item.actionX + this.getItemWidth(item) < lastX &&
              this.rectList.actionY <
                item.actionY + this.getItemHeight(item) &&
              item.actionY + this.getItemHeight(item) < lastY) ||
            (this.rectList.actionX < item.actionX &&
              item.actionX < lastX &&
              this.rectList.actionY <
                item.actionY + this.getItemHeight(item) &&
              item.actionY + this.getItemHeight(item) < lastY) ||
            (this.rectList.actionX <
              item.actionX + this.getItemWidth(item) &&
              item.actionX + this.getItemWidth(item) < lastX &&
              this.rectList.actionY < item.actionY &&
              item.actionY < lastY)) && !this.subcomponentIdList.includes(item.actionId)
          ) {
            item.checkStroke = true;
            item.actionCoverShow = true;
          } else {
            item.checkStroke = false;
            item.actionCoverShow = false;
          }
        });
      });
      // 鼠标松开事件监听
      document.onmouseup = throttle((ev) => {
        let i = 0;
        this.dataList.forEach((item) => {
          if (item.checkStroke) {
            i++;
          }
        });
        if (i == 0) {
          this.rectList = {
            show: false,
            actionX: 0,
            actionY: 0,
            itemWidth: 0,
            itemHeight: 0,
          };
        }
        document.onmousemove = null;
      });
    },
    // 背景右键
    handleBackgroundCm(ev) {
      if (!getSessionStorage("pasteObj") || this.isRead || this.isTest) return
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev.stopPropagation();
        this.getSvgPos();
        this.currentLocation.x =
          ev.pageX - this.svgOptions.left - this.getScrollLeft() + 10;
        this.currentLocation.y =
          ev.pageY - this.svgOptions.top - this.getScrollTop() - 30;
        this.isPastePopShow = true;
      }, 300); //大概时间300ms
    },
    // 选中矩形移动
    checkBoxrectMove(ev) {
      // 获取鼠标点击后的坐标
      this.oldDataList = JSON.parse(JSON.stringify(this.dataList));
      let x1 = ev.clientX;
      let y1 = ev.clientY;
      let oldX = this.rectList.actionX; // 多选框左上角的X坐标
      let oldY = this.rectList.actionY; // 多选框左上角的Y坐标
      document.onmousemove = throttle((ev) => {
        let nx1 = ev.clientX; // 鼠标当前X坐标
        let ny1 = ev.clientY; // 鼠标当前Y坐标
        let moveX = (nx1 - x1) / this.scaleRate; // 鼠标X轴移动距离
        let moveY = (ny1 - y1) / this.scaleRate; // 鼠标Y轴移动距离
        let currentX = oldX + moveX; // 移动后多选框左上角的X坐标
        let currentY = oldY + moveY; // 移动后多选框左上角的Y坐标
        if (currentX < 0) {
          currentX = 0;
        } else if (currentX > this.svgOptions.width - this.rectList.itemWidth) {
          currentX = this.svgOptions.width - this.rectList.itemWidth;
        }
        if (currentY < 0) {
          currentY = 0;
        } else if (
          currentY >
          this.svgOptions.height - this.rectList.itemHeight
        ) {
          currentY = this.svgOptions.height - this.rectList.itemHeight;
        }
        this.rectList.actionX = currentX;
        this.rectList.actionY = currentY;
        this.dataList.forEach((item, index) => {
          if (item.checkStroke) {
            this.dataListMove(item, index, moveX, moveY, currentX, currentY);
          }
        });
      });
      // 鼠标松开事件监听
      document.onmouseup = throttle((ev) => {
        document.onmousemove = null;
      });
    },
    // 选中框中的组件移动
    dataListMove(item, i, x, y, cx, cy) {
      const oldX = this.oldDataList[i].actionX; // 选中时组件左上角点的X坐标
      const oldY = this.oldDataList[i].actionY; // 选中时组件左上角点的Y坐标
      let currentX = oldX + x; // 选中时组件左上角点的X坐标 + 鼠标X轴移动距离 = 移动后组件左上角点的X坐标
      let currentY = oldY + y; // 选中时组件左上角点的Y坐标 + 鼠标Y轴移动距离 = 移动后组件左上角点的y坐标
      if (currentX < 0) {
        currentX = 0;
      } else if (currentX > this.svgOptions.width - item.itemWidth) {
        currentX = this.svgOptions.width - item.itemWidth;
      }
      if (currentY < 0) {
        currentY = 0;
      } else if (currentY > this.svgOptions.height - item.itemHeight) {
        currentY = this.svgOptions.height - item.itemHeight;
      }
      // 判断外层选中矩形状态
      if (
        cx == 0 &&
        cy > 0 &&
        cy < this.svgOptions.height - this.rectList.itemHeight
      ) {
        item.actionY = currentY;
      } else if (
        cx == this.svgOptions.width - this.rectList.itemWidth &&
        cy > 0 &&
        cy < this.svgOptions.height - this.rectList.itemHeight
      ) {
        item.actionY = currentY;
      } else if (
        cy == 0 &&
        cx > 0 &&
        cx < this.svgOptions.width - this.rectList.itemWidth
      ) {
        item.actionX = currentX;
      } else if (
        cy == this.svgOptions.height - this.rectList.itemHeight &&
        cy > 0 &&
        cx < this.svgOptions.width - this.rectList.itemWidth
      ) {
        item.actionX = currentX;
      } else if (
        cx > 0 &&
        cx > 0 &&
        cx < this.svgOptions.width - this.rectList.itemWidth &&
        cy < this.svgOptions.height - this.rectList.itemHeight
      ) {
        item.actionY = currentY;
        item.actionX = currentX;
      }
      item.actionPoint =
        item.actionX +
        this.getItemWidth(item) / 2 +
        "," +
        item.actionY +
        "  " +
        item.actionX +
        "," +
        (item.actionY + this.getItemHeight(item) / 2) +
        "  " +
        (item.actionX + this.getItemWidth(item) / 2) +
        "," +
        (item.actionY + this.getItemHeight(item)) +
        "  " +
        (item.actionX + this.getItemWidth(item)) +
        "," +
        (item.actionY + this.getItemHeight(item) / 2);
      if (this.containerList.includes(item)) {
        const conf = this.getConfItem("subcomponent", item.actionId)
        const subcomponent = JSON.parse((conf.value || "[]"))
        this.setContainerInnerItemPosition(item, subcomponent)
      }
      // if(cx==0 && cx==0) return
      this.updataPolyline(
        item,
        this.dataList,
        // this.getItemWidth(item),
        // this.getItemHeight(item)
        this.getItemWidth(item),
        this.getItemHeight(item),
      );
      this.getLineList(
        this.lineList,
        this.dataList,
        // this.getItemWidth(item),
        // this.getItemHeight(item)
        this.getItemWidth(item),
        this.getItemHeight(item),
      );
    },
    // 画布空白处点击
    handleSvgBgClick(e) {
      // if (this.isRead) return;
      this.isPopShow = false;
      this.isPastePopShow = false;
      this.currentActionId = "";
      this.clearAllLineCheck(this.lineList);
      console.log("点击画布空白处触发")
      this.$emit("getSvgClickEvent", this.dataObj);
    },
    // 线条点击
    handleLineClick(ev, item) {
      // if (this.isRead) return;
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev && ev.stopPropagation();
        this.getSvgPos();
        this.clearAllLineCheck(this.lineList);
        console.log(this.lineList);
        item.checked = true;
        this.isPopShow = false;
        this.isPastePopShow = false;
        this.lineObj = item;
        console.log("点击画布后触发")
        this.$emit("getConditionEvent", this.lineObj, this.lineList);
      }, 300); //大概时间300ms
    },
    // 在线条上单击左键时
    handleLineMouseDown(event, item) {
      console.log("handleLineMouseDown", item)
      if (!(this.lineObj.checked && this.lineObj.lineId == item.lineId) || this.isRead || this.isTest) return
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        // 鼠标点击的线条上的坐标
        const clickLineX = event.pageX - this.svgOptions.left - this.getScrollLeft();
        const clickLineY = event.pageY - this.svgOptions.top - this.getScrollTop();
        const pointArr = item.polyline.split(" ").reduce((prev, point, i, arr) => {
          if (i % 2 == 0) {
            prev.push({
              x: arr[i] * 1,
              y: arr[i + 1] * 1,
              index: prev.length
            })
          }
          return prev
        }, [])
        let insertPointIndex = this.getInsertPointIndex(pointArr, clickLineX, clickLineY)
        pointArr.splice(insertPointIndex, 0, {
          x: clickLineX,
          y: clickLineY
        })
        item.polyline = pointArr.reduce((prev, item, i) => {
          return `${prev}${item.x} ${item.y}${i == pointArr.length - 1 ? "" : " "}`
        }, "")
        document.onmousemove = throttle((ev) => {
          let mouseX = ev.pageX - this.svgOptions.left - this.getScrollLeft();
          let mouseY = ev.pageY - this.svgOptions.top - this.getScrollTop();
          if (mouseX < 0) mouseX = 0
          else if (mouseX > this.svgOptions.width - this.getItemWidth(item)) mouseX = this.svgOptions.width - this.getItemWidth(item)
          if (mouseY < 0) mouseY = 0
          else if (mouseY > this.svgOptions.width - this.getItemWidth(item)) mouseY = this.svgOptions.width - this.getItemWidth(item)
          pointArr[insertPointIndex].x = mouseX
          pointArr[insertPointIndex].y = mouseY
          item.polyline = pointArr.reduce((prev, item, i) => {
            return `${prev}${item.x} ${item.y}${i == pointArr.length - 1 ? "" : " "}`
          }, "")
        });
  
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
          // 更新dataList中children的polyline
          this.updateDateListChildren(item)
          this.markCurrentDate();
          console.log("线条移动后触发");
        };
      }, 100); //大概时间300ms
    },
    // 获取折线中插入点的位置索引
    getInsertPointIndex(pointArr, clickLineX, clickLineY) {
      // 区间坐标符合的点
      const _pointArr = pointArr.filter((point, i, arr) => {
        if (i >= arr.length - 1) return false
        const minX = Math.min(arr[i].x, arr[i + 1].x)
        const maxX = Math.max(arr[i].x, arr[i + 1].x)
        const minY = Math.min(arr[i].y, arr[i + 1].y)
        const maxY = Math.max(arr[i].y, arr[i + 1].y)
        return clickLineX >= minX - 3 && clickLineX <= maxX + 3 && clickLineY >= minY - 3 && clickLineY <= maxY + 3
      })
      // 计算tan值，找出差值最小的点
      _pointArr.forEach((point, i, arr) => {
        const tan1 = Math.abs((clickLineY - arr[i].y) / (clickLineX - arr[i].x))
        const tan2 = Math.abs((clickLineY - pointArr[point.index + 1].y) / (clickLineX - pointArr[point.index + 1].x))
        point.tan =  Math.abs(tan1 - tan2)
      })
      let minTan = _pointArr.reduce((prev, point, i) => {
        if (i == 0) return point.tan
        return point.tan < prev ? point.tan : prev 
      }, 0)
      let resultIndex = _pointArr.find(point => point.tan == minTan).index
      return resultIndex + 1
    },
    // 更新dataList中children的polyline
    updateDateListChildren(lineObj) {
      const children = this.dataList.find(data => data.actionId == lineObj.sourceId).children
      children.find(line => line.lineId == lineObj.lineId).polyline = lineObj.polyline
      this.getLineList(
        this.lineList,
        this.dataList,
        this.getItemWidth(),
        this.getItemHeight()
      );
      this.lineObj = this.lineList.find(line => line.lineId == lineObj.lineId)
      this.lineObj.checked = true
    },
    // 在折线点上单击左键时
    handlePolyLinePonitMouseDown(ev, point) {
      if (this.isRead || this.isTest) return
      const arr = this.lineObj.polyline.split(" ")
      const pointArr = []
      for (let i = 0; i < arr.length; i += 2) {
        pointArr.push({
          x: arr[i] * 1,
          y: arr[i + 1] * 1
        })
      }
      let insertPointIndex = pointArr.findIndex(item => item.x == point.x && item.y == point.y)

      document.onmousemove = throttle((ev) => {
        let mouseX = ev.pageX - this.svgOptions.left - this.getScrollLeft();
        let mouseY = ev.pageY - this.svgOptions.top - this.getScrollTop();
        if (mouseX < 0) mouseX = 0
        else if (mouseX > this.svgOptions.width - this.getItemWidth()) mouseX = this.svgOptions.width - this.getItemWidth()
        if (mouseY < 0) mouseY = 0
        else if (mouseY > this.svgOptions.width - this.getItemWidth()) mouseY = this.svgOptions.width - this.getItemWidth()
        pointArr[insertPointIndex].x = mouseX
        pointArr[insertPointIndex].y = mouseY
        this.lineObj.polyline = pointArr.reduce((prev, item, i) => {
          return `${prev}${item.x} ${item.y}${i == pointArr.length - 1 ? "" : " "}`
        }, "")
      });

      document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
          // 更新dataList中children的polyline
          this.updateDateListChildren(this.lineObj)
          this.markCurrentDate();
          console.log("折线点移动后触发");
        };
    },
    // 在折线点上单击右键时
    handlePolyLinePonitCm(ev, point) {
      if (this.isRead || this.isTest) return
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev.stopPropagation();
        this.getSvgPos();
        this.polylinePointObj = point
        this.delType = "polylinePoint";
        this.currentLocation.x =
          ev.pageX - this.svgOptions.left - this.getScrollLeft() + 10;
        this.currentLocation.y =
          ev.pageY - this.svgOptions.top - this.getScrollTop() - 30;
        this.isPopShow = true;
      }, 300); //大概时间300ms
    },
    // 删除在折线上的点
    handleDelPolyLinePonit() {
      if (this.isRead) return;
      this.lineObj.polyline = this.lineObj.polyline.replace(`${this.polylinePointObj.x} ${this.polylinePointObj.y} `, "")
      this.updateDateListChildren(this.lineObj)
      this.polylinePointObj = {};
      this.isPopShow = false;
      this.isPastePopShow = false;
      this.markCurrentDate();
      console.log("删除折线点后触发")
    },
    // 线条双击
    handleLineDClick(ev, item) {
      if (this.isRead) return;
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev && ev.stopPropagation();
        this.getSvgPos();
        this.clearAllLineCheck(this.lineList);
        console.log(this.lineList);
        item.checked = true;
        this.isPopShow = false;
        this.isPastePopShow = false;
        this.lineObj = item;
        console.log("线条双击后触发");
        this.$emit("getConditionDbClickEvent", this.lineObj, this.lineList);
      }, 100); //大概时间300ms
    },
    //线条右键点击
    handleLineCm(ev, item) {
      if (this.isRead) return;
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev.stopPropagation();
        this.getSvgPos();
        this.clearAllLineCheck(this.lineList);
        this.lineObj = item;
        this.delType = "line";
        this.currentLocation.x =
          ev.pageX - this.svgOptions.left - this.getScrollLeft() + 10;
        this.currentLocation.y =
          ev.pageY - this.svgOptions.top - this.getScrollTop() - 30;
        this.isPopShow = true;
      }, 300); //大概时间300ms
    },
    // 线条删除
    handleDelLine() {
      if (this.isRead) return;
      let e = this.lineObj;
      let d = this.dataList.filter((item) => item.actionId == e.sourceId.split("-")[0])[0];
      d.children = d.children.filter((i) => i.lineId !== e.lineId);
      this.lineList.splice(this.lineList.indexOf(e), 1);
      this.setActionSeq();
      this.updateLineCondPrit();
      this.lineObj = {};
      this.isPopShow = false;
      this.isPastePopShow = false;
      this.markCurrentDate();
      console.log("线条删除后触发");
    },
    // 根据sourceId和targetId删除线条
    deleteLineBySourceIdAndTargetId(sourceId, targetId) {
      let e = this.lineList.find(item => item.sourceId == sourceId && item.targetId == targetId);
      let d = this.dataList.filter((item) => item.actionId == e.sourceId)[0];
      d.children = d.children.filter((i) => i.lineId !== e.lineId);
      this.lineList = this.lineList.filter(item => !(item.sourceId == sourceId && item.targetId == targetId));
    },
    // 更新dataList的children并对优先级进行排序
    updateLineCondPrit() {
      const linesIdArray = this.lineList.map(item => item.lineId)
      this.dataList.forEach(item => {
        item.children = item.children.filter(child => linesIdArray.indexOf(child.lineId) > -1)
      })
      // 当组件的线大于2时，对线进行排序
      const moreThan2LinesData = this.dataList.filter(item => item.children.length >= 2)
      moreThan2LinesData && moreThan2LinesData.forEach(data => {
        const min = Math.min(...data.children.map(item => item.condition.condPrit))
        data.children.forEach(item => {
          if (item.condition.condPrit >= data.children.length - 1 - min) item.condition.condPrit = `${item.condition.condPrit * 1 - 1}`
        })
      })
      // 当组件的线只有1条时，把线的优先级设置成0
      const onlyOneLineData = this.dataList.filter(item => item.children.length == 1)
      onlyOneLineData && onlyOneLineData.forEach(data => {
        data.children.forEach(item => item.condition.condPrit = "0")
      })
    },
    // 组件操作点击
    handleItemBtnClick(e) {
      if (this.isRead) return;
      if (e === "edit") {
        console.log("组件点击编辑后触发");
        this.$emit("itemEditClick")
      } else if (e === "del") {
        let item = this.itemObj;
        if (!this.verifyItemDeletable(item)) return
        if (item.actionDetailShow) {
          // 删除展开的父组件
          this.switch4RAction(item)
        }
        // 删除容器的时候，连子组件一起删除
        if (this.containerTypeList.includes(item.actionType)) {
          const conf = this.getConfItem("subcomponent", item.actionId)
          const subcomponent = JSON.parse((conf.value || "[]"))
          this.dataList = this.dataList.filter(data => !subcomponent.includes(data.actionId))
        }
        this.dataList.splice(this.dataList.indexOf(item), 1);
        delete this.actionIdToWidth[item.actionId];
        this.lineList = this.lineList.filter(
          (i) => i.targetId.split("-")[0] !== item.actionId && i.sourceId.split("-")[0] !== item.actionId
        );
        this.updateLineCondPrit()
        this.isPopShow = false;
        this.isPastePopShow = false;
        this.itemObj = {};
        this.markCurrentDate();
        console.log("组件点击删除后触发");
      } else if (e == "copy") {
        setSessionStorage("pasteObj", JSON.stringify(this.itemObj), Date.now() + 10000 )
        this.isPopShow = false;
        this.isPastePopShow = false;
        this.itemObj = {};
        console.log("组件点击复制后触发")
      } else if (e == "paste") {
        const pasteObj = JSON.parse(getSessionStorage("pasteObj"))
        pasteObj.actionId = pasteObj.actionType + this.getNewRectId("Action", this.dataList)
        pasteObj.actionX = this.currentLocation.x
        pasteObj.actionY = this.currentLocation.y
        this.dataList.push(pasteObj)
        this.isPastePopShow = false;
        this.markCurrentDate();
        console.log("组件点击粘贴后触发")
      }
    },
    // 校验组件是否可删除
    verifyItemDeletable(item) {
      if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType) && item.compositeId) {
        // 删除L5服务组件时，判断其是否作为循环组件的循环集合来源
        const loopList = this.dataList.filter((data) => {
          if (data.actionType == "loopAction") {
            const loopListSource = this.getConfItem("loopListSource", data.actionId)?.value
            return loopListSource == item.compositeId
          }
        })
        if (loopList.length) {
          const loopNames = loopList.reduce((prev, loopAction, index, arr) => {
            return `${prev}${loopAction.actionName}${index == arr.length - 1 ? "" : "、"}`
          }, "")
          return this.$message.error(`${item.actionName}是${loopNames}的循环集合来源，无法删除！`) && false
        }
        // 判断是否作为其他L5服务组件的交易编排来源
        const referenceList = this.dataList.filter((data) => {
          if (data.compositeId && data.compositeId != item.compositeId) {
            const layoutAction = this.layoutActionList.find((layoutData) => layoutData.actionId == data.compositeId)
            const tfrCdtnCd = JSON.parse(layoutAction?.tfrCdtnCd || "[]")
            return tfrCdtnCd.some((_tfrCdtnCd) => _tfrCdtnCd.actionId == item.compositeId)
          }
        })
        if (referenceList.length) {
          const referenceNames = referenceList.reduce((prev, referenceItem, index, arr) => {
            return `${prev}${referenceItem.actionName}${index == arr.length - 1 ? "" : "、"}`
          }, "")
          return this.$message.error(`${item.actionName}是${referenceNames}的交易编排来源，无法删除！`) && false
        }
      }
      return true
    },
    // 组件移动
    handleMoveMD(event, item, itemOptions) {
      // 在主流程中返显子流程组件时，这些组件不能移动
      if (item.actionParentId) return
      // 移动容器内的组件时，改为移动整个容器
      if (this.subcomponentIdList.includes(item.actionId)) {
        const container = this.dataList.find((data) => {
          if (this.containerTypeList.includes(data.actionType)) {
            const conf = this.getConfItem("subcomponent", data.actionId)
            const subcomponent = JSON.parse((conf.value || "[]"))
            if (subcomponent.includes(item.actionId)) {
              return true
            }
          }
        })
        item = container
      }
      const oldMouseX = event.clientX;
      const oldMouseY = event.clientY;
      let oldX = item.actionX;
      let oldY = item.actionY;
      const conf = this.getConfItem("subcomponent", item.actionId)
      const subcomponent = JSON.parse((conf.value || "[]"))
      // 容器组件的坐标区间
      const containerAreaMap = this.containerList.reduce((prev, item, index) => {
        prev[item.actionId] = {
          x: [item.actionX, item.actionX + this.getContainerActionWidth(item, itemOptions)],
          y: [item.actionY, item.actionY + this.getContainerActionHeight(item, itemOptions)],
        }
        return prev
      }, {})
      document.onmousemove = throttle((ev) => {
        let moveX = (ev.clientX - oldMouseX) / this.scaleRate; // 移动的x距离
        let moveY = (ev.clientY - oldMouseY) / this.scaleRate; // 移动的y距离
        let currentX = oldX + moveX; // 组件的x坐标
        let currentY = oldY + moveY; // 组件的y坐标
        if (currentX < 0) {
          currentX = 0;
        } else if (
          currentX >
          this.svgOptions.width - this.getItemWidth(item)
        ) {
          currentX = this.svgOptions.width - this.getItemWidth(item);
        }

        if (currentY < 0) {
          currentY = 0;
        } else if (
          currentY >
          this.svgOptions.height - this.getItemHeight(item)
        ) {
          currentY = this.svgOptions.height - this.getItemHeight(item);
        }
        item.actionX = currentX;
        item.actionY = currentY;
        item.actionPoint =
          currentX +
          this.getItemWidth(item) / 2 +
          "," +
          currentY +
          "  " +
          currentX +
          "," +
          (currentY + this.getItemHeight(item) / 2) +
          "  " +
          (currentX + this.getItemWidth(item) / 2) +
          "," +
          (currentY + this.getItemHeight(item)) +
          "  " +
          (currentX + this.getItemWidth(item)) +
          "," +
          (currentY + this.getItemHeight(item) / 2);
        if (this.containerList.includes(item)) {
          this.setContainerInnerItemPosition(item, subcomponent)
        }
        if (item.actionDetailShow) {
          this.setFourRItemInnerItemPosition(item)
        }
        this.updataPolyline(
          item,
          this.dataList,
          this.getItemWidth(item),
          this.getItemHeight(item),
        );
        this.getLineList(
          this.lineList,
          this._dataList,
          this.getItemWidth(item),
          this.getItemHeight(item),
        );
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          this.getIntersectionContainer(item, containerAreaMap)
        }
      });

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.lineObj.checked = false

        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
          const containerId = this.getIntersectionContainer(item, containerAreaMap)
          if (containerId) {
            this.addItemToContainer(item, containerId)
          }
        }
        this.$emit("handleItemMover", item, this.dataList);
        this.markCurrentDate();
        console.log("组件移动后触发");
      };
    },
    // 鼠标移入组件操作按钮
    handleItemMouseover(e) {
      if (this.isRead) return;
      if (this.isTest) {
        e.actionCoverShow = false;
      } else {
        e.actionCoverShow = true;
      }
      this.$emit("handleItemMouseover", e);
      console.log("移入组件按钮后触发");
    },
    // 鼠标移出组件操作按钮
    handleItemMouseout(e) {
      // if (this.isRead) return;
      e.actionCoverShow = false;
      this.$emit("handleItemMouseout", e);
      console.log("移出组件按钮后触发");
    },

    /**
        ev: event对象
        drection: 划线小圈圈的方位
        item: 小圈圈所在表单对象
    */
    handleMoveLineMouseDown(ev, drection, item) {
      console.log("handleMoveLineMouseDown", ev, drection, item)
      if (this.isRead) return;
      if (item.actionParentId) return
      if (this.lineList.some(line => line.sourceId == item.actionId)) {
        return this.$message.error(`组件【${item.actionName}】已存在连线，如需重新连线请先删除原连线`)
      } else if (item.actionType == "outputAction") {
        return this.$message.error(`组件【${item.actionName}】只能作为编排终点`)
      }
      // const now = Date.now()
      // if (this.handleMoveLineMouseDown.lastClickTime && now - this.handleMoveLineMouseDown.lastClickTime <= 300) {
      //   this.lineType = "polyline"
      // }
      // // 记录点击时间
      // this.handleMoveLineMouseDown.lastClickTime = now
      this.getSvgPos();
      this.isCircleClick = true;
      const oldMouseX = ev.pageX - this.svgOptions.left;
      const oldMouseY = ev.pageY - this.svgOptions.top;
      let endItem = {};
      let lineObj = {};
      if (this.lineType == "polyline") {
        lineObj = this.newLineObj(
          item,
          drection,
          "polyline",
          this.getItemWidth(item),
          this.getItemHeight(item)
        );
        lineObj.lineType = "polyline";
      } else {
        lineObj = this.newLineObj(
          item,
          drection,
          "line",
          this.getItemWidth(item),
          this.getItemHeight(item)
        );
        lineObj.lineType = "line";
      }
      lineObj.drection = drection;
      this.lineList.push(lineObj);
      document.onmousemove = throttle((ev) => {
        /** 鼠标相对于svg的left位置 */
        let newMouseX = (ev.pageX - this.svgOptions.left - this.getScrollLeft()) / this.scaleRate;
        // let newMouseX =
        //   ev.pageX - this.svgOptions.left - this.getScrollLeft();
        /** 鼠标相对于svg的top位置 */
        // let newMouseY =
        //   ev.pageY - this.svgOptions.top - this.getScrollTop();
        let newMouseY = (ev.pageY - this.svgOptions.top - this.getScrollTop()) / this.scaleRate;
        this.setMoveLineObj(
          item,
          lineObj,
          drection,
          newMouseX,
          newMouseY,
          this.getItemWidth(item),
          this.getItemHeight(item)
        );
        let flag = false;
      });

      document.onmouseup = (ev) => {
        /** 鼠标相对于svg的left位置 */
        // let newMouseX =
        //   ev.pageX - this.svgOptions.left - this.getScrollLeft();
        let newMouseX = (ev.pageX - this.svgOptions.left - this.getScrollLeft()) / this.scaleRate;
        /** 鼠标相对于svg的top位置 */
        // let newMouseY =
        //   ev.pageY - this.svgOptions.top - this.getScrollTop();
        let newMouseY = (ev.pageY - this.svgOptions.top - this.getScrollTop()) / this.scaleRate;

        /** 标记鼠标是否移入表单 */
        let flag = false;
        console.log("拖线的时候鼠标松开左键", newMouseX, newMouseY)
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i] !== item) {
            flag = this.testImpactMoveMouse(
              this.dataList[i],
              newMouseX,
              newMouseY,
              // this.getItemWidth(item),
              // this.getItemHeight(item)
              this.getItemWidth(this.dataList[i]),
              this.getItemHeight(this.dataList[i]),
            );
            if (flag) {
              // 连接到容器内的子组件时，改为与容器建立连线
              if (this.subcomponentIdList.includes(this.dataList[i].actionId)) {
                const container = this.containerList.find((container) => {
                  const conf = this.getConfItem("subcomponent", container.actionId)
                  const subcomponent = JSON.parse((conf.value || "[]"))
                  return subcomponent.includes(this.dataList[i].actionId)
                })
                endItem = container ? container : this.dataList[i]
              } else {
                endItem = this.dataList[i];
              }
              break;
            }
          }
        }

        if (flag) {
          if (this.lineList.some(line => line.targetId == endItem.actionId)) {
            document.onmousemove = null;
            document.onmouseup = null;
            this.isCircleClick = false;
            this.lineList.pop()
            return this.$message.error(`组件【${endItem.actionName}】已存在连线，如需重新连线请先删除原连线`)
          } else if (endItem.actionType == "inputAction") {
            document.onmousemove = null;
            document.onmouseup = null;
            this.isCircleClick = false;
            this.lineList.pop()
            return this.$message.error(`组件【${item.actionName}】只能作为编排起点`)
          } else if (this.containerTypeList.includes(endItem.actionType) && !["D4bAction", "D5SelfAction", "D5LinkAction"].includes(item.actionType)) {
            document.onmousemove = null;
            document.onmouseup = null;
            this.isCircleClick = false;
            this.lineList.pop()
            return this.$message.error(`请将L5服务组件与【${endItem.actionName}】连线`)
          } else if (endItem.actionType == "uploadAction" && item.actionType != "inputAction") {
            document.onmousemove = null;
            document.onmouseup = null;
            this.isCircleClick = false;
            this.lineList.pop()
            return this.$message.error(`请将输入组件与文件上传组件连线`)
          } 
          let lineEndPos = this.getEndPos(
            endItem,
            newMouseX,
            newMouseY,
            // this.getItemWidth(item),
            // this.getItemHeight(item)
            this.getItemWidth(endItem),
            this.getItemHeight(endItem),
          );
          console.log("lineEndPos", lineEndPos)
          let end = lineEndPos.drection;
          // let x2 = endItem.actionX + this.getItemWidth(item) / 2;
          // let y2 = endItem.actionY + this.getItemHeight(item) / 2;
          let x2 = endItem.actionX + this.getItemWidth(endItem) / 2;
          let y2 = endItem.actionY + this.getItemHeight(endItem) / 2;
          let lineId = this.getLineId();
          if (this.lineType == "polyline") {
            this.setLineObj(
              item,
              lineObj,
              drection,
              endItem,
              end,
              lineEndPos.x,
              lineEndPos.y,
              this.getItemWidth(item),
              this.getItemHeight(item)
            );
            // 生成线条时的默认优先级
            this.$emit("generateLineCondPrit", lineObj, this.lineList)
          } else {
            // 生成连接线时执行
            this.setLineObj(
              item,
              lineObj,
              drection,
              endItem,
              end,
              x2,
              y2,
              // this.getItemWidth(item),
              // this.getItemHeight(item)
              this.getItemWidth(endItem),
              this.getItemHeight(endItem)
            );
            // 生成线条时的默认优先级
            this.$emit("generateLineCondPrit", lineObj, this.lineList)
            // 设置组件的序列号
            this.setActionSeq()
            this.markCurrentDate();
            console.log("生成连接线后触发", JSON.parse(JSON.stringify(lineObj)))
          }
          lineObj.lineId = lineId;
          item.children.push({
            targetId: endItem.actionId,
            sourceId: item.actionId,
            begin: drection,
            end,
            lineId,
            condition: "",
            lineType: this.lineType,
            polyline: lineObj.polyline
          });
        } else {
          this.lineList.pop();
        }
        document.onmousemove = null;
        document.onmouseup = null;
        this.isCircleClick = false;
        // this.lineType = "line"
        console.log("在圆点鼠标放开后触发(无论是否生成新线条)");
      };
    },
    /**
        ev: event对象
        drection: 划线小圈圈的方位
        item: 小圈圈所在表单对象
        fieldItem: 字段小圈圈所在表单对象
        fieldIndex: 字段小圈圈的序号
    */
    handleFieldMoveLineMouseDown(ev, drection, item, fieldItem, fieldIndex) {
      console.log("handleFieldMoveLineMouseDown", ev, drection, item, fieldItem, fieldIndex)
      if (this.isRead) return;
      this.getSvgPos();
      this.isCircleClick = true;
      const oldMouseX = ev.pageX - this.svgOptions.left;
      const oldMouseY = ev.pageY - this.svgOptions.top;
      let endItem = {};
      let lineObj = {};
      if (this.lineType == "polyline") {
        lineObj = this.newLineObj(
          item,
          drection,
          "polyline",
          this.getItemWidth(item),
          this.getItemHeight(item)
        );
        lineObj.lineType = "polyline";
      } else {
        lineObj = this.newLineObj(
          item,
          drection,
          "line",
          this.getItemWidth(item),
          this.getItemHeight(item),
          fieldItem,
          fieldIndex,
        );
        lineObj.lineType = "line";
      }
      lineObj.drection = drection;
      this.lineList.push(lineObj);
      document.onmousemove = throttle((ev) => {
        /** 鼠标相对于svg的left位置 */
        let newMouseX =
          ev.pageX - this.svgOptions.left - this.getScrollLeft();
        /** 鼠标相对于svg的top位置 */
        let newMouseY =
          ev.pageY - this.svgOptions.top - this.getScrollTop();
        this.setMoveLineObj(
          item,
          lineObj,
          drection,
          newMouseX,
          newMouseY,
          this.getItemWidth(item),
          this.getItemHeight(item)
        );
        let flag = false;
      });

      document.onmouseup = (ev) => {
        /** 鼠标相对于svg的left位置 */
        let newMouseX =
          ev.pageX - this.svgOptions.left - this.getScrollLeft();
        /** 鼠标相对于svg的top位置 */
        let newMouseY =
          ev.pageY - this.svgOptions.top - this.getScrollTop();

        /** 标记鼠标是否移入表单 */
        let flag = false;
        console.log("拖线的时候鼠标松开左键", newMouseX, newMouseY)
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i] !== item) {
            flag = this.fieldTestImpactMoveMouse(
              this.dataList[i],
              newMouseX,
              newMouseY,
              this.itemOptions.sbsectActionWidth,
              this.getSbsectActionHeight(item),
              fieldItem,
              fieldIndex
            );
            if (flag) {
              endItem = flag.endItem;
              break;
            }
          }
        }

        if (flag) {
          let lineEndPos = this.getEndPos(
            endItem,
            newMouseX,
            newMouseY,
            this.itemOptions.sbsectActionWidth,
            this.getItemHeight(item)
          );
          let end = lineEndPos.drection;
          let x2 = endItem.actionX;
          let y2 = endItem.actionY;
          let lineId = this.getLineId();
          if (this.lineType == "polyline") {
            this.setLineObj(
              item,
              lineObj,
              drection,
              endItem,
              end,
              lineEndPos.x,
              lineEndPos.y,
              this.getItemWidth(item),
              this.getItemHeight(item)
            );
            // 生成线条时的默认优先级
            this.$emit("generateLineCondPrit", lineObj, this.lineList)
          } else {
            // 生成连接线时执行
            this.setLineObj(
              item,
              lineObj,
              drection,
              endItem,
              end,
              x2,
              y2,
              this.getItemWidth(item),
              this.getItemHeight(item),
              fieldItem,
              fieldIndex
            );
            // 生成线条时的默认优先级
            this.$emit("generateLineCondPrit", lineObj, this.lineList)
            // 修改实体关系
            lineObj.condition.relation = "01"
            this.$emit("editEntityRelation", item, JSON.parse(JSON.stringify(lineObj)))
            this.markCurrentDate();
            console.log("生成连接线后触发", JSON.parse(JSON.stringify(lineObj)))
          }
          lineObj.lineId = lineId;
          item.children.push({
            targetId: endItem.actionId,
            sourceId: fieldItem.actionId,
            begin: drection,
            end,
            lineId,
            condition: {
              relation: "01"
            },
            lineType: this.lineType,
            polyline: lineObj.polyline
          });
        } else {
          this.lineList.pop();
        }
        document.onmousemove = null;
        document.onmouseup = null;
        this.isCircleClick = false;
        // this.lineType = "line"
        console.log("在圆点鼠标放开后触发(无论是否生成新线条)");
      };
    },
    //拖入新组件
    handleNewRectMousedown(e) {
      console.log("handleNewRectMousedown",e)
      if (this.isRead) return
      this.currentActionId = "";
      let ev = e.ev;
      this.getSvgPos();
      let newDiv = document.createElement("div");
      newDiv.setAttribute("class", "new-rect");
      newDiv.style.position = "absolute";
      newDiv.style.left = ev.clientX - 25 + "px";
      newDiv.style.top = ev.clientY - 15 + "px";
      document.body.appendChild(newDiv);
      // 容器组件的坐标区间
      const containerAreaMap = this.containerList.reduce((prev, item, index) => {
        prev[item.actionId] = {
          x: [item.actionX, item.actionX + this.getContainerActionWidth(item)],
          y: [item.actionY, item.actionY + this.getContainerActionHeight(item)],
        }
        return prev
      }, {})
      document.onmousemove = throttle((ev) => {
        let isNewRect = false;
        if (
          newDiv.offsetTop > this.svgOptions.top &&
          newDiv.offsetLeft > this.svgOptions.left
        ) {
          document.body.removeChild(newDiv);
          if (!isNewRect) {
            console.log(e);
            this.currentMoveItem = {
              actionId:
                e.item.type + this.getNewRectId("Action", this.dataList),
              actionOwnId: e.item.cpntId,
              actionName: e.item.conf.filter(
                (item) => item.name == "actionDesc"
              )[0].value,
              actionX: 0,
              actionY: 0,
              actionCoverShow: false,
              color: e.item.color ? e.item.color : "#333",
              children: [],
              actionPoint: "",
              actionType: e.item.type,
              paramList: e.item.paramList,
              conf: e.item.conf,
            };
            this.dataList.push(this.currentMoveItem);
            isNewRect = true;
          }
        } else {
          newDiv.style.left = ev.clientX - 25 + "px";
          newDiv.style.top = ev.clientY - 15 + "px";
        }
        let x =
          ev.clientX - this.svgOptions.left - this.getItemWidth() / 2;
        if (x < 0) x = 0;
        else if (x > this.svgOptions.width - this.getItemWidth())
          x = this.svgOptions.width - this.getItemWidth();
        // this.currentMoveItem.actionX = x;
        this.currentMoveItem.actionX = x / this.scaleRate;

        let y =
          ev.clientY - this.svgOptions.top - this.getItemHeight() / 2;

        if (y < 0) {
          y = 0;
        } else if (y > this.svgOptions.height - this.getItemHeight()) {
          y = this.svgOptions.height - this.getItemHeight();
        }
        // this.currentMoveItem.actionY = y;
        this.currentMoveItem.actionY = y / this.scaleRate;
        this.currentMoveItem.actionPoint =
          x +
          this.getItemWidth() / 2 +
          "," +
          y +
          "  " +
          x +
          "," +
          (y + this.getItemHeight() / 2) +
          "  " +
          (x + this.getItemWidth() / 2) +
          "," +
          (y + this.getItemHeight()) +
          "  " +
          (x + this.getItemWidth()) +
          "," +
          (y + this.getItemHeight() / 2);
        if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(this.currentMoveItem.actionType)) {
          this.getIntersectionContainer(this.currentMoveItem, containerAreaMap)
        }
      });

      document.onmouseup = (ev) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.$emit("handleNewRectAdd", this.currentMoveItem, this.dataList);
        if (newDiv.parentNode) {
          document.body.removeChild(newDiv);
        }
        console.log("this.currentMoveItem", JSON.parse(JSON.stringify(this.currentMoveItem)))
        if (this.currentMoveItem.actionName && this.currentMoveItem.actionType) {
          // 把组件拖进了画布
          this.handleItemClick(this.currentMoveItem, false)
          if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(this.currentMoveItem.actionType)) {
            const containerId = this.getIntersectionContainer(this.currentMoveItem, containerAreaMap)
            if (containerId) {
              this.addItemToContainer(this.currentMoveItem, containerId)
            }
          }
        } else {
          // 没有把组件拖进了画布
          if (["D4bAction", "D5SelfAction", "D5LinkAction"].includes(e.item.type)) {
            this.$emit("showServInfo", e.item)
          }
        }
        this.currentMoveItem = {};
        this.markCurrentDate();
        console.log("新增组件后触发");
      };
    },
    //点击已使用/已赋值列表，高亮选中点击服务
    handleListClick(e) {
      this.currentActionId = e.actionId;
    },
    //组件点击
    handleItemClick(e, click = true) { // 默认点击触发，拖拽组件触发时click = false
      if (this.handleItemClick.timer) clearTimeout(this.handleItemClick.timer);
      this.handleItemClick.timer = setTimeout(() => {
        // if (this.isRead) return;
        // 当isTest为true时，则为服务活动预览执行测试页面，组件不可移动
        if (this.isTest) {
          this.$emit("componentClick", e);
          return;
        }
        console.log("组件点击后触发",e);
        this.isPopShow = false;
        this.isPastePopShow = false;
        this.currentActionId = e.actionId;
        this.$emit("getAttrEvent", e, click);
      }, 200)
    },
    //组件右键
    handleItemCm(ev, item) {
      if (this.isRead) return;
      if (
        this.isDelArry.length > 0 &&
        !this.isDelArry.includes(item.actionType)
      )
        return;
      let timers = this.timer;
      if (timers) {
        window.clearTimeout(timers);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        ev.stopPropagation();
        this.getSvgPos();
        this.clearAllLineCheck(this.lineList);
        this.itemObj = item;
        this.delType = item.actionType == "newD5Action" ? "newD5Action" : "rect";
        let moreX = item.actionId.includes("loopAction") ? -5 : 6
        // this.currentLocation.x = item.actionX + this.getItemWidth(item) + moreX;
        this.currentLocation.x = (item.actionX + this.getItemWidth(item) + moreX) * this.scaleRate;
          // ev.pageX - this.svgOptions.left - processCore.getScrollLeft() + 30;
        // this.currentLocation.y = item.actionY
        this.currentLocation.y = item.actionY * this.scaleRate
          // ev.pageY - this.svgOptions.top - processCore.getScrollTop() - 10;
        this.isPopShow = true;
        this.$emit("getAttrEvent", item, true);
      }, 300); //大概时间300ms
    },
    //更新画布
    updateProcessMain() {
      this.getSvgPos();
      let me = this;
      for (let i in me.dataList) {
        let children = [];
        for (let p in me.lineList) {
          if (me.lineList[p].sourceId.split("-")[0] == me.dataList[i].actionId) {
            let d = me.lineList[p];
            d.lineId = this.getLineId() + p;
            d.lineType = me.lineList[p].polyline == "1" ? "polyline" : "line";
            children.push(d);
          }
        }
        me.dataList[i].children = children;
        me.dataList[i].actionX = me.dataList[i].actionX * 1;
        me.dataList[i].actionY = me.dataList[i].actionY * 1;
        me.dataList[i].actionCoverShow = false;
        delete me.dataList[i].lineList;
      }
      this.getLineList(
        this.lineList,
        this.dataList,
        this.getItemWidth(),
        this.getItemHeight(),
        this.isTest
      );
    },
    //更新画布坐标
    getSvgPos() {
      this.svgOptions.left = this.$refs.svg.getBoundingClientRect().left;
      this.svgOptions.top = this.$refs.svg.getBoundingClientRect().top;
    },
    //更新dateList
    updateDataParams(e) {
      for (let i in this.dataList) {
        if (this.dataList[i].actionId == e.actionId) {
          this.dataList[i].paramList = e.paramList;
          this.dataList[i].conf = e.conf;
          this.dataList[i].actionName = e.conf.filter(
            (item) => item.name == "actionDesc"
          )[0].value;
        }
      }
    },
    // 更新流程图中的服务的参数
    upDateServParams(obj, e) {
      console.log("upDateServParams", obj, e)
      if (["D4bAction", "D5SelfAction", "D5LinkAction", "decisionAction"].includes(obj.actionType)) { // 服务组件
        // const target = this.dataList.find(item => item.actionOwnId == obj.svcId)
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e
      } else if (obj.actionType == "inputAction" || obj.actionType == "outputAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (["cacheSessionAction", "getSessionAction", 'updateSessionAction'].includes(obj.actionType)) {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "dataDealAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "ruleAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "loopAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "asyncAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "breakAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "continueAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "judgeAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "throwExceptionAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "sqlAction") {
        console.log("更新数据库组件")
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        // target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj == "params") {
        // 保存参数时更新input和output组件
        const inputCpn = this.dataList.find(item => item.actionType == "inputAction")
        const outputCpn = this.dataList.find(item => item.actionType == "outputAction")
        try {
          inputCpn.paramList = e.iInputList
          outputCpn.paramList = e.iOutputList
        } catch (error) {
          console.log(error)
        }
      } else if (obj.actionType == "dataListAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
      } else if (obj.actionType == "newD5Action") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      } else if (obj.actionType == "4RAction") {
        const target = this.dataList.find(item => item.actionId == obj.actionId)
        target.paramList = e.paramList
        target.conf = e.confList.map(item => {
          return {
            name: item.confKey,
            value: item.confValue
          }
        }) 
        target.compositeId = e.compositeId
        target.actionName = e.confList.find(item => item.confKey == "actionDesc")?.confValue
      }
      this.$forceUpdate()
      // target.conf.push({
      //   name: "compositeId",
      //   value: e.compositeId
      // })
    },
    //更新线条条件
    updateCondition(e) {
      for (let i in this.dataList) {
        if (this.dataList[i].actionId == e.sourceId) {
          for (let k in this.dataList[i].children) {
            if (this.dataList[i].children[k].lineId == e.lineId) {
              this.dataList[i].children[k].condition = e.condition;
            }
          }
        }
      }
      this.$forceUpdate();
    },
    //映射数据
    mapData(e, po) {
      let list = [];
      let ll = [];
      for (let i in e) {
        let pp = JSON.parse(po);
        let p = pp[e[i].id].split(" ");
        let d = {
          actionId: e[i].id,
          actionOwnId: e[i].cpntId,
          actionType: e[i].type,
          actionName: e[i].conf.filter((item) => item.name == "actionDesc")[0]
            .value,
          actionX: p[0] * 1,
          actionY: p[1] * 1,
          actionPoint: "",
          color: e[i].color || "#333",
          actionCoverShow: false,
          conf: e[i].conf,
          resultFlg: e[i].resultFlg || "",
          paramList: e[i].paramList || [],
          stusCd: e[i].stusCd || [],
          compositeId: e[i].compositeId || "",
        };

        d.actionPoint =
          d.actionX +
          (p[2] * 1) / 2 +
          "," +
          d.actionY +
          "  " +
          d.actionX +
          "," +
          (d.actionY + (p[3] * 1) / 2) +
          "  " +
          (d.actionX + (p[2] * 1) / 2) +
          "," +
          (d.actionY + p[3] * 1) +
          "  " +
          (d.actionX + p[2] * 1) +
          "," +
          (d.actionY + (p[3] * 1) / 2);
        list.push(d);
        for (let k in e[i].transition) {
          let n = {
            // sourceId: e[i].id,
            sourceId: e[i].transition[k].name.split(".")[0],
            targetId: e[i].transition[k].value,
            condition: e[i].transition[k],
            begin: e[i].transition[k].desc.split("-")[0] || "bottom",
            end: e[i].transition[k].desc.split("-")[1] || "top",
            lineType: "line",
            polyline: e[i].transition[k].polyline || "",
          };
          ll.push(n);
        }
      }
      this.dataList = list;
      this.lineList = ll;
      if(!this.lineList.length) {
        if(this.fourRAttrFlag) {
          this.lineList = this.fourRDefaultLineList
        }else {
          this.lineList = this.defaultLineList 
        }
      }
      this.updateProcessMain();
      this.markCurrentDate();
    },
    map4RData(e, po, item) {
      // console.log("map4RData", e, po, JSON.parse(JSON.stringify(this._dataList)))
      // const actionSeq = item.conf.find(conf => conf.name == "actionSeq").value
      const maxId = this.getNewRectId("Action", this._dataList)
      let list = [];
      let ll = [];
      for (let i in e) {
        // console.log("map4RData", i, maxId)
        let pp = JSON.parse(po);
        let p = pp[e[i].id].split(" ");
        const children = e[i].transition.map((tran) => {
          return {
            targetId: `${item.actionId}-${tran.value}`,
            sourceId: `${item.actionId}-${tran.name.split(".")[0]}`,
            begin: "",
            end: "",
            lineId: this.getLineId(),
            condition: "",
            lineType: "line",
            // polyline: `${x1} ${y1} ${x2} ${y2}`,
            polyline: tran.polyline,
          }
        })
        let d = {
          // actionId: e[i].id,
          actionParentId: item.actionId,
          // actionId: `${e[i].type}${maxId + i * 1}`,
          actionId: `${item.actionId}-${e[i].id}`,
          actionOwnId: e[i].cpntId,
          actionType: e[i].type,
          actionName: e[i].conf.filter((item) => item.name == "actionDesc")[0]
            .value,
          actionX: item.actionX + p[0] * 1 + this.itemOptions.fourRTypeInnerItemOffsetX,
          actionY: item.actionY + p[1] * 1,
          originalActionX: p[0] * 1,
          originalActionY: p[1] * 1,
          actionPoint: "",
          color: e[i].color || "#333",
          actionCoverShow: false,
          conf: e[i].conf,
          resultFlg: e[i].resultFlg || "",
          paramList: e[i].paramList || [],
          stusCd: e[i].stusCd || [],
          compositeId: e[i].compositeId || "",
          children: children,
        };

        d.actionPoint =
          d.actionX +
          (p[2] * 1) / 2 +
          "," +
          d.actionY +
          "  " +
          d.actionX +
          "," +
          (d.actionY + (p[3] * 1) / 2) +
          "  " +
          (d.actionX + (p[2] * 1) / 2) +
          "," +
          (d.actionY + p[3] * 1) +
          "  " +
          (d.actionX + p[2] * 1) +
          "," +
          (d.actionY + (p[3] * 1) / 2);
        list.push(d);
      }
      this.$set(this.fourRDataMap, item.actionId, list)
      this.updateProcessMain();
      // this.markCurrentDate();
    },
    // 记录当前的画布数据
    markCurrentDate() {
      let { index, data } = this.stepDataRecord
      data[index] = {
        dataList: JSON.stringify(this.dataList),
        lineList: JSON.stringify(this.lineList)
      }
      this.stepDataRecord.index++
      if (data.length > this.stepDataRecord.index) data.length = this.stepDataRecord.index
    },
    //条件排列
    conditionString(e) {
      let d = "";
      let k = e.condition.condList;
      for (let i in k) {
        d =
          d +
          (i * 1 == 1 ? " " + filters.condAndOr(k[i].mtchMode) + " " : "") +
          k[i].sorcParaNm +
          filters.condType(k[i].condTyp) +
          k[i].trgtParaNm;
      }
      return d;
    },
    throttle,
    handleSwimlaneMousemove(item, event) {
      if (this.swimLaneWidth - event.offsetX <= 10 && !this.isRead) {
        this.changeWidthBtnY = event.offsetY
        this.changeSwinLaneSizeShow = true
      } else {
        this.changeSwinLaneSizeShow = false
      }
    },
    handleSwimlaneMouseleave(event) {
      if (event.offsetX >= this.swimLaneWidth -2) {
        this.changeSwinLaneSizeShow = false
      }
    },
    handleSwinLaneWidthChange() {
      // 鼠标移动事件监听
      document.onmousemove = throttle((ev) => {
        this.$emit("handleSwinLaneWidthChange", ev)
      });
      // 鼠标松开事件监听
      document.onmouseup = throttle((ev) => {
        document.onmousemove = null;
        this.changeSwinLaneSizeShow = false
      });
    },
    // 线上展示的文字
    getLineText(lineObj, showAll = false) {
      if (lineObj.sourceId && lineObj.sourceId.indexOf("judgeAction") > -1) {
        try {
          const judgeCpn = this.dataList.find(item => item.actionId == lineObj.sourceId)
          const paramList = JSON.parse((judgeCpn.conf.find(item => item.name == "paramList"))?.value)
          const item = paramList.find(item => item.targetId == lineObj.targetId)
          // let result = item ? `如果参数变量 ${item.paramCName} ${item.condTyp} ${item.paramValue}，则触发组件【${item.triggerCpnName}】` : ""
          let result = item ? `${item.apSource == "40" ? item.paramValue : item.paramCName} ${item.condTyp} ${item.otherApSource == "40" ? item.otherParamValue : item.otherParamCName}` : ""
          return showAll ? result : `${result && result.slice(0, 15)}${result && result.length > 15 ? "..." : ""}`
        } catch (error) {
          console.log(error)
          return ""
        }
      } else if (lineObj.sourceId && lineObj.sourceId.indexOf("sbsectAction") > -1) {
        return filters.relation(lineObj.condition.relation)
      } else {
        return ""
      }
      // let result = ""
      // if (this.pageType == "assetDesign" || this.pageType == "assetDev") {
      //     const sameSourceLines = this.lineList.filter(item => item.sourceId == lineObj.sourceId)
      //   if (sameSourceLines.length <= 1) {
      //     result = lineObj.condition.desc || ""
      //   } else {
      //     result = lineObj.condition.condPrit ? `[${lineObj.condition.condPrit}]${lineObj.condition.desc ?? ""}` : ""
      //   }
      // } else if (this.pageType == "cpnDesign") {
      //   result = (lineObj.condition.condList && lineObj.condition.condList[0] && lineObj.condition.condList[0].sorcParaNm) || ""
      // } else if (this.pageType == "domainDesign") {
      //   result = (lineObj.condition.condList && lineObj.condition.condList[0] && lineObj.condition.condList[0].sorcParaNm) || ""
      // } else {
      //   return result
      // }
      // return showAll ? result : `${result && result.slice(0, 10)}${result && result.length > 10 ? "..." : ""}`
    },
    // 鼠标移入线条文字时
    handleLineTextMouseOver(lineObj) {
      // this.lineList.find((line, index) => {
      //   if (line.lineId == lineObj.lineId) {
      //     lineObj.isFocus = true
      //     return this.$set(this.lineList, index, lineObj)
      //   }
      // })
    },
    // 鼠标移出线条文字时
    handleLineTextMouseLeave(lineObj) {
      this.lineList.find((line, index) => {
        if (line.lineId == lineObj.lineId) {
          delete lineObj.isFocus
          return this.$set(this.lineList, index, lineObj)
        }
      })
      // this.$forceUpdate();
    },
    getPolylineTextX(lineObj, oldX) {
      const source = this.dataList.find(item => item.actionId == lineObj.sourceId?.split("-")[0])
      const target = this.dataList.find(item => item.actionId == lineObj.targetId?.split("-")[0])
      if (source?.actionX && target?.actionX) {
        if (source.actionType == "sbsectAction") {
          const sourceFieldList = this.getSbsectFieldList(source)
          const targetFieldList = this.getSbsectFieldList(target)
          // const sourceIndex = sourceFieldList.findIndex(field => field.actionId == lineObj.sourceId)
          // const targetIndex = targetFieldList.findIndex(field => field.actionId == lineObj.targetId)
          // const { begin, end }  = source.children.find(child => child.sourceId == lineObj.sourceId)
          const begin = source.children?.find(child => child.sourceId == lineObj.sourceId)?.begin
          const end  = source.children?.find(child => child.sourceId == lineObj.sourceId)?.end
          const sourceFieldX = begin == "left" ? source.actionX : source.actionX + this.itemOptions.sbsectActionWidth
          // const sourceFieldY = begin == "left" ? processCore.getFieldLeftCircleY(sourceFieldList[sourceIndex], sourceIndex) : processCore.getFieldRightCircleY(sourceFieldList[sourceIndex], sourceIndex)
          const targetFieldX = end == "left" ? target.actionX : target.actionX + this.itemOptions.sbsectActionWidth
          // const targetFieldY = end == "left" ? processCore.getFieldLeftCircleY(targetFieldList[targetIndex], targetIndex) : processCore.getFieldRightCircleY(sourceFieldList[sourceIndex], sourceIndex)
          if (sourceFieldX < targetFieldX) {
            return targetFieldX - Math.abs(sourceFieldX - targetFieldX) / 2
          } else {
            return targetFieldX + Math.abs(sourceFieldX - targetFieldX) / 2
          }
        } else {
          if (source.actionX < target.actionX) {
            return target.actionX - Math.abs(source.actionX - target.actionX) / 2
          } else {
            return target.actionX + Math.abs(source.actionX - target.actionX) / 2
          }
        }
      } else {
        return 0
      }
      
    },
    getPolylineTextY(lineObj, oldY) {
      return oldY
    },
    handleLineTextMouseClick(item, event) {
      console.log("handleLineTextMouseClick")
      if (item.sourceId.indexOf("sbsectAction") > -1) {
        this.$emit("showEditEntityRelationDialog", item)
      } else {
        const target = this.dataList.find(data => data.actionId == item.sourceId)
        this.handleItemClick(target)
      }
    },
    // 处理线条优先级的变更，如果新值和其他线条的优先级相同，则互换
    handleCondPritChange(newCondPrit, oldCondPrit, lineObj) {
      const sameSourceLines = this.lineList.filter(item => item.sourceId == lineObj.sourceId)
      const line = sameSourceLines.find(item => item.condition.condPrit == newCondPrit && item.lineId != lineObj.lineId)
      if (line) line.condition.condPrit = oldCondPrit
      this.$forceUpdate()
    },
    // 把字符串的polyline转成数组形式
    getPolylineArray(polyline) {
      if (!polyline || polyline.length == 0) return
      const arr = polyline.split(" ")
      const pointArr = []
      // 去掉首尾的点
      for (let i = 2; i < arr.length - 2; i += 2) {
        pointArr.push({
          x: arr[i] * 1,
          y: arr[i + 1] * 1
        })
      }
      return pointArr
    },
    // 根据actionPoint获取规则组件（平行四边形）四个点的坐标字符串
    getRuleItemPoints(actionPoint) {
      const arr = actionPoint.split("  ")
      const pointArr = arr.map(item => {
        const a = item.split(",")
        return {x: a[0], y: a[1]}
      })
      pointArr[0].x = pointArr[0].x * 1 - 45 + ""
      pointArr[1].x = pointArr[1].x * 1 - 5 + ""
      pointArr[1].y = pointArr[1].y * 1 + 24 + ""
      pointArr[2].x = pointArr[2].x * 1 + 45 + ""
      pointArr[3].x = pointArr[3].x * 1 + 5 + ""
      pointArr[3].y = pointArr[3].y * 1 - 24 + ""
      const str = pointArr.reduce((prev, item) => {
         return `${prev}${item.x},${item.y} `
      }, "")
      return str
    },
    // 根据actionPoint获取输入输出组件 五个点的坐标字符串
    getInputOrOutputItemPoints(item, itemOptions) {
      const { actionX, actionY } = item
      const width = this.getItemWidth(item)
      const height = this.getItemHeight(item)
      return `${actionX},${actionY} ${actionX},${actionY + height} ${actionX + width - 20},${actionY + height} ${actionX + width},${actionY + height / 2} ${actionX + width - 20},${actionY}`
    },
    // 双击组件
    handleItemDouble(e) {
      clearTimeout(this.handleItemClick.timer)
      if (["4RAction", "loopAction", "asyncAction"].includes(e.actionType)) {
        console.log("双击了组件",e)
        const actionSeq = this.getConfItem("actionSeq", e.actionId).value
        if (!actionSeq || actionSeq.includes("位置序号")) return this.$message.error("请先设置组件的位置序号")
        this.$emit("handleActionChange",e)
        this.fourRDataMap = {}
      } else if (e.actionType == "decisionAction") {
        this.$emit("handleActionChange",e)
      }
    },
    // 获取conf配置项
    getConfItem(name, actionId) {
      const cpn = this.dataList.find(data => data.actionId == actionId)
      return cpn.conf.find(item => item.name == name) || {}
    },
    // 设置组件的序列号
    setActionSeq() {
      // 清空组件的序号
      this.dataList.forEach(data => {
        this.getConfItem("actionSeq", data.actionId).value = ""
      })
      // 设置input组件的序号为R0000
      const inputAction = this.dataList.find(item => item.actionType == "inputAction")
      let actionSeq = "R0000"
      inputAction.conf.find(item => item.name == "actionSeq").value = actionSeq
      let nextItem = this.getNextSettingItem(inputAction)
      while(nextItem) {
        actionSeq = this.actionSeqFormat(actionSeq.slice(1) * 1 + 1)
        this.getConfItem("actionSeq", nextItem.actionId).value = actionSeq
        if (this.containerTypeList.includes(nextItem.actionType)) {
          // 设置容器内部组件的ID
          const conf = this.getConfItem("subcomponent", nextItem.actionId)
          const subcomponent = JSON.parse((conf.value || "[]"))
          subcomponent.forEach((subItem, index) => {
            const actionSeqConf = this.getConfItem("actionSeq", subItem)
            const actionFrntSeqConf = this.getConfItem("actionFrntSeq", subItem)
            const actionPostSeqConf = this.getConfItem("actionPostSeq", subItem)
            actionSeqConf.value = actionFrntSeqConf.value = actionPostSeqConf.value = ""
            actionSeqConf.value = `${actionSeq}-${this.actionSeqFormat(index + 1)}`
            // if (index != 0) {
            //   actionFrntSeqConf.value = `${actionSeq}-${this.actionSeqFormat(index)}`
            // }
            // if (index != subcomponent.length - 1) {
            //   actionPostSeqConf.value = `${actionSeq}-${this.actionSeqFormat(index + 2)}`
            // }
            actionFrntSeqConf.value = this.actionSeqFormat(actionSeq.slice(1) * 1 - 1)
            actionPostSeqConf.value = this.actionSeqFormat(actionSeq.slice(1) * 1 + 1)
          })
        }
        nextItem = this.getNextSettingItem(nextItem)
      }
      // 设置组件的前序和后序ID
      this.dataList.forEach((data) => {
        const lineList = this.lineList.filter(line => line.targetId == data.actionId && this.getConfItem("actionSeq", line.sourceId).value)
        const actionFrntSeq = lineList.reduce((prev, item, index) => {
          return `${prev}${this.getConfItem("actionSeq", item.sourceId).value}${index == lineList.length - 1 ? "" : ","}`
        }, "")
        if (actionFrntSeq) {
          this.getConfItem("actionFrntSeq", data.actionId).value = actionFrntSeq
        }
        
        const _lineList = this.lineList.filter(line => line.sourceId == data.actionId && this.getConfItem("actionSeq", line.targetId).value)
        const actionPostSeq = _lineList.reduce((prev, item, index) => {
          return `${prev}${this.getConfItem("actionSeq", item.targetId).value}${index == _lineList.length - 1 ? "" : ","}`
        }, "")
        if (actionPostSeq) {
          this.getConfItem("actionPostSeq", data.actionId).value = actionPostSeq
        }
      })
    },
    // 下一个需要设置位置序号的组件
    getNextSettingItem(sourceItem) {
      const targetId = this.lineList.find(line => line.sourceId == sourceItem.actionId)?.targetId
      return this.dataList.find(data => data.actionId == targetId)
    },
    // 位置序号格式化 传1返R0001 传10返R0010
    actionSeqFormat(number, start = "R0000") {
      number = number + ""
      start = start.slice(0, start.length - number.length)
      return `${start}${number}`
    },
    sbsectActionOperate(operation, data) {
      if (this.isSbsectActionOperateDisabled(operation, data)) {
        if (operation == "save") {
          this.$message.error("请先进行数据库表设计，再保存")
        } else {
          return
        }
      } else {
        this.$emit("sbsectActionOperate", operation, data)
      }
    },
    // 分段组件的按钮是否禁用
    isSbsectActionOperateDisabled(type, item) {
      if (type == "split") {
        const merge = item.conf.find(config => config.name == "merge").value
        return JSON.parse(merge).length <= 1
      } else if (type == "save") {
        const entityCode = item.conf.find(config => config.name == "entityCode").value
        const entityName = item.conf.find(config => config.name == "entityName").value
        return !entityCode || !entityName
      } else if (type == "merge") {
        return this.dataList.some((data) => {
          const entityCode = data.conf.find(config => config.name == "entityCode").value
          const entityName = data.conf.find(config => config.name == "entityName").value
          return !entityCode || !entityName
        })
      } else {
        return false
      }
    },
    getUpCircleR(item, itemOptions, rate) {
      if (item.actionType == "fieldAction") {
        return 0
      } else {
        return itemOptions.circleR * rate
      }
    },
    getDownCircleR(item, itemOptions, rate) {
      if (item.actionType == "fieldAction") {
        return 0
      } else {
        return itemOptions.circleR * rate
      }
    },
    // 获取分段组件的高度
    getSbsectActionHeight(item = {}) {
      const fieldList = this.getSbsectFieldList(item)
      const l5ServiceList = this.getL5ServiceList(item)
      return 42 + fieldList.length * 21 + l5ServiceList.length * 21
    },
    // 是否展示分段组件的标签
    isShowSbsectActionTag(item) {
      return item.conf.find(config => config.name == 'status')?.value == 1
    },
    // 删除字段
    deleteField(item, field) {
      console.log("deleteField", field)
      let fieldList = this.getSbsectFieldList(item)
      fieldList = fieldList.filter(data => data.dictryNo != field.dictryNo)
      item.conf.find(config => config.name == "fieldList").value = JSON.stringify(fieldList)
      this.lineList = this.lineList.filter(line => line.sourceId != field.actionId)
    },
    async switch4RAction(item) {
      // console.log("switch4RAction", item)
      if (!item.actionDetailShow) {
        //获取组件流程图信息
        const params = {
          cpntPId: item.compositeId,
        };
        const res = await this.rpc.transactionDesign.getFlowdata(params);
        // this.fourRDataObj[item.actionId] = res
        this.$set(this.fourRDataObj, item.actionId, res)
        this.map4RData(res.flow, escape2Html(res.position), item)
        // 1.调整4R组件右下方其他组件的位置，调整边框actionPoint的位置及item的样式
        // 2.子流程组件的actionId调整（item.actionId-actionI）
        // 3.生成子流程组件间的连接线
        this.$nextTick(() => {
          const itemArea = {
            x: [item.actionX, item.actionX + this.getItemWidth(item)],
            y: [item.actionY, item.actionY + this.getItemHeight(item)],
          }
          this.dataList.forEach((data) => {
            const dataArea = {
              x: [data.actionX, data.actionX + this.getItemWidth(data)],
              y: [data.actionY, data.actionY + this.getItemHeight(data)],
            }
            if (this.isIntersection(dataArea, itemArea) && data.actionId != item.actionId) {
              data.actionX = data.actionX + (itemArea.x[1] - itemArea.x[0])
              data.actionY = data.actionY + (itemArea.y[1] - itemArea.y[0])
            }
          })
          const dataList = [...this.dataList, ...this.fourRDataMap[item.actionId]]
          this.getLineList(
            this.lineList,
            // this.dataList,
            dataList,
            this.getItemWidth(item),
            this.getItemHeight(item),
          );
        })
      } else {
        const itemArea = {
          x: [item.actionX, item.actionX + this.getItemWidth(item)],
          y: [item.actionY, item.actionY + this.getItemHeight(item)],
        }
        this.dataList.forEach((data) => {
          const dataArea = {
            x: [data.actionX - (itemArea.x[1] - itemArea.x[0]), data.actionX + this.getItemWidth(data) - (itemArea.x[1] - itemArea.x[0])],
            y: [data.actionY - (itemArea.y[1] - itemArea.y[0]), data.actionY + this.getItemHeight(data) - (itemArea.y[1] - itemArea.y[0])],
          }
          if (this.isIntersection(dataArea, itemArea) && data.actionId != item.actionId) {
            // 有碰撞重合的情况
            data.actionX = data.actionX - (itemArea.x[1] - itemArea.x[0])
            data.actionY = data.actionY - (itemArea.y[1] - itemArea.y[0])
          }
        })
        this.$delete(this.fourRDataObj, item.actionId)
        this.$delete(this.fourRDataMap, item.actionId)
        this.getLineList(
          this.lineList,
          this.dataList,
          this.getItemWidth(item),
          this.getItemHeight(item),
        );
      }
      this.$set(item, "actionDetailShow", !item.actionDetailShow)
    },
    // 添加组件进容器
    addItemToContainer(item, containerId) {
      console.log("addItemToContainer", item, containerId)
      // 删除相关的线
      this.lineList = this.lineList.filter(line => line.sourceId != item.actionId && line.targetId != item.actionId)
      const linesIdArray = this.lineList.map(item => item.lineId)
      this.dataList.forEach(item => {
        item.children = item.children.filter(child => linesIdArray.indexOf(child.lineId) > -1)
      })
      const container = this.dataList.find(item => item.actionId == containerId)
      const conf = this.getConfItem("subcomponent", containerId)
      const subcomponent = JSON.parse((conf.value || "[]"))
      subcomponent.push(item.actionId)
      conf.value = JSON.stringify([...new Set(subcomponent)])
      delete this.actionIdToWidth[container.actionId]
      // 设置item的位置
      setTimeout(() => {
        this.setContainerInnerItemPosition(container, subcomponent)
        this.setActionSeq()
        this.getLineList(
          this.lineList,
          this.dataList,
          this.getItemWidth(container),
          this.getItemHeight(container),
        );
        this.containerList.forEach((item) => item.isHover = false)
      }, 100)
    },
    // 设置容器组件的内部位置
    setContainerInnerItemPosition(container, subcomponent) {
      // console.log("setContainerInnerItemPosition", container, subcomponent)
      for (let i in subcomponent) {
        const item = this.dataList.find(data => data.actionId == subcomponent[i])
        item.actionX = container.actionX + (this.getItemWidth(item) + 20) * i + 20
        item.actionY = container.actionY + 20
      }
    },
    // 设置4R类组件的内部位置
    setFourRItemInnerItemPosition(item) {
      // console.log("setFourRItemInnerItemPosition", this.fourRDataMap[item.actionId])
      const dataList = this.fourRDataMap[item.actionId] || []
      dataList.forEach((data) => {
        data.actionX = data.originalActionX + item.actionX + this.itemOptions.fourRTypeInnerItemOffsetX
        data.actionY = data.originalActionY + item.actionY
      })

    },
    toApply(operation, args) {
      this[operation].apply(this, args)
    },
    moveOutFromContainer() {
      const container = this.containerList.find(container => {
        const conf = this.getConfItem("subcomponent", container.actionId)
        const subcomponent = JSON.parse((conf.value || "[]"))
        return subcomponent.includes(this.itemObj.actionId)
      })
      const _conf = this.getConfItem("subcomponent", container.actionId)
      const _subcomponent = JSON.parse((_conf.value || "[]")).filter(item => item != this.itemObj.actionId)
      _conf.value = JSON.stringify(_subcomponent)
      this.setContainerInnerItemPosition(container, _subcomponent)
      this.setActionSeq()
      this.itemObj.actionX = this.getRightCircleX(this.itemObj) + 30
      this.getLineList(
        this.lineList,
        this.dataList,
        this.getItemWidth(container),
        this.getItemHeight(container),
      );
      delete this.actionIdToWidth[container.actionId]
      this.isPopShow = false;
    },
    // 一键对齐
    oneKeyAlign() {
      const dataList = this.dataList.filter(data => {
        const actionSeq = this.getConfItem("actionSeq", data.actionId).value
        return actionSeq.includes("R")
      })
      // 根据连线起来的组件的位置序号排序
      dataList.sort((a, b) => {
        const actionSeqA = this.getConfItem("actionSeq", a.actionId).value
        const actionSeqB = this.getConfItem("actionSeq", b.actionId).value
        let actionSeqs = [actionSeqA, actionSeqB]
        actionSeqs = actionSeqs.map((item) => {
          if (item.includes("-")) {
            const arr = item.split("-")
            item = arr[0].slice(1) * 1 + arr[1].slice(1) * 0.0001
          } else {
            item = item.slice(1) * 1
          }
          return item
        })
        return actionSeqs[0] - actionSeqs[1];
      })
      const position = dataList.reduce((prev, data) => {
        if (data.actionX < prev.left) prev.left = data.actionX
        if (data.actionX > prev.right) prev.right = data.actionX
        return prev
      }, { left: dataList[0]?.actionX, right: dataList[0]?.actionX })
      // 存在容器类组件时，需要考虑中点X坐标的补偿量
      const compensationX = dataList.some(data => this.containerTypeList.includes(data.actionType)) ? 10 : 0
      const middleX = (position.left + position.right) / 2 + compensationX
      dataList.reduce((prev, item, index) => {
        if (this.subcomponentIdList.includes(item.actionId)) return prev
        if (["containerAction", "concurrentAction"].includes(item.actionType)) {
          const offetX = (this.getItemWidth(item) - prev[prev.length - 1].width) / 2
          item.actionX = middleX - offetX
          item.actionY = prev[prev.length - 1].actionY + prev[prev.length - 1].height + 20
          // 调整容器内子组件的位置
          const conf = this.getConfItem("subcomponent", item.actionId)
          const subcomponent = JSON.parse((conf.value || "[]"))
          this.setContainerInnerItemPosition(item, subcomponent)
        } else {
          item.actionX = middleX
        }
        if (index > 0) {
          item.actionY = prev[prev.length - 1].actionY + prev[prev.length - 1].height + 20
          prev.push({
            actionY: item.actionY,
            width: this.getItemWidth(item),
            height: this.getItemHeight(item),
          })
        }
        this.updataPolyline(
          item,
          this.dataList,
          this.getItemWidth(item),
          this.getItemHeight(item),
        );
        this.getLineList(
          this.lineList,
          this.dataList,
          this.getItemWidth(item),
          this.getItemHeight(item),
        );
        return prev
      }, [{
        actionY: dataList[0]?.actionY,
        width: this.getItemWidth(dataList[0]),
        height: this.getItemHeight(dataList[0]),
      }])
    },
  },
  watch: {
    dataObj(n, o) {
      this.mapData(n.flow, escape2Html(n.position));
    },
    swimlaneInfo: {
      handler(n, o) {
        this.svgOptions.width = n.width || processConf.svgOptions.width
        this.svgOptions.height = n.height || processConf.svgOptions.height
      },
      deep: true
    },
  },
  filters: {
    ...filters,
  },
};
</script>

<style lang="scss" scoped>
@import "@m/assets/css/editorMixin.scss";
.aop_tradecode_comps_process {
  position: relative;
  .process_svg_box {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .process_svg_main {
    width: 100%;
    height: 100%;
    font-family: $font_medium;
    user-select: none;
    .swimlane_name {
      @include fs16;
      text-align: center;
      line-height: 1;
      user-select: none;
      p {
        border-bottom: 1px solid #c2c2c2;
        height: 100%;
        line-height: 40px;
      }
    }
    .process_move_group {
      .hidden {
        display: none;
      }
    }
    .process_move:hover {
      cursor: move;
    }
    .process_pointer:hover {
      cursor: pointer;
    }
    .process_line:hover {
      cursor: pointer;
    }
    .process_line_circle {
      &:hover {
        cursor: crosshair;
      }
    }
    .process_line_circle_cap {
      opacity: 0.5;
      stroke-linecap: round;
      stroke-width: 24;
      animation: strokeWidth 0.2s linear 1;
    }
    .ordinary_text_wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.5em;
      line-height: 1;
      user-select: none;
      .content {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .top {
        margin-bottom: 3px;
      }
    }
    .process_rect_text {
      color: $base_black;
      font-size: 0.5em;
      line-height: 1;
      user-select: none;
      margin-bottom: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.white {
        color: $base_white;
      }
      &.ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.container {
        position: relative;
        top: 5px;
        left: 5px;
      }
      &.flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      &.h100 {
        height: 100%;
      }
    }
    .process_rect_tips {
      background-color: #fdf6ec;
      border-color: #faecd8;
      color: #e6a23c;
      font-size: 12px;
    }
    .process_rect_dev_tips {
      background-color: #36D542;
      border-color: #36D542;
      color: #fff;
      font-size: 12px;
      border-radius: 0 0 0 6px ;
      height: 16px;
      line-height: 16px;
    }
    .process_rect_database_tips {
      background-color: $theme_color;
      border-color: $theme_color;
      color: #fff;
      font-size: 12px;
      border-radius: 0 0 0 6px ;
      height: 16px;
      line-height: 16px;
      text-align: center;
    }
    .process_line_dash {
      &:hover {
        .dash {
          stroke-dasharray: 5, 5;
          animation: dashoffset 0.2s linear infinite;
        }
      }
    }
    .error_rect_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 2px solid #999;
      color: #fe4758;
    }
    .error_rect_code {
      // font-size: 0.1em;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .error_rect_msg {
      // font-size: 0.1em;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .sbsect_action_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 2px solid #999;
      color: #333;
      text-align: left;
      padding: 0 4px;
      display: flex;
      justify-content: space-between;
      .sbsect_name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .btn_area {
        .icon {
          cursor: pointer;
          &.disabled {
            color: #aaa;
            cursor: default;
          }
        }
      }
    }
    .sbsect_action_field_list {
      padding: 4px 0;
      border-bottom: 2px solid #999;
      min-height: 30px;
      .sbsect_action_field_list_item {
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding: 0 8px;
        .text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tag_area {
          .btn {
            cursor: pointer;
            color: $theme_color;
          }
          .info {
            background: #E6EFEB;
            color: #EF87DB;
          }
        }
      }
    }
    .sbsect_action_l5service_list {
      padding: 4px 0;
      border-bottom: 2px solid #999;
      min-height: 30px;
      .sbsect_action_l5service_list_item {
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding: 0 8px;
        .text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tag_area {
          .btn {
            cursor: pointer;
            color: $theme_color;
          }
        }
        .info {
          background: #E6EFEB;
          color: #EF87DB;
        }
      }
    }
    .spec_rect_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 2px solid #999;
    }
    .spec_rect_msg {
      // font-size: 0.1em;
      font-size: 12px;
    }

    .d_rect_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // font-size: 0.1em;
      font-size: 12px;
      .icon {
        cursor: pointer;
      }
    }
    .d_rect_code {
      // font-size: 0.1em;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 0 6px;
      border-radius: 6px;
      &.d5 {
        background: #f7ecc2;
      }
      &.d4 {
        background: #ff9104;
      }
      &.decision {
        background: #ff9104;
      }
      &.blue {
        background: #358AFF;
        color: #fff;
        height: 30px;
        line-height: 30px;
      }
      &.purple {
        background: #8080ff;
        color: #fff;
        height: 30px;
        line-height: 30px;
      }
      &.service {
        height: 40px;
        .text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .d_rect_msg {
      // font-size: 0.1em;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.mt5 {
        margin-top: 5px;
      }
    }

    @keyframes dashoffset {
      0% {
        stroke-dashoffset: 5;
      }
      50% {
        stroke-dashoffset: 0;
      }
      100% {
        stroke-dashoffset: -5;
      }
    }
    @keyframes strokeWidth {
      0% {
        stroke-width: 4;
      }
      50% {
        stroke-width: 16;
      }
      100% {
        stroke-width: 24;
      }
    }
  }
  .process_pop {
    position: absolute;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    font-size: 12px;
    color: $base_white;
    background-color: rgba(53, 138, 255, 0.9);
    padding: 10px 8px;
    box-shadow: $pri_br_color 0px 0px 10px;
    &.hidden {
      display: none;
    }
    .process_del {
      width: 50px;
      cursor: pointer;
      p {
        text-align: center;
        &.btn_item {
          margin-bottom: 10px;
        }
      }
    }
  }
  .process_pop_edit {
    position: absolute;
    border: 1px solid $pri_br_color;
    border-radius: $theme_radius;
    font-size: 12px;
    color: $base_white;
    background-color: rgba(53, 138, 255, 0.9);
    padding: 10px 8px;
    box-shadow: $pri_br_color 0px 0px 10px;
    .process_del {
      width: 50px;
      cursor: pointer;
      p {
        text-align: center;
        &.btn_item {
          margin-bottom: 10px;
        }
      }
    }
  }
  .right_box {
    line-height: 32px;
    .test_record_icon {
      width: 20px;
      height: 20px;
      vertical-align: sub;
    }
    .status {
      text-align: center;
      height: 24px;
      line-height: 24px;
      padding: 0 4px;
      &.fail {
        background: #ffeaec;
        color: $danger_color;
      }
      &.success {
        background: #f2f8ff;
        color: $theme_color;
      }
    }
  }
  .used_action {
    // width: 200px;
    // height: 200px;
    position: fixed;
    top: 120px;
    right: 315px;
    // border: 1px solid #ccc;
    // box-shadow: #e7e7e7 0 0 25px;
    // background: rgba(255, 255, 255, 0.5);
  }
}
</style>
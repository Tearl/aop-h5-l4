/**
 * 精准连线相交计算工具类
 * 负责计算连线与节点边框的相交位置
 */

export class IntersectionCalculator {
  
  /**
   * 📐 计算连线与目标节点边框的相交位置
   * @param {Object} sourcePoint - 源点坐标 {x, y}
   * @param {Object} mousePoint - 鼠标坐标 {x, y}
   * @param {Object} targetNode - 目标节点
   * @returns {Object} 相交点坐标 {x, y, edge}
   */
  static calculateLineIntersectionPoint(sourcePoint, mousePoint, targetNode) {
    try {
      // 🚀 使用圆半径算法（为未来不规则图形做准备）
      return this.findNearestPointOnBorder(mousePoint, targetNode);
    } catch (error) {
      console.error('❌ 计算连线相交点失败:', error);
      // 返回一个默认的备选位置
      const bbox = targetNode.getBBox();
      return { x: bbox.x, y: bbox.y + bbox.height / 2, edge: 'left' }; // 左边中点
    }
  }

  /**
   * 🆕 边界效果：判断点是否在节点内部
   * @param {Object} point - 待判断的点 {x, y}
   * @param {Object} bbox - 节点边界框 {x, y, width, height}
   * @returns {boolean} 是否在节点内部
   */
  static isPointInsideNode(point, bbox) {
    return point.x >= bbox.x && 
           point.x <= bbox.x + bbox.width &&
           point.y >= bbox.y && 
           point.y <= bbox.y + bbox.height;
  }

  /**
   * 🆕 边界效果：将节点内部点映射到最近的边框点
   * @param {Object} mousePoint - 鼠标位置 {x, y}
   * @param {Object} bbox - 节点边界框 {x, y, width, height}
   * @returns {Object} 边框映射点 {x, y, edge, method}
   */
  static mapToNearestBorderPoint(mousePoint, bbox) {
    try {
      // 计算到四条边的距离
      const distances = {
        left: mousePoint.x - bbox.x,
        right: (bbox.x + bbox.width) - mousePoint.x,
        top: mousePoint.y - bbox.y,
        bottom: (bbox.y + bbox.height) - mousePoint.y
      };
      
      // 找到距离最短的边
      const minDistance = Math.min(...Object.values(distances));
      
      let result;
      if (distances.left === minDistance) {
        result = { x: bbox.x, y: mousePoint.y, edge: 'left' };
      } else if (distances.right === minDistance) {
        result = { x: bbox.x + bbox.width, y: mousePoint.y, edge: 'right' };
      } else if (distances.top === minDistance) {
        result = { x: mousePoint.x, y: bbox.y, edge: 'top' };
      } else {
        result = { x: mousePoint.x, y: bbox.y + bbox.height, edge: 'bottom' };
      }
      
      return {
        ...result,
        method: 'border-attachment'
      };
    } catch (error) {
      console.error('❌ 边框映射计算失败:', error);
      // 返回安全的默认位置
      return { x: bbox.x, y: bbox.y + bbox.height / 2, edge: 'left', method: 'error' };
    }
  }

  /**
   * 🆕 边界效果：计算边框吸附点（主要入口方法）
   * @param {Object} mousePoint - 鼠标位置 {x, y}
   * @param {Object} targetNode - 目标节点
   * @param {Object} options - 配置选项
   * @param {boolean} options.allowInternalConnection - 是否允许内部连接
   * @returns {Object} 边框吸附点 {x, y, edge, method}
   */
  static calculateBorderAttachmentPoint(mousePoint, targetNode, options = {}) {
    try {
      const bbox = targetNode.getBBox();
      const isInsideNode = this.isPointInsideNode(mousePoint, bbox);
      
      if (isInsideNode && !options.allowInternalConnection) {
        // 鼠标在节点内部时，强制映射到边框
        return this.mapToNearestBorderPoint(mousePoint, bbox);
      }
      
      // 鼠标在节点外部时，使用现有逻辑
      return this.findNearestPointOnBorder(mousePoint, targetNode);
    } catch (error) {
      console.error('❌ 边框吸附计算失败:', error);
      // 出错时回退到原有逻辑
      return this.findNearestPointOnBorder(mousePoint, targetNode);
    }
  }

  /**
   * 🚀 优化的二分查找圆半径算法 - 找到边框上最近的点
   * @param {Object} mousePoint - 鼠标位置 {x, y}
   * @param {Object} targetNode - 目标节点
   * @returns {Object} 最近的边框点 {x, y, edge}
   */
  static findNearestPointOnBorder(mousePoint, targetNode) {
    try {
      const bbox = targetNode.getBBox();
      const nodeRect = {
        left: bbox.x,
        top: bbox.y,
        right: bbox.x + bbox.width,
        bottom: bbox.y + bbox.height
      };

      // 预估最小可能半径（鼠标到矩形的理论最短距离）
      const minRadius = Math.max(0, Math.min(
        Math.abs(mousePoint.x - nodeRect.left),
        Math.abs(mousePoint.x - nodeRect.right),
        Math.abs(mousePoint.y - nodeRect.top),
        Math.abs(mousePoint.y - nodeRect.bottom)
      ));

      const maxRadius = Math.max(bbox.width, bbox.height) * 2;
      
      // 二分查找最小有效半径
      let left = Math.max(0.5, minRadius * 0.8); // 略小于理论值确保不错过
      let right = maxRadius;
      let bestResult = null;

      while (right - left > 0.5) {
        const mid = (left + right) / 2;
        const intersections = this.findCircleRectIntersections(mousePoint, mid, nodeRect);
        
        if (intersections.length > 0) {
          // 找到相交点，尝试更小的半径
          bestResult = {
            intersections,
            radius: mid
          };
          right = mid;
        } else {
          // 没找到，增大半径
          left = mid;
        }
      }

      if (bestResult) {
        const nearestPoint = bestResult.intersections.reduce((nearest, current) => {
          const nearestDist = this.calculateDistance(mousePoint, nearest);
          const currentDist = this.calculateDistance(mousePoint, current);
          return currentDist < nearestDist ? current : nearest;
        });

        return {
          ...nearestPoint,
          method: 'circle-optimized'
        };
      }

      // 备选方案：使用最短距离算法
      return this.findNearestPointOnBorder_Fallback(mousePoint, targetNode);
    } catch (error) {
      console.error('❌ 圆半径算法失败:', error);
      return this.findNearestPointOnBorder_Fallback(mousePoint, targetNode);
    }
  }

  /**
   * 🎯 备选最短距离算法
   * @param {Object} mousePoint - 鼠标位置 {x, y}
   * @param {Object} targetNode - 目标节点
   * @returns {Object} 最近的边框点 {x, y, edge}
   */
  static findNearestPointOnBorder_Fallback(mousePoint, targetNode) {
    try {
      const bbox = targetNode.getBBox();
      const nodeRect = {
        left: bbox.x,
        top: bbox.y,
        right: bbox.x + bbox.width,
        bottom: bbox.y + bbox.height
      };

      // 计算鼠标到四条边的最短距离投影点
      const projections = [
        // 左边
        {
          x: nodeRect.left,
          y: Math.max(nodeRect.top, Math.min(nodeRect.bottom, mousePoint.y)),
          edge: 'left'
        },
        // 右边
        {
          x: nodeRect.right,
          y: Math.max(nodeRect.top, Math.min(nodeRect.bottom, mousePoint.y)),
          edge: 'right'
        },
        // 上边
        {
          x: Math.max(nodeRect.left, Math.min(nodeRect.right, mousePoint.x)),
          y: nodeRect.top,
          edge: 'top'
        },
        // 下边
        {
          x: Math.max(nodeRect.left, Math.min(nodeRect.right, mousePoint.x)),
          y: nodeRect.bottom,
          edge: 'bottom'
        }
      ];

      // 找到距离最短的投影点
      let nearestPoint = projections[0];
      let minDistance = this.calculateDistance(mousePoint, nearestPoint);

      for (let i = 1; i < projections.length; i++) {
        const distance = this.calculateDistance(mousePoint, projections[i]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = projections[i];
        }
      }

      return {
        ...nearestPoint,
        method: 'distance-fallback'
      };
    } catch (error) {
      console.error('❌ 最短距离算法失败:', error);
      const bbox = targetNode.getBBox();
      return { x: bbox.x, y: bbox.y + bbox.height / 2, edge: 'left', method: 'error' };
    }
  }

  /**
   * 🔍 找到圆与矩形的相交点
   * @param {Object} center - 圆心 {x, y}
   * @param {number} radius - 半径
   * @param {Object} rect - 矩形 {left, top, right, bottom}
   * @returns {Array} 相交点数组
   */
  static findCircleRectIntersections(center, radius, rect) {
    const intersections = [];

    // 检查四条边
    const edges = [
      { x1: rect.left, y1: rect.top, x2: rect.left, y2: rect.bottom, edge: 'left' },
      { x1: rect.right, y1: rect.top, x2: rect.right, y2: rect.bottom, edge: 'right' },
      { x1: rect.left, y1: rect.top, x2: rect.right, y2: rect.top, edge: 'top' },
      { x1: rect.left, y1: rect.bottom, x2: rect.right, y2: rect.bottom, edge: 'bottom' }
    ];

    // console.log(`🔍 检查圆心(${Math.round(center.x)}, ${Math.round(center.y)})半径${Math.round(radius)}与矩形的相交:`);

    edges.forEach(edge => {
      const points = this.findCircleLineIntersections(center, radius, edge);
      if (points.length > 0) {
        // console.log(`  ${edge.edge}边找到${points.length}个相交点:`, points);
      }
      intersections.push(...points);
    });

    return intersections;
  }

  /**
   * 🔍 找到圆与线段的相交点
   * @param {Object} center - 圆心 {x, y}
   * @param {number} radius - 半径
   * @param {Object} line - 线段 {x1, y1, x2, y2, edge}
   * @returns {Array} 相交点数组
   */
  static findCircleLineIntersections(center, radius, line) {
    const { x1, y1, x2, y2, edge } = line;
    const intersections = [];

    // 垂直线段
    if (x1 === x2) {
      const dx = center.x - x1;
      if (Math.abs(dx) <= radius) {
        const dy = Math.sqrt(radius * radius - dx * dx);
        const y_intersect1 = center.y + dy;
        const y_intersect2 = center.y - dy;

        if (y_intersect1 >= Math.min(y1, y2) && y_intersect1 <= Math.max(y1, y2)) {
          intersections.push({ x: x1, y: y_intersect1, edge });
        }
        if (y_intersect2 >= Math.min(y1, y2) && y_intersect2 <= Math.max(y1, y2)) {
          intersections.push({ x: x1, y: y_intersect2, edge });
        }
      }
    }
    // 水平线段
    else if (y1 === y2) {
      const dy = center.y - y1;
      if (Math.abs(dy) <= radius) {
        const dx = Math.sqrt(radius * radius - dy * dy);
        const x_intersect1 = center.x + dx;
        const x_intersect2 = center.x - dx;

        if (x_intersect1 >= Math.min(x1, x2) && x_intersect1 <= Math.max(x1, x2)) {
          intersections.push({ x: x_intersect1, y: y1, edge });
        }
        if (x_intersect2 >= Math.min(x1, x2) && x_intersect2 <= Math.max(x1, x2)) {
          intersections.push({ x: x_intersect2, y: y1, edge });
        }
      }
    }

    return intersections;
  }

  /**
   * 📏 计算两点间距离
   * @param {Object} point1 - 点1 {x, y}
   * @param {Object} point2 - 点2 {x, y}
   * @returns {number} 距离
   */
  static calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default IntersectionCalculator;


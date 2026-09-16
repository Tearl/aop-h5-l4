/**
 * 位置计算工具类
 * 负责计算各种位置坐标
 */

export class PositionCalculator {
  
  /**
   * 📍 获取源连接桩的位置
   * @param {Object} sourceNode - 源节点
   * @param {string} sourcePortId - 源连接桩ID
   * @returns {Object} 连接桩位置 {x, y}
   */
  static getSourcePortPosition(sourceNode, sourcePortId) {
    try {
      if (!sourceNode || !sourcePortId) {
        console.error('❌ 获取源连接桩位置失败：缺少必要参数');
        return { x: 0, y: 0 };
      }

      // 获取节点的边界框
      const bbox = sourceNode.getBBox();
      
      // 根据端口ID确定位置
      // 假设端口ID格式为: top-1, right-1, bottom-1, left-1
      if (sourcePortId.includes('top')) {
        return { x: bbox.x + bbox.width / 2, y: bbox.y };
      } else if (sourcePortId.includes('right')) {
        return { x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2 };
      } else if (sourcePortId.includes('bottom')) {
        return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height };
      } else if (sourcePortId.includes('left')) {
        return { x: bbox.x, y: bbox.y + bbox.height / 2 };
      }

      // 默认返回节点中心
      console.warn('⚠️ 未知的端口ID格式，返回节点中心:', sourcePortId);
      return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    } catch (error) {
      console.error('❌ 获取源连接桩位置失败:', error);
      return { x: 0, y: 0 };
    }
  }

  /**
   * 🖱️ 获取鼠标在画布中的坐标
   * @param {Event} mouseEvent - 鼠标事件
   * @param {HTMLElement} container - 画布容器
   * @returns {Object} 鼠标坐标 {x, y}
   */
  static getMousePosition(mouseEvent, container) {
    try {
      // 🆕 增强的参数验证
      if (!mouseEvent) {
        throw new Error('鼠标事件对象为空');
      }
      
      if (mouseEvent.clientX === undefined || mouseEvent.clientY === undefined) {
        throw new Error('鼠标事件对象缺少clientX或clientY属性');
      }
      
      if (!container) {
        throw new Error('容器对象为空');
      }
      
      const containerRect = container.getBoundingClientRect();
      
      // 计算鼠标在容器内的相对坐标
      const x = mouseEvent.clientX - containerRect.left;
      const y = mouseEvent.clientY - containerRect.top;

      return { x, y };
    } catch (error) {
      console.error('❌ 获取鼠标位置失败:', {
        error: error.message,
        mouseEvent: mouseEvent ? '存在' : '不存在',
        clientX: mouseEvent?.clientX,
        clientY: mouseEvent?.clientY,
        container: container ? '存在' : '不存在'
      });
      return { x: 0, y: 0 };
    }
  }

  /**
   * 📐 计算临时端口在节点上的相对位置
   * @param {Object} intersectionPoint - 相交点 {x, y, edge}
   * @param {Object} nodeRect - 节点矩形 {left, top, right, bottom}
   * @returns {Object} 端口位置信息 {x, y, position}
   */
  static calculatePortPosition(intersectionPoint, nodeRect) {
    try {
      const { x, y, edge } = intersectionPoint;
      
      // 计算相对位置（0-1之间的数值，X6需要这种格式）
      const relativeX = (x - nodeRect.left) / (nodeRect.right - nodeRect.left);
      const relativeY = (y - nodeRect.top) / (nodeRect.bottom - nodeRect.top);
      
      // 根据相交边确定端口位置
      switch (edge) {
        case 'top':
          return {
            x: Math.max(0, Math.min(1, relativeX)), // 限制在0-1范围内
            y: 0,
            position: 'top'
          };
        case 'bottom':
          return {
            x: Math.max(0, Math.min(1, relativeX)),
            y: 1,
            position: 'bottom'
          };
        case 'left':
          return {
            x: 0,
            y: Math.max(0, Math.min(1, relativeY)),
            position: 'left'
          };
        case 'right':
          return {
            x: 1,
            y: Math.max(0, Math.min(1, relativeY)),
            position: 'right'
          };
        default:
          console.warn('⚠️ 未知的边类型，使用默认位置');
          return {
            x: 0.5,
            y: 0.5,
            position: 'center'
          };
      }
    } catch (error) {
      console.error('❌ 计算端口位置失败:', error);
      return {
        x: 0.5,
        y: 0.5,
        position: 'center'
      };
    }
  }
}

export default PositionCalculator;



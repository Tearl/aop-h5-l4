/**
 * 测试辅助工具类
 * 负责测试和可视化功能
 */

export class TestHelper {
  
  /**
   * 🧪 测试相交计算功能
   * @param {Object} graph - X6图形实例
   * @param {Function} calculateIntersection - 相交计算函数
   */
  static testIntersectionCalculation(graph, calculateIntersection) {
    console.log('🧪 开始测试相交计算功能...');
    
    // 模拟测试数据
    const sourcePoint = { x: 100, y: 120 }; // 左边节点右侧端口
    const mousePoint = { x: 250, y: 180 }; // 鼠标在右边节点内
    const targetNode = graph.getNodes()[1]; // 假设第二个节点是目标

    if (!targetNode) {
      console.warn('⚠️ 没有找到目标节点进行测试');
      return;
    }

    // 计算相交点
    const intersectionPoint = calculateIntersection(sourcePoint, mousePoint, targetNode);
    
    console.log('🧪 测试结果:', {
      sourcePoint,
      mousePoint,
      intersectionPoint,
      targetNodeId: targetNode.id
    });

    // 在目标节点上标记相交点（用于可视化验证）
    if (intersectionPoint) {
      this.visualizeIntersectionPoint(intersectionPoint, graph.container);
    }
  }

  /**
   * 🎨 可视化相交点（仅用于测试）
   * @param {Object} point - 相交点 {x, y}
   * @param {HTMLElement} container - 容器元素
   */
  static visualizeIntersectionPoint(point, container) {
    try {
      // 创建一个临时的可视化标记
      const marker = document.createElement('div');
      marker.id = `intersection-marker-${Date.now()}`;
      marker.style.cssText = `
        position: absolute;
        left: ${point.x - 5}px;
        top: ${point.y - 5}px;
        width: 10px;
        height: 10px;
        background: red;
        border-radius: 50%;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
      `;
      
      container.appendChild(marker);
      
      // 3秒后自动移除标记
      setTimeout(() => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      }, 3000);
      
      console.log('🎨 相交点可视化标记已添加');
    } catch (error) {
      console.error('❌ 可视化相交点失败:', error);
    }
  }

  /**
   * 🎨 可视化连线路径（用于调试）
   * @param {Object} sourcePoint - 源点
   * @param {Object} mousePoint - 目标点
   * @param {HTMLElement} container - 容器元素
   */
  static visualizeConnectionLine(sourcePoint, mousePoint, container) {
    try {
      // 创建SVG线条来显示连接路径
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      const line = document.createElementNS(svgNS, "line");
      
      svg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 998;
      `;
      
      line.setAttribute("x1", sourcePoint.x);
      line.setAttribute("y1", sourcePoint.y);
      line.setAttribute("x2", mousePoint.x);
      line.setAttribute("y2", mousePoint.y);
      line.setAttribute("stroke", "blue");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "5,5");
      
      svg.appendChild(line);
      container.appendChild(svg);
      
      // 2秒后自动移除
      setTimeout(() => {
        if (svg.parentNode) {
          svg.parentNode.removeChild(svg);
        }
      }, 2000);
      
      console.log('🎨 连接线可视化已添加');
    } catch (error) {
      console.error('❌ 可视化连接线失败:', error);
    }
  }

  /**
   * 📊 性能测试
   * @param {Function} testFunction - 要测试的函数
   * @param {Array} testData - 测试数据
   * @param {number} iterations - 迭代次数
   */
  static performanceTest(testFunction, testData, iterations = 1000) {
    console.log(`📊 开始性能测试，迭代 ${iterations} 次...`);
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      testFunction(...testData);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    
    console.log('📊 性能测试结果:', {
      总耗时: `${totalTime.toFixed(2)}ms`,
      平均耗时: `${avgTime.toFixed(4)}ms`,
      每秒操作数: `${(1000 / avgTime).toFixed(0)} ops/sec`
    });
    
    return {
      totalTime,
      avgTime,
      opsPerSecond: 1000 / avgTime
    };
  }
}

export default TestHelper;



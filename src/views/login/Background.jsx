import React, { useRef, useEffect } from 'react';
import './Background.css'; // 样式文件


const Background = ({ 
  imageUrl, 
  blurStrength = 10, 
  clearSize = 200,
  children 
}) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const animationRef = useRef(null);

  // 处理鼠标移动
  const handleMouseMove = (e) => {
    if (!containerRef.current || !overlayRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => {
      overlayRef.current.style.setProperty('--mouse-x', `${x}px`);
      overlayRef.current.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  // 添加/移除事件监听器
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="glass-container"
      style={{
        '--blur-strength': `${blurStrength}px`,
        '--clear-size': `${clearSize}px`
      }}
    >
      {/* 背景图片层 */}
      <div 
        className="glass-background" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* 毛玻璃覆盖层 */}
      <div ref={overlayRef} className="glass-overlay" />
      
      {/* 插槽内容 - 会显示在毛玻璃层上方 */}
      <div className="glass-content">
        {children}
      </div>
    </div>
  );
};

export default Background
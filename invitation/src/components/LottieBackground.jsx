// LottieBackground.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieBackground = ({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  className = "",
  style = {},
  rotateOnMobile = false // 모바일에서 회전 여부
}) => {
  const containerRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    // 기존 애니메이션 정리
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // 새 애니메이션 로드
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: loop,
      autoplay: autoplay,
      animationData: animationData
    });

    // SVG 요소에 스타일 적용 (꽉 차게)
    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.objectFit = 'cover';
      svg.style.display = 'block';
      svg.style.margin = '0';
      svg.style.padding = '0';
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay]);

  // 회전 시 화면을 꽉 채우기 위한 스타일
  const getRotatedStyle = () => {
    if (!rotateOnMobile) return {};
    
    return {
      // 모바일에서 회전 시 더 큰 크기로 설정하여 꽉 채우기
      width: '100vh', // 높이를 너비로
      height: '100vw', // 너비를 높이로
      transform: 'rotate(90deg)',
      transformOrigin: 'center',
      // lg 이상에서는 원래대로
      '@media (min-width: 1024px)': {
        width: '100vw',
        height: '100vh',
        transform: 'rotate(0deg)'
      }
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`${rotateOnMobile ? 'lg:rotate-0' : ''} ${className}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: rotateOnMobile 
          ? 'translate(-50%, -50%)' 
          : 'translate(-50%, -50%) rotate(90deg)',
        width: rotateOnMobile ? '100vw' : '100vh',
        height: rotateOnMobile ? '100vh' : '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 0,
        ...style
      }}
    />
  );
};

export default LottieBackground;
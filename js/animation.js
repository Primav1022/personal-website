// 这里可以添加更多自定义动画
const animations = {
    fadeIn: (element, delay = 0) => {
        anime({
            targets: element,
            opacity: [0, 1],
            duration: 1000,
            delay: delay,
            easing: 'easeInOutQuad'
        });
    },
    
    slideIn: (element, direction = 'left', delay = 0) => {
        const x = direction === 'left' ? [-100, 0] : [100, 0];
        anime({
            targets: element,
            translateX: x,
            opacity: [0, 1],
            duration: 1000,
            delay: delay,
            easing: 'easeOutExpo'
        });
    }
};

// 导出动画函数供其他文件使用
window.siteAnimations = animations; 
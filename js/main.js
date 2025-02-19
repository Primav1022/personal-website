document.addEventListener('DOMContentLoaded', function() {
    // 设置加载动画时间
    const tweenTime = 3; // 秒
    
    // 创建主时间轴
    const master = gsap.timeline({delay: tweenTime-2});
    master.eventCallback('onComplete', function() {
        progressBar(); // 初始化进度条
    });

    // 使用 imagesLoaded 检查所有图片加载完成
    imagesLoaded(document.body, function() {
        preloader(); // 初始化预加载器
    });

    // 预加载动画
    function preloader() {
        const tl = gsap.timeline({paused: true});
        
        // 设置初始状态
        tl.set('.preloader', {
            opacity: 1
        });
        
        // 添加动画序列
        tl.to('.preloader', {
            duration: 0.3,
            delay: 1,
            opacity: 0,
            zIndex: -1,
            ease: 'power3.inOut'
        });
        
        tl.play();
    }

    // 添加 Sticky Sidebar 功能
    function stickySidebar() {
        const containerEl = document.querySelector('.left-sidebar');
        const containerRect = containerEl.getBoundingClientRect();
        const headerHeight = 100; // 导航栏高度
        const footerEl = document.querySelector('footer'); // 如果有页脚的话
        
        let lastScrollTop = 0;
        let ticking = false;

        function updateSticky() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const direction = scrollTop > lastScrollTop ? 'down' : 'up';
            
            if (window.innerWidth > 768) { // 只在桌面版本启用
                const containerHeight = containerEl.offsetHeight;
                const windowHeight = window.innerHeight;
                const sidebarFits = containerHeight <= windowHeight;
                
                if (sidebarFits) {
                    // 如果侧边栏高度小于窗口高度，简单固定定位
                    if (scrollTop >= headerHeight) {
                        gsap.to(containerEl, {
                            duration: 0.3,
                            y: headerHeight - containerRect.top,
                            ease: 'power2.out'
                        });
                    } else {
                        gsap.to(containerEl, {
                            duration: 0.3,
                            y: 0,
                            ease: 'power2.out'
                        });
                    }
                } else {
                    // 如果侧边栏高度大于窗口高度，需要处理滚动
                    const maxScroll = containerHeight - windowHeight;
                    
                    if (direction === 'down' && scrollTop > lastScrollTop) {
                        // 向下滚动
                        gsap.to(containerEl, {
                            duration: 0.3,
                            y: Math.max(-maxScroll, headerHeight - containerRect.top - scrollTop),
                            ease: 'power2.out'
                        });
                    } else if (direction === 'up' && scrollTop < lastScrollTop) {
                        // 向上滚动
                        gsap.to(containerEl, {
                            duration: 0.3,
                            y: Math.min(0, headerHeight - containerRect.top),
                            ease: 'power2.out'
                        });
                    }
                }
            } else {
                // 移动端重置位置
                gsap.set(containerEl, {y: 0});
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        }

        // 监听滚动事件
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateSticky();
                });
                ticking = true;
            }
        });

        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateSticky();
                });
                ticking = true;
            }
        });

        // 初始化位置
        updateSticky();
    }

    // 进度条动画
    function progressBar() {
        // 初始化页面动画
        initializeAnimations();
        
        // 触发个人介绍区域的动画
        const profilePhoto = document.querySelector('.profile-photo');
        const profileIntro = document.querySelector('.profile-intro');
        
        // 照片从左侧滑入
        siteAnimations.slideIn(profilePhoto, 'left', 300);
        
        // 介绍文字淡入
        siteAnimations.fadeIn(profileIntro, 600);
        
        // 初始化 sticky sidebar
        stickySidebar();
    }
});

function initializeAnimations() {
    // 使用 GSAP 添加导航栏动画
    gsap.from('.main-nav', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    // 使用 Anime.js 添加内容区域动画
    anime({
        targets: '.content',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo'
    });
}

// 动画相关函数
const siteAnimations = {
    slideIn: function(element, direction, delay) {
        anime({
            targets: element,
            translateX: direction === 'left' ? [-100, 0] : [100, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: delay,
            easing: 'easeOutExpo'
        });
    },
    
    fadeIn: function(element, delay) {
        anime({
            targets: element,
            opacity: [0, 1],
            duration: 1000,
            delay: delay,
            easing: 'easeOutExpo'
        });
    }
}; 
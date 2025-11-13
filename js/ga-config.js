// Google Analytics 配置
// 请将下面的 G-XXXXXXXXXX 替换为你的 Google Analytics Measurement ID

const GA_MEASUREMENT_ID = 'G-1W3ERG64BN'; // Google Analytics Measurement ID

// 初始化 Google Analytics
if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Google Analytics 4 (gtag.js)
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // 加载 gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // 添加 gtag 函数到 window
    window.gtag = gtag;
    
    console.log('✅ Google Analytics 已加载 - Measurement ID:', GA_MEASUREMENT_ID);
} else {
    console.warn('⚠️ 请设置 Google Analytics Measurement ID（在 js/ga-config.js 文件中）');
}


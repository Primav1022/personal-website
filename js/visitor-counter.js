// 访客计数器 - 仅统计真实总访问量
class VisitorCounter {
    constructor() {
        this.apiUrl = 'https://api.countapi.xyz';
        this.siteName = 'primav-website';
        this.init();
    }

    async init() {
        try {
            // 仅获取总访问量
            await this.updateTotalVisits();
        } catch (error) {
            console.error('访客统计初始化失败:', error);
            this.showFallbackNumbers();
        }
    }

    async updateTotalVisits() {
        try {
            // 使用免费的 countapi 服务
            const response = await fetch(`${this.apiUrl}/hit/${this.siteName}/visits`);
            const data = await response.json();
            
            if (data.value) {
                document.getElementById('total-visits').textContent = this.formatNumber(data.value);
            }
        } catch (error) {
            console.error('获取总访问量失败:', error);
            // 使用本地存储作为备选方案
            this.updateLocalVisits();
        }
    }

    updateLocalVisits() {
        let visits = localStorage.getItem('site-visits') || '0';
        visits = parseInt(visits) + 1;
        localStorage.setItem('site-visits', visits.toString());
        document.getElementById('total-visits').textContent = this.formatNumber(visits);
    }



    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showFallbackNumbers() {
        // 如果API失败，使用本地存储的访问量
        this.updateLocalVisits();
    }
}

// 页面加载完成后初始化访客计数器
document.addEventListener('DOMContentLoaded', function() {
    new VisitorCounter();
});


// 访客计数器 - 仅统计真实总访问量
class VisitorCounter {
    constructor(shouldCount = true) {
        this.apiUrl = 'https://api.countapi.xyz';
        this.siteName = 'primav-website';
        this.shouldCount = shouldCount;
        if (shouldCount) {
            this.init();
        }
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
                const element = document.getElementById('total-visits');
                if (element) {
                    element.textContent = this.formatNumber(data.value);
                }
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
        const element = document.getElementById('total-visits');
        if (element) {
            element.textContent = this.formatNumber(visits);
        }
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

    // 获取统计数据（不增加计数）- 用于统计页面
    async getStats() {
        try {
            // 获取总访问量（不增加计数）
            const response = await fetch(`${this.apiUrl}/get/${this.siteName}/visits`);
            const data = await response.json();
            
            return {
                totalVisits: data.value || 0,
                source: 'api'
            };
        } catch (error) {
            console.error('获取统计数据失败:', error);
            // 使用本地存储作为备选方案
            const localVisits = localStorage.getItem('site-visits') || '0';
            return {
                totalVisits: parseInt(localVisits),
                source: 'localStorage'
            };
        }
    }
}

// 页面加载完成后初始化访客计数器
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否是统计页面
    if (document.getElementById('stats-container')) {
        // 统计页面：只显示数据，不增加计数
        const counter = new VisitorCounter(false);
        counter.getStats().then(stats => {
            const displayElement = document.getElementById('total-visits-display');
            if (displayElement) {
                displayElement.textContent = counter.formatNumber(stats.totalVisits);
            }
            const sourceElement = document.getElementById('stats-source');
            if (sourceElement) {
                sourceElement.textContent = `数据来源: ${stats.source === 'api' ? 'CountAPI' : '本地存储'}`;
            }
        });
    } else {
        // 普通页面：正常计数
        new VisitorCounter(true);
    }
});


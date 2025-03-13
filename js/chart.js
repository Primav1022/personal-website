// 创建雷达图的函数
function createRadarChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// 当文档加载完成后初始化所有图表
document.addEventListener('DOMContentLoaded', function() {
    // 设计技能图表
    createRadarChart(
        'designSkillsChart',
        ['Photoshop', 'Illustrator', 'AfterEffect', 'Figma', 'unity3D', 'Touchdesigner'],
        [85, 75, 90, 90, 80, 70],
        'Design software and Engines Skills'
    );

    // 编程技能图表
    createRadarChart(
        'codingSkillsChart',
        ['JavaScript', 'Python', 'Java', 'HTML/CSS', 'React', 'Node.js'],
        [70, 95, 60, 80, 75, 70],
        'Coding Skills'
    );

    // 3D建模技能图表
    createRadarChart(
        'modelingSkillsChart',
        ['Maya', '3ds Max', 'CAD', 'Cinema4D', 'Grasshopper', 'Rhino'],
        [60, 80, 85, 90, 70, 65],
        '3D Modeling Skills'
    );

    // 其他技能图表
    // createRadarChart(
    //     'otherSkillsChart',
    //     ['项目管理', '团队协作', '沟通能力', '问题解决', '创新思维', '学习能力'],
    //     [85, 90, 80, 85, 90, 95],
    //     '其他技能掌握程度'
    // );
});

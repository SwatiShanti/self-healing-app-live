// Handle feedback form submission
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('.submit-btn');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Submitting...';
    submitBtn.classList.add('btn-loading');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            window.location.href = '/feedback';
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('btn-loading');

        const responseMessage = document.getElementById('responseMessage');
        responseMessage.innerHTML = `<div style="color: #ff6b6b; background: rgba(255, 107, 107, 0.1); padding: 10px; border-radius: 8px;">Error: ${error.message}</div>`;
        console.error('Error:', error);
    }
});

// Counter functionality
async function updateCounter() {
    try {
        const response = await fetch('/counter');
        const data = await response.json();
        const display = document.getElementById('counterValue');
        if (display) display.textContent = data.counter;
    } catch (error) {
        console.error('Error updating counter:', error);
    }
}

async function modifyCounter(action, btn) {
    if (!btn) return;
    const originalText = btn.textContent;

    // Show loading state
    btn.innerHTML = '<span class="loading-spinner"></span>';
    btn.classList.add('btn-loading');

    try {
        const response = await fetch(`/counter/${action}`, { method: 'POST' });
        const data = await response.json();
        const display = document.getElementById('counterValue');
        if (display) display.textContent = data.counter;

        // Reset button after short delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-loading');
        }, 500);
    } catch (error) {
        console.error('Error modifying counter:', error);
        // Reset button
        btn.innerHTML = originalText;
        btn.classList.remove('btn-loading');
    }
}

// Chart.js initialization
let healthChart;
const maxDataPoints = 20;
const chartData = {
    labels: [],
    datasets: [{
        label: 'System Load %',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
    }]
};

function initChart() {
    const ctx = document.getElementById('healthChart');
    if (!ctx) return;

    healthChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } },
            animation: { duration: 0 }
        }
    });
}

// Live stats from API
async function updateLiveStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        const uptime = document.getElementById('uptime');
        const requests = document.getElementById('requests');
        const users = document.getElementById('users');
        const health = document.getElementById('health');

        if (uptime) uptime.textContent = data.uptime;
        if (requests) requests.textContent = data.requests.toLocaleString();
        if (users) users.textContent = data.users;

        // Update Chart
        if (healthChart) {
            const now = new Date();
            const timeLabel = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

            chartData.labels.push(timeLabel);
            // Simulate load based on metrics
            const simulatedLoad = Math.min(95, 20 + (data.users * 1) + (data.requests % 50) + Math.random() * 5);
            chartData.datasets[0].data.push(simulatedLoad);

            if (chartData.labels.length > maxDataPoints) {
                chartData.labels.shift();
                chartData.datasets[0].data.shift();
            }
            healthChart.update();

            if (health) {
                health.textContent = simulatedLoad > 80 ? 'Heavy Load' : 'Stable';
                health.style.color = simulatedLoad > 80 ? '#ef4444' : '#10b981';
            }
        } else if (health) {
            health.textContent = data.status === 'Healthy' ? '🟢' : '🔴';
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Event listeners for counter buttons
const incBtn = document.getElementById('incrementBtn');
const decBtn = document.getElementById('decrementBtn');
const resBtn = document.getElementById('resetBtn');

if (incBtn) incBtn.addEventListener('click', (e) => modifyCounter('increment', e.target));
if (decBtn) decBtn.addEventListener('click', (e) => modifyCounter('decrement', e.target));
if (resBtn) resBtn.addEventListener('click', (e) => modifyCounter('reset', e.target));

// Initialize UI
initChart();
updateCounter();
updateLiveStats();
setInterval(updateLiveStats, 3000);

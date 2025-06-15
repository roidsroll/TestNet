document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-test');
    const stopBtn = document.getElementById('stop-test');
    const pingResult = document.getElementById('ping-result');
    const downloadResult = document.getElementById('download-result');
    const uploadResult = document.getElementById('upload-result');
    const pingBar = document.getElementById('ping-bar');
    const downloadBar = document.getElementById('download-bar');
    const uploadBar = document.getElementById('upload-bar');
    
    let testInProgress = false;
    let downloadTestData = [];
    let uploadTestData = [];
    
    // Start test
    startBtn.addEventListener('click', startSpeedTest);
    stopBtn.addEventListener('click', stopSpeedTest);
    
    function startSpeedTest() {
        if (testInProgress) return;
        
        testInProgress = true;
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        
        // Reset previous results
        pingResult.textContent = '-';
        downloadResult.textContent = '-';
        uploadResult.textContent = '-';
        pingBar.style.width = '0%';
        downloadBar.style.width = '0%';
        uploadBar.style.width = '0%';
        downloadTestData = [];
        uploadTestData = [];
        
        // Start with ping test
        testPing()
            .then(ping => {
                pingResult.textContent = `${ping} ms`;
                pingBar.style.width = '100%';
                
                // Then download test
                return testDownloadSpeed();
            })
            .then(downloadSpeed => {
                downloadResult.textContent = `${downloadSpeed.toFixed(2)} Mbps`;
                downloadBar.style.width = '100%';
                
                // Then upload test
                return testUploadSpeed();
            })
            .then(uploadSpeed => {
                uploadResult.textContent = `${uploadSpeed.toFixed(2)} Mbps`;
                uploadBar.style.width = '100%';
            })
            .catch(error => {
                console.error('Speed test error:', error);
                alert('Speed test failed. Please try again.');
            })
            .finally(() => {
                testInProgress = false;
                startBtn.classList.remove('hidden');
                stopBtn.classList.add('hidden');
            });
    }
    
    function stopSpeedTest() {
        testInProgress = false;
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }
    
    // Simulate ping test
    function testPing() {
        return new Promise((resolve) => {
            // Simulate ping time between 10ms and 100ms
            const pingTime = Math.floor(Math.random() * 90) + 10;
            
            // Simulate ping taking some time
            setTimeout(() => {
                resolve(pingTime);
            }, 500);
        });
    }
    
    // Simulate download speed test
    function testDownloadSpeed() {
        return new Promise((resolve) => {
            const testDuration = 3000; // 3 seconds
            const interval = 200; // update every 200ms
            const chunks = testDuration / interval;
            let loaded = 0;
            
            // Simulate downloading chunks of data
            const downloadInterval = setInterval(() => {
                if (!testInProgress) {
                    clearInterval(downloadInterval);
                    return;
                }
                
                // Simulate downloading between 0.5-2 MB per chunk
                const chunkSize = Math.random() * 1.5 + 0.5;
                loaded += chunkSize;
                
                // Calculate current speed in Mbps (1 MB = 8 Mb)
                const currentSpeed = (chunkSize * 8) / (interval / 1000);
                downloadTestData.push(currentSpeed);
                
                // Update UI
                const avgSpeed = downloadTestData.reduce((a, b) => a + b, 0) / downloadTestData.length;
                downloadResult.textContent = `${avgSpeed.toFixed(2)} Mbps`;
                
                // Update progress bar
                const progress = (downloadTestData.length / chunks) * 100;
                downloadBar.style.width = `${progress}%`;
                
            }, interval);
            
            setTimeout(() => {
                clearInterval(downloadInterval);
                if (!testInProgress) return;
                
                // Calculate average download speed
                const avgSpeed = downloadTestData.reduce((a, b) => a + b, 0) / downloadTestData.length;
                resolve(avgSpeed);
            }, testDuration);
        });
    }
    
    // Simulate upload speed test
    function testUploadSpeed() {
        return new Promise((resolve) => {
            const testDuration = 3000; // 3 seconds
            const interval = 200; // update every 200ms
            const chunks = testDuration / interval;
            let loaded = 0;
            
            // Simulate uploading chunks of data
            const uploadInterval = setInterval(() => {
                if (!testInProgress) {
                    clearInterval(uploadInterval);
                    return;
                }
                
                // Simulate uploading between 0.1-0.8 MB per chunk
                const chunkSize = Math.random() * 0.7 + 0.1;
                loaded += chunkSize;
                
                // Calculate current speed in Mbps (1 MB = 8 Mb)
                const currentSpeed = (chunkSize * 8) / (interval / 1000);
                uploadTestData.push(currentSpeed);
                
                // Update UI
                const avgSpeed = uploadTestData.reduce((a, b) => a + b, 0) / uploadTestData.length;
                uploadResult.textContent = `${avgSpeed.toFixed(2)} Mbps`;
                
                // Update progress bar
                const progress = (uploadTestData.length / chunks) * 100;
                uploadBar.style.width = `${progress}%`;
                
            }, interval);
            
            setTimeout(() => {
                clearInterval(uploadInterval);
                if (!testInProgress) return;
                
                // Calculate average upload speed
                const avgSpeed = uploadTestData.reduce((a, b) => a + b, 0) / uploadTestData.length;
                resolve(avgSpeed);
            }, testDuration);
        });
    }
});

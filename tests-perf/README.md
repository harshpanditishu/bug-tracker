# K6 Performance Testing

This directory contains K6 performance/load tests for the Bug Tracker application.

## What is K6?

K6 is a modern, developer-friendly load testing tool built for testing the performance and reliability of APIs, microservices, and websites. It's designed to be easy to use and scriptable with JavaScript.

## Installation

### Windows

#### Option 1: Using Chocolatey (Recommended)
**Run PowerShell as Administrator**, then:
```powershell
choco install k6 -y
```

#### Option 2: Using winget
```powershell
winget install k6 --source winget
```

#### Option 3: Manual Installation
1. Download the latest Windows installer from [k6 releases](https://github.com/grafana/k6/releases)
2. Run the `.msi` installer
3. Verify installation:
   ```powershell
   k6 version
   ```

### macOS

#### Using Homebrew
```bash
brew install k6
```

### Linux

#### Debian/Ubuntu
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Fedora/CentOS
```bash
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

### Using Docker

If you prefer using Docker:
```bash
docker pull grafana/k6:latest
```

## Verify Installation

After installation, verify K6 is installed correctly:
```bash
k6 version
```

You should see output similar to:
```
k6 v0.48.0 (go1.21.4, windows/amd64)
```

## Running Performance Tests

### Prerequisites
Ensure the Bug Tracker application is running:
```bash
# From the project root
docker compose up -d
```

### Run Tests

#### Standard Test Run
```bash
# From tests-perf directory
k6 run script.js
```

#### Run with Custom VUs and Duration
```bash
# 10 virtual users for 1 minute
k6 run --vus 10 --duration 1m script.js
```

#### Run and Generate HTML Report
The script is already configured to generate an HTML report:
```bash
k6 run script.js
# Report will be saved as perf-results.html
```

#### Using Docker
```bash
# From project root
docker run --rm -i --network=host \
  -v ${PWD}/tests-perf:/tests-perf \
  grafana/k6:latest run /tests-perf/script.js
```

On Windows PowerShell:
```powershell
docker run --rm -i --network=host `
  -v ${PWD}/tests-perf:/tests-perf `
  grafana/k6:latest run /tests-perf/script.js
```

## Test Configuration

The current test configuration in `script.js`:
- **Duration**: 30 seconds
- **Virtual Users (VUs)**: 1
- **Thresholds**:
  - HTTP error rate < 1%
  - 95th percentile response time < 500ms

### Customize Tests

Edit `script.js` to modify test parameters:

```javascript
export const options = {
  duration: "30s",    // Test duration
  vus: 1,             // Number of virtual users
  thresholds: {
    http_req_failed: ["rate<0.01"],      // Error rate threshold
    http_req_duration: ["p(95)<500"],    // Response time threshold
  },
};
```

## Understanding Results

After running tests, K6 provides:

- **HTTP Request Metrics**: Duration, success rate, RPS
- **VU Metrics**: Active virtual users
- **Data Transfer**: Bytes sent/received
- **Threshold Status**: Pass/fail for defined thresholds
- **HTML Report**: Visual representation in `perf-results.html`

### Sample Output
```
     ✓ health check status is 200
     ✓ create bug status is 201
     ✓ bug has an id

     checks.........................: 100.00% ✓ 18       ✗ 0   
     data_received..................: 4.7 kB  157 B/s
     data_sent......................: 1.3 kB  43 B/s
     http_req_duration..............: avg=25.5ms   min=8.2ms    med=22.3ms   max=89.4ms   p(95)=45.2ms   p(99)=89.4ms  
     http_reqs......................: 12      0.399962/s
```

## CI/CD Integration

To integrate K6 tests in Jenkins pipeline:

```groovy
stage('Performance Tests') {
    agent {
        docker {
            image 'grafana/k6:latest'
            args '--network="host"'
            reuseNode true
        }
    }
    steps {
        dir('tests-perf') {
            sh 'k6 run script.js'
        }
    }
    post {
        always {
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'tests-perf',
                reportFiles: 'perf-results.html',
                reportName: 'K6 Performance Test Results'
            ])
        }
    }
}
```

## Additional Resources

- [K6 Official Documentation](https://k6.io/docs/)
- [K6 Test Types](https://k6.io/docs/test-types/introduction/)
- [K6 Metrics](https://k6.io/docs/using-k6/metrics/)
- [K6 Thresholds](https://k6.io/docs/using-k6/thresholds/)
- [K6 Cloud](https://k6.io/cloud/) - For advanced test analytics

## Troubleshooting

### Port Connection Issues
If K6 can't connect to the application:
1. Verify the application is running: `curl http://localhost:8080/api/health`
2. Check Docker network mode (use `--network=host` for Docker)
3. Update URLs in `script.js` if using different ports

### Permission Issues (Linux/macOS)
```bash
sudo k6 run script.js
```

### Windows Firewall
If blocked by firewall, add K6 to allowed applications in Windows Defender Firewall.

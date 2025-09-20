# End-to-End (E2E) Testing for Digital E-Panchayat

This document outlines the planned E2E testing framework for the Digital E-Panchayat web application.

## Technologies to be Used

1. **Playwright** or **Cypress**: For browser automation and E2E testing
2. **Test containers** or **Docker**: For isolated test environments
3. **GitHub Actions**: For CI/CD integration

## Test Scenarios

### 1. Citizen Registration and Certificate Application Flow
```
Scenario: Citizen registers → logs in → applies for birth certificate → previews → downloads PDF
Steps:
1. Navigate to registration page
2. Fill registration form with valid data
3. Submit registration
4. Verify successful registration message
5. Navigate to login page
6. Login with registered credentials
7. Navigate to certificates service
8. Select birth certificate application
9. Fill application form with valid data
10. Submit application
11. Preview application details
12. Download PDF certificate
13. Verify PDF content
```

### 2. Grievance Redressal Workflow
```
Scenario: Citizen files grievance → staff updates → officer views report
Steps:
1. Citizen logs in
2. Navigate to grievances service
3. Fill grievance form with valid data
4. Submit grievance
5. Staff logs in
6. Navigate to grievances dashboard
7. View pending grievances
8. Update grievance status
9. Add remarks
10. Officer logs in
11. Navigate to reports section
12. Generate grievances report
13. Download report as PDF
```

### 3. Scheme Application Flow
```
Scenario: Citizen applies for scheme → sees application in dashboard
Steps:
1. Citizen logs in
2. Navigate to schemes service
3. Browse available schemes
4. Select a scheme to apply
5. Fill application form with valid data
6. Submit application
7. Navigate to dashboard
8. Verify application appears in dashboard
```

### 4. Officer Dashboard and Reporting
```
Scenario: Officer logs in → navigates to dashboard → downloads certificate report
Steps:
1. Officer logs in with predefined credentials
2. Navigate to officer dashboard
3. View overview cards and charts
4. Navigate to reports section
5. Select certificate report
6. Generate report
7. Download report as PDF
8. Verify report content and formatting
```

## Test Environment Setup

### Docker-based Testing Environment
```dockerfile
# Dockerfile for E2E testing
FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000 3001

# Start the application
CMD ["npm", "run", "dev"]
```

### Docker Compose for Testing
```yaml
# docker-compose.test.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:3001/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/digital-e-panchayat
      - JWT_SECRET=test-secret-key
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  e2e:
    build: ./e2e
    depends_on:
      - frontend
      - backend
    environment:
      - BASE_URL=http://frontend:3000
      - API_URL=http://backend:3001

volumes:
  mongo-data:
```

## Test Execution

### Running E2E Tests Locally
```bash
# Install Playwright/Cypress
npm install --save-dev @playwright/test

# Install browsers
npx playwright install

# Run tests
npx playwright test
```

### Running Tests in CI/CD
```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../backend && npm install
          cd ..
          
      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d
        
      - name: Wait for services
        run: sleep 30
        
      - name: Run E2E tests
        run: |
          cd e2e
          npm install
          npx playwright test
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: e2e/test-results/
          
      - name: Stop services
        if: always()
        run: docker-compose -f docker-compose.test.yml down
```

## Best Practices

1. **Test Data Management**: Use fixtures and factories for consistent test data
2. **Page Object Model**: Implement POM for maintainable test code
3. **Parallel Execution**: Run tests in parallel to reduce execution time
4. **Screenshots and Videos**: Capture screenshots/videos on test failures
5. **Test Retries**: Implement retry mechanism for flaky tests
6. **Performance Testing**: Include performance metrics in E2E tests
7. **Accessibility Testing**: Integrate accessibility checks in E2E tests

## Reporting

1. **Test Results**: Generate HTML reports with detailed test execution information
2. **Screenshots**: Capture screenshots on test failures
3. **Videos**: Record test execution videos
4. **Performance Metrics**: Report page load times and API response times
5. **Accessibility Reports**: Generate accessibility compliance reports

## Future Enhancements

1. **Mobile Testing**: Add mobile browser testing
2. **Cross-browser Testing**: Test on multiple browsers (Chrome, Firefox, Safari, Edge)
3. **Load Testing**: Integrate load testing with E2E scenarios
4. **Security Testing**: Add security scanning to E2E pipeline
5. **Visual Regression Testing**: Implement visual regression testing
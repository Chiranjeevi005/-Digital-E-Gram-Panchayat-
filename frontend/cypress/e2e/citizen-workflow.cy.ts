describe('Citizen Workflow Tests', () => {
  it('should allow citizen to register, login, apply for certificate, and download PDF', () => {
    // Visit the home page
    cy.visit('/')
    
    // Navigate to register page
    cy.contains('Get Started').click()
    
    // Fill registration form
    cy.get('[data-testid="name"]').type('Test Citizen')
    cy.get('[data-testid="email"]').type('citizen@test.com')
    cy.get('[data-testid="password"]').type('password123')
    cy.get('[data-testid="confirmPassword"]').type('password123')
    cy.get('[data-testid="declaration"]').click()
    
    // Submit registration
    cy.get('[data-testid="register-button"]').click()
    
    // Should redirect to login page
    cy.url().should('include', '/login')
    
    // Login with the same credentials
    cy.get('[data-testid="email"]').type('citizen@test.com')
    cy.get('[data-testid="password"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    
    // Navigate to services
    cy.contains('Services').click()
    
    // Apply for a certificate
    cy.contains('Apply Now').first().click()
    
    // Fill certificate form
    cy.get('[data-testid="applicant-name"]').type('Test Citizen')
    cy.get('[data-testid="father-name"]').type('Father Name')
    cy.get('[data-testid="address"]').type('Test Address')
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click()
    
    // Preview and download
    cy.contains('Download PDF').click()
    
    // Verify download started
    cy.contains('PDF downloaded successfully')
  })

  it('should allow citizen to submit grievance and view status', () => {
    // Login as citizen
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('citizen@test.com')
    cy.get('[data-testid="password"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    // Navigate to grievances
    cy.contains('Grievances').click()
    
    // Submit new grievance
    cy.get('[data-testid="subject"]').type('Test Grievance')
    cy.get('[data-testid="description"]').type('This is a test grievance description')
    cy.get('[data-testid="submit-grievance"]').click()
    
    // Verify grievance submitted
    cy.contains('Grievance submitted successfully')
    
    // Check grievance status in dashboard
    cy.visit('/dashboard')
    cy.contains('Grievances').should('be.visible')
  })

  it('should allow citizen to apply for scheme and see application in dashboard', () => {
    // Login as citizen
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('citizen@test.com')
    cy.get('[data-testid="password"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    // Navigate to schemes
    cy.contains('Schemes').click()
    
    // Apply for a scheme
    cy.contains('Apply Now').first().click()
    
    // Fill scheme application form
    cy.get('[data-testid="applicant-name"]').type('Test Citizen')
    cy.get('[data-testid="income"]').type('50000')
    cy.get('[data-testid="family-size"]').type('4')
    
    // Submit application
    cy.get('[data-testid="submit-button"]').click()
    
    // Verify application submitted
    cy.contains('Application submitted successfully')
    
    // Check application status in dashboard
    cy.visit('/dashboard')
    cy.contains('Applications').should('be.visible')
  })
})
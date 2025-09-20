describe('Officer Workflow Tests', () => {
  it('should allow officer to login, access dashboard, and generate reports', () => {
    // Visit login page
    cy.visit('/login')
    
    // Select officer role
    cy.contains('Officer').click()
    
    // Login with officer credentials
    cy.get('[data-testid="email"]').type('officer@epanchayat.com')
    cy.get('[data-testid="password"]').type('officerpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Should redirect to officer dashboard
    cy.url().should('include', '/officer/dashboard')
    
    // Verify dashboard elements
    cy.contains('Overview').should('be.visible')
    cy.contains('Reports').should('be.visible')
    cy.contains('Analytics').should('be.visible')
    
    // Navigate to reports section
    cy.contains('Reports').click()
    
    // Generate certificates report
    cy.contains('Certificates Report').click()
    cy.get('[data-testid="generate-report"]').click()
    cy.contains('Report generated successfully')
    
    // Generate grievances report
    cy.contains('Grievances Report').click()
    cy.get('[data-testid="generate-report"]').click()
    cy.contains('Report generated successfully')
    
    // Generate schemes report
    cy.contains('Schemes Report').click()
    cy.get('[data-testid="generate-report"]').click()
    cy.contains('Report generated successfully')
    
    // Verify report watermark/seal appears correctly
    cy.get('[data-testid="report-seal"]').should('be.visible')
  })

  it('should allow officer to view all grievances', () => {
    // Login as officer
    cy.visit('/login')
    cy.contains('Officer').click()
    cy.get('[data-testid="email"]').type('officer@epanchayat.com')
    cy.get('[data-testid="password"]').type('officerpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Navigate to grievances section
    cy.contains('Grievances').click()
    
    // Verify all grievances are visible
    cy.get('[data-testid="grievance-list"]').should('be.visible')
    cy.get('[data-testid="grievance-item"]').should('have.length.greaterThan', 0)
  })

  it('should allow officer to view overview cards and reports', () => {
    // Login as officer
    cy.visit('/login')
    cy.contains('Officer').click()
    cy.get('[data-testid="email"]').type('officer@epanchayat.com')
    cy.get('[data-testid="password"]').type('officerpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Verify overview cards
    cy.get('[data-testid="certificates-card"]').should('be.visible')
    cy.get('[data-testid="grievances-card"]').should('be.visible')
    cy.get('[data-testid="schemes-card"]').should('be.visible')
    cy.get('[data-testid="users-card"]').should('be.visible')
  })
})
describe('Staff Workflow Tests', () => {
  it('should allow staff to login, access dashboard, and update grievances', () => {
    // Visit login page
    cy.visit('/login')
    
    // Select staff role
    cy.contains('Staff').click()
    
    // Login with staff credentials
    cy.get('[data-testid="email"]').type('staff1@epanchayat.com')
    cy.get('[data-testid="password"]').type('staffpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Should redirect to staff dashboard
    cy.url().should('include', '/staff/dashboard')
    
    // Verify dashboard elements
    cy.contains('Tasks').should('be.visible')
    cy.contains('Progress').should('be.visible')
    cy.contains('Assigned Work').should('be.visible')
    
    // Navigate to grievances section
    cy.contains('Grievances').click()
    
    // View assigned grievances
    cy.get('[data-testid="grievance-list"]').should('be.visible')
    
    // Update a grievance status
    cy.get('[data-testid="grievance-item"]').first().click()
    cy.get('[data-testid="status-dropdown"]').select('In Progress')
    cy.get('[data-testid="update-status"]').click()
    
    // Verify status update
    cy.contains('Status updated successfully')
  })

  it('should show staff tasks and their progress', () => {
    // Login as staff
    cy.visit('/login')
    cy.contains('Staff').click()
    cy.get('[data-testid="email"]').type('staff1@epanchayat.com')
    cy.get('[data-testid="password"]').type('staffpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Verify tasks and progress
    cy.get('[data-testid="task-list"]').should('be.visible')
    cy.get('[data-testid="progress-bar"]').should('be.visible')
    
    // Check specific task
    cy.get('[data-testid="task-item"]').first().should('be.visible')
  })

  it('should allow staff to handle citizen applications', () => {
    // Login as staff
    cy.visit('/login')
    cy.contains('Staff').click()
    cy.get('[data-testid="email"]').type('staff1@epanchayat.com')
    cy.get('[data-testid="password"]').type('staffpass123')
    cy.get('[data-testid="login-button"]').click()
    
    // Navigate to applications section
    cy.contains('Applications').click()
    
    // View pending applications
    cy.get('[data-testid="application-list"]').should('be.visible')
    
    // Process an application
    cy.get('[data-testid="application-item"]').first().click()
    cy.get('[data-testid="review-notes"]').type('Application reviewed and approved')
    cy.get('[data-testid="approve-button"]').click()
    
    // Verify application processed
    cy.contains('Application processed successfully')
  })
})
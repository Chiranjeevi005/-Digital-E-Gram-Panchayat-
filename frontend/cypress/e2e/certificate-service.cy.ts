describe('Certificate Service End-to-End Flow', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('http://localhost:3001');
  });

  it('should complete the full certificate application and download flow', () => {
    // Step 1: Login as a citizen
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('citizen@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-login"]').click();
    
    // Step 2: Navigate to Services page
    cy.get('[data-testid="services-link"]').click();
    
    // Step 3: Select Certificates & Records service
    cy.get('[data-testid="certificates-service-card"]').click();
    
    // Step 4: Select Birth Certificate
    cy.get('[data-testid="birth-certificate-card"]').click();
    
    // Step 5: Fill out the application form
    cy.get('[data-testid="applicant-name"]').type('Test Applicant');
    cy.get('[data-testid="father-name"]').type('Test Father');
    cy.get('[data-testid="mother-name"]').type('Test Mother');
    cy.get('[data-testid="date-of-birth"]').type('2023-01-15');
    cy.get('[data-testid="place-of-birth"]').type('District Hospital');
    
    // Step 6: Submit the form
    cy.get('[data-testid="submit-application"]').click();
    
    // Step 7: Wait for submission to complete and redirect to preview
    cy.url().should('include', '/services/certificates/preview');
    
    // Step 8: Verify preview page content
    cy.get('[data-testid="certificate-preview"]').should('be.visible');
    cy.contains('Test Applicant').should('be.visible');
    cy.contains('Birth Certificate').should('be.visible');
    
    // Step 9: Download as PDF
    cy.get('[data-testid="download-pdf"]').click();
    
    // Step 10: Verify download started (we can't test actual file download in Cypress)
    cy.get('[data-testid="download-success"]').should('be.visible');
    
    // Step 11: Download as JPG
    cy.get('[data-testid="download-jpg"]').click();
    
    // Step 12: Verify download started
    cy.get('[data-testid="download-success"]').should('be.visible');
  });

  it('should handle form validation errors', () => {
    // Login as a citizen
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('citizen@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-login"]').click();
    
    // Navigate to Services page
    cy.get('[data-testid="services-link"]').click();
    
    // Select Certificates & Records service
    cy.get('[data-testid="certificates-service-card"]').click();
    
    // Select Birth Certificate
    cy.get('[data-testid="birth-certificate-card"]').click();
    
    // Try to submit without filling required fields
    cy.get('[data-testid="submit-application"]').click();
    
    // Verify error message is shown
    cy.get('[data-testid="form-error"]').should('be.visible');
  });
});
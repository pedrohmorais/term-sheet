describe('Deals test', () => {
  it('should redirect from /deals to /login when not authenticated', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/deals');

    cy.url().should('include', '/login');
    cy.login();

    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/deals');
  });

  it('should display all elements on the screen', () => {
    cy.login();

    cy.contains('Deal Pipeline')
      .should('be.visible');

    // amount of deals
    cy.contains('5 deals total')
      .should('be.visible');

    // filters inputs
    cy.contains('mat-form-field', 'Search by name')
      .should('be.visible');

    cy.contains('mat-form-field', 'Min Price')
      .should('be.visible');

    cy.contains('mat-form-field', 'Max Price')
      .should('be.visible');

    // clear filters btn
    cy.contains('Clear filters')
      .should('be.visible');

    // results amount
    cy.contains('Showing 5 results')
      .should('be.visible');

    // deals list
    cy.contains('Sunset Boulevard Office Complex')
      .should('be.visible');

    cy.contains('Downtown Seattle Retail Hub')
      .should('be.visible');

    cy.contains('Miami Beach Mixed Use')
      .should('be.visible');

    // check percents
    cy.contains('9%').should('exist');
    cy.contains('7%').should('exist');
    cy.contains('8%').should('exist');

    // delete btn)
    cy.get('button[mattooltip="Delete deal"]').should('exist');

    // New Deal btn
    cy.contains('button', 'New Deal')
      .click();

    cy.contains('Add New Deal')
      .should('be.visible');
  });
})
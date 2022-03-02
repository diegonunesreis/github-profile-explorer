describe('Seach - Initial Page', () => {
  it('Should perform search if form is valid', () => {
    cy.visit('/');
    cy.contains('Profile Explorer');
    cy.get('[name="searchtextInput"]').type('diego');
    cy.get('button').click();
    cy.url().should('include', 'diego');
  });

  it('Should not perform search if form empty', () => {
    cy.visit('/');
    cy.contains('Profile Explorer');
    cy.get('button').click();
    cy.url().should('not.include', 'search');
  })
})

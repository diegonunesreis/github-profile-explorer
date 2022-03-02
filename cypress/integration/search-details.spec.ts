describe('Seach - Initial Page', () => {
  it('Should perform search if form is valid', () => {
    cy.visit('/search?q=diego');
    cy.get('[name="searchtextInput"]').clear().type('diegonunes');
    cy.get('#submit-btn').click();
    cy.url().should('include', 'diegonunes');
  });

  it('Should not perform search if form empty', () => {
    cy.visit('/search?q=diego');
    cy.get('[name="searchtextInput"]').clear()
    cy.get('#submit-btn').click();
    cy.url().should('not.include', 'diegonunes');
  })
})

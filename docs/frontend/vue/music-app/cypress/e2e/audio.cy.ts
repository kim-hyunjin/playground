describe('Audio Player Test', () => {
  it('plays audio', () => {
    cy.visit('/')

    cy.get('.song-link:first').click()

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    cy.get('#play-btn').click()

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)

    cy.get('#player-play-btn').click()
  })
})

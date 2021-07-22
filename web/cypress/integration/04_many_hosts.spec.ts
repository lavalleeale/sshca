describe("Many Hosts", () => {
  before("Log In", () => {
    cy.visit("/");
    cy.contains("Login").should("exist");
    cy.get(":nth-child(1) > .MuiInputBase-root > .MuiInputBase-input").type(
      "test@example.com"
    );
    cy.get(":nth-child(2) > .MuiInputBase-root > .MuiInputBase-input").type(
      "development"
    );
    cy.get("form > .MuiButtonBase-root").click();
    cy.url().should("include", "/dash");
    cy.contains("test@example.com").should("exist");
  });

  beforeEach("Go To Main Page", () => {
    Cypress.Cookies.preserveOnce("token");
    cy.visit("/dash");
  });
  it("Create Hosts", () => {
    var genArr = new Array(50);
    cy.wrap(genArr).each((el, index) => {
      cy.contains("Create Host").should("not.exist");
      cy.get(`[aria-label="Add Host"]`).click();
      cy.contains("Create Host").should("be.visible");
      cy.get(":nth-child(1) > .MuiInputBase-root > .MuiInputBase-input").type(
        `Host ${index}`
      );
      cy.get(
        '[style="margin-top: 10px;"] > .MuiInputBase-root > .MuiInputBase-input'
      ).type(`host${index}.local`);
      cy.contains("Add").click();
      cy.contains(`Host ${index}`).should("exist");
    });
  });
  it("Cleanup", () => {
    cy.get('[aria-label="delete"]').each((el) => cy.wrap(el).click());
  });
});
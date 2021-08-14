describe("Many Roles", () => {
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

  it("Add Host", () => {
    cy.contains("Create Host").should("not.exist");
    cy.get(`[aria-label="Add Host"]`).click();
    cy.contains("Create Host").should("be.visible");
    cy.get(":nth-child(1) > .MuiInputBase-root > .MuiInputBase-input").type(
      "Host 1"
    );
    cy.get(
      '[style="margin-top: 10px;"] > .MuiInputBase-root > .MuiInputBase-input'
    ).type("host1.local");
    cy.contains("Add").click();
    cy.contains("Host 1").should("exist");
  });

  it("Create Roles", () => {
    var genArr = new Array(50);
    cy.wrap(genArr).each((el, index) => {
      cy.contains("Create Role").should("not.exist");
      cy.get(`[aria-label="Add Role"]`).click();
      cy.contains("Create Role").should("be.visible");
      cy.get(
        ".MuiDialogContent-root > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input"
      ).type(`Role ${index}`);
      cy.get(
        ":nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("root");
      cy.get(
        ":nth-child(5) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root"
      ).click();
      cy.get('.MuiAutocomplete-listbox > [tabindex="-1"]').click();
      cy.contains("Add").click();
      cy.contains(`Role ${index}`).should("exist");
    });
  });

  it("Cleanup", () => {
    cy.get('[aria-label="delete"]').each((el) => cy.wrap(el).click());
  });
});

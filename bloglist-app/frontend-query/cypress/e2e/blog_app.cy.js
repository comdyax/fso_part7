describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "John Coltrane",
      username: "The Trane",
      password: "TransitionJapanConcerts",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.get("h1").should("contain", "Login to see application");
    cy.get("#loginForm").parent().as("form");
    cy.get("@form")
      .should("contain", "username")
      .and("contain", "password")
      .and("contain", "login");
    cy.get("#username");
    cy.get("#password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("The Trane");
      cy.get("#password").type("TransitionJapanConcerts");
      cy.get("#login-button").click();

      cy.contains("John Coltrane is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("The Trane");
      cy.get("#password").type("wrongPassword");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "John Coltrane logged in");
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.login({
          username: "The Trane",
          password: "TransitionJapanConcerts",
        });
      });

      it("A blog can be created", function () {
        cy.contains("new blog").click();
        cy.get("#title").type("How to play standards");
        cy.get("#author").type("Someone who likes music");
        cy.get("#url").type("www.thewaytojazz.io");
        cy.get("#create-blog").click();

        cy.contains("title: How to play standards");
        cy.contains("author: Someone who likes music");
        cy.get("#blogs").parent().find(".blogDiv").as("blogDiv");
        cy.get("@blogDiv").parent().find(".defaultValues").as("defaultValues");
        cy.get("@defaultValues").should(
          "not.contain",
          "url: www.thewaytojazz.io",
        );

        cy.get(".confirmation")
          .should(
            "contain",
            "a new blog: How to play standards by Someone who likes music was added.",
          )
          .and("have.css", "color", "rgb(0, 128, 0)")
          .and("have.css", "border-style", "solid");
      });
    });

    describe("When blogs already exist", function () {
      beforeEach(function () {
        cy.login({
          username: "The Trane",
          password: "TransitionJapanConcerts",
        });
        cy.createBlog({
          title: "seveneight",
          author: "nineten",
          url: "eleventwelve",
          likes: 2,
        });
        cy.createBlog({
          title: "onetwo",
          author: "threefour",
          url: "fivesix",
          likes: 0,
        });
        cy.createBlog({
          title: "thirteen",
          author: "fourteen",
          url: "fifteen",
          likes: 5,
        });
        cy.visit("");
      });

      it("blogs are ordered according to likes, most likes first", function () {
        cy.get(".blogDiv").eq(2).should("contain", "title: onetwo");
        cy.get(".blogDiv").eq(1).should("contain", "title: seveneight");
        cy.get(".blogDiv").eq(0).should("contain", "title: thirteen");
      });

      it("user can like a blog", function () {
        cy.contains("title: onetwo").parent().as("blog");
        cy.get("@blog").find("#showDetails-button").click();
        cy.get("@blog").contains("likes: 0");
        cy.get("@blog").find("#like-button").click();
        cy.get("@blog").contains("likes: 1");
      });

      it("user can delete a blog that he created", function () {
        cy.contains("title: onetwo").parent().as("blog");
        cy.get("@blog").find("#showDetails-button").click();
        cy.get("@blog").find("#remove-button").click();

        cy.get("html").should("not.contain", "title: onetwo");
      });

      describe("second user", function () {
        beforeEach(function () {
          cy.get("#logout-button").click();
          const user = {
            name: "second user",
            username: "2nduser",
            password: "secondtwo22",
          };
          cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
          cy.login({ username: "2nduser", password: "secondtwo22" });
        });

        it("only creator can see delete button not", function () {
          cy.contains("second user is logged in");
          cy.get("html").should("not.contain", "#remove-button");

          cy.contains("title: onetwo").parent().as("blog");
          cy.get("@blog").find("#showDetails-button").click();
          cy.get("@blog").should("not.contain", "#remove-button");
        });
      });
    });
  });
});

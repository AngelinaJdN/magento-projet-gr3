import { faker } from '@faker-js/faker';

describe('Parcours d\'achat', () => {
  before(() => {
    cy.visit('https://magento.softwaretestingboard.com/');
  });
  
  it('Voir la catégorie Tops et choisir le premier produit', () => {
    //Given a user, when he hovers on "Women" and then click on "Tops", then he is redirected to a page that shows the first 50 articles of this category
    cy.get('#ui-id-4').trigger('mouseover');
    cy.get('#ui-id-9').click();
    cy.url().should('eql', 'https://magento.softwaretestingboard.com/women/tops-women.html');
    //Given a user, when he clicks on the first product of the Tops list, then he is redirected to the page of this product and given options about size, color, and quantity
    cy.get(':nth-child(1) > .product-item-info > .photo > .product-image-container > .product-image-wrapper > .product-image-photo').click();
    cy.url().should('eql', 'https://magento.softwaretestingboard.com/breathe-easy-tank.html')
  });
  
  it('Choisir une taille et une couleur, ajouter au panier, voir le panier, finaliser la commande', () => {
    //Given a user, when he clicks on a size and a color, then the selected size and color appear with a red border
    cy.visit('https://magento.softwaretestingboard.com/breathe-easy-tank.html');
    cy.intercept({
      url: 'https://magento.softwaretestingboard.com/pub/static/version1678540400/frontend/Magento/luma/en_US/Magento_Captcha/template/checkout/captcha.html',
      method: 'GET',
    }).as('pagePrdt');
    cy.wait("@pagePrdt").then((prdt) => {
      expect(prdt.response.statusCode).eq(200);
    });
    cy.get('#option-label-size-143-item-169').click({force: true});
    cy.wait(1000);
    cy.get('#option-label-color-93-item-57').click({force: true});
    cy.wait(1000);
    cy.get('#option-label-size-143-item-169').should('have.css', 'border');
    cy.get('#option-label-color-93-item-57').should('have.css', 'border');
    
    //Given a user, when he clicks on "Add to cart", then the message "You added Breathe-Easy Tank to your shopping cart." appears and the cart symbol has a number on his side
    cy.get('#product-addtocart-button').click();
    cy.get(2000);
    cy.get('.message-success').should('be.visible');
    cy.get('.counter-number').should('be.visible');
    //Given a user, when he modifies the quantity and clicks on "Proceed to checkout", then he is redirected to a page with a form to fill
    cy.wait(2000);
    cy.get('.showcart').click({force: true});
    cy.wait(1000);
    cy.get('[id^="cart-item-"][id$="-qty"]').clear().type("3");
    cy.get('#top-cart-btn-checkout').click();
    cy.wait(5000);
    cy.url().should('eql', 'https://magento.softwaretestingboard.com/checkout/#shipping');
    cy.get('.opc-wrapper').should('be.visible');
    
    //Given a user, when he fills correctly the form, select a shipping method and click on "Next", then he is redirected to a page where he can review his infos
    const firstName = faker.name.firstName();
    cy.get('#customer-email-fieldset > .required > .control > #customer-email').type(faker.internet.email(firstName, '159', 'gmail.com'));
    cy.get('[name="firstname"]').type(firstName);
    cy.get('[name="lastname"]').type(faker.word.noun());
    cy.get('[name="company"]').type(faker.word.noun());
    cy.get('[name="street[0]"]').type(faker.address.streetAddress());
    cy.get('[name="city"]').type(faker.address.city());
    cy.get('[name="region_id"]').select('Alabama');
    cy.get('[name="postcode"]').type(faker.address.zipCode());
    cy.get('[name="country_id"]').select('United States');
    cy.get('[name="telephone"]').type(faker.phone.number());
    cy.get(':nth-child(1) > :nth-child(1) > .radio').click();
    cy.get('.button').click();
    cy.url().should('eql', 'https://magento.softwaretestingboard.com/checkout/#payment');
    
    //Given a user, when he clicks on "Place Order", then he is redirected to a page with the message "Thank you for your purchase!" and can either continue shopping or create an account.
    cy.get('#billing-address-same-as-shipping-checkmo').check();
    cy.get('.payment-method-content > :nth-child(4) > div.primary > .action').click();
    cy.wait(2000);
    cy.url().should('eql', 'https://magento.softwaretestingboard.com/checkout/onepage/success/');
    cy.get('.base').should('be.visible');
    cy.get('.checkout-success > .actions-toolbar > div.primary > .action').should('exist');
    cy.get('#registration > :nth-child(3) > .action').should('exist');
  });

})
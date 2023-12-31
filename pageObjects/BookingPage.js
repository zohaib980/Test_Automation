
export class BookingPage {

  addNewBookingAndValidate(propertyName, sourceName, adults, child) {
    let oldBookingId
    // A recursive Funtion will wait until the new booking displayed on the booking listing page
    const waitForBookingIdChange = () => {
      return cy.xpath("(//div)[2532]")
        .then(($newId) => {
          const newBookingId = $newId.text().trim()
          cy.log(newBookingId)
          if (newBookingId !== oldBookingId) {
            // Old booking ID has changed to a new booking ID
            cy.log(`Old Booking ID ${oldBookingId} changed to New Booking ID ${newBookingId}.`)
          }
          else {
            // Old booking ID remains the same, retry the check
            cy.wait(4000);
            waitForBookingIdChange(); // Recursive-like call to check again
          }
        })
    };
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //Validate URL
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(4000) //Validate Page Title
    cy.get('.text-small.translate').should('contain', 'View all your bookings') //Validate Page Subtitle
    cy.xpath("(//div)[2532]")
      .then(($oldId) => {
        oldBookingId = $oldId.text().trim()
        cy.log(oldBookingId)
        this.happyAddBooking(propertyName, sourceName, adults, child)
        // A recursive Funtion will wait until the new booking displayed on the booking listing page
        waitForBookingIdChange();
      });
  }
  happyAddBooking(propertyName, sourceName, adults, child) {
    cy.get('#add_booking_button').click()
    //Select Property
    cy.get('select[id="assigned_property"]:visible').select(propertyName)  //.should('have.value', '2500' )
    //Select Date
    cy.get('.custom-date-box').eq(0).click()
    cy.wait(1000)
    cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).invoke('text').then((fromDate) => {
      cy.log(fromDate)
      cy.get('[role="presentation"] [aria-label*="your start date."] button').then((todate) => {
        cy.log(todate)
        cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).click() //from date
        cy.get('.custom-date-box').eq(0).click()
        cy.wait(1000)
        cy.get(todate).eq(8).click({ force: true }) //Click todate
      })
    })
    // Select Source
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > :nth-child(2) > :nth-child(2) > .form-group > #booking_source')
      .select(sourceName)
    // Reservation Status
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > :nth-child(3) > :nth-child(1) > .form-group > #reservation_status')
      .select("Confirmed")
    // Booking Amount
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > :nth-child(3) > :nth-child(2) > .form-group > #total_booking_amount')
      .type('100')
    // Enter Note
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > .mt-1 > .col-md-12 > .form-group > div > #bookingNotes')
      .type('Testing Automation')
    // First Name and Last Name
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(1) > .form-group > #first_name')
      .type("QA")
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(2) > .form-group > #last_name')
      .type("Tester")
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(4) > .form-group > #email')
      .should('have.attr', 'placeholder', 'Email')
      .type(generatedUserName + '@mailinator.com') //Add a random email
    //Add Adult, child and nationality
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(5) > .form-group > #num_adults').clear().type(adults)
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(6) > .form-group > #num_child').clear().type(child)
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > #bookings-tabContent > .col-sm-12 > #accordion-booking-booker > .card > #accordion-booking-booker-section > .card-body > .row > :nth-child(8) > .form-group > #nationality').select("Pakistani").wait(2000)
    cy.get(':nth-child(1) > #add_edit_booking_modal > .modal-dialog > .modal-content > .modal-footer > .btn-success').should('be.visible').click()
  }
  validatePrecheckInStatusAsCompleted() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in completed') //Validate first booking Precheckin status
  }
  validatePrecheckinStatusAsIncomplete() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.page-title.translate').should('contain', 'Bookings')
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in incomplete') //validate first booking incomplete status
  }
  mailValidation() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]") //3dot icon on first booking
      .click({ force: true })
    cy.xpath("(//a[@class='dropdown-item notranslate'])[2]") //Go to Booking detail
      .invoke("removeAttr", "target", { force: true })
      .click({ force: true })
    cy.wait(3000)
    cy.get("a[id='tab_general-sent-email-detail'] span[class='mt-sm-15']").should('contain.text', 'Messages').click({ force: true }) //Messages tab
    cy.xpath("(//td[contains(text(), 'Pre Check-in Completed')])[1]")
      .then($text => {
        const guestTitle = $text.text();
        cy.log(guestTitle)
        cy.wrap(guestTitle).should('contain', 'Pre Check-in Completed')
        cy.xpath("(//td[contains(text(), 'Guest')])[1]").should('contain', 'Guest')
        cy.xpath("(//td[contains(text(), 'Pre Check-in Completed')])[2]")
          .then($text => {
            const hostTitle = $text.text();
            cy.log(hostTitle)
            cy.wrap(hostTitle).should('contain', 'Pre Check-in Completed')
            cy.xpath("(//td[contains(text(), 'Host')])[1]").should('contain', 'Host')
          })
      })
  }
}
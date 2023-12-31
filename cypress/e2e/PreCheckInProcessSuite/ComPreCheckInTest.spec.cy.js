/// <reference types ="Cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn

describe('Pre Check-In Complete Process Scenerios', () => {

  beforeEach(() => {
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal
  })

  it('CA_CPCT_01 > Validate Complete Pre Check-In Process with Source PMS-No-PMS, using document as ID Card, Arrival by Car, Only available Guests and using all Services', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.selectLicenseAndIDcard()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 1, 0) //Create a new booking and validate (1Adult,0Child)
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]")
      .click({ force: true })
    cy.xpath("(//a[@class='dropdown-item notranslate'])[1]")
      .then(($button) => {
        const link = $button.attr('href');
        cy.wrap(link).as('myLink');
        cy.log(link)
        // Here we will copy the and Visit the Pre Check-In process after logout from the portal
        cy.xpath("(//a[@class='dropdown-item notranslate'])[3]")
          .invoke("removeAttr", "target", { force: true })
          .click({ force: true })
        cy.url().should('include', '/booking-detail')
        cy.get('.booking-property-heading').should('have.text', 'Waqas DHA')
        cy.wait(4000)
        // Will get and store BookingId value in a variable
        cy.get('#bookingID')
          .invoke('val')
          .then((text) => {
            const bookingID = text;
            cy.wrap(bookingID).should('eq', bookingID)
            // Will get and store Source value in a variable
            cy.get('#source')
              .invoke('val')
              .then((text) => {
                const source = text;
                cy.wrap(source).should('eq', source)
                // Will get and store CheckIn Date in a variable
                cy.get('#checkinDate')
                  .invoke('val')
                  .then((text) => {
                    const checkInDate = text;
                    cy.wrap(checkInDate).should('eq', checkInDate)
                    // Will get and store CheckOut Date in a variable
                    cy.get('#checkoutDate')
                      .invoke('val')
                      .then((text) => {
                        const checkOutDate = text;
                        cy.wrap(checkOutDate).should('eq', checkOutDate)
                        cy.scrollTo('bottom')
                        cy.wait(3000)
                        // Here we will get the FullName and Save into Variable
                        cy.xpath('(//input[@id="6"])[1]')
                          .invoke('val')
                          .then((text) => {
                            const fName = text;
                            cy.wrap(fName).should('eq', fName)
                            // Here we will get the Email and Save into Variable
                            cy.xpath('(//input[@id="1"])[1]')
                              .invoke('val')
                              .then((text) => {
                                const emailText = text;
                                cy.wrap(emailText).should('eq', emailText)
                                cy.scrollTo('top').wait(2000)
                                // Now user will go to Payments and Copy the Amount 
                                cy.get('#tab_general-payment-detail > .mt-sm-15')
                                  .click({ force: true })
                                cy.scrollTo('bottom')
                                cy.wait(4000)
                                cy.get('.col-md-4 > .table-responsive > .table > :nth-child(1) > .text-right')
                                  .then($text => {
                                    const tAmount = $text.text();
                                    cy.log(tAmount)
                                    // User will logout from the portal and will open CheckIn link
                                    loginPage.logout()
                                    cy.visit(link)
                                    cy.wait(4000)
                                    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
                                    cy.wait(2000)
                                    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(3000)
                                    // Validate Reference Number
                                    cy.get('span.single-line.notranslate')
                                      .then(($ref) => {
                                        const referenceID = $ref.text().trim()
                                        cy.wrap(bookingID).should('eq', referenceID)
                                        // Validate Soruce type
                                        cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
                                          .then(($sour) => {
                                            const sourceType = $sour.text().trim()
                                            cy.wrap(sourceType).should('eq', source)
                                            // Validate Amount
                                            cy.get(':nth-child(1) > :nth-child(2) > .dl-with-icon > .notranslate')
                                              .then(($amount) => {
                                                const amountTotal = $amount.text().trim()
                                                cy.wrap(amountTotal).should('eq', tAmount)
                                                // Validate check In date
                                                cy.get(':nth-child(1) > .dl-with-icon > .notranslate')
                                                  .then($cIn => {
                                                    const dateCheckIn = $cIn.text().replace(/,/g, '');
                                                    cy.log(dateCheckIn)
                                                    cy.wrap(dateCheckIn).should('eq', checkInDate)
                                                    // Validate CheckOut Date
                                                    cy.get(':nth-child(2) > :nth-child(2) > .dl-with-icon > .notranslate')
                                                      .then($cOut => {
                                                        const dateCheckOut = $cOut.text().replace(/,/g, '');
                                                        cy.log(dateCheckOut)
                                                        cy.wrap(dateCheckOut).should('eq', checkOutDate).wait(3000)
                                                        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
                                                        cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
                                                        cy.wait(3000)
                                                        //Here we will validate Full Name and Email entered during Booking
                                                        cy.xpath('(//input[@id="6"])[1]')
                                                          .invoke('val')
                                                          .then((text) => {
                                                            const fullName = text;
                                                            cy.wrap(fullName).should('eq', fName)
                                                            //Here we will validate Full Name and Email entered during Booking
                                                            cy.xpath('(//input[@id="1"])[1]')
                                                              .invoke('val')
                                                              .then((text) => {
                                                                const emailAddress = text;
                                                                cy.wrap(emailAddress).should('eq', emailText)
                                                                preCheckIn.addBasicInfo() //Add and validate basic info
                                                                preCheckIn.fillQuestionnaires() //Fill Questionnier
                                                                preCheckIn.selectArrivalBy('Car') //Select Car
                                                                preCheckIn.addAndValidateIdCard()
                                                                preCheckIn.takeSelfy()
                                                                // Guest Verification
                                                                cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)')
                                                                  .should('contain.text', 'Guest Details\n                        1/1')
                                                                cy.get('table[class="table guest-table"] h6[class="guest-name"]')
                                                                  .then($text => {
                                                                    const guestName = $text.text();
                                                                    cy.log(guestName)
                                                                    cy.wrap(fName).should('eq', guestName) //Validate Guest Name
                                                                    cy.get("table[class='table guest-table'] span[class='guest-email']")
                                                                      .then($text => {
                                                                        const guestEmail = $text.text();
                                                                        cy.log(guestEmail)
                                                                        cy.wrap(emailText).should('eq', guestEmail) //Validate Email
                                                                        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
                                                                        preCheckIn.allAddOnServices() //Select All AddOns Services
                                                                        preCheckIn.addCreditCardInfo() //Add caredit card and submit the payment, proceed to Summary page
                                                                        // Validate Summary Page
                                                                        cy.get('.page-title').should('contain', 'Your Summary')
                                                                        cy.get('.mb-0.notranslate').should('contain', 'CA')
                                                                        cy.wait(3000)
                                                                        // Validate Source
                                                                        cy.get('div[class="gp-property-dl small"] span')
                                                                          .then(($sSource) => {
                                                                            const mySumSource = $sSource.text().replace(/Booked with /g, '')
                                                                            cy.log(mySumSource)
                                                                            cy.wrap(mySumSource).should('eq', source)
                                                                            // Validate Review Booking Detail
                                                                            cy.get('div[class="col"] h4').should('contain', 'REVIEW BOOKING DETAILS')
                                                                            cy.get('.col-md-12 > .row > :nth-child(1) > .gp-dl > dd')
                                                                              .then(($sRefNo) => {
                                                                                const myRefNo = $sRefNo.text()
                                                                                cy.log(myRefNo)
                                                                                cy.wrap(myRefNo).should('eq', bookingID)
                                                                                cy.get(':nth-child(2) > .gp-dl > .notranslate')
                                                                                  .then(($sAmount) => {
                                                                                    const mySumAmount = $sAmount.text()
                                                                                    cy.log(mySumAmount)
                                                                                    cy.wrap(mySumAmount).should('eq', tAmount)
                                                                                    cy.get(':nth-child(3) > .gp-dl > .notranslate')
                                                                                      .then(($sCIn) => {
                                                                                        const myCheckInDate = $sCIn.text().replace(/,/g, '');
                                                                                        cy.log(myCheckInDate)
                                                                                        cy.wrap(myCheckInDate).should('eq', checkInDate)
                                                                                        cy.get('.col-md-12 > .row > :nth-child(4) > .gp-dl > .notranslate')
                                                                                          .then(($sCOut) => {
                                                                                            const myCheckOutDate = $sCOut.text().replace(/,/g, '');
                                                                                            cy.log(myCheckOutDate)
                                                                                            cy.wrap(myCheckOutDate).should('eq', checkOutDate)
                                                                                            // Validate Booking info
                                                                                            cy.get(':nth-child(4) > .row > :nth-child(1) > .gp-dl > dd')
                                                                                              .then($infoName => {
                                                                                                const myName = $infoName.text();
                                                                                                cy.log(myName)
                                                                                                cy.wrap(myName).should('eq', fName)
                                                                                                cy.get(':nth-child(5) > .gp-dl > dd')
                                                                                                  .then($infoEmail => {
                                                                                                    const myEmail = $infoEmail.text();
                                                                                                    cy.log(myEmail)
                                                                                                    cy.wrap(myEmail).should('eq', emailText)
                                                                                                    preCheckIn.verifySummaryContactInfo()
                                                                                                    preCheckIn.verifySummaryQuestionnairesInfo()
                                                                                                    preCheckIn.verifySummaryArrival('Car')
                                                                                                    preCheckIn.verifySummaryIDcardInfo()
                                                                                                    preCheckIn.verifySummaryPaymentMethod()
                                                                                                    preCheckIn.verifySummarySignature()
                                                                                                  })
                                                                                              })
                                                                                          })
                                                                                      })
                                                                                  })
                                                                              })
                                                                          })
                                                                      })
                                                                  })
                                                              })
                                                          })
                                                      })
                                                  })
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
  })
  it('CA_CPCT_02 > Validate Complete Pre Check-In Process using document as Driving License, Arrival by other, add more Guests and using only one Service from all', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult. 1Child)
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]")
      .click({ force: true })
    cy.xpath("(//a[@class='dropdown-item notranslate'])[1]")
      .then(($button) => {
        const link = $button.attr('href');
        cy.wrap(link).as('myLink');
        cy.log(link)
        // Here we will copy the and Visit the Pre Check-In process after logout from the portal
        cy.xpath("(//a[@class='dropdown-item notranslate'])[3]")
          .invoke("removeAttr", "target", { force: true })
          .click({ force: true })
        cy.url().should('include', '/booking-detail')
        cy.get('.booking-property-heading').should('have.text', 'Waqas DHA')
        cy.wait(4000)
        // Will get and store BookingId value in a variable
        cy.get('#bookingID')
          .invoke('val')
          .then((text) => {
            const bookingID = text;
            cy.wrap(bookingID).should('eq', bookingID)
            // Will get and store Source value in a variable
            cy.get('#source')
              .invoke('val')
              .then((text) => {
                const source = text;
                cy.wrap(source).should('eq', source)
                // Will get and store CheckIn Date in a variable
                cy.get('#checkinDate')
                  .invoke('val')
                  .then((text) => {
                    const checkInDate = text;
                    cy.wrap(checkInDate).should('eq', checkInDate)
                    // Will get and store CheckOut Date in a variable
                    cy.get('#checkoutDate')
                      .invoke('val')
                      .then((text) => {
                        const checkOutDate = text;
                        cy.wrap(checkOutDate).should('eq', checkOutDate)
                        cy.scrollTo('bottom')
                        cy.wait(3000)
                        // Here we will get the FullName and Save into Variable
                        cy.xpath('(//input[@id="6"])[1]')
                          .invoke('val')
                          .then((text) => {
                            const fName = text;
                            cy.wrap(fName).should('eq', fName)
                            // Here we will get the Email and Save into Variable
                            cy.xpath('(//input[@id="1"])[1]')
                              .invoke('val')
                              .then((text) => {
                                const emailText = text;
                                cy.wrap(emailText).should('eq', emailText)
                                cy.scrollTo('top').wait(2000)
                                // Now user will go to Payments and Copy the Amount 
                                cy.get('#tab_general-payment-detail > .mt-sm-15')
                                  .click({ force: true })
                                cy.scrollTo('bottom')
                                cy.wait(4000)
                                cy.get('.col-md-4 > .table-responsive > .table > :nth-child(1) > .text-right')
                                  .then($text => {
                                    const tAmount = $text.text();
                                    cy.log(tAmount)
                                    // User will logout from the portal and will open CheckIn link
                                    loginPage.logout()
                                    cy.visit(link)
                                    cy.wait(4000)
                                    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
                                    cy.wait(2000)
                                    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(3000)
                                    // Validate Reference Number
                                    cy.get('span.single-line.notranslate')
                                      .then(($ref) => {
                                        const referenceID = $ref.text().trim()
                                        cy.log(referenceID)
                                        cy.wrap(referenceID).should('eq', bookingID)
                                        // Validate Soruce type
                                        cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
                                          .then(($sour) => {
                                            const sourceType = $sour.text().trim()
                                            cy.wrap(sourceType).should('eq', source)
                                            // Validate Amount
                                            cy.get(':nth-child(1) > :nth-child(2) > .dl-with-icon > .notranslate')
                                              .then(($amount) => {
                                                const amountTotal = $amount.text().trim()
                                                cy.wrap(amountTotal).should('eq', tAmount)
                                                // Validate check In date
                                                cy.get(':nth-child(1) > .dl-with-icon > .notranslate')
                                                  .then($cIn => {
                                                    const dateCheckIn = $cIn.text().replace(/,/g, '');
                                                    cy.log(dateCheckIn)
                                                    cy.wrap(dateCheckIn).should('eq', checkInDate)
                                                    // Validate CheckOut Date
                                                    cy.get(':nth-child(2) > :nth-child(2) > .dl-with-icon > .notranslate')
                                                      .then($cOut => {
                                                        const dateCheckOut = $cOut.text().replace(/,/g, '');
                                                        cy.log(dateCheckOut)
                                                        cy.wrap(dateCheckOut).should('eq', checkOutDate).wait(3000)
                                                        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
                                                        cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
                                                        cy.wait(3000)
                                                        //Here we will validate Full Name and Email entered during Booking
                                                        cy.xpath('(//input[@id="6"])[1]')
                                                          .invoke('val')
                                                          .then((text) => {
                                                            const fullName = text;
                                                            cy.wrap(fullName).should('eq', fName)
                                                            //Here we will validate Full Name and Email entered during Booking
                                                            cy.xpath('(//input[@id="1"])[1]')
                                                              .invoke('val')
                                                              .then((text) => {
                                                                const emailAddress = text;
                                                                cy.wrap(emailAddress).should('eq', emailText)
                                                                preCheckIn.addBasicInfo() //Add and validate basic info
                                                                preCheckIn.fillQuestionnaires() //Fill Questionnier
                                                                preCheckIn.selectArrivalBy('Other')
                                                                preCheckIn.addAndValidateDrivingDoc()
                                                                preCheckIn.takeSelfy()
                                                                preCheckIn.addValidateNewGuest()
                                                                preCheckIn.selectAddOnService1()
                                                                preCheckIn.addCreditCardInfo()
                                                                // Validate Summary Page
                                                                cy.get('.page-title').should('contain', 'Your Summary')
                                                                cy.get('.mb-0.notranslate').should('contain', 'CA')
                                                                cy.wait(3000)
                                                                // Validate Source
                                                                cy.get('div[class="gp-property-dl small"] span')
                                                                  .then(($sSource) => {
                                                                    const mySumSource = $sSource.text().replace(/Booked with /g, '')
                                                                    cy.log(mySumSource)
                                                                    cy.wrap(mySumSource).should('eq', source)
                                                                    // Validate Review Booking Detail
                                                                    cy.get('div[class="col"] h4').should('contain', 'REVIEW BOOKING DETAILS')
                                                                    cy.get('.col-md-12 > .row > :nth-child(1) > .gp-dl > dd')
                                                                      .then(($sRefNo) => {
                                                                        const myRefNo = $sRefNo.text()
                                                                        cy.log(myRefNo)
                                                                        cy.wrap(myRefNo).should('eq', bookingID)
                                                                        cy.get(':nth-child(2) > .gp-dl > .notranslate')
                                                                          .then(($sAmount) => {
                                                                            const mySumAmount = $sAmount.text()
                                                                            cy.log(mySumAmount)
                                                                            cy.wrap(mySumAmount).should('eq', tAmount)
                                                                            cy.get(':nth-child(3) > .gp-dl > .notranslate')
                                                                              .then(($sCIn) => {
                                                                                const myCheckInDate = $sCIn.text().replace(/,/g, '');
                                                                                cy.log(myCheckInDate)
                                                                                cy.wrap(myCheckInDate).should('eq', checkInDate)
                                                                                cy.get('.col-md-12 > .row > :nth-child(4) > .gp-dl > .notranslate')
                                                                                  .then(($sCOut) => {
                                                                                    const myCheckOutDate = $sCOut.text().replace(/,/g, '');
                                                                                    cy.log(myCheckOutDate)
                                                                                    cy.wrap(myCheckOutDate).should('eq', checkOutDate)
                                                                                    // Validate Booking info
                                                                                    cy.get(':nth-child(4) > .row > :nth-child(1) > .gp-dl > dd')
                                                                                      .then($infoName => {
                                                                                        const myName = $infoName.text();
                                                                                        cy.log(myName)
                                                                                        cy.wrap(myName).should('eq', fName)
                                                                                        cy.get(':nth-child(5) > .gp-dl > dd')
                                                                                          .then($infoEmail => {
                                                                                            const myEmail = $infoEmail.text();
                                                                                            cy.log(myEmail)
                                                                                            cy.wrap(myEmail).should('eq', emailText)
                                                                                            preCheckIn.verifySummaryContactInfo()
                                                                                            preCheckIn.verifySummaryQuestionnairesInfo()
                                                                                            preCheckIn.verifySummaryArrival('Other')
                                                                                            preCheckIn.verifySummaryLicenseInfo()
                                                                                            preCheckIn.verifySummaryPaymentMethod()
                                                                                            preCheckIn.verifySummarySignature()
                                                                                          })
                                                                                      })
                                                                                  })
                                                                              })
                                                                          })
                                                                      })
                                                                  })
                                                              })
                                                          })
                                                      })
                                                  })
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
  })
  it('CA_CPCT_03 > Validate Booking Guest PrecheckIn status when the Primary guest complete the pre CheckIn on booking listing page. ', () => {
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 1, 0) //Create a new booking and validate (1Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest Detail Tab
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
  })
  it("CA_CPCT_04 > Validate Under 'Who is required to Complete the Above Details?' setting if only primary guest is selected then pre-checkin will get completed when primary guest complete pre-checkin and also 2 emails sent for Pre Check-in Completed one is for guest and second one for client", () => {
    onlineCheckinSettings.applySelectOnlyPrimaryGuestSettings()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 1, 0) //Create a new booking and validate (1Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //The guest tab will not be shown, user is directed to AllAddons tab
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card detail and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
  })
  it("CA_CPCT_05 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected “When primary guest completes it” under When is pre check-in considered completed? settings then guest will tab and mark completed when Only the primary guest complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
  })
  it("CA_CPCT_06 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected ”When all required guests complete it” under When is pre check-in considered completed? settings then guest will tab and mark completed when all guests complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.adultChildrenBabiesWithAllRequiredGuest()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    preCheckIn.editGuestDetail("Child") //Add detail in 1st incomplete Guest (Child)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_07 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected “When primary guest completes it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithPrimary()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_08 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected ”When all required guests complete it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_09 > Validate If user try to complete the Pre CheckIn process without filling All Guest detail above 18. They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button 
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321')
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings() 
  })
  it('CA_CPCT_10 > Validate If user try to complete the Pre CheckIn process without filling all Guest detail (Adult, Children and Babies). They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.selectWhenAllGuestRequired()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321')
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it("CA_CPCT_11 > If Who is required to upload the document? is selected to 'All guests' then all guests need to upload ID based on basic info settings who will complete pre-checkin", () => {
    onlineCheckinSettings.allGuestOver18UploadID()
    bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetailAddIDCard('Adult') //Add guest and ID detail in 1st incomplete Adult
    //apply previous settings
    cy.visit('/')
    loginPage.happyLogin('automation9462@gmail.com', 'Boring321')
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
  })
})


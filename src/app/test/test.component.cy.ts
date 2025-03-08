import { signal } from '@angular/core';
import { TestComponent } from './test.component';
import { createOutputSpy } from 'cypress/angular';

describe('TestComponent', () => {
  it('mounts', () => {
    cy.mount(TestComponent, {
      componentProperties: {
        title: 'test',
      },
    });
  });

  it('title should be "test"', () => {
    cy.mount(TestComponent, {
      componentProperties: {
        title: 'test',
      },
    });
    cy.get('[data-cy=test-component-title-display]').should(
      'have.text',
      'test'
    );
  });

  it('count should be "3"', () => {
    cy.mount(TestComponent, {
      componentProperties: {
        title: 'Test Component',
        count: 3,
      },
    });

    cy.get('[data-cy="test-component-count-display"]').should('have.text', '3');
  });

  it('change title value from "Test Component" to "FooBar" with set function of signal', () => {
    const myTitlePropAsSignal = signal('Test Component');
    cy.mount(TestComponent, {
      componentProperties: {
        title: myTitlePropAsSignal,
      },
    });

    cy.get('[data-cy="test-component-title-display"]').should(
      'have.text',
      'Test Component'
    );
    cy.then(() => {
      // now set the input() through a signal to update the one-way binding
      myTitlePropAsSignal.set('FooBar');
    });

    cy.get('[data-cy="test-component-title-display"]').should(
      'have.text',
      'FooBar'
    );
  });

  it('change count value from "5" to "8" with set function of signal', () => {
    let count = signal(5);
    cy.mount(TestComponent, {
      componentProperties: {
        title: 'Test Component',
        count,
      },
    });

    cy.get('[data-cy="test-component-count-display"]').should('have.text', '5');

    cy.then(() => {
      // now set the model() through a signal to update the binding in the component
      count.set(8);
    });

    cy.get('[data-cy="test-component-count-display"]').should('have.text', '8');

    // some action occurs that changes the count to 9 inside the component, which updates the binding in our test
    cy.get('[data-cy="test-component-count-incr"]').click();
    cy.get('[data-cy="test-component-count-display"]').should('have.text', '9');
    cy.then(() => {
      expect(count()).to.equal(9);
    });
  });

  it('spy count change', () => {
    cy.mount(TestComponent, {
      componentProperties: {
        title: 'Test Component',
        count: 4,
        // @ts-expect-error
        countChange: createOutputSpy('countChange'),
      },
    });

    // some action occurs that changes the count
    cy.get('[data-cy="test-component-count-incr"]').click();
    cy.get('[data-cy="test-component-count-display"]').should('have.text', '5');
    cy.get('@countChange').should('have.been.called');
    cy.get('@countChange').should('have.been.calledWith', 5);
  });
});

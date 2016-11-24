angular.module('starter')
//this is the controller for login
.service('SwipeService', function($ionicPopup) {
'use strict';
  //The class for our note cards
  class Cards {
    //Defining the card object and all of its properties
    constructor () {
      //Targets all the HTML elements in the document with the '.card' class
      this.cards = Array.from(document.querySelectorAll('.card'));

      //Binds the onStart function to the current selected element to check if the client started moving the element
      this.onStart = this.onStart.bind(this);

      //Binds the onMove function to the current started element to check if its moving
      this.onMove = this.onMove.bind(this);

      //Binds the onEnd function to the current moving element to check if the movement ended
      this.onEnd = this.onEnd.bind(this);

      //Binds the onUpdate function to the current selected element to check if an animation is needed
      this.update = this.update.bind(this);


      this.targetBCR = null;
      this.target = null;
      this.startX = 0;
      this.currentX = 0;
      this.screenX = 0;
      this.targetX = 0;

      //Per default the dragging is set to false
      this.draggingCard = false;

      //Calls the event listeners to check if any events are happening
      this.addEventListeners();

      //Request an animation for each frame as an update to the element
      requestAnimationFrame(this.update);
    }

    //Our event listeners
    addEventListeners () {
      //Touch start event, checks if the user is touching the card
      document.addEventListener('touchstart', this.onStart);

      //Touch move event, checks if the user is moving the card
      document.addEventListener('touchmove', this.onMove);

      //Touch end event, checks if the user is no longer touching the card
      document.addEventListener('touchend', this.onEnd);

      //Mouse start event
      document.addEventListener('mousedown', this.onStart);

      //Mouse move event
      document.addEventListener('mousemove', this.onMove);

      //Mouse end event
      document.addEventListener('mouseup', this.onEnd);
    }

    //onStart function, fires when the user starts touching or clicking on the card
    onStart (evt) {
      if (this.target)
        return;

      if (!evt.target.classList.contains('card'))
        return;

      console.log('card moving');
      this.target = evt.target;
      this.targetBCR = this.target.getBoundingClientRect();

      this.startX = evt.pageX || evt.touches[0].pageX;
      this.currentX = this.startX;

      this.draggingCard = true;
      this.target.style.willChange = 'transform';

      evt.preventDefault();
    }

    //onMove function, fires when the card is being moved and calculates where the card is moving
    onMove (evt) {
      if (!this.target)
        return;

      this.currentX = evt.pageX || evt.touches[0].pageX;
    }

    //onEnd function, fires when the card is no longer being touched and is done moving
    onEnd (evt) {
      if (!this.target)
        return;

      this.targetX = 0;
      var screenX = this.currentX - this.startX;
      var threshold = this.targetBCR.width * 0.35;
      if (Math.abs(screenX) > threshold) {
        $ionicPopup.confirm({
            title: 'Delete this note?',
            buttons: [{ text: 'Cancel' },
            {
            text: '<b>OK</b>',
            type: 'button-positive',

            /// how to get a vlue into array!!! 
            onTap: function(width) {
              this.targetX = (screenX > 0) ?
                  this.targetBCR.width :
                  -this.targetBCR.width;
              }
            }
          ]
        });
        /*} else {
          this.resetTarget();*/
        /*let ConfirmDismiss = confirm("Are you sure you want to delete this note?");
        if(ConfirmDismiss){
          this.targetX = (screenX > 0) ?
              this.targetBCR.width :
              -this.targetBCR.width;*/
      /*  function deleteIt(){
          this.targetX = (screenX > 0) ?
              this.targetBCR.width :
              -this.targetBCR.width;
        };
        function resetIt(){this.resetTarget()};
        $ionicPopup.confirm(
          {
              title: 'Delete this note?',
              buttons: [
                { text: 'Delete', onTap: function(e){

                } {  var deleteIt = true; return deleteIt;  } },
                { text: 'Cancel', onTap: resetIt(){  var deleteIt = false; return deleteIt; } }
              ]
            });*/

      }

      this.draggingCard = false;
    }

    //update function, updates the element and animates the changes happening to it
    update () {

      requestAnimationFrame(this.update);

      if (!this.target)
        return;

      if (this.draggingCard) {
        this.screenX = this.currentX - this.startX;
      } else {
        this.screenX += (this.targetX - this.screenX) / 4;
      }

      const normalizedDragDistance =
          (Math.abs(this.screenX) / this.targetBCR.width);
      const opacity = 1 - Math.pow(normalizedDragDistance, 3);

      this.target.style.transform = `translateX(${this.screenX}px)`;
      this.target.style.opacity = opacity;

      // User has finished dragging.
      if (this.draggingCard)
        return;

      const isNearlyAtStart = (Math.abs(this.screenX) < 0.1);
      const isNearlyInvisible = (opacity < 0.01);

      // If the card is nearly gone.
      if (isNearlyInvisible) {

        // Bail if there's no target or it's not attached to a parent anymore.
        if (!this.target || !this.target.parentNode)
          return;

        this.target.parentNode.removeChild(this.target);

        const targetIndex = this.cards.indexOf(this.target);
        this.cards.splice(targetIndex, 1);

        // Slide all the other cards.
        this.animateOtherCardsIntoPosition(targetIndex);

      } else if (isNearlyAtStart) {
        this.resetTarget();
      }
    }

    //animation function, animated the other cards into position when the one above has been removed
    animateOtherCardsIntoPosition (startIndex) {
      // If removed card was the last one, there is nothing to animate.
      // Remove the target.
      if (startIndex === this.cards.length) {
        this.resetTarget();
        return;
      }

      const onAnimationComplete = evt => {
        const card = evt.target;
        card.removeEventListener('transitionend', onAnimationComplete);
        card.style.transition = '';
        card.style.transform = '';

        this.resetTarget();
      };

      // Set up all the card animations.
      for (let i = startIndex; i < this.cards.length; i++) {
        const card = this.cards[i];

        // Move the card down then slide it up.
        card.style.transform = `translateY(${this.targetBCR.height + 20}px)`;
        card.addEventListener('transitionend', onAnimationComplete);
      }

      // Now init them.
      requestAnimationFrame(_ => {
        for (let i = startIndex; i < this.cards.length; i++) {
          const card = this.cards[i];

          // Move the card down then slide it up, with delay according to "distance"
          card.style.transition = `transform 150ms cubic-bezier(0,0,0.31,1) ${i*50}ms`;
          card.style.transform = '';
        }
      });
    }

    //resetTarget function, resets the target back to its original state
    resetTarget () {
      if (!this.target)
        return;

      this.target.style.willChange = 'initial';
      this.target.style.transform = 'none';
      this.target.style.opacity = 1;
      this.target = null;
    }
  }

  //eventlistener for the window to check if any new cards arrived
  window.addEventListener('load', () => new Cards());



});

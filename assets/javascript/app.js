$(document).ready(function() {

    var questionObj;
    var totalQuestions = 15;
    var currentQuestion = 1;
    var animationLength = 2000;
    var correct = 0;
    var incorrect = 0;
    var answerLength = 4;
    var answerDisplay = answerLength;
    var responseIntervalId;
    var responseLength = 20;
    var responseTime = responseLength;
    var audioElement;

    function startGame() {

        // empty the main container
        $("#main").fadeOut(750);

        // hide the start button
        $(".start-button").fadeOut(750);

        // play the music when the game is started
        playSong();
        
        // start the first question using the runQuestion function after everything has faded out
        setTimeout(runQuestion, 1250);
    }

    function playSong() {

        // create the audio element for the song and set the source file
        audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "assets/music/dawn.mp3");
        
        // add an event listener to determine when the song has ended so that it can be played again
        audioElement.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        // play the song the first time
        audioElement.play();
    }

    function runQuestion() {
        
        // set the question object using the current question counter
        questionObj = eval(`question` + [currentQuestion]);

        // run the question timer
        questionTimer();

        // display the question using the current question object
        displayQuestion(questionObj);
    }

    function questionTimer() {

        // resets the response time to the full amount of time at the start of each question
        responseTime = responseLength;

        // display the timer on the page and populate it with the response time
        $("#timer").fadeIn(750);
        $("#timer").html(responseTime);

        // run the countdown function every second
        responseIntervalId = setInterval(countdown, 1000);
    }

    function countdown() {

        // decrease the response time by 1
        responseTime--;

        // update the timer on the page
        $("#timer").html(responseTime);

        // tasks if the timer gets to 0 
        if(responseTime === 0) {

            // stop the timer and display the time's up message
            stopTimer();
            $("#timer").html("your time is up");

            // after 3 seconds, call the timesUp function
            setTimeout(timesUp, 3000);

            // fade out the answer buttons
            $(".answer-button").fadeOut(750);

            // display the incorrect message on the page and increase the number of incorrect answers
            $("#message").text(questionObj.incorrectMessage);
            incorrect++;

            // increase the currentQuestion to prepare for the next question
            currentQuestion++;

            // run answer timer which controls how long the answer message is displayed
            answerTimer();
        }
    }

    // stops the timer
    function stopTimer() {

        clearInterval(responseIntervalId);
    }

    // delayed tasks set to occur when the time expires
    function timesUp() {

        // fade out the time's up message
        $("#timer").fadeOut(750);

        // transition the body and answer button
        $("body").animate({
            backgroundColor: questionObj.backgroundColor,
            color: questionObj.fontColor,
        }, animationLength);

        $(".answer-button").animate({color: questionObj.fontColor}, animationLength);
    }

    // displays the question on the page
    function displayQuestion(obj) {

        // sets the answerDisplay back to it's starting length for the next answer
        answerDisplay = answerLength;

        // populates the message container with the question
        $("#message").fadeIn(750);
        $("#message").text(obj.question);

        // display the answer buttons
        $(".answer-button").fadeIn(750);
        $(".answer-button").css('display', 'block');

        // populate and style the answer buttons 
        for (var i = 1; i <= 4; i++) {
            var objAnswer = eval(`obj.answer` + [i]);
            var objBackground = eval(`obj.answer` + [i] + `color`);
            var answerButton = $(`#answer` + [i]);

            // populate the answer button with its corresponding text
            answerButton.text(objAnswer);

            // style the answer button with its corresponding color
            answerButton.css('background-color', objBackground);
        }
    }

    function processAnswer() {

        // increase the current question counter by 1 for the next question
        currentQuestion++;

        // stop the timer
        stopTimer();

        // hide the timer
        $("#timer").fadeOut(750);

        // store the value of the button the user clicks.
        var userAnswer = $(this).attr("value");

        // convert the userAnswer to an integer to compare to the object's correct answer
        userAnswer = parseInt(userAnswer);

        // hide the answer buttons
        $(".answer-button").fadeOut(750);

        // transition the body and answer buttons based on the question settings
        $("body").animate({
            backgroundColor: questionObj.backgroundColor,
            color: questionObj.fontColor,
        }, animationLength);

        $(".answer-button").animate({color: questionObj.fontColor}, animationLength);

        // if the answer is correct, display the correct message and increase correct answers by 1. 
        // Otherwise display the incorrect message and increase incorrect answers by 1.
        if (userAnswer === questionObj.correctAnswer) {
            $("#message").text(questionObj.correctMessage);
            correct++;
        } else {
            $("#message").text(questionObj.incorrectMessage);
            incorrect++;
        }

        // start the answer timer
        answerTimer();
    }

    // controls how long the answer is displayed to the user
    function answerTimer() {

        // if the currentQuestion is greater than the number of questions, run the gameover function.  Otherwise, run another question
        if(currentQuestion <= totalQuestions) {
            setTimeout(runQuestion, 1000 * answerLength);
        } else {
            setTimeout(gameOver, 1000 * answerLength);
        }
    }

    function gameOver() {

        // display the main message field and populate with messages based on their correct answers
        $("#main").fadeIn(750);
        if(correct >= 12) {
            $("#main").text("you did well");
        } else if (correct > 8) {
            $("#main").text("you have potential to do better");
        } else {
            $("#main").text("this was not for you");
        }

        // display the results on the page
        $(".results").text(correct + " of " + totalQuestions + " were correct")

        // hide the answer buttons
        $(".answer-button").css('display', 'none');
        
        // reset the game settings
        setTimeout(resetGame, 2000);
    }

    function resetGame() {

        // turns off the music
        audioElement.pause();

        // hide the results
        $(".results").fadeOut(750);

        // display the start button
        $(".start-button").text('try again');
        $(".start-button").css('display', 'block');

        // reset the variables
        questionObj;
        currentQuestion = 1;
        correct = 0;
        incorrect = 0;
    }

    $(".start-button").on("click", startGame);

    $(".answer-button").on("click", processAnswer);

});
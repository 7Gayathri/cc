
(function ($) {
    function Hash(config) {
        this.config = config;
        this.clickedDotsSequence = [];
        this.initialStates = {};
        this.init();
    }

    Hash.prototype.init = function () {
        console.log("Hash");
        
        var _this = this;
        $(document).ready(function ($) {
            $('main').each(function () {
                var totalQuestions = $(this).find('.question').length;
        
                // Hide all questions initially
                $(this).find('.question').each(function () {
                    var questionClass = $(this).attr('class').split(' ').find(c => c.startsWith('q'));
                    _this.initialStates[questionClass] = $(this).html();
                    $(this).hide();
                });
        
                // Retrieve stored question index
                var currentQuestionIndex = localStorage.getItem('currentQuestionIndex');
                if (currentQuestionIndex !== null) {
                    currentQuestionIndex = parseInt(currentQuestionIndex, 10) - 1;
                    var $currentQuestion = $(this).find('.question').eq(currentQuestionIndex);
                    $currentQuestion.show().addClass('active');
                    _this.updateQuestionDisplay($currentQuestion, totalQuestions, false);
                } else {
                    var $firstQuestion = $(this).find('.question').first();
                    $firstQuestion.show().addClass('active');
                    _this.updateQuestionDisplay($firstQuestion, totalQuestions, false);
                }
        
                var answersData = []; // Initialize empty array before using it

                $(".submit-btn").on("click", function () {
                    var $currentQuestion = $(".question.active");
                
                    if ($currentQuestion.hasClass("assessment")) {
                        var correctAnswer = $currentQuestion.find(".answer").data("answer");
                        var selectedAnswer = $currentQuestion.find(".selected p").text();
                
                        if (selectedAnswer && correctAnswer && selectedAnswer.trim() === correctAnswer.trim()) {
                            $currentQuestion.attr("data-answered", "true");
                        
                        } 
                    }
                });
               
                function updateNextBtnState() {
                    let $currentQuestion = $(".question.active");
                    let isAssessment = $currentQuestion.hasClass("assessment");
                    let isAnsweredCorrectly = $currentQuestion.attr("data-correct") === "true";
        
                    console.log("Checking Next Btn State:", isAssessment, isAnsweredCorrectly);
        
                    $(".next-btn").toggleClass("disabled", isAssessment && !isAnsweredCorrectly).css({
                        "pointer-events": isAssessment && !isAnsweredCorrectly ? "none" : "auto",
                        "opacity": isAssessment && !isAnsweredCorrectly ? "0.4" : "1"
                    });
                }
        
                // ✅ Retrieve stored answers from localStorage
                let storedAnswers = JSON.parse(localStorage.getItem('storedAnswers')) || {};
        
                $(".question").each(function () {
                    let questionId = $(this).attr("id");  
                    let savedAnswer = storedAnswers[questionId];
        
                    if (savedAnswer) {
                        let correctAnswer = $(this).find(".answer").data("answer");
        
                        $(this).find(".box.ans-select").each(function () {
                            if ($(this).text().trim() === savedAnswer) {
                                $(this).addClass("selected");
        
                                if (savedAnswer.trim() === correctAnswer.trim()) {
                                    $(this).closest(".question").attr("data-correct", "true");
                                } else {
                                    $(this).closest(".question").attr("data-correct", "false");
                                }
                            }
                        });
                    }
                });
        
                // ✅ Call function immediately after restoring answers
                updateNextBtnState();
        
                // ✅ Answer Selection - Only enable Next if the correct answer is selected
                $('.box.ans-select').on('click', function () {
                    let $currentQuestion = $(this).closest(".question");
                    let questionId = $currentQuestion.attr("id");  
                    let selectedText = $(this).text().trim();
                    let correctAnswer = $currentQuestion.find(".answer").data("answer");
        
                    // Save answer in localStorage
                    storedAnswers[questionId] = selectedText;
                    localStorage.setItem('storedAnswers', JSON.stringify(storedAnswers));
        
                    // Remove previous selections
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
        
                    // ✅ Mark question as correctly answered only if the answer is correct
                    let isCorrect = selectedText === correctAnswer;
                    console.log("Selected Answer:", selectedText, "Correct Answer:", correctAnswer, "Is Correct?", isCorrect);
        
                    $currentQuestion.attr("data-correct", isCorrect ? "true" : "false");
        
                    // setTimeout(updateNextBtnState, 100); // Ensure state update
                });
        
                // ✅ Next Button Click - Move to Next Question (Only if answered correctly)
                $(".next-btn").on("click", function () {
                    let $currentQuestion = $(".question.active");
        
                    if ($currentQuestion.hasClass("assessment") && $currentQuestion.attr("data-correct") !== "true") {
                        return; // Prevent moving forward if wrong answer
                    }
        
                    _this.moveToNextQuestion($currentQuestion);
                    _this.updateQuestionDisplay($(".question.active"), totalQuestions);
        
                    // setTimeout(updateNextBtnState, 100);  // ✅ Ensure Next button updates
                    updateNextBtnState()
                });
        
                // ✅ Previous Button Click - Move to Previous Question
                $(".prev-btn").on("click", function () {
                    _this.moveToPreviousQuestion($(".question.active"));
                    _this.updateQuestionDisplay($(".question.active"), totalQuestions);
        
                    // setTimeout(updateNextBtnState, 100);  // ✅ Ensure Next button updates
                    updateNextBtnState()
                });
        
            });
        });
        


        $(document).ready(function () {
            // Retrieve stored selection from localStorage
            let storedSelection = localStorage.getItem('selectedAnswer');
        
            if (storedSelection) {
                $('.box.ans-select').each(function () {
                    if ($(this).text().trim() === storedSelection) {
                        $(this).addClass('selected');
                    }
                });
            }
        
            // Click event for selection
            $('.box.ans-select').on('click', function () {
                $(this).siblings().removeClass('selected'); // Remove previous selection
                $(this).addClass('selected'); // Add selected class
        
                // Store selection in localStorage
                let selectedText = $(this).text().trim();
                localStorage.setItem('selectedAnswer', selectedText);
            });
        
        });        


        $('main').on('click', '.ans-select, .ans-image', function () {
            $(this).siblings().removeClass('selected').end().addClass('selected');
        });
        $('#reset').click(function () {
            var $activeQuestion = $('.question.active'); // Get the active question
            _this.resetQuestion($activeQuestion);
        });
        $('.submit-btn').click(function () {
            console.log("Submit button clicked");
            $(this).css('background-color', '#6A3B88');
            _this.checkAnswers();
        });

    };
    
let lessonData = {};

Hash.prototype.checkQuestion = function ($question) {
    var lessonNumber = $question.data('lesson'); // Get lesson number
    var questionType = $question.data('question');
    var assessmentType = $question.data('assessment');
    var isCorrect = false;

    console.log("Lesson:", lessonNumber);
    console.log("Assessment Type:", assessmentType);
    console.log("Question Type:", questionType);

    // Get correct answer
    var correctAnswer = $question.find('.answer').data('answer') 
        ? $question.find('.answer').data('answer').toString().toLowerCase()
        : "";

    console.log("Correct Answer:", correctAnswer);

    switch (questionType) {
        case "select":
            var userAnswer = $question.find(".selected").text().toLowerCase().trim() || 
                             $question.find(".selected").attr("alt");
            isCorrect = userAnswer === correctAnswer;
            console.log("User Answer:", userAnswer);
            console.log("Is Correct:", isCorrect);
            break;
        default:
            break;
    }

    // ✅ Store all assessments inside the same lesson
    if (!lessonData[`lesson ${lessonNumber}`]) {
        lessonData[`lesson ${lessonNumber}`] = []; // Initialize lesson if not exists
    }

    // ✅ Check if this assessment type already exists in the lesson
    let existingAssessment = lessonData[`lesson ${lessonNumber}`].find(
        (entry) => entry.skillType === assessmentType
    );

    if (existingAssessment) {
        // Update the existing assessment completion status
        existingAssessment.skillCompletion = isCorrect;
    } else {
        // Add a new assessment if it doesn't exist
        lessonData[`lesson ${lessonNumber}`].push({
            skillType: assessmentType,
            skillCompletion: isCorrect
        });
    }

    console.log("Updated Lesson Data:", JSON.stringify(lessonData, null, 2));

    // ✅ Send updated lesson data to the server
    fetch("http://localhost:4000/save-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
    })
    .then((response) => response.json())
    .then((data) => console.log("Data saved:", data))
    .catch((error) => console.error("Error saving data:", error));

    return {
        assessmentType: assessmentType,
        isCorrect: isCorrect,
    };
};
    
$("#congrats-popup").dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    draggable: false,
    closeOnEscape: true,
    dialogClass: "custom-overlay",
    open: function () {
        $(".ui-dialog-titlebar").hide();

        $(this).parent().css({
            position: 'fixed',
            width: '100%',
            height: '100%'
        });

        $(this).css({
            width: '100%',
            height: '100%'
        });

        // Disable Next & Prev buttons while popup is open
        $(".next-btn-static, .prev-btn-static").addClass("disabled").css({
            "pointer-events": "none",
            "z-index": "unset"
        });
    },

    close: function () {
        var $currentQuestion = $(".question.active");
        var isCorrect = $currentQuestion.attr("data-correct") === "true"; // ✅ Use 'data-correct'

        if (isCorrect || localStorage.getItem("answeredCorrectly") === "true") {
            $(".next-btn").removeClass("disabled").css({
                "pointer-events": "auto",
                "opacity": "1"
            });

            // ✅ Store in localStorage only if the answer was correct
            localStorage.setItem("answeredCorrectly", "true");
        } else {
            $(".next-btn").addClass("disabled").css({
                "pointer-events": "none",
                "opacity": "0.4"
            }).show();
        }

        // Always enable the Prev button after closing
        $(".prev-btn").removeClass("disabled").css({
            "pointer-events": "auto",
            "opacity": "1"
        });
    }
});

// ✅ Close the popup only when clicking the background, NOT inside content
$("#congrats-popup").click(function (event) {  
    if (event.target === this) {  // Ensures only background click closes
        $(this).dialog("close");
        $(".next-btn-static, .prev-btn-static")
    .removeClass("disabled")
    .css({
        "pointer-events": "none",
        "z-index": "1"
    });
    }
});


    function updateDatabaseForQuestion() {

    }

    function QuestionCompleted() {
    }
    Hash.prototype.checkAnswers = function () {
        var _this = this;
    
        $('main').each(function () {
            var data=[]
            console.log(data)
            var totalQuestions = $(this).find('.question').length;
            var allQuestions = $(this).find('.question');
    
            var $currentQuestion = allQuestions.filter('.active');
            var $nextQuestion = $currentQuestion.next('.question');
            console.log("Next Question: ", $nextQuestion);
            var result = _this.checkQuestion($currentQuestion);
              data.push(result)
            var isCorrect = result.isCorrect; // Extract the isCorrect value from the object
            // localStorage.setItem('questionResult', JSON.stringify(data));
            if (isCorrect) {
                $currentQuestion.addClass('correct').removeClass('incorrect');
                $("#congrats-popup").html('<img src="./img/correct.png" class="result-image" />'); // Set the content of the dialog box to the correct image
                $("#congrats-popup").dialog("open");
                if ($nextQuestion.length) {
                    $("#congrats-popup").dialog("open");
                    updateDatabaseForQuestion(); // Case 1: Update the database for a question
                } else {
                    // Clear the stored question index when the worksheet is completed
                    localStorage.removeItem('currentQuestionIndex');
                    QuestionCompleted(); // Case 2: Update the database for the last question
                    $('.popup').css('display', 'block');
                    console.log("Worksheet completed done"); // --//
                }
            } else {
                $currentQuestion.addClass('incorrect').removeClass('correct');
                $("#congrats-popup").html('<img src="./img/wrong.png" class="result-image" />'); // Set the content of the dialog box to the incorrect image
                $("#congrats-popup").dialog("open");
            }
        });
    };
    
    Hash.prototype.moveToNextQuestion = function ($currentQuestion) {
        var $nextQuestion = $currentQuestion.next('.question');
        if ($nextQuestion.length) {
            $currentQuestion.removeClass('active').hide();
            $nextQuestion.addClass('active').show();
            // Store the index of the next question
            var nextQuestionIndex = $currentQuestion.parent().children().index($nextQuestion);
            localStorage.setItem('currentQuestionIndex', nextQuestionIndex);
        }
    };
    
    Hash.prototype.moveToPreviousQuestion = function ($currentQuestion) {
        var $prevQuestion = $currentQuestion.prev('.question');
        if ($prevQuestion.length) {
            $currentQuestion.removeClass('active').hide();
            $prevQuestion.addClass('active').show();
            // Store the index of the previous question
            var prevQuestionIndex = $currentQuestion.parent().children().index($prevQuestion);
            localStorage.setItem('currentQuestionIndex', prevQuestionIndex);
        }
    };

    Hash.prototype.updateQuestionDisplay = function ($currentQuestion, totalQuestions, isNextQuestion) {
        var currentQuestionIndex = $currentQuestion.parent().children().index($currentQuestion);

        console.log("current Questions: ", currentQuestionIndex);
        // Update question count display
        $('.counter').text(`${currentQuestionIndex  + (isNextQuestion ? 1 : 0)} / ${totalQuestions}`);
        
    };

    // Make Hash globally accessible
    window.Hash = Hash;
})(jQuery);



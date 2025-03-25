document.addEventListener('DOMContentLoaded', function() {
    // Add animated moving clouds
    const createMovingClouds = () => {
      const animations = [
        '@keyframes moveCloud { 0% { transform: translateX(0); } 100% { transform: translateX(1000px); } }',
        '@keyframes moveCloud2 { 0% { transform: translateX(0); } 100% { transform: translateX(-1000px); } }'
      ];
      
      const style = document.createElement('style');
      style.textContent = animations.join('\n');
      document.head.appendChild(style);
    };
    
    createMovingClouds();
    
    // Quiz questions
    const questions = [
      {
        question: "What does DOM stand for?",
        options: [
          "Document Object Model",
          "Data Object Model",
          "Document Oriented Model",
          "Digital Ordinance Model"
        ],
        answer: 0
      },
      {
        question: "Which method adds an event listener to an HTML element?",
        options: [
          "attachEvent()",
          "addEventListener()",
          "addEvent()",
          "listenTo()"
        ],
        answer: 1
      },
      {
        question: "Which operator is used to compare both value and type?",
        options: [
          "==",
          "===",
          "=",
          "!="
        ],
        answer: 1
      },
      {
        question: "How do you create a function in JavaScript?",
        options: [
          "function = myFunction() {}",
          "function:myFunction() {}",
          "function myFunction() {}",
          "create myFunction() {}"
        ],
        answer: 2
      },
      {
        question: "How do you declare a JavaScript variable?",
        options: [
          "variable myVar;",
          "v myVar;",
          "var myVar;",
          "declare myVar;"
        ],
        answer: 2
      }
    ];
    
    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;
    let answered = false;
    
    // DOM Elements
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress');
    const quizContent = document.getElementById('quiz-content');
    const resultsEl = document.getElementById('results');
    const scoreEl = document.getElementById('score');
    const scoreMessageEl = document.getElementById('score-message');
    const restartBtn = document.getElementById('restart-btn');
    
    // Start the quiz
    function startQuiz() {
      currentQuestion = 0;
      score = 0;
      loadQuestion();
      updateProgress();
    }
    
    // Load question
    function loadQuestion() {
      const question = questions[currentQuestion];
      questionEl.textContent = `Question ${currentQuestion + 1}: ${question.question}`;
      
      // Clear previous options
      optionsEl.innerHTML = '';
      
      // Reset state
      selectedOption = null;
      answered = false;
      nextBtn.disabled = true;
      feedbackEl.textContent = '';
      
      // Add animation class
      setTimeout(() => {
        questionEl.classList.add('active');
      }, 100);
      
      // Create and add options
      question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.className = 'option';
        li.dataset.index = index;
        
        li.addEventListener('click', selectOption);
        
        optionsEl.appendChild(li);
        
        // Staggered animation for options
        setTimeout(() => {
          li.classList.add('active');
        }, 200 + (index * 150));
      });
    }
    
    // Select option
    function selectOption(e) {
      if (answered) return;
      
      const optionIndex = parseInt(e.target.dataset.index);
      
      // Clear previous selection
      const options = document.querySelectorAll('.option');
      options.forEach(option => option.classList.remove('selected'));
      
      // Mark as selected
      e.target.classList.add('selected');
      selectedOption = optionIndex;
      
      // Enable next button
      nextBtn.disabled = false;
      
      // Add a little bounce animation to the next button
      nextBtn.style.animation = 'none';
      setTimeout(() => {
        nextBtn.style.animation = 'pulse 0.5s';
      }, 10);
    }
    
    // Check answer
    function checkAnswer() {
      if (selectedOption === null || answered) return;
      
      answered = true;
      const correctIndex = questions[currentQuestion].answer;
      
      const options = document.querySelectorAll('.option');
      
      // Mark correct and incorrect options
      options.forEach((option, index) => {
        if (index === correctIndex) {
          option.classList.add('correct');
        } else if (index === selectedOption) {
          option.classList.add('incorrect');
        }
      });
      
      // Update score and feedback
      if (selectedOption === correctIndex) {
        score++;
        feedbackEl.textContent = '🎉 Correct! 🎉';
        feedbackEl.style.color = '#7adb7a';
        
        // Add some stars as reward
        for (let i = 0; i < 3; i++) {
          const star = document.createElement('div');
          star.className = 'cartoon-element star';
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          star.style.width = `${30 + Math.random() * 20}px`;
          star.style.height = `${30 + Math.random() * 20}px`;
          document.body.appendChild(star);
          
          setTimeout(() => {
            star.remove();
          }, 4000);
        }
      } else {
        feedbackEl.textContent = '❌ Incorrect! ❌';
        feedbackEl.style.color = '#ff7b7b';
      }
      
      // Shake effect for feedback
      feedbackEl.style.animation = 'none';
      setTimeout(() => {
        feedbackEl.style.animation = 'scoreReveal 0.5s ease-out';
      }, 10);
    }
    
    // Next question
    function nextQuestion() {
      // Don't proceed if not answered
      if (!answered && selectedOption !== null) {
        checkAnswer();
        return;
      }
      
      // Remove animation classes
      questionEl.classList.remove('active');
      const options = document.querySelectorAll('.option');
      options.forEach(option => option.classList.remove('active'));
      
      currentQuestion++;
      
      // Check if quiz ended
      if (currentQuestion >= questions.length) {
        endQuiz();
        return;
      }
      
      // Load next question after a short delay
      setTimeout(loadQuestion, 300);
      updateProgress();
    }
    
    // Update progress bar
    function updateProgress() {
      const progress = (currentQuestion / questions.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    // End quiz
    function endQuiz() {
      quizContent.style.display = 'none';
      resultsEl.style.display = 'block';
      
      const percentage = Math.round((score / questions.length) * 100);
      scoreEl.textContent = `${percentage}%`;
      
      // Set score message
      if (percentage >= 80) {
        scoreMessageEl.textContent = '🌟 Excellent! You really know your JavaScript! You\'re a coding superstar! 🌟';
        createConfetti();
      } else if (percentage >= 60) {
        scoreMessageEl.textContent = '👍 Good job! You have a solid understanding of JavaScript. Keep learning! 👍';
        createSimpleConfetti();
      } else {
        scoreMessageEl.textContent = '📚 Keep practicing! JavaScript takes time to master. You\'ll get there! 📚';
      }
    }
    
    // Create confetti effect
    function createConfetti() {
      const colors = ['#ffbe5c', '#ff7b7b', '#7bceff', '#7adb7a', '#d587ff'];
      const shapes = ['circle', 'square', 'triangle'];
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        // Random position
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '0';
        
        // Random shape
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
          confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
          confetti.style.backgroundColor = 'transparent';
          confetti.style.width = '0';
          confetti.style.height = '0';
          confetti.style.borderLeft = '8px solid transparent';
          confetti.style.borderRight = '8px solid transparent';
          confetti.style.borderBottom = `16px solid ${color}`;
        }
        
        // Random size
        const size = 5 + Math.random() * 15;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random animation delay
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        
        // Add to body
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          confetti.remove();
        }, 4000);
      }
    }
    
    // Simpler confetti for medium scores
    function createSimpleConfetti() {
      const colors = ['#ffbe5c', '#7bceff', '#7adb7a'];
      
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '0';
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          confetti.remove();
        }, 4000);
      }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', function() {
      quizContent.style.display = 'block';
      resultsEl.style.display = 'none';
      startQuiz();
    });
    
    // Start the quiz
    startQuiz();
  });
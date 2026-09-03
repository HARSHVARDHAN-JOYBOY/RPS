document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State from sessionStorage (or default)
    let scoreYou = parseInt(sessionStorage.getItem('scoreYou') || '0');
    let scoreCpu = parseInt(sessionStorage.getItem('scoreCpu') || '0');
    let roundNum = parseInt(sessionStorage.getItem('roundNum') || '1');

    const scoreYouEl = document.getElementById('score-you');
    const scoreCpuEl = document.getElementById('score-cpu');
    const roundNumEl = document.getElementById('round-num');
    
    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');

    // 2. Handle Result if page loaded with a result
    const bodyResultType = document.body.getAttribute('data-result-type');
    const justSubmitted = sessionStorage.getItem('justSubmitted');

    if (bodyResultType && bodyResultType !== 'none') {
        // We are on the result page
        if (statusText) statusText.textContent = "RESULT";
        if (statusDot) statusDot.className = "dot result";

        if (justSubmitted === 'true') {
            // Update scores based on result
            if (bodyResultType === 'win') {
                scoreYou++;
                triggerConfetti();
            } else if (bodyResultType === 'lose') {
                scoreCpu++;
                const resultMsg = document.querySelector('.result-message-container');
                if (resultMsg) resultMsg.classList.add('shake-animation');
            } else if (bodyResultType === 'draw') {
                // draw doesn't change score
                const resultMsg = document.querySelector('.result-message-container');
                if (resultMsg) resultMsg.classList.add('pulse-animation');
            }
            
            // Advance round
            roundNum++;
            
            // Save state
            sessionStorage.setItem('scoreYou', scoreYou);
            sessionStorage.setItem('scoreCpu', scoreCpu);
            sessionStorage.setItem('roundNum', roundNum);
            
            // Clear flag so refreshing doesn't increment again
            sessionStorage.removeItem('justSubmitted');
        } else if (bodyResultType === 'win') {
            // Re-trigger confetti if user just reloads the winning page directly
            triggerConfetti();
        }
    }

    // 3. Update DOM with current state
    if (scoreYouEl) scoreYouEl.textContent = scoreYou;
    if (scoreCpuEl) scoreCpuEl.textContent = scoreCpu;
    if (roundNumEl) roundNumEl.textContent = roundNum;

    // 4. Handle Play Interactions (Card Click)
    const choiceCards = document.querySelectorAll('#game-form .choice-card');
    const gameForm = document.getElementById('game-form');
    const choiceInput = document.getElementById('choice-input');

    if (choiceCards.length > 0 && gameForm) {
        choiceCards.forEach(card => {
            card.addEventListener('click', function() {
                // Visual feedback
                choiceCards.forEach(c => c.style.pointerEvents = 'none'); // disable other clicks
                this.classList.add('selected');
                
                statusText.textContent = "CHOOSING...";
                statusDot.className = "dot choosing";

                // Set hidden input value for Flask
                const choice = this.getAttribute('data-choice');
                choiceInput.value = choice;

                // Flag for next page load to know we actually played a round
                sessionStorage.setItem('justSubmitted', 'true');

                // Small delay to let the animation play before form submits
                setTimeout(() => {
                    gameForm.submit();
                }, 600);
            });
        });
    }

    // 5. Lightweight Vanilla JS Confetti Function
    function triggerConfetti() {
        const colors = ['#4ade80', '#fbbf24', '#3b82f6', '#f472b6', '#a78bfa'];
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        for (let i = 0; i < 70; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 5 + 10) + 'px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);
        }
    }
});

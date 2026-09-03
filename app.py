from flask import Flask, render_template, request
import random

app = Flask(__name__)

# User's rules matrix
rules = [
    ['Draw', 'Player Wins', 'Computer Wins'],
    ['Computer Wins', 'Draw', 'Player Wins'],
    ['Player Wins', 'Computer Wins', 'Draw']
]

choices = ['rock', 'paper', 'scissors']

@app.route('/', methods=['GET', 'POST'])
def index():
    result_message = None
    player_choice = None
    computer_choice = None
    
    if request.method == 'POST':
        player_choice = request.form.get('choice')
        
        if player_choice in choices:
            p = choices.index(player_choice)
            comp_idx = random.randint(0, 2)
            computer_choice = choices[comp_idx]
            
            result = rules[comp_idx][p]
            
            if result == 'Player Wins':
                result_message = "🎉 Congratulations! You Won!"
            elif result == 'Draw':
                result_message = "🤝 It's a Draw!"
            elif result == 'Computer Wins':
                result_message = "😂 Oops! Computer Wins! Better luck next time! 😜"

    return render_template('index.html', 
                           result=result_message, 
                           player=player_choice, 
                           computer=computer_choice)

if __name__ == '__main__':
    app.run(debug=True)

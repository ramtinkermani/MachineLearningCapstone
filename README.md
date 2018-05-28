## MachineLearningCapstone: A simple simulated robot planning game
**To read about the purpose and design of this project, please refer to the project proposal (PDF file)**

### Introduction
This is a basic planning game for a simulated vacuum cleaner robot in a simple grid environment. The purpose of the robot is to learn to efficiently (as fast as possible and with the highest received reward) collect all the Trash and avoid the Fire (Hazard) cells. 

I've used Q-Learning which is a model-free algorithm for Reinforcement Learning (RL) to teach the robot how to achieve this goal. The main premise of RL is that it does not require us (Humans, if you will!) program the agent explicitly what to do or what not to do. The agent starts by playing the game and at each state picks a random action and as a result, ends up in a new state based on which we reward it. If the outcome is desirable (Collected Trash) the reward is positive and if it's undesirable, the reward is negative. Every run of the game is called an Epoch and the rewards that are received based on the Action taken on each State, is used to update a table called the Q-Table. Q-Table is basically the memory of the learning agent about it's past experiences.

This is how the agent (Robot) learns about its purpose and goal: by trial and error which is called the **Exploration phase**. Once the agent has sufficiently played the game and exhausted all the possible State/Action pairs, the Q-Table is ready to be *Exploited*, that's when we can start the actual game and that is called **Exploitation phase**.

**Note)** This is a basic implementation of Q-Learning and is by no means perfect or optimal. Even after training, the robot may sometimes get stuck or not find the optimal route, etc. There's plenty of room for improvement. This is project I developed to implement Q-Learning from scratch, as a learning experience. Your positive/negative feedback will for sure help me improve it (Ha! That's Reinforcement Learning too, I think! :) )

### TL;DR; 
To run this web-based application 
- go to: https://ramtinkermani.github.io/MachineLearningCapstone/
- The right panel has the main game grid and the left panel has the controls and basic stats about the score for each epoch. At the bottom you can see the Game Console which logs the states, actions and rewards received by the agent.
- Click on "Start Exploration" button to run the training for 3000 epochs. at each run, based on the State, random Action taken and the awarded reward to the agent, the Q-Table entry is updated with a calculated score.
- **Note)** To speed up the training, it's recommended to disable Console logging (Move your mouse over the black console and you see a button on the right to toggle logging)
- Once the training is done, you can click on "Start Exploitation". The agent starts playing the game utilizing the populated Q-Table. 
- **Note)** Some browsers (such as Google Chrome) do not allow the scripts to run while the browser tab is inactive. So if you start the training and switch to another tab, it may stop the training. Make sure you keep the tab open and always on top for the training to complete.
- Click on the "Show Q-Table" to see the current Q-Table content
- The States are interpreted as follows: A string containing 4 characters which represent the item on the Top, Right, Bottom and Left of the Robot. The Characters are N (Nothing), W (Wall), F (Fire), T(Trash). Of course the goal of the robot is to avoid the Fire and to some extent the walls (so it doesn't get stuck) and Collect the Trash (intentionally walk into the trash cells)

### How to run the application
This is a web application and the whole training and playing is written in Javascript. The deployed application could be found at https://ramtinkermani.github.io/MachineLearningCapstone/.

### How to start the training (Exploration)
By default the training run for 3000 epochs. This should be enough to optimally populate the Q-Table with almost all possible state-action pairs that the agent has experienced. This should take about 10 minutes to complete (depending on your machine's and browser's performance)

### How to start playing the game (Exploitation)
After the training is done, the Start Exploitation button will be enables and you can click to start the game. If the robot gets stuck or you need to restart a new game, you can click on this button again.

### Interpreting the output and results
At the top of the left panel, a blue banner shows the total score for each epoch, either at training or playing time. If you note this score, when the robot is playing randomly (Exploration phase) the score barely exceeds 20. But when it starts playing the game by exploitation, the score goes up to 40.

The States are interpreted as follows: A string containing 4 characters which represent the item on the Top, Right, Bottom and Left of the Robot. The Characters are N (Nothing), W (Wall), F (Fire), T(Trash). Of course the goal of the robot is to avoid the Fire and to some extent the walls (so it doesn't get stuck) and Collect the Trash (intentionally walk into the trash cells)

In the black console at the bottom, you can see the rewards received for each action taken by the agent and the next state that the robot is landed in.

### Contact me
If you have any further questions, you can find me here:
https://www.linkedin.com/in/ramtinr/

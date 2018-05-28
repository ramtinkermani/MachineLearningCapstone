## MachineLearningCapstone: A simple simulated robot planning game
**To read about the purpose and design of this project, please refer to the project proposal (PDF file)**

### TL;DR; 
To run this web-based application 
- go to: https://ramtinkermani.github.io/MachineLearningCapstone/
- The right panel has the main game grid and the left panel has the controls and basic stats about the score for each epoch. At the bottom you can see the Game Console which logs the states, actions and rewards received by the agent.
- Click on "Start Exploration" button to run the training for 3000 epochs. at each run, based on the State, random Action taken and the awarded reward to the agent, the QTable entry is updated with a calculated score.
- **Note)** To speed up the training, it's recommended to disable Console logging (Move your mouse over the black console and you see a button on the right to toggle logging)
- Once the training is done, you can click on "Start Exploitation". The agent starts playing the game utilizing the populated QTable. 
- **Note)** Some browsers (such as Google Chrome) do not allow the scripts to run while the browser tab is inactive. So if you start the training and switch to another tab, it may stop the training. Make sure you keep the tab open and always on top for the training to complete.
- Click on the "Show QTable" to see the current QTable content
- The States are interpreted as follows: A string containing 4 characters which represent the item on the Top, Right, Bottom and Left of the Robot. The Characters are N (Nothing), W (Wall), F (Fire), T(Trash). Of course the goal of the robot is to avoid the Fire and to some extent the walls (so it doesn't get stuck) and Collect the Trash (intentionally walk into the trash cells)

### How to run the application
This is a web application and the whole training and playing is written in Javascript. The deployed application could be found at https://ramtinkermani.github.io/MachineLearningCapstone/.

### How to start the training (Exploration)
By default the training run for 3000 epochs. This should be enough to optimally populate the QTable with almost all possible state-action pairs that the agent has experienced. This should take about 10 minutes to complete (depending on your machine's and browser's performance)

### How to start playing the game (Exploitation)

### Interpreting the output and results


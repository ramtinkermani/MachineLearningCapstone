# MachineLearningCapstone: A simple robot planning simulation
The Capstone project for Udacity Connect's Machine Learning class

# To read about the purpose and design of this projetc, please refer to the project proposal (PDF file)

## Tl;DR; 
To run this web-based application 
- go to: https://ramtinkermani.github.io/MachineLearningCapstone/
- The right panel has the main game grid and the left panel has the 
- Click on "Start Exploration" button to run the training for 3000 epochs. at each run, based on the State, random action taken and the awarded reward to the agent, the QTable entry is updated with a calculated score.
- Note) To speed up the training, it's recommended to disable Console logging (Move your mouse over the black console and you see a button to disable logging)
- Once the training is done, you can click on "Start Exploitation". The agent starts playing the game utilizing the populated QTable. 
- Click on the "Show QTable" to see the current QTable content
- The States are interpreted as follows: A string containing 4 characters which represent the item on the Top, Right, Bottom and Left of the Robot. The Charaters are N (Nothing), W (Wall), F (Fire), T(Trash). Of course the goal of the robot is to avoid the Fire and to some extent the walls (so it doesn't get stuck) and Collect the Trash (intentionally walk into the trash cells)

## How to run the application
This is a web application and the whole training and playing is written in Javascript. The deployed application could be found at https://ramtinkermani.github.io/MachineLearningCapstone/.

## How to start the training (Exploration)
By default the training run for 3000 epochs. This should be enough to optimally populate the QTable with almost all possible state-action pairs that the agent has experienced. This should take about 10 minutes to complete (dependingon your machine and browser's performance)

## How to start playing the game (Exploitation)

## Interpreting the output and results


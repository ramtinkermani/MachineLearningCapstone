/**
 * Created by ramtinkermani on 4/7/18.
 */

gridConfig =
{
    width: 7,           // sq unit
    height:5,           // sq unit
    cellSize: 70,      // pixel
    deadLine: 10        // agent's deadline in seconds or steps, not used yet
}

environmentConfig =
{
    numHazardCells: 8,
    numTrashCells: 8
}

rewards =
{
    anyMoveReward: -1,
    dirtReward: +10,
    fireReward: -10,
    wallReward: -5
}

timerInterval = 5;

QTable = {}

legalMoves = [moveUp, moveRight, moveDown, moveLeft];

images =
{
    "roomba": "http://www.irobotweb.com/-/media/MainSite/Images/About/STEM/Create/create-overview.png?h=487&la=en&w=445",
    "hazard": "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/128x128/fire.png",
    "trash": "https://d30y9cdsu7xlg0.cloudfront.net/png/915312-200.png"
}

score = 0;

rewardedCells = 0;

// Discount Factor
gamma = .2;

gridCells = {}

roombaLocation = {"i":0, "j":0}

trashCells= []

hazardCells = []

var previousState;

function BuildEnvironment () {
    CreateBaseGrid();
    InitializeCells();
    RegisterEventListeners();
    InitializeQTable();
}

function CreateBaseGrid() {

    for(i=0; i < gridConfig.height; i++) {
        gridCells[i] = {}

        for(j=0; j< gridConfig.width; j++)
        {
            cell = document.createElement("div");
            $(cell).addClass("cell");
            $(cell).css({"width": gridConfig.cellSize+"px", "height": gridConfig.cellSize+"px"});
            $("#gameCanvas").append(cell);
            $(cell).html(i+ "," +j);
            if(j == 0)
            {
                $(cell).addClass("RowsStartCell")
            }

            gridCells[i][j] = {
                "i": i,
                "j": j,
                "element": $(cell)
            };
        }
    }

    // console.log(gridCells)
}

function SetCellBackground(i, j, imageUrl) {
    gridCells[i][j]["element"].css({"background": "url('"+ imageUrl +"')", "background-size": "cover", "background-color":"white"});
}

function InitializeCells() {

    // Initialize the random location of Roomba
    roombaLocation.i = Math.floor(Math.random() * gridConfig.height);
    roombaLocation.j = Math.floor(Math.random() * gridConfig.width);
    SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);

    // Initialize random location of environmentConfig.numHazardCells number of Hazard cells
    for(k=0; k< environmentConfig.numHazardCells; k++) {
        do {
            hazardI = Math.floor(Math.random() * gridConfig.height);
            hazardJ = Math.floor(Math.random() * gridConfig.width);
        }
        while(!IsValidLocation(hazardI, hazardJ));

        hazardCells.push({"i": hazardI, "j": hazardJ});
        SetCellBackground(hazardI, hazardJ, images.hazard);
    }

    // Initialize random location of environmentConfig.numTrashCells number of Trash cells
    for(k=0; k< environmentConfig.numTrashCells; k++)
    {
        do {
            trashI = Math.floor(Math.random() * gridConfig.height);
            trashJ = Math.floor(Math.random() * gridConfig.width);
        }
        while(!IsValidLocation(trashI, trashJ));

        trashCells.push({"i": trashI, "j": trashJ});
        SetCellBackground(trashI, trashJ, images.trash);
    }
}

function InitializeQTable() {
    // Nothing, Fire, Trash (Burn, Break and Crash you freak! ;P)
    var stateItems = ['N', 'F', 'T', 'W'];

    // "UP_Value Right_Value Down_Value Left_Value"
    var state = "";

    QTable = {}

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            for (k = 0; k < 4; k++) {
                for (l = 0; l < 4; l++) {
                    state = stateItems[i] + stateItems[j] + stateItems[k] + stateItems[l];

                    QTable[state] = {}
                    QTable[state]['moveUp'] = 0.0
                    QTable[state]['moveRight'] = 0.0
                    QTable[state]['moveDown'] = 0.0
                    QTable[state]['moveLeft'] = 0.0
                }
            }
        }
    }
}

function evaluateMove(action){
    // Console.writeLine("Roomba: " + JSON.stringify(roombaLocation));
    // Console.writeLine("Trash: " + JSON.stringify(trashCells));
    // Console.writeLine("Fire: " + JSON.stringify(hazardCells));

    // Get the current state before applying the move
    // var currentState = getCurrentState();

    var immediateScore = rewards.anyMoveReward;

    trashCells.forEach(function(cell, index){
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           immediateScore = rewards.dirtReward;
           rewardedCells++;

           trashCells.splice(index, 1);
           // If all trash is collected, then agent has WON!
           if(trashCells.length == 0)
           {
               // $("#resultHolder").html("YOU WON! :)");
               // $("#resultHolder").addClass("alert-success")
            stopEpisode();
            clearInterval(timer);
               if($("#episodeCount").val() != 0){
                   RestartEpisode();
                   StartRandomExploration();
               }
           }
           return;
       }
    });


    hazardCells.forEach(function(cell, index){
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           immediateScore = rewards.fireReward;
           rewardedCells++;

           hazardCells.splice(index, 1);
           // $("#resultHolder").html("YOU LOST! :(");
           // $("#resultHolder").addClass("alert-danger");
           return;
       }
    });

    var newState = getCurrentState();

    //Console.writeLine(previousState + "&nbsp;&nbsp;&nbsp; Action: " + action + "&nbsp;&nbsp;&nbsp; Reward: " + immediateScore + "&nbsp;&nbsp;NewState: " + newState);
    updateQTable(previousState, newState, action, immediateScore);
    score += immediateScore;

    $("#scoreHolder").html(score);
}

function RestartEpisode()
{
    // TODO: Re-implement ....
}

function evaluateMove000() {

    trashCells.forEach(function(cell, index){
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           score++;
           trashCells.splice(index, 1);

           // If all trash is collected, then agent has WON!
           if(trashCells.length == 0)
           {
               $("#resultHolder").html("YOU WON! :)");
               $("#resultHolder").addClass("alert-success");
           }
           return;
       }
    });


    hazardCells.forEach(function(cell, index){
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           score = 0;
           hazardCells.splice(index, 1);
           $("#resultHolder").html("YOU LOST! :(");
           $("#resultHolder").addClass("alert-danger");
           return;
       }
    });

    $("#scoreHolder").html(score);
}


// Makes sure the new random position is not already occupied
function IsValidLocation(i, j) {
    isValid =  true

    // Return false if this location is already occupied by a trash cell
    trashCells.forEach(function(cell){
       if(cell.i == i && cell.j == j)
       {
           isValid = false;
           return;
       }
    });

    // Return false if this location is already occupied by a hazard cell
    hazardCells.forEach(function(cell){
       if(cell.i == i && cell.j == j)
       {
           isValid = false;
           return;
       }
    });

    // Return false if this location is already occupied by Roomba
    if(roombaLocation.i == i && roombaLocation.j == j)
    {
        isValid = false;
    }
    return isValid;
}

function RegisterEventListeners() {
    $("body").on("keydown", function(e){
       e.preventDefault();
       switch(e.key)
       {
           case "ArrowUp":
                   moveUp();
               break;
           case "ArrowDown":
                   moveDown();
               break;
           case "ArrowRight":
                   moveRight();
               break;
           case "ArrowLeft":
                   moveLeft();
               break;
           default:
               break;
       }
    });

    $("#startExploreBtn").on("click", function(){
        StartExploration();
    });

    $("#startRandomBtn").on("click", function(){
        StartRandomExploration();
    });

    $("#showQtableBtn").on("click", function(){
        console.log(QTable);
    });
}

function moveUp() {
    previousState = getCurrentState();
    if(roombaLocation.i != 0 ) {
        SetCellBackground(roombaLocation.i, roombaLocation.j, "");
        roombaLocation.i -= 1;
        SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
        evaluateMove("moveUp");
    }
}

function moveDown() {
    previousState = getCurrentState();
    if(roombaLocation.i != gridConfig.height - 1 ) {
        SetCellBackground(roombaLocation.i, roombaLocation.j, "");
        roombaLocation.i += 1;
        SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
        evaluateMove("moveDown");
    }
}

function moveRight() {
    previousState = getCurrentState();
    if(roombaLocation.j != gridConfig.width - 1 ) {
        SetCellBackground(roombaLocation.i, roombaLocation.j, "");
        roombaLocation.j += 1;
        SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
        evaluateMove("moveRight");
    }
}

function moveLeft() {
    previousState = getCurrentState();
    if(roombaLocation.j != 0) {
        SetCellBackground(roombaLocation.i, roombaLocation.j, "");
        roombaLocation.j -= 1;
        SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
        evaluateMove("moveLeft");
    }
}

function updateQTable(previousState, newState, action, immediateScore) {
    if (QTable[previousState] === undefined) {
        QTable[previousState] = {}
    }

    if(previousState != newState) {
        var maxNextQ = 0;

        bestScore = -1000;
        var bestAction;

        for (var act in QTable[newState]) {
            var predictedScoreForAction = QTable[newState][act];
            if (predictedScoreForAction > bestScore) {
                bestScore = predictedScoreForAction;
                //bestActions.push(action);
                maxNextQ = bestScore;
                //bestAction = act;
            }
        }

        // Bellman Eq
        QScore = immediateScore + (gamma * maxNextQ)

        //console.log("PrevState:" + previousState + " -- " + "NewState:" + newState + " -- " + "score:" + QScore)

        QTable[previousState][action] = QScore;
        //DisplayQtable();
    }
    else
    {
        QTable[previousState][action] = rewards.wallReward;
    }
}


var timer;

function StartRandomExploration() {
    $("#episodeCount").val($("#episodeCount").val() - 1);
    // console.log("QTable Items: " + Object.keys(QTable).length);

    count = 0
    if (timer != undefined) {
        clearTimeout(timer);
        timer = undefined;
    }
    timer = setInterval(function () {

        var nextMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        nextMove();
        count++;
        if (count == 1000) {
            clearInterval(timer);
            return;
        }
    }, timerInterval);
}


function  PlayTheFuck() {
    if (timer != undefined) {
        clearTimeout(timer);
        timer = undefined;
    }
    timer = setInterval(function () {

        var nextMove = getBestNextMove();//legalMoves[Math.floor(Math.random() * legalMoves.length)];
        window[nextMove]();
        count++;
        if (count == 1000) {
            clearInterval(timer);
            return;
        }
    }, 1000);
}

function getBestNextMove() {
    var bestScore = -1000;
    var currentState = getCurrentState();
    var bestActions = [];
    var bestAction;

    var tempPossibleAction = QTable[currentState];

    for(var action in tempPossibleAction)
    {
        predictedScoreForAction  = QTable[currentState][action];
        if( predictedScoreForAction > bestScore) {
            bestScore = predictedScoreForAction;
            bestAction = action;
            //bestActions.push(action);
            //tempPossibleAction[action] = -2000;
        }
    }

    // bestScore = -1000;
    // for(var action in tempPossibleAction)
    // {
    //     predictedScoreForAction  = QTable[currentState][action];
    //     if( predictedScoreForAction > bestScore) {
    //         bestScore = predictedScoreForAction;
    //         bestActions.push(action);
    //     }
    // }
    //
    // bestAction = bestActions[Math.floor(Math.random() * bestActions.length)];

    console.log("Best Action for " + currentState + " :: " + bestAction);
    return bestAction;
}

function stopEpisode() {
    $("body").on("keydown", function () {

    });
}

function getCurrentStateDic() {
    currentState = {'U': 'N', 'R': 'N', 'D': 'N', 'L': 'N'}
    aboveRoomba = {'i': roombaLocation.i-1, 'j': roombaLocation.j}
    belowRoomba = {'i': roombaLocation.i+1, 'j': roombaLocation.j}
    rightOfRoomba = {'i': roombaLocation.i, 'j': roombaLocation.j+1}
    leftOfRoomba = {'i': roombaLocation.i, 'j': roombaLocation.j-1}

    trashCells.forEach(function(cell) {
        if (cell.i == aboveRoomba.i && cell.j == aboveRoomba.j)
        {
            currentState.U = 'T'
        }
        if (cell.i == belowRoomba.i && cell.j == belowRoomba.j)
        {
            currentState.D = 'T'
        }
        if (cell.i == rightOfRoomba.i && cell.j == rightOfRoomba.j)
        {
            currentState.R = 'T'
        }
        if (cell.i == leftOfRoomba.i && cell.j == leftOfRoomba.j)
        {
            currentState.L = 'T'
        }
    });

    hazardCells.forEach(function(cell) {
        if (cell.i == aboveRoomba.i && cell.j == aboveRoomba.j)
        {
            currentState.U = 'F'
        }
        if (cell.i == belowRoomba.i && cell.j == belowRoomba.j)
        {
            currentState.D = 'F'
        }
        if (cell.i == rightOfRoomba.i && cell.j == rightOfRoomba.j)
        {
            currentState.R = 'F'
        }
        if (cell.i == leftOfRoomba.i && cell.j == leftOfRoomba.j)
        {
            currentState.L = 'F'
        }
    });

    // If the neighbour cell is a wall (or a hole, whatever!)
    if(roombaLocation.j == 0)
    {
        currentState.L = 'W'
    }
    if(roombaLocation.j == gridConfig.width - 1)
    {
        currentState.R = 'W'
    }
    if(roombaLocation.i == 0)
    {
        currentState.U = 'W'
    }
    if(roombaLocation.i == gridConfig.height - 1)
    {
        currentState.D = 'W'
    }

    // currentState = [aboveRoomba, belowRoomba, rightOfRoomba, leftOfRoomba]
    return currentState;
}

function getCurrentStateList() {
    currentStateList = []
    currentState = getCurrentStateDic();

    currentStateList.push(currentState.U);
    currentStateList.push(currentState.R);
    currentStateList.push(currentState.D);
    currentStateList.push(currentState.L);

    return currentStateList;
}

function getCurrentState() {
    var currentState = "";

    currentStateDic = getCurrentStateDic();

    currentState += currentStateDic.U;
    currentState += currentStateDic.R;
    currentState += currentStateDic.D;
    currentState += currentStateDic.L;
    return currentState;
}

Console = {
    writeLine: function(text)
    {
        $("#reportConsole").prepend(text).prepend("<br>");
        // $("#reportConsole").scrollTop($("#reportConsole").height())
    }
}

function DisplayQtable() {
    console.log(QTable);
}
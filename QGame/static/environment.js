/**
 * Created by ramtinkermani on 4/7/18.
 */

gridConfig =
{
    width: 4,           // sq unit
    height:4,           // sq unit
    cellSize: 100,      // pixel
    deadLine: 10        // agent's deadline in seconds or steps, not used yet
}

environmentConfig =
{
    numHazardCells: 3,
    numTrashCells: 5
}

rewards =
{
    anyMoveReward: -.35,
    dirtReward: +10,
    fireReward: -10,
    wallReward: -3
}

gameMode =
{
    "training": 0,
    "playing-auto": 1,
    "playing-manual": 2
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
    hazardCells.forEach(function(cell)
    {
        SetCellBackground(cell.i, cell.j, "");
    });

    trashCells.forEach(function(cell)
    {
        SetCellBackground(cell.i, cell.j, "");
    });

    SetCellBackground(roombaLocation.i, roombaLocation.j, "");

    hazardCells = []
    trashCells = []

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

function evaluateMove(action){

    var immediateScore = rewards.anyMoveReward;

    trashCells.forEach(function(cell, index){
       // If the Roomba ends up on a trash cell after the move:
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           immediateScore = rewards.dirtReward;
           // Keep track of all the collected Trash cells so we know when the game ends
           rewardedCells++;

           trashCells.splice(index, 1);

           // If all trash is collected, then agent has WON!
           if(trashCells.length == 0)
           {
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
       // If the Roomba ends up on a fire cell after the move:
       if(cell.i == roombaLocation.i && cell.j == roombaLocation.j)
       {
           immediateScore = rewards.fireReward;
           rewardedCells++;

           hazardCells.splice(index, 1);
           return;
       }
    });

    var newState = getCurrentState();

    Console.writeLine(previousState + "&nbsp;&nbsp;&nbsp; Action: " + action + "&nbsp;&nbsp;&nbsp; Reward: " + immediateScore + "&nbsp;&nbsp;NewState: " + newState);

    updateQTable(previousState, newState, action, immediateScore);

    updateScoreboard(score + immediateScore);
}

function updateScoreboard(s)
{
    score = parseInt(s.toFixed());
    $("#scoreHolder").html(score);
}

function RestartEpisode()
{
    InitializeCells();
    updateScoreboard(-10);
    // TODO: Re-implement ....
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
       switch(e.key)
       {
           case "ArrowUp":
               e.preventDefault();
               moveUp();
               break;
           case "ArrowDown":
               e.preventDefault();
               moveDown();
               break;
           case "ArrowRight":
               e.preventDefault();
               moveRight();
               break;
           case "ArrowLeft":
               e.preventDefault();
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

    $("#showQtableBtn").on("mouseover", function(){
        UpdateModalQtable();
    });

    $("#showQtableBtn").on("click", function(){
        DisplayQtable();
    });

    $("#playFuckBtn").on("click", function(){
        PlayTheFuck();
    });

    $("#logControl").on("click", function(){
        Console.toggleEnabled();
    });

    $("#reportConsole").on("mouseover", function(){
        $("#logControl").css("visibility", "visible");
    }).on("mouseout", function(){
        $("#logControl").css("visibility", "hidden");
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

function InitializeQTable() {
    // Nothing, Fire, Trash and Wall (Burn, Break and Crash you freak! ;P)
    var stateItems = ['N', 'F', 'T', 'W'];

    // "UP_Value Right_Value Down_Value Left_Value"
    var state = "";

    QTable = {}

    // Populate the table with all the possible values of states.
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            for (k = 0; k < 4; k++) {
                for (l = 0; l < 4; l++) {
                    state = stateItems[i] + stateItems[j] + stateItems[k] + stateItems[l];

                    QTable[state] = {}
                    if(stateItems[i] == 'W') QTable[state]['moveUp'] = rewards.wallReward; else QTable[state]['moveUp'] = 0.0;
                    if(stateItems[j] == 'W') QTable[state]['moveRight'] = rewards.wallReward; else QTable[state]['moveRight'] = 0.0;
                    if(stateItems[k] == 'W') QTable[state]['moveDown'] = rewards.wallReward; else QTable[state]['moveDown'] = 0.0;
                    if(stateItems[l] == 'W') QTable[state]['moveLeft'] = rewards.wallReward; else QTable[state]['moveLeft'] = 0.0;
                }
            }
        }
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

        QTable[previousState][action] = parseFloat(QScore.toFixed(3));
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

    //count = 0
    if (timer != undefined) {
        clearTimeout(timer);
        timer = undefined;
    }
    timer = setInterval(function () {

        var nextMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        nextMove();
      //  count++;
        if ($("#episodeCount").val() == 0) {
            clearInterval(timer);
            return;
        }
    }, timerInterval);
}

function PlayTheFuck() {
    RestartEpisode();

    if (timer != undefined) {
        clearTimeout(timer);
        timer = undefined;
    }
    timer = setInterval(function () {

        var nextMove = getBestNextMove();//legalMoves[Math.floor(Math.random() * legalMoves.length)];
        window[nextMove]();
        // count++;
        // if (count == 1000) {
        //     clearInterval(timer);
        //     return;
        // }
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

    // currentState = [aboveRoomba, rightOfRoomba, belowRoomba, leftOfRoomba]
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
    isEnabled: true,
    writeLine: function(text)
    {
        if(this.isEnabled) {
            $("#consoleCanvas").prepend(text).prepend("<br>");
            // $("#reportConsole").scrollTop($("#reportConsole").height())
        }
    },
    toggleEnabled: function()
    {
        this.isEnabled = !this.isEnabled;
        $("#logControl").text(this.isEnabled? "Disable Logging" : "Enable Logging");
    }
}

function UpdateModalQtable()
{
    console.log("Updating modal content");
    var headerLabels = ['State', 'moveUp', 'moveRight', 'moveDown', 'moveLeft']
    var actions = ['moveUp', 'moveRight', 'moveDown', 'moveLeft']

    var QtableContent = document.createElement("table");
    var headerRow = document.createElement("tr");

    for(i in headerLabels) {
        var headerCol = document.createElement("th");
        $(headerRow).append(headerCol);
        $(headerCol).html(headerLabels[i]);
        $(QtableContent).append(headerRow);
    }

    for(state in QTable) {
        var row = document.createElement("tr");
        $(QtableContent).append(row);

        var col = document.createElement("td");
        $(row).append(col);
        $(col).html(state);

        for(action in actions) {
            var col = document.createElement("td");
            $(row).append(col);
            $(col).html(QTable[state][actions[action]]);
        }
    }

    $("#modal-Qtable").html(QtableContent);
}

function DisplayQtable() {
    console.log(QTable);
}
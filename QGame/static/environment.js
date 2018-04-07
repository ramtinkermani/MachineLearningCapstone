/**
 * Created by ramtinkermani on 4/7/18.
 */

gridConfig =
{
    width: 8,           // sq unit
    height:8,           // sq unit
    cellSize: 70,      // pixel
    deadLine: 10        // agent's deadline in seconds
}

environmentConfig =
{
    numHazardCells: 3,
    numTrashCells: 5
}

images =
{
    "roomba": "http://www.irobotweb.com/-/media/MainSite/Images/About/STEM/Create/create-overview.png?h=487&la=en&w=445",
    "hazard": "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/128x128/fire.png",
    "trash": "https://d30y9cdsu7xlg0.cloudfront.net/png/915312-200.png"
}

score = 0;


gridCells = {}

roombaLocation = {"i":0, "j":0}

trashCells= []

hazardCells = []

function BuildEnvironment () {
    CreateBaseGrid();
    InitializeCells();
    RegisterEventListeners();
}

function CreateBaseGrid() {

    for(i=0; i < gridConfig.height; i++)
    {
        gridCells[i] = {}

        for(j=0; j< gridConfig.width; j++)
        {
            cell = document.createElement("div");
            $(cell).addClass("cell");
            $(cell).css({"width": gridConfig.cellSize+"px", "height": gridConfig.cellSize+"px"});
            $(".gameCanvas").append(cell);
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
               if(roombaLocation.i != 0 ) {
                   moveUp();
               }
               break;
           case "ArrowDown":
               if(roombaLocation.i != gridConfig.height - 1 ) {
                   moveDown();
               }
               break;
           case "ArrowRight":
               if(roombaLocation.j != gridConfig.width - 1 ) {
                   moveRight();
               }
               break;
           case "ArrowLeft":
               if(roombaLocation.j != 0) {
                   moveLeft();
               }
               break;
           default:
               break;
       }
    });
}


function moveUp() {
    SetCellBackground(roombaLocation.i, roombaLocation.j, "");
    roombaLocation.i -= 1;
    SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);

    evaluateMove();
}

function moveDown() {
    SetCellBackground(roombaLocation.i, roombaLocation.j, "");
    roombaLocation.i += 1;
    SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
    evaluateMove();
}

function moveRight() {
    SetCellBackground(roombaLocation.i, roombaLocation.j, "");
    roombaLocation.j += 1;
    SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
    evaluateMove();
}

function moveLeft() {
    SetCellBackground(roombaLocation.i, roombaLocation.j, "");
    roombaLocation.j -= 1;
    SetCellBackground(roombaLocation.i, roombaLocation.j, images.roomba);
    evaluateMove();
}

function evaluateMove() {

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

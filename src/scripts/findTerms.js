const addVertexButton = document.createElement("edgeButton");
document.getElementById("addGraphButton").addEventListener("click", addGraph);
document.getElementById("saveNewGraphButton").addEventListener("click",
    readInputData);
document.getElementById("saveNewGraphButton").style.display = "none";
let vertexIndex = 0;

defaultGraph();

function defaultGraph() {
  const weightedGraph = {
    0: {1: 8, 2: 6},
    1: {3: 4},
    2: {4: 4, 5: 10},
    3: {5: 7},
    4: {7: 12},
    5: {6: 5, 7: 6},
    6: {7: 9},
    7: {}
  }

  getGraph(weightedGraph);
}

function getGraph(weightedGraph) {
  let graphString = "Граф: " + "\n";

  console.log("==============GRAPH==============");

  for (let vertex in weightedGraph) {
    console.log("Вершина:", vertex);
    graphString = graphString + "Вершина: " + vertex + "\n";
    for (let neighborVertex in weightedGraph[vertex]) {
      const weight = weightedGraph[vertex][neighborVertex];
      console.log("Ребро між", vertex, "та", neighborVertex, "з вагою:",
          weight);
      graphString = graphString + "Ребро між " + vertex + " та "
          + neighborVertex
          + " з вагою: "
          + weight + "\n";
    }
  }
  console.log("=================================");
  document.getElementById("graphLabel").textContent = graphString;

  document.getElementById("findDistances").addEventListener("click",
      function () {
        findTerms(weightedGraph);
      });
}

function findTerms(graph) {
  let graphLength = Object.keys(graph).length;

  let earlyTerms = new Array(graphLength).fill(0);
  earlyTerms[0] = 0;

  console.log("===========EARLY TERMS===========");
  for (let i = 0; i < graphLength - 1; i++) {
    console.log("vertex ", i);

    for (let neighborVertex in graph[i]) {
      let weight = parseInt(graph[i][neighborVertex]);
      if (earlyTerms[i] + weight > earlyTerms[neighborVertex]) {
        earlyTerms[neighborVertex] = earlyTerms[i] + weight;
      }
    }
    console.log("earlyTerms ", earlyTerms);
  }
  console.log("=================================");

  let lateTerms = new Array(graphLength).fill(
      earlyTerms[earlyTerms.length - 1]);

  console.log("============LATE TERMS===========");
  for (let i = graphLength - 1; i > 0; i--) {
    console.log("vertex ", i);

    for (let j = 0; j < i; j++) {
      for (let neighborVertex in graph[j]) {
        neighborVertex = parseInt(neighborVertex);
        if (neighborVertex === i) {
          let weight = parseInt(graph[j][neighborVertex]);

          if (lateTerms[i] - weight < earlyTerms[i]) {
            lateTerms[j] = earlyTerms[i] - weight;
          }
        }
      }
    }
    console.log("lateTerms ", lateTerms);
  }
  console.log("================================");

  let reserves = new Array(graphLength);
  for (let i = 0; i < earlyTerms.length; i++) {
    reserves[i] = parseInt(lateTerms[i]) - parseInt(earlyTerms[i]);
  }
  console.log("reserves ", reserves);

  let criticalPath = [];
  for (let i = 0; i < reserves.length; i++) {
    if (parseInt(reserves[i]) === 0) {
      criticalPath.push(i.valueOf());
    }
  }
  console.log("criticalPath ", criticalPath);

  let earlyTermsString = "Ранні строки здійснення події: ";
  let lateTermsString = "Пізні строки здійснення події: ";
  let reservesString = "Резерв часу події: ";

  for (let i = 0; i < reserves.length; i++) {
    earlyTermsString = earlyTermsString + i + "(" + earlyTerms[i] + "), ";
    lateTermsString = lateTermsString + i + "(" + lateTerms[i] + "), ";
    reservesString = reservesString + i + "(" + reserves[i] + "), ";
  }

  let criticalPathString = "Критичний шлях: 0";

  for (let i = 1; i < criticalPath.length; i++) {
    criticalPathString = criticalPathString + "-" + criticalPath[i];
  }

  let totalResources = 0;
  let criticalPathLength = earlyTerms[earlyTerms.length - 1];

  for (let i = 0; i < graphLength; i++) {
    for (let neighborVertex in graph[i]) {
      let weight = parseInt(graph[i][neighborVertex]);
      totalResources = totalResources + weight;
    }
  }

  console.log(earlyTermsString);
  console.log(lateTermsString);
  console.log(reservesString);

  console.log(criticalPathString);
  console.log("Повна потреба в ресурсах: " + totalResources);
  console.log("Потреба в ресурсах на критичному шляху: " + criticalPathLength);
  document.getElementById("distanceLabel").textContent = earlyTermsString + "\n"
      + lateTermsString + "\n" + reservesString + "\n" + criticalPathString
      + "\n" + "Повна потреба в ресурсах: " + totalResources + "\n"
      + "Потреба в ресурсах на критичному шляху: " + criticalPathLength;
}

function addGraph() {
  document.getElementById("findDistances").style.display = "none";
  document.getElementById("saveNewGraphButton").style.display = "block";
  vertexIndex = 0;
  document.getElementById("graphLabel").textContent = null;
  document.getElementById("distanceLabel").textContent = null;
  document.getElementById("addGraphButton").style.display = "none";

  let infoString = "Введіть дані для нової вершини до якої направлене ребро"
      + "\n" + "0 - початкова вершина," + "\n"
      + "остання вершина - кінцева вершина,";

  const infoLabel = document.createElement("label");
  infoLabel.textContent = infoString;
  document.getElementById("panelContainer").appendChild(infoLabel);

  for (let i = 0; i < 3; i++) {
    addVertexElements(vertexIndex);
  }

  addVertexButton.classList.add("myButton")
  addVertexButton.textContent = "Додати вершину";
  addVertexButton.addEventListener("click", function () {
    addVertexElements(vertexIndex);
  });

  document.getElementById("mainPanel").appendChild(addVertexButton);
}

function addVertexElements() {
  const panelContainer = document.getElementById("panelContainer");

  const panel = document.createElement("div");
  panel.classList.add("panel");

  const vertexLabel = document.createElement("label");
  vertexLabel.textContent = "Вершина " + vertexIndex;
  vertexIndex++;

  const edgePanel = document.createElement("edgePanel");
  edgePanel.classList.add("edgePanel");

  const edgeButton = document.createElement("edgeButton");
  edgeButton.classList.add("myButton")
  edgeButton.textContent = "Додати ребро";
  edgeButton.addEventListener("click", function () {
    addEdgeElements(edgePanel);
  });

  panel.appendChild(vertexLabel);
  panel.appendChild(edgePanel)
  panel.appendChild(edgeButton);
  addEdgeElements(edgePanel);

  panelContainer.appendChild(panel);
}

function addEdgeElements(panel) {
  const edgeLabel = document.createElement("label");
  edgeLabel.textContent = ", ребро до вершини ";

  const edgeInput = document.createElement("input");

  const weightLabel = document.createElement("label");
  weightLabel.textContent = " з вагою ";

  const weightInput = document.createElement("input");

  panel.appendChild(edgeLabel);
  panel.appendChild(edgeInput);
  panel.appendChild(weightLabel);
  panel.appendChild(weightInput);
}

function readInputData() {
  const panelContainer = document.getElementById("panelContainer");
  const panels = panelContainer.querySelectorAll(".panel");

  const inputData = {};

  panels.forEach((panel, index) => {
    const inputs = panel.querySelectorAll("input");

    inputData[index] = {};

    for (let i = 0; i < inputs.length; i = i + 2) {
      inputData[index][inputs[i].value] = inputs[i + 1].value;
    }
  });
  inputData[Object.keys(inputData).length-1] = {};

  document.getElementById("findDistances").style.display = "block";
  document.getElementById("saveNewGraphButton").style.display = "none";
  document.getElementById("addGraphButton").style.display = "block";
  document.getElementById("panelContainer").textContent = null;
  addVertexButton.style.display = "none";

  getGraph(inputData);
}

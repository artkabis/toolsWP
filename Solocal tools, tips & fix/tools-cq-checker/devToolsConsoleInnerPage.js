(function() {
  const id = "consoleElement"+Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
  if (document.getElementById(id) === undefined) return;
  const consoleElement = document.createElement("details");
  consoleElement.id = id;

  const scopedStyle = document.createElement("style");
  const container = document.createElement("div");
  scopedStyle.innerText = `
#${id} {
  position: fixed;
  max-height: auto;
  bottom: 0px;
  left: 0px;
  border: 1px solid red;
  z-index: 100;
  backdrop-filter: blur(5px);
  padding-left: 1em;
  font-family: monospace;
  margin: 1em;
  background-color: rgba(250, 235, 215, 0.4);
}

#{id}[open] {
 right: 0px !important;
 height: auto;
}

#{id}:not(open) summary {
 padding-right: 1em;
}

#${id} div {
  height: auto;
  overflow: auto;
}

#${id} p {
  font-size: 12px;
}

#${id} p.log:before {
  content: "Log: ";
}

#${id} p.warn {
  color: orange;
  border-top: solid 1px orange;
  border-bottom: solid 1px orange;
}

#${id} p.warn:before {
  content: "Warn: ";
}

#${id} p.error {
  color: red;
  border-top: solid 1px red;
  border-bottom: solid 1px red;
}

#${id} p.error:before {
  content: "Error: ";
}`;

  const summary = document.createElement("summary");
  summary.innerText = "Console: L: 0, W: 0, E: 0, T: 0";
  consoleElement.appendChild(scopedStyle);
  consoleElement.appendChild(summary);
  consoleElement.appendChild(container);

  const log = console.log.bind(console);
  const error = console.error.bind(console);
  const warn = console.warn.bind(console);
  const table = console.table.bind(console);

  const count = {};

  const output = function(type, fn, ...args) {
    const logElement = document.createElement("p");
    if (type in count == false) count[type] = 0;
    count[type]++;
    
    summary.innerText = `Console: L: ${count["log"] || 0}, W: ${count["warn"] ||
      0}, E: ${count["error"] || 0}, T: ${count["table"] || 0}`;
    
    logElement.className = type;
    logElement.innerText = `${args}`;
    container.appendChild(logElement);
    
    logElement.scrollIntoView({behavior: "smooth", block: "start" });

    fn(...args);
  };

  console.log = function(...args) {
    output("log", log, ...args);
  };

  console.warn = function(...args) {
    output("warn", warn, ...args);
  };

  console.error = function(...args) {
    output("error", error, ...args);
  };
  console.table = function(...args) {
    output("table", error, JSON.stringify(...args));
  };

  document.body.appendChild(consoleElement);
})();

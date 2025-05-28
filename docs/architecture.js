document.addEventListener('DOMContentLoaded', function() {
    const architectureData = {
    "nodes": [
        { "data": { "id": "frontend", "name": "Frontend (Gatsby/React)", "description": "User Interface for interaction, planning, and monitoring. Built with Gatsby and React.", "type": "Frontend" } },
        { "data": { "id": "backend", "name": "Backend (Python/FastAPI)", "description": "Handles business logic, agent management, API services, and data persistence.", "type": "Backend" } },
        { "data": { "id": "webserver", "name": "Web Server (FastAPI)", "description": "Exposes RESTful APIs for the frontend to interact with the backend services.", "type": "BackendComponent", "parent": "backend" } },
        { "data": { "id": "teammanager", "name": "TeamManager", "description": "Manages the lifecycle and state of agent teams for different tasks.", "type": "BackendComponent", "parent": "backend" } },
        { "data": { "id": "dbmanager", "name": "DatabaseManager", "description": "Manages persistence of session states, configurations, and learned plans.", "type": "BackendComponent", "parent": "backend" } },
        { "data": { "id": "agents", "name": "Agents", "description": "Core components responsible for executing tasks and interacting with various services.", "type": "Core" } },
        { "data": { "id": "orchestrator", "name": "Orchestrator", "description": "Lead agent. Manages co-planning with the user, task delegation to other agents, and overall execution flow. Handles replanning and user feedback.", "type": "Agent", "parent": "agents" } },
        { "data": { "id": "websurfer", "name": "WebSurfer", "description": "Agent for browsing the web, filling forms, clicking elements, and navigating sites.", "type": "Agent", "parent": "agents" } },
        { "data": { "id": "coder", "name": "Coder Agent", "description": "Agent for writing and executing Python code and shell commands in a sandboxed Docker environment.", "type": "Agent", "parent": "agents" } },
        { "data": { "id": "filesurfer", "name": "FileSurfer", "description": "Agent for locating files, converting them, and answering questions about their content.", "type": "Agent", "parent": "agents" } },
        { "data": { "id": "userproxy", "name": "UserProxy", "description": "Represents the user in the agent system, facilitating communication and task delegation to the user.", "type": "Agent", "parent": "agents" } },
        { "data": { "id": "tools", "name": "Tools", "description": "Utilities and controllers used by agents to perform specific actions.", "type": "Tools" } },
        { "data": { "id": "playwright", "name": "Playwright Controller", "description": "Tool used by WebSurfer for browser automation and interaction.", "type": "Tool", "parent": "tools" } },
        { "data": { "id": "docker", "name": "Docker Integration", "description": "Provides sandboxed environments for Coder agent execution.", "type": "Tool", "parent": "tools" } },
        { "data": { "id": "bingsearch", "name": "Bing Search", "description": "Tool for performing web searches to gather information.", "type": "Tool", "parent": "tools" } },
        { "data": { "id": "filesystemtools", "name": "File System Tools", "description": "Tools used by FileSurfer for file operations.", "type": "Tool", "parent": "tools" } },
        { "data": { "id": "cli", "name": "CLI (`_cli.py`)", "description": "Command-Line Interface for running Magentic-UI tasks and managing configurations.", "type": "Interface" } },
        { "data": { "id": "planlearning", "name": "Plan Learning & Retrieval", "description": "Module for learning from previous runs and retrieving saved plans to improve task automation.", "type": "CoreFeature" } },
        { "data": { "id": "actionguards", "name": "Action Guards", "description": "Mechanism for requiring user approval for sensitive actions performed by agents.", "type": "CoreFeature" } }
    ],
    "edges": [
        { "data": { "source": "frontend", "target": "webserver", "label": "API Calls" } },
        { "data": { "source": "webserver", "target": "teammanager", "label": "Manages Teams" } },
        { "data": { "source": "webserver", "target": "dbmanager", "label": "Accesses Data" } },
        { "data": { "source": "teammanager", "target": "orchestrator", "label": "Instantiates & Manages" } },
        { "data": { "source": "orchestrator", "target": "websurfer", "label": "Delegates Web Tasks" } },
        { "data": { "source": "orchestrator", "target": "coder", "label": "Delegates Code Tasks" } },
        { "data": { "source": "orchestrator", "target": "filesurfer", "label": "Delegates File Tasks" } },
        { "data": { "source": "orchestrator", "target": "userproxy", "label": "Interacts for Input/Feedback" } },
        { "data": { "source": "orchestrator", "target": "planlearning", "label": "Uses/Stores Plans" } },
        { "data": { "source": "orchestrator", "target": "actionguards", "label": "Checks Approvals" } },
        { "data": { "source": "websurfer", "target": "playwright", "label": "Uses" } },
        { "data": { "source": "coder", "target": "docker", "label": "Executes In" } },
        { "data": { "source": "filesurfer", "target": "filesystemtools", "label": "Uses" } },
        { "data": { "source": "websurfer", "target": "bingsearch", "label": "Optionally Uses for Search" } },
        { "data": { "source": "cli", "target": "teammanager", "label": "Initiates Tasks (via get_task_team)" } },
        { "data": { "source": "planlearning", "target": "dbmanager", "label": "Stores/Retrieves Plans" } },
        { "data": { "source": "actionguards", "target": "userproxy", "label": "Requests User Approval" } }
    ]
};

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            ...architectureData.nodes,
            ...architectureData.edges
        ],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#888', 'label': 'data(name)', 'width': '120px',
                    'height': '70px', 'shape': 'rectangle', 'text-valign': 'center',
                    'text-halign': 'center', 'font-size': '10px', 'color': 'white',
                    'text-wrap': 'wrap', 'text-max-width': '110px', 'border-width': 1,
                    'border-color': '#555'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2, 'line-color': '#aaa', 'target-arrow-color': '#aaa',
                    'target-arrow-shape': 'triangle', 'curve-style': 'bezier',
                    'label': 'data(label)', 'font-size': '8px', 'color': '#444',
                    'text-rotation': 'autorotate', 'text-margin-y': -10, 'edge-text-rotation': 'autorotate'
                }
            },
            { selector: 'node[type=\"Frontend\"]', style: { 'background-color': '#3498db' } },
            { selector: 'node[type=\"Backend\"]', style: { 'background-color': '#27ae60' } },
            { selector: 'node[type=\"BackendComponent\"]', style: { 'background-color': '#2ecc71' } },
            { selector: 'node[type=\"Core\"]', style: { 'background-color': '#f1c40f' } },
            { selector: 'node[type=\"Agent\"]', style: { 'background-color': '#e67e22' } },
            { selector: 'node[type=\"Tool\"]', style: { 'background-color': '#9b59b6' } },
            { selector: 'node[type=\"Interface\"]', style: { 'background-color': '#34495e' } },
            { selector: 'node[type=\"CoreFeature\"]', style: { 'background-color': '#e74c3c' } },
            {
                selector: ':parent',
                style: {
                    'text-valign': 'top', 'text-halign': 'center', 'background-opacity': 0.333,
                    'background-color': '#ccc', 'border-width': 2, 'border-color': '#aaa',
                    'font-size': '14px', 'label': 'data(name)'
                }
            }
        ],
        layout: {
            name: 'cose', idealEdgeLength: 150, nodeOverlap: 40, refresh: 20, fit: true,
            padding: 50, randomize: false, componentSpacing: 120, nodeRepulsion: 450000,
            edgeElasticity: 120, nestingFactor: 5, gravity: 80, numIter: 1500,
            initialTemp: 200, coolingFactor: 0.95, minTemp: 1.0, animate: 'end',
            animationDuration: 500
        }
    });

    cy.nodes().filter(ele => !ele.isParent()).forEach(node => {
        node.grabify();
    });

    cy.on('tap', 'node', function(evt){
        var node = evt.target;
        if (!node.isParent()) {
            console.log('Tapped ' + node.id() + ': ' + node.data('description'));
        }
    });
});

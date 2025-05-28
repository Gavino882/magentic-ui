document.addEventListener('DOMContentLoaded', function() {
    const architectureData = {
    "nodes": [
        // Frontend
        { "data": { "id": "frontend", "name": "Frontend (Gatsby/React)", "description": "Provides the user interface for all user interactions, including task initiation, co-planning, monitoring agent progress, and providing feedback. Built using Gatsby and React.", "type": "Frontend", "filePath": "frontend/" } },

        // Backend
        { "data": { "id": "backend", "name": "Backend (Python)", "description": "Core server-side logic written in Python. Manages agent teams, handles API requests from the frontend, interacts with the database, and orchestrates overall task execution.", "type": "Backend", "filePath": "src/magentic_ui/backend/" } },
        { "data": { "id": "webserver", "name": "Web Server (FastAPI)", "description": "A FastAPI application that exposes RESTful API endpoints. The frontend communicates with this server to send user requests and receive updates on agent activities and task status.", "type": "BackendComponent", "parent": "backend", "filePath": "src/magentic_ui/backend/web/app.py" } },
        { "data": { "id": "teammanager", "name": "TeamManager", "description": "Responsible for creating, managing, and tearing down instances of agent teams (TaskTeam). Each user session/task typically has an associated team.", "type": "BackendComponent", "parent": "backend", "filePath": "src/magentic_ui/backend/teammanager/" } },
        { "data": { "id": "dbmanager", "name": "DatabaseManager", "description": "Handles all database interactions, such as storing and retrieving session information, user configurations, learned plans, and task history. (Specific DB not detailed, conceptual).", "type": "BackendComponent", "parent": "backend", "filePath": "src/magentic_ui/backend/database/db_manager.py" } },

        // Agents Core & Specific Agents
        { "data": { "id": "agents_core", "name": "Agents System", "description": "The collective of autonomous agents that perform tasks. Based on AutoGen framework.", "type": "Core", "filePath": "src/magentic_ui/agents/" } },
        { "data": { "id": "orchestrator", "name": "Orchestrator", "description": "The primary agent responsible for overall task management. It communicates with the user (via UserProxy), creates plans, delegates sub-tasks to specialized agents (WebSurfer, Coder, FileSurfer), handles replanning, and synthesizes final responses.", "type": "Agent", "parent": "agents_core", "filePath": "src/magentic_ui/teams/orchestrator/" } },
        { "data": { "id": "websurfer", "name": "WebSurfer Agent", "description": "An agent specialized in web navigation. It can open URLs, click elements, type text, scroll, manage browser tabs, and extract information from web pages using browser automation tools.", "type": "Agent", "parent": "agents_core", "filePath": "src/magentic_ui/agents/web_surfer/" } },
        { "data": { "id": "coder", "name": "Coder Agent", "description": "An agent that writes and executes Python code and shell commands within a secure Docker container. Used for tasks requiring data manipulation, script execution, or interaction with local development tools.", "type": "Agent", "parent": "agents_core", "filePath": "src/magentic_ui/agents/_coder.py" } },
        { "data": { "id": "filesurfer", "name": "FileSurfer Agent", "description": "An agent designed to interact with files in the workspace. It can locate files, read their content, convert between formats (e.g., to Markdown), and answer questions based on file content.", "type": "Agent", "parent": "agents_core", "filePath": "src/magentic_ui/agents/file_surfer/" } },
        { "data": { "id": "userproxy", "name": "UserProxy Agent", "description": "Acts as the user's representative within the agent system. It relays user input to the Orchestrator and presents information or requests from the agents back to the user via the UI.", "type": "Agent", "parent": "agents_core", "filePath": "src/magentic_ui/agents/_user_proxy.py" } },

        // Tools
        { "data": { "id": "tools_core", "name": "Tools & Controllers", "description": "A collection of utilities and controllers that provide specific functionalities to the agents.", "type": "Tools", "filePath": "src/magentic_ui/tools/" } },
        { "data": { "id": "playwright", "name": "Playwright Controller", "description": "A tool providing fine-grained control over a web browser (e.g., Chromium, Firefox, WebKit). Used extensively by the WebSurfer agent for web automation tasks.", "type": "Tool", "parent": "tools_core", "filePath": "src/magentic_ui/tools/playwright/" } },
        { "data": { "id": "docker", "name": "Docker Integration", "description": "Provides isolated Docker containers where the Coder agent can safely execute code without affecting the host system.", "type": "Tool", "parent": "tools_core", "filePath": "src/magentic_ui/_docker.py" } },
        { "data": { "id": "bingsearch", "name": "Bing Search Tool", "description": "A tool that allows agents (typically WebSurfer or Orchestrator) to perform web searches using the Bing Search API to gather external information.", "type": "Tool", "parent": "tools_core", "filePath": "src/magentic_ui/tools/bing_search.py" } },
        { "data": { "id": "filesystemtools", "name": "File System Tools", "description": "A set of utilities enabling the FileSurfer agent to perform operations like listing files, reading files, and writing to files within its designated workspace.", "type": "Tool", "parent": "tools_core", "filePath": ["src/magentic_ui/agents/file_surfer/file_explorer.py", "src/magentic_ui/agents/file_surfer/file_writer.py"] } },
        
        // CLI
        { "data": { "id": "cli", "name": "CLI (`_cli.py`)", "description": "Command-Line Interface for Magentic-UI. Allows users to run tasks, manage configurations, and interact with the system from a terminal without the web UI.", "type": "Interface", "filePath": "src/magentic_ui/_cli.py" } },

        // Core Features / Concepts
        { "data": { "id": "planlearning", "name": "Plan Learning & Retrieval", "description": "A conceptual module (mentioned in README) responsible for storing successful task plans and retrieving them for similar future tasks to improve efficiency and reliability. Interacts with Orchestrator and Database.", "type": "CoreFeature", "filePath": "src/magentic_ui/learning/" } },
        { "data": { "id": "actionguards", "name": "Action Guards", "description": "A security feature (mentioned in README) that gates sensitive actions (e.g., file modifications, expensive API calls). Requires explicit user approval via the UI before an agent can proceed with such actions.", "type": "CoreFeature", "filePath": "src/magentic_ui/approval_guard.py" } },
        { "data": { "id": "taskteam", "name": "TaskTeam", "description": "Represents a configured group of agents (Orchestrator, Coder, WebSurfer, etc.) assembled to accomplish a specific high-level task given by the user.", "type": "CoreConcept", "filePath": "src/magentic_ui/task_team.py"}}
    ],
    "edges": [
        { "data": { "source": "frontend", "target": "webserver", "label": "HTTP Requests", "relationType": "apiCall" } },
        { "data": { "source": "webserver", "target": "teammanager", "label": "Manages Agent Teams", "relationType": "manages" } },
        { "data": { "source": "webserver", "target": "dbmanager", "label": "Accesses Data", "relationType": "dataFlow" } },
        { "data": { "source": "teammanager", "target": "taskteam", "label": "Creates/Configures", "relationType": "instantiation"}},
        { "data": { "source": "taskteam", "target": "orchestrator", "label": "Contains / Is Led By", "relationType": "composition"}},
        { "data": { "source": "orchestrator", "target": "websurfer", "label": "Delegates Web Tasks", "relationType": "delegation" } },
        { "data": { "source": "orchestrator", "target": "coder", "label": "Delegates Code Tasks", "relationType": "delegation" } },
        { "data": { "source": "orchestrator", "target": "filesurfer", "label": "Delegates File Tasks", "relationType": "delegation" } },
        { "data": { "source": "orchestrator", "target": "userproxy", "label": "Gets User Input/Feedback", "relationType": "interaction" } },
        { "data": { "source": "orchestrator", "target": "planlearning", "label": "Uses/Stores Plans", "relationType": "dataFlow" } },
        { "data": { "source": "orchestrator", "target": "actionguards", "label": "Checks Approvals", "relationType": "controlFlow" } },
        { "data": { "source": "websurfer", "target": "playwright", "label": "Controls Browser Via", "relationType": "usesTool" } },
        { "data": { "source": "coder", "target": "docker", "label": "Executes Code In", "relationType": "usesTool" } },
        { "data": { "source": "filesurfer", "target": "filesystemtools", "label": "Operates Files Via", "relationType": "usesTool" } },
        { "data": { "source": "websurfer", "target": "bingsearch", "label": "Uses for Search", "relationType": "usesTool" } },
        { "data": { "source": "cli", "target": "teammanager", "label": "Initiates Tasks", "relationType": "instantiation" } },
        { "data": { "source": "planlearning", "target": "dbmanager", "label": "Stores/Retrieves Plans", "relationType": "dataStorage" } },
        { "data": { "source": "actionguards", "target": "userproxy", "label": "Requests User Approval Via", "relationType": "interaction" } }
    ]
};

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            ...architectureData.nodes,
            ...architectureData.edges
        ],
        style: [
            // Node Styles
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
            { selector: 'node[type=\"Frontend\"]', style: { 'background-color': '#3498db' } },
            { selector: 'node[type=\"Backend\"]', style: { 'background-color': '#27ae60' } },
            { selector: 'node[type=\"BackendComponent\"]', style: { 'background-color': '#2ecc71' } },
            { selector: 'node[type=\"Core\"]', style: { 'background-color': '#f1c40f' } },
            { selector: 'node[type=\"Agent\"]', style: { 'background-color': '#e67e22' } },
            { selector: 'node[type=\"Tool\"]', style: { 'background-color': '#9b59b6' } },
            { selector: 'node[type=\"Interface\"]', style: { 'background-color': '#34495e' } },
            { selector: 'node[type=\"CoreFeature\"]', style: { 'background-color': '#e74c3c' } },
            { selector: 'node[type=\"CoreConcept\"]', style: { 'background-color': '#1abc9c' } },
            {
                selector: ':parent',
                style: {
                    'text-valign': 'top', 'text-halign': 'center', 'background-opacity': 0.333,
                    'background-color': '#ccc', 'border-width': 2, 'border-color': '#aaa',
                    'font-size': '14px', 'label': 'data(name)'
                }
            },

            // Default Edge Style
            {
                selector: 'edge',
                style: {
                    'width': 2, 'line-color': '#aaa', 'target-arrow-color': '#aaa',
                    'target-arrow-shape': 'triangle', 'curve-style': 'bezier',
                    'label': 'data(label)', 'font-size': '8px', 'color': '#444',
                    'text-rotation': 'autorotate', 'text-margin-y': -10, 'edge-text-rotation': 'autorotate'
                }
            },

            // Edge Styles based on relationType
            { selector: 'edge[relationType="apiCall"]', style: { 'line-color': '#2980b9', 'target-arrow-color': '#2980b9' } },
            { selector: 'edge[relationType="manages"]', style: { 'line-color': '#27ae60', 'target-arrow-color': '#27ae60', 'line-style': 'dashed' } },
            { selector: 'edge[relationType="instantiation"]', style: { 'line-color': '#8e44ad', 'target-arrow-color': '#8e44ad', 'line-style': 'dotted' } },
            { selector: 'edge[relationType="delegation"]', style: { 'line-color': '#f39c12', 'target-arrow-color': '#f39c12' } },
            { selector: 'edge[relationType="usesTool"]', style: { 'line-color': '#7f8c8d', 'target-arrow-color': '#7f8c8d', 'line-style': 'dashed' } },
            { selector: 'edge[relationType="interaction"]', style: { 'line-color': '#16a085', 'target-arrow-color': '#16a085' } },
            { selector: 'edge[relationType="dataFlow"]', style: { 'line-color': '#d35400', 'target-arrow-color': '#d35400', 'line-style': 'dotted', 'target-arrow-shape': 'vee' } },
            { selector: 'edge[relationType="dataStorage"]', style: { 'line-color': '#c0392b', 'target-arrow-color': '#c0392b', 'line-style': 'dotted', 'target-arrow-shape': 'circle' } },
            { selector: 'edge[relationType="composition"]', style: { 'line-color': '#34495e', 'target-arrow-color': '#34495e', 'target-arrow-shape': 'diamond' } },
            { selector: 'edge[relationType="controlFlow"]', style: { 'line-color': '#2c3e50', 'target-arrow-color': '#2c3e50', 'line-style': 'dashed', 'target-arrow-shape': 'tee' } }
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

    cy.ready(function() {
        cy.nodes().forEach(function(node) {
            if (node.isParent()) return; 

            let content = `<strong>${node.data('name')}</strong><hr style="margin: 2px 0; border-top: 1px solid #eee;">
                           <p style="font-size:0.9em; margin: 4px 0;">${node.data('description')}</p>`;
            
            const filePath = node.data('filePath');
            if (filePath) {
                content += `<hr style="margin: 2px 0; border-top: 1px solid #eee;"><p style="font-size:0.8em; color: #333; margin: 4px 0;"><strong>Path(s):</strong><br>`;
                if (Array.isArray(filePath)) {
                    content += filePath.join('<br>');
                } else {
                    content += filePath;
                }
                content += `</p>`;
            }

            tippy(node.popperRef(), { 
                content: content,
                trigger: 'mouseenter', 
                allowHTML: true,
                theme: 'light', 
                animation: 'scale',
                placement: 'top', 
                interactive: true, 
                appendTo: document.body 
            });
        });

        // Populate the legend
        const legendRelations = [
            { type: 'apiCall', name: 'API Call', style: { color: '#2980b9', lineStyle: 'solid' } },
            { type: 'manages', name: 'Manages', style: { color: '#27ae60', lineStyle: 'dashed' } },
            { type: 'instantiation', name: 'Instantiation', style: { color: '#8e44ad', lineStyle: 'dotted' } },
            { type: 'delegation', name: 'Delegation', style: { color: '#f39c12', lineStyle: 'solid' } },
            { type: 'usesTool', name: 'Uses Tool', style: { color: '#7f8c8d', lineStyle: 'dashed' } },
            { type: 'interaction', name: 'Interaction', style: { color: '#16a085', lineStyle: 'solid' } },
            { type: 'dataFlow', name: 'Data Flow', style: { color: '#d35400', lineStyle: 'dotted' } },
            { type: 'dataStorage', name: 'Data Storage', style: { color: '#c0392b', lineStyle: 'dotted' } },
            { type: 'composition', name: 'Composition', style: { color: '#34495e', lineStyle: 'solid' } },
            { type: 'controlFlow', name: 'Control Flow', style: { color: '#2c3e50', lineStyle: 'dashed' } }
        ];

        const legendItemsUl = document.getElementById('legend-items');
        if (legendItemsUl) {
            legendRelations.forEach(rel => {
                const li = document.createElement('li');
                
                const styleRepresentation = document.createElement('span');
                styleRepresentation.className = 'legend-color-box'; // Use class for basic box styling
                styleRepresentation.style.borderTop = `3px ${rel.style.lineStyle} ${rel.style.color}`;
                // For solid lines, we can use background color, or rely on border-top for consistency.
                // If using background for solid:
                // if (rel.style.lineStyle === 'solid') {
                //    styleRepresentation.style.backgroundColor = rel.style.color;
                // } else {
                //    styleRepresentation.style.borderTop = `3px ${rel.style.lineStyle} ${rel.style.color}`;
                // }
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = rel.name;
                nameSpan.style.verticalAlign = 'middle';
                
                li.appendChild(styleRepresentation);
                li.appendChild(nameSpan);
                legendItemsUl.appendChild(li);
            });
        }
    });
});
